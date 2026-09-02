import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  ActiveLevelAttempt,
  AdminSettings,
  AptitudeQuestion,
  AptitudeTopicId,
  AptitudeTopicInfo,
  ConceptMastery,
  FinalAptitudeResult,
  FinalReportData,
  HRInterviewSession,
  HRQuestion,
  LevelAttemptResult,
  QuestionAttemptLog,
  ReviewQuestionItem,
  TechnicalDomainId,
  TechnicalInterviewSession,
  TopicTestResult,
  User,
  UserDashboardState,
} from '../src/types';
import { generateDefaultQuestionBank, TOPICS_META, CONCEPT_TIPS, normalizeQuestionText } from './questionBank';
import { generateAITechnicalQuestions, evaluateTechnicalAnswer, evaluateHREvaluation, generateFinalAIFeedback, DOMAIN_DEFAULTS } from './ai';
import { getCuratedDomainQuestions } from './domainCuratedQuestions';

const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'database_store.json')
  : path.join(process.cwd(), 'database_store.json');
const SEED_DB_FILE = path.join(process.cwd(), 'database_store.json');

export interface UserProgressData {
  user_id: string;
  topic_levels_passed: Record<AptitudeTopicId, number[]>; // array of level numbers passed, e.g. [1,2,3,4,5]
  topic_test1_passed: Record<AptitudeTopicId, boolean>;
  topic_test2_passed: Record<AptitudeTopicId, boolean>;
  level_attempts: LevelAttemptResult[];
  test_attempts: TopicTestResult[];
  final_aptitude_attempts: FinalAptitudeResult[];
  technical_sessions: TechnicalInterviewSession[];
  hr_sessions: HRInterviewSession[];
  recent_questions_answered: string[]; // for avoiding immediate repeats
  question_attempts: QuestionAttemptLog[];
  concept_performance: Record<string, ConceptMastery>;
  active_level_attempts: Record<string, ActiveLevelAttempt>;
}

interface DatabaseSchema {
  users: User[];
  settings: AdminSettings;
  questions: AptitudeQuestion[];
  user_progress: Record<string, UserProgressData>;
}

export const ADMIN_EMAIL = 'jaammaaj123@gmail.com';

const DEFAULT_SETTINGS: AdminSettings = {
  levelCutoff: 70,
  testCutoff: 70,
  finalTestCutoff: 70,
  technicalCutoff: 60,
  hrCutoff: 60,
  levelTimerMinutes: 10,
  testTimerMinutes: 20,
  finalTestTimerMinutes: 30,
  aiModel: 'gemini-3.7-flash',
  globalDemoMode: false,
};

const HR_QUESTIONS_BANK: HRQuestion[] = [
  {
    question_id: 'hr_q1',
    category: 'behavioral',
    question: 'Tell me about yourself, your technical journey, and what drives you to solve complex engineering problems.',
    intent: 'Assesses career passion, concise storytelling, and professional communication.',
  },
  {
    question_id: 'hr_q2',
    category: 'situational',
    question: 'Describe a challenging technical disagreement or tight project deadline you encountered with a team member and how you resolved it.',
    intent: 'Evaluates conflict resolution, empathy, collaboration, and delivery mindset.',
  },
  {
    question_id: 'hr_q3',
    category: 'culture',
    question: 'Where do you envision your technical and leadership impact in the next 3 to 5 years?',
    intent: 'Assesses long-term vision, growth mindset, and organizational alignment.',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      const targetFile = fs.existsSync(DB_FILE) ? DB_FILE : fs.existsSync(SEED_DB_FILE) ? SEED_DB_FILE : null;
      if (targetFile && fs.existsSync(targetFile)) {
        const raw = fs.readFileSync(targetFile, 'utf-8');
        const parsed = JSON.parse(raw);
        // Refresh question bank with the full, deduplicated dataset
        parsed.questions = generateDefaultQuestionBank();

        // Purge any legacy hardcoded / fake demo users
        if (parsed.users && Array.isArray(parsed.users)) {
          parsed.users = parsed.users.filter(
            (u: any) =>
              u.email !== 'candidate@example.com' &&
              u.email !== 'demo@interview.com' &&
              u.email !== 'alex.johnson@gmail.com' &&
              u.email !== 'sarah.connor@gmail.com' &&
              u.user_id !== 'user_demo'
          );
        } else {
          parsed.users = [];
        }

        if (!parsed.user_progress) {
          parsed.user_progress = {};
        }

        // Clean up orphaned demo user progress
        delete parsed.user_progress['user_demo'];

        Object.keys(parsed.user_progress).forEach((uid) => {
          const up = parsed.user_progress[uid];
          if (!up.active_level_attempts) up.active_level_attempts = {};
          if (!up.question_attempts) up.question_attempts = [];
          if (!up.concept_performance) up.concept_performance = {};
        });

        if (!parsed.settings) {
          parsed.settings = { ...DEFAULT_SETTINGS };
        } else {
          parsed.settings.globalDemoMode = false;
        }

        this.saveDatabase(parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Error loading db file, reinitializing default:', e);
    }

    const initialData: DatabaseSchema = {
      users: [],
      settings: { ...DEFAULT_SETTINGS },
      questions: generateDefaultQuestionBank(),
      user_progress: {},
    };

    this.saveDatabase(initialData);
    return initialData;
  }

  private saveDatabase(dataToSave = this.data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database:', err);
    }
  }

  public hashPassword(pwd: string): string {
    return crypto.createHash('sha256').update(pwd + '_ai_interview_salt').digest('hex');
  }

  public createDefaultUserProgress(userId: string): UserProgressData {
    return {
      user_id: userId,
      topic_levels_passed: {
        quantitative: [],
        logical: [],
        verbal: [],
        specialized: [],
      },
      topic_test1_passed: {
        quantitative: false,
        logical: false,
        verbal: false,
        specialized: false,
      },
      topic_test2_passed: {
        quantitative: false,
        logical: false,
        verbal: false,
        specialized: false,
      },
      level_attempts: [],
      test_attempts: [],
      final_aptitude_attempts: [],
      technical_sessions: [],
      hr_sessions: [],
      recent_questions_answered: [],
      question_attempts: [],
      concept_performance: {},
      active_level_attempts: {},
    };
  }

  // User Authentication
  public loginOrRegisterGoogleUser(
    email: string,
    name?: string,
    avatarUrl?: string,
    googleId?: string
  ): { user: User; token: string; isNewUser: boolean } {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

    // Prefer matching by Google unique sub (googleId) first, then email
    let user: User | undefined = undefined;
    if (googleId) {
      user = this.data.users.find((u) => u.google_id === googleId);
    }
    if (!user) {
      user = this.data.users.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    let isNewUser = false;

    if (!user) {
      const derivedName = name && name.trim() ? name.trim() : cleanEmail.split('@')[0];
      user = {
        user_id: `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: derivedName,
        email: cleanEmail,
        google_id: googleId,
        role: isAdmin ? 'admin' : 'user',
        avatar_url: avatarUrl,
        auth_provider: 'google',
        created_at: new Date().toISOString(),
      };
      this.data.users.push(user);
      this.data.user_progress[user.user_id] = this.createDefaultUserProgress(user.user_id);
      isNewUser = true;
    } else {
      // User already exists - reuse account and don't create duplicate
      if (googleId && !user.google_id) {
        user.google_id = googleId;
      }
      if (name && name.trim() && (!user.name || user.name === 'Alex Johnson' || user.name === cleanEmail.split('@')[0])) {
        user.name = name.trim();
      }
      if (avatarUrl) {
        user.avatar_url = avatarUrl;
      }
      user.role = isAdmin ? 'admin' : 'user';
      user.auth_provider = 'google';
      if (!this.data.user_progress[user.user_id]) {
        this.data.user_progress[user.user_id] = this.createDefaultUserProgress(user.user_id);
      }
    }

    // Strictly enforce role integrity across all registered users
    this.data.users.forEach((u) => {
      if (u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        u.role = 'admin';
      } else {
        u.role = 'user';
      }
    });

    this.saveDatabase();
    return { user, token: `token_${user.user_id}`, isNewUser };
  }

  public registerUser(name: string, email: string, password: string): { user: User; token: string } {
    const existing = this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists');
    }
    const user: User = {
      user_id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: email.toLowerCase(),
      password_hash: this.hashPassword(password),
      created_at: new Date().toISOString(),
    };
    this.data.users.push(user);
    this.data.user_progress[user.user_id] = this.createDefaultUserProgress(user.user_id);
    this.saveDatabase();
    return { user, token: `token_${user.user_id}` };
  }

  public loginUser(email: string, password: string): { user: User; token: string } {
    const hash = this.hashPassword(password);
    const user = this.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password_hash === hash
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    if (!this.data.user_progress[user.user_id]) {
      this.data.user_progress[user.user_id] = this.createDefaultUserProgress(user.user_id);
      this.saveDatabase();
    }
    return { user, token: `token_${user.user_id}` };
  }

  public getUserById(userId?: string): User | null {
    if (!userId) return null;
    if (!this.data.users || this.data.users.length === 0) {
      return null;
    }
    const found = this.data.users.find((u) => u.user_id === userId);
    return found || null;
  }

  public updateUserProfile(userId: string, name?: string, email?: string): User {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (name && name.trim()) {
      user.name = name.trim();
    }
    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      // Check if email taken by another user
      const existing = this.data.users.find((u) => u.user_id !== userId && u.email.toLowerCase() === cleanEmail);
      if (existing) {
        throw new Error('This email is already in use by another account');
      }
      user.email = cleanEmail;
    }
    this.saveDatabase();
    return user;
  }

  public getUserProgress(userId: string): UserProgressData {
    if (!this.data.user_progress[userId]) {
      this.data.user_progress[userId] = this.createDefaultUserProgress(userId);
      this.saveDatabase();
    }
    return this.data.user_progress[userId];
  }

  public getSettings(): AdminSettings {
    return this.data.settings || { ...DEFAULT_SETTINGS };
  }

  public updateSettings(settings: Partial<AdminSettings>): AdminSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveDatabase();
    return this.data.settings;
  }

  public setGlobalDemoMode(enabled: boolean): AdminSettings {
    if (!this.data.settings) {
      this.data.settings = { ...DEFAULT_SETTINGS };
    }
    this.data.settings.globalDemoMode = !!enabled;
    this.saveDatabase();
    return this.data.settings;
  }

  public isGlobalDemoMode(): boolean {
    return Boolean(this.data.settings?.globalDemoMode);
  }

  public isDemoUser(userId?: string): boolean {
    // Demo Mode is OFF by default. It is ONLY active if explicitly enabled globally by the Administrator.
    if (this.data.settings?.globalDemoMode) {
      return true;
    }
    return false;
  }

  // Dashboard Aggregator & Progression Verification
  public getDashboardState(userId: string): UserDashboardState {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User session not found. Please log in.');
    }
    const prog = this.getUserProgress(user.user_id);
    const settings = this.getSettings();
    const isDemo = this.isDemoUser(user.user_id);

    const topicIds: AptitudeTopicId[] = ['quantitative', 'logical', 'verbal', 'specialized'];
    const topics: Record<AptitudeTopicId, AptitudeTopicInfo> = {} as any;

    let totalLevelsCompleted = 0;
    let totalTestsPassed = 0;
    let pendingTestsCount = 0;

    topicIds.forEach((tid) => {
      let passedLvls = prog.topic_levels_passed[tid] || [];
      let test1 = prog.topic_test1_passed[tid] || false;
      let test2 = prog.topic_test2_passed[tid] || false;

      if (isDemo) {
        passedLvls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        test1 = true;
        test2 = true;
      }

      // Current level determination:
      // If hasn't passed L1 -> 1
      // If passed L1..L5 and NOT passed Test 1 -> at Test 1 (currentLevel stays 5)
      // If passed Test 1 and passed L6..L7 -> L8
      // If passed L1..L10 and passed Test 2 -> Completed (10)
      let currentLvl = 1;
      for (let i = 1; i <= 10; i++) {
        if (passedLvls.includes(i)) {
          currentLvl = Math.min(10, i + 1);
        } else {
          currentLvl = i;
          break;
        }
      }
      if (!test1 && currentLvl > 5) {
        currentLvl = 5;
      }
      if (isDemo) currentLvl = 10;

      const isCompleted = isDemo || (passedLvls.length >= 10 && test1 && test2);
      totalLevelsCompleted += isDemo ? 10 : passedLvls.length;
      if (test1 || isDemo) totalTestsPassed++;
      if (test2 || isDemo) totalTestsPassed++;

      // Check if test 1 or test 2 is ready to be taken
      if (!isDemo) {
        if (passedLvls.filter((l) => l <= 5).length === 5 && !test1) {
          pendingTestsCount++;
        }
        if (passedLvls.length === 10 && test1 && !test2) {
          pendingTestsCount++;
        }
      }

      // Calculate progress percentage:
      let pct = isDemo ? 100 : passedLvls.length * 8;
      if (!isDemo) {
        if (test1) pct += 10;
        if (test2) pct += 10;
        pct = Math.min(100, pct);
      }

      topics[tid] = {
        id: tid,
        name: TOPICS_META[tid].name,
        icon: TOPICS_META[tid].icon,
        description: TOPICS_META[tid].description,
        totalLevels: 10,
        completedLevels: isDemo ? 10 : passedLvls.length,
        currentLevel: currentLvl,
        test1Passed: isDemo || test1,
        test2Passed: isDemo || test2,
        isCompleted,
        progressPercentage: pct,
      };
    });

    const allTopicsCompleted = isDemo || topicIds.every((tid) => topics[tid].isCompleted);
    const latestFinalTest = prog.final_aptitude_attempts[prog.final_aptitude_attempts.length - 1];
    const finalAptitudePassed = isDemo || latestFinalTest?.status === 'QUALIFIED';

    const latestTech = prog.technical_sessions.filter((s) => s.status === 'COMPLETED');
    const latestTechSession = latestTech[latestTech.length - 1];
    const techPassed = (latestTechSession?.overall_score || 0) >= settings.technicalCutoff;

    const latestHR = prog.hr_sessions.filter((s) => s.status === 'COMPLETED');
    const latestHRSession = latestHR[latestHR.length - 1];
    const hrPassed = (latestHRSession?.overall_score || 0) >= settings.hrCutoff;

    const overallProgress = isDemo
      ? 100
      : Math.round(
          (totalLevelsCompleted / 40) * 40 +
            (totalTestsPassed / 8) * 20 +
            (finalAptitudePassed ? 15 : 0) +
            (techPassed ? 15 : 0) +
            (hrPassed ? 10 : 0)
        );

    return {
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      },
      topics,
      progression: {
        all_topics_completed: isDemo || allTopicsCompleted,
        final_aptitude_unlocked: isDemo || allTopicsCompleted,
        final_aptitude_passed: isDemo || finalAptitudePassed,
        technical_unlocked: isDemo || finalAptitudePassed,
        technical_passed: isDemo ? (latestTechSession ? techPassed : true) : techPassed,
        hr_unlocked: isDemo || techPassed,
        hr_passed: isDemo ? (latestHRSession ? hrPassed : true) : hrPassed,
        final_report_available: isDemo || hrPassed,
      },
      cutoffs: {
        levelCutoff: settings.levelCutoff,
        testCutoff: settings.testCutoff,
        finalTestCutoff: settings.finalTestCutoff,
        technicalCutoff: settings.technicalCutoff,
        hrCutoff: settings.hrCutoff,
      },
      stats: {
        total_levels_completed: isDemo ? 40 : totalLevelsCompleted,
        total_tests_passed: isDemo ? 8 : totalTestsPassed,
        overall_progress: isDemo ? 100 : Math.min(100, overallProgress),
        pending_tests_count: isDemo ? 0 : pendingTestsCount,
      },
    };
  }

  // Progression Verification Helpers (Backend Security)
  public canAccessLevel(userId: string, topicId: AptitudeTopicId, levelId: number): { allowed: boolean; reason?: string } {
    if (this.isDemoUser(userId)) {
      return { allowed: true };
    }
    const prog = this.getUserProgress(userId);
    const passed = (prog.topic_levels_passed[topicId] || []).map(Number);
    const test1 = prog.topic_test1_passed[topicId] || false;
    const numLevel = Number(levelId);

    if (!numLevel || isNaN(numLevel) || numLevel < 1 || numLevel > 10) {
      return { allowed: false, reason: 'Invalid level number requested.' };
    }

    if (numLevel === 1 || passed.includes(numLevel)) return { allowed: true };

    if (numLevel <= 5) {
      // Must have passed previous level
      if (!passed.includes(numLevel - 1)) {
        return { allowed: false, reason: `Level ${numLevel - 1} must be passed before accessing Level ${numLevel}.` };
      }
      return { allowed: true };
    }

    // Level 6 to 10: MUST have passed Test 1
    if (!test1) {
      return { allowed: false, reason: `Test 1 (covering Levels 1-5) must be passed before unlocking Levels 6-10.` };
    }

    if (numLevel === 6) return { allowed: true };

    if (!passed.includes(numLevel - 1)) {
      return { allowed: false, reason: `Level ${numLevel - 1} must be passed before accessing Level ${numLevel}.` };
    }

    return { allowed: true };
  }

  public canAccessTopicTest(userId: string, topicId: AptitudeTopicId, testNumber: 1 | 2): { allowed: boolean; reason?: string } {
    if (this.isDemoUser(userId)) {
      return { allowed: true };
    }
    const prog = this.getUserProgress(userId);
    const passed = (prog.topic_levels_passed[topicId] || []).map(Number);

    if (testNumber === 1) {
      if (prog.topic_test1_passed[topicId]) return { allowed: true };
      const has1to5 = [1, 2, 3, 4, 5].every((lvl) => passed.includes(lvl));
      if (!has1to5) {
        return { allowed: false, reason: `Levels 1 through 5 of ${TOPICS_META[topicId]?.name || topicId} must all be completed before attempting Test 1.` };
      }
      return { allowed: true };
    } else {
      if (prog.topic_test2_passed[topicId]) return { allowed: true };
      const has6to10 = [6, 7, 8, 9, 10].every((lvl) => passed.includes(lvl));
      if (!has6to10 || !prog.topic_test1_passed[topicId]) {
        return { allowed: false, reason: `Levels 6 through 10 and Test 1 must all be completed before attempting Test 2.` };
      }
      return { allowed: true };
    }
  }

  // Question Serving with Guaranteed Uniqueness, Persistence & Zero-Repeat Retries
  public getQuestionsForLevel(
    userId: string,
    topicId: AptitudeTopicId,
    levelId: number,
    isRetry: boolean = false
  ): AptitudeQuestion[] {
    const numLevel = Number(levelId) || 1;
    const check = this.canAccessLevel(userId, topicId, numLevel);
    if (!check.allowed) {
      throw new Error(check.reason);
    }

    const prog = this.getUserProgress(userId);
    if (!prog.active_level_attempts) prog.active_level_attempts = {};
    if (!prog.question_attempts) prog.question_attempts = [];
    if (!prog.concept_performance) prog.concept_performance = {};

    const attemptKey = `${topicId}_${numLevel}`;

    // REQUIREMENT 6: Active Attempt Persistence
    // If NOT a retry and there is an existing active attempt, return the EXACT same 10 questions
    if (!isRetry && prog.active_level_attempts[attemptKey]) {
      const activeAttempt = prog.active_level_attempts[attemptKey];
      if (activeAttempt && Array.isArray(activeAttempt.question_ids) && activeAttempt.question_ids.length === 10) {
        const activeQuestions: AptitudeQuestion[] = [];
        for (const qid of activeAttempt.question_ids) {
          const found = this.data.questions.find((q) => q.question_id === qid);
          if (found) activeQuestions.push(found);
        }
        if (activeQuestions.length === 10) {
          return activeQuestions;
        }
      }
    }

    // REQUIREMENT 5: Question Selection Algorithm
    // STEP 1: Get questions belonging to requested topic_id and level_id from learning pool
    const rawPool = this.data.questions.filter(
      (q) => q.topic_id === topicId && q.level_id === numLevel && (q.pool_type === 'learning' || !q.pool_type)
    );

    // STEP 2: Find all questions already used by this user in previous attempts of THIS SAME topic_id and level_id
    const usedQuestionIds = new Set<string>();
    const usedNormalizedTexts = new Set<string>();

    const previousAttempts = (prog.level_attempts || []).filter(
      (a) => a.topic_id === topicId && a.level_id === numLevel
    );

    previousAttempts.forEach((attempt) => {
      if (attempt.answers_review) {
        attempt.answers_review.forEach((ar) => {
          if (ar.question_id) usedQuestionIds.add(ar.question_id);
          if (ar.question) usedNormalizedTexts.add(normalizeQuestionText(ar.question));
        });
      }
    });

    (prog.question_attempts || [])
      .filter((qa) => qa.topic_id === topicId && qa.level_id === numLevel)
      .forEach((qa) => {
        if (qa.question_id) usedQuestionIds.add(qa.question_id);
      });

    // STEP 3: Deduplicate pool questions
    const deduplicatedRawPool: AptitudeQuestion[] = [];
    const seenRawIds = new Set<string>();
    const seenRawTexts = new Set<string>();

    for (const q of rawPool) {
      const norm = normalizeQuestionText(q.question);
      if (!seenRawIds.has(q.question_id) && !seenRawTexts.has(norm)) {
        seenRawIds.add(q.question_id);
        seenRawTexts.add(norm);
        deduplicatedRawPool.push(q);
      }
    }

    // STEP 4: Separate into unseen and previously seen questions for this level
    const unusedPool = deduplicatedRawPool.filter(
      (q) => !usedQuestionIds.has(q.question_id) && !usedNormalizedTexts.has(normalizeQuestionText(q.question))
    );
    const seenPool = deduplicatedRawPool.filter(
      (q) => usedQuestionIds.has(q.question_id) || usedNormalizedTexts.has(normalizeQuestionText(q.question))
    );

    // STEP 5: Select 10 unique questions, prioritizing unseen questions first
    const shuffledUnused = [...unusedPool].sort(() => Math.random() - 0.5);
    const shuffledSeen = [...seenPool].sort(() => Math.random() - 0.5);

    const candidatePool = [...shuffledUnused, ...shuffledSeen];
    const selected: AptitudeQuestion[] = [];
    const selectedIds = new Set<string>();
    const selectedTexts = new Set<string>();

    for (const q of candidatePool) {
      if (selected.length === 10) break;
      const norm = normalizeQuestionText(q.question);
      if (!selectedIds.has(q.question_id) && !selectedTexts.has(norm)) {
        selectedIds.add(q.question_id);
        selectedTexts.add(norm);
        selected.push(q);
      }
    }

    // STEP 6: If candidatePool is less than 10 (edge case), draw from topic pool
    if (selected.length < 10) {
      const fallbackPool = this.data.questions
        .filter((q) => q.topic_id === topicId)
        .sort(() => Math.random() - 0.5);
      for (const q of fallbackPool) {
        if (selected.length === 10) break;
        const norm = normalizeQuestionText(q.question);
        if (!selectedIds.has(q.question_id) && !selectedTexts.has(norm)) {
          selectedIds.add(q.question_id);
          selectedTexts.add(norm);
          selected.push(q);
        }
      }
    }

    // STEP 7: Save those exact 10 question IDs to the active attempt record
    const attemptNumber = previousAttempts.length + 1;
    const newAttemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    prog.active_level_attempts[attemptKey] = {
      attempt_id: newAttemptId,
      topic_id: topicId,
      level_id: numLevel,
      attempt_number: attemptNumber,
      question_ids: selected.map((q) => q.question_id),
      created_at: new Date().toISOString(),
    };
    this.saveDatabase();

    // STEP 8: Return the selected 10 questions
    return selected;
  }

  public getQuestionsForTopicTest(userId: string, topicId: AptitudeTopicId, testNumber: 1 | 2): AptitudeQuestion[] {
    const check = this.canAccessTopicTest(userId, topicId, testNumber);
    if (!check.allowed) {
      throw new Error(check.reason);
    }

    const prog = this.getUserProgress(userId);
    const minLevel = testNumber === 1 ? 1 : 6;
    const maxLevel = testNumber === 1 ? 5 : 10;
    const poolType = testNumber === 1 ? 'test1' : 'test2';

    // Look for dedicated test pool questions first
    let pool = this.data.questions.filter((q) => q.topic_id === topicId && q.pool_type === poolType);
    if (pool.length < 20) {
      const levelQuestions = this.data.questions.filter(
        (q) => q.topic_id === topicId && q.level_id >= minLevel && q.level_id <= maxLevel
      );
      pool = [...pool, ...levelQuestions];
    }

    // Avoid questions from user's latest test attempt
    const prevTests = prog.test_attempts.filter((t) => t.topic_id === topicId && t.test_number === testNumber);
    const lastTest = prevTests[prevTests.length - 1];
    const recentIds = new Set<string>();
    if (lastTest && lastTest.answers_review) {
      lastTest.answers_review.forEach((ar) => recentIds.add(ar.question_id));
    }

    const fresh = pool.filter((q) => !recentIds.has(q.question_id));
    const poolToUse = fresh.length >= 20 ? fresh : pool;
    const shuffled = [...poolToUse].sort(() => Math.random() - 0.5);

    const selected: AptitudeQuestion[] = [];
    const seen = new Set<string>();

    for (const q of shuffled) {
      if (selected.length >= 20) break;
      if (!seen.has(q.question_id)) {
        selected.push(q);
        seen.add(q.question_id);
      }
    }

    // Fill to 20 if needed
    if (selected.length < 20) {
      for (const q of pool) {
        if (selected.length >= 20) break;
        if (!seen.has(q.question_id)) {
          selected.push(q);
          seen.add(q.question_id);
        }
      }
    }

    return selected.slice(0, 20);
  }

  public getQuestionsForFinalTest(userId: string): AptitudeQuestion[] {
    const dashboard = this.getDashboardState(userId);
    if (!dashboard.progression.final_aptitude_unlocked) {
      throw new Error('All four aptitude topics must be 100% completed before unlocking the Final Aptitude Test.');
    }

    const prog = this.getUserProgress(userId);
    const lastFinal = prog.final_aptitude_attempts[prog.final_aptitude_attempts.length - 1];
    const recentIds = new Set<string>();
    if (lastFinal && lastFinal.answers_review) {
      lastFinal.answers_review.forEach((ar) => recentIds.add(ar.question_id));
    }

    const getTopicPool = (topic: AptitudeTopicId, count: number) => {
      let pool = this.data.questions.filter((q) => q.topic_id === topic && q.pool_type === 'final');
      if (pool.length < count) {
        const general = this.data.questions.filter((q) => q.topic_id === topic);
        pool = [...pool, ...general];
      }
      const fresh = pool.filter((q) => !recentIds.has(q.question_id));
      const poolToUse = fresh.length >= count ? fresh : pool;
      return [...poolToUse].sort(() => Math.random() - 0.5).slice(0, count);
    };

    // 25 questions: 7 Quant, 6 Logical, 6 Verbal, 6 Tech
    const quant = getTopicPool('quantitative', 7);
    const logical = getTopicPool('logical', 6);
    const verbal = getTopicPool('verbal', 6);
    const tech = getTopicPool('specialized', 6);

    const combined = [...quant, ...logical, ...verbal, ...tech].sort(() => Math.random() - 0.5);
    return combined;
  }

  // Level Submission, Detailed Evaluation & Attempt Logging
  public submitLevel(
    userId: string,
    topicId: AptitudeTopicId,
    levelId: number,
    answers: Array<{ question_id: string; selected_answer: string }>
  ): LevelAttemptResult {
    const check = this.canAccessLevel(userId, topicId, levelId);
    if (!check.allowed) {
      throw new Error(check.reason);
    }

    const settings = this.getSettings();
    const prog = this.getUserProgress(userId);
    if (!prog.active_level_attempts) prog.active_level_attempts = {};
    if (!prog.question_attempts) prog.question_attempts = [];
    if (!prog.concept_performance) prog.concept_performance = {};

    const attemptKey = `${topicId}_${levelId}`;
    const activeAttempt = prog.active_level_attempts[attemptKey];

    const attemptId = activeAttempt?.attempt_id || `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const attemptNumber =
      activeAttempt?.attempt_number ||
      prog.level_attempts.filter((a) => a.topic_id === topicId && a.level_id === levelId).length + 1;

    let score = 0;
    const totalQuestions = answers.length || 10;
    const wrongAnswers: LevelAttemptResult['wrong_answers'] = [];
    const answersReview: ReviewQuestionItem[] = [];
    const categoryStats: Record<string, { correct: number; total: number }> = {};

    answers.forEach((ans) => {
      const q = this.data.questions.find((x) => x.question_id === ans.question_id) || {
        question_id: ans.question_id,
        topic_id: topicId,
        level_id: levelId,
        category: 'General',
        difficulty: 'Medium',
        question: 'Aptitude Question',
        option_a: 'Option A',
        option_b: 'Option B',
        option_c: 'Option C',
        option_d: 'Option D',
        correct_answer: 'A',
        explanation: 'Correct solution applies standard logical principles.',
      };

      const cat = q.category || 'General';
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
      categoryStats[cat].total += 1;

      const isCorrect = (ans.selected_answer || '').trim().toUpperCase() === q.correct_answer.toUpperCase();
      if (isCorrect) {
        score += 1;
        categoryStats[cat].correct += 1;
      } else {
        wrongAnswers.push({
          question: q.question,
          your_answer: ans.selected_answer || 'None',
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          category: cat,
        });
      }

      const reviewItem: ReviewQuestionItem = {
        question_id: q.question_id,
        question: q.question,
        your_answer: ans.selected_answer || 'None',
        correct_answer: q.correct_answer,
        explanation: q.explanation || 'Detailed step-by-step reasoning applies standard principles.',
        category: cat,
        topic_id: topicId,
        difficulty: q.difficulty,
        is_correct: isCorrect,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
      };
      answersReview.push(reviewItem);

      // Track individual question attempt history in database
      prog.question_attempts.push({
        attempt_id: `qatt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        user_id: userId,
        question_id: q.question_id,
        topic_id: topicId,
        level_id: levelId,
        concept: cat,
        attempt_number: attemptNumber,
        selected_answer: ans.selected_answer || 'None',
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        timestamp: new Date().toISOString(),
      });

      // Update concept performance mastery
      if (!prog.concept_performance[cat]) {
        prog.concept_performance[cat] = {
          concept: cat,
          topic_id: topicId,
          total_attempts: 0,
          correct_attempts: 0,
          accuracy_pct: 0,
          last_attempted: new Date().toISOString(),
        };
      }
      prog.concept_performance[cat].total_attempts += 1;
      if (isCorrect) prog.concept_performance[cat].correct_attempts += 1;
      prog.concept_performance[cat].accuracy_pct = Math.round(
        (prog.concept_performance[cat].correct_attempts / prog.concept_performance[cat].total_attempts) * 100
      );
      prog.concept_performance[cat].last_attempted = new Date().toISOString();
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= settings.levelCutoff;

    const numLevel = Number(levelId);
    if (passed) {
      if (!prog.topic_levels_passed[topicId]) {
        prog.topic_levels_passed[topicId] = [];
      }
      const existingPassed = prog.topic_levels_passed[topicId].map(Number);
      if (!existingPassed.includes(numLevel)) {
        prog.topic_levels_passed[topicId] = Array.from(new Set([...existingPassed, numLevel])).sort((a, b) => a - b);
      }
    }

    // Category breakdown
    const categoryBreakdown: Record<string, { correct: number; total: number; percentage: number }> = {};
    const weakCategories: string[] = [];
    const strongCategories: string[] = [];
    const conceptImprovementTips: Record<string, string> = {};

    Object.keys(categoryStats).forEach((cat) => {
      const c = categoryStats[cat];
      const pct = Math.round((c.correct / c.total) * 100);
      categoryBreakdown[cat] = { correct: c.correct, total: c.total, percentage: pct };
      if (pct < 70) {
        weakCategories.push(cat);
        conceptImprovementTips[cat] = CONCEPT_TIPS[cat] || `Review foundational formulas and calculation methods for ${cat}.`;
      } else {
        strongCategories.push(cat);
      }
    });

    const attemptResult: LevelAttemptResult = {
      attempt_id: attemptId,
      topic_id: topicId,
      level_id: levelId,
      attempt_number: attemptNumber,
      score,
      total_questions: totalQuestions,
      percentage,
      status: passed ? 'PASSED' : 'FAILED',
      cutoff: settings.levelCutoff,
      next_level_unlocked: numLevel === 5 ? false : passed,
      wrong_answers: wrongAnswers,
      answers_review: answersReview,
      category_breakdown: categoryBreakdown,
      weak_categories: weakCategories,
      strong_categories: strongCategories,
      concept_improvement_tips: conceptImprovementTips,
    };

    prog.level_attempts.push(attemptResult);

    // Clear active attempt since submission finalized the attempt
    if (prog.active_level_attempts && prog.active_level_attempts[attemptKey]) {
      delete prog.active_level_attempts[attemptKey];
    }

    this.saveDatabase();
    return attemptResult;
  }

  // Topic Test Submission & Evaluation
  public submitTopicTest(
    userId: string,
    topicId: AptitudeTopicId,
    testNumber: 1 | 2,
    answers: Array<{ question_id: string; selected_answer: string }>
  ): TopicTestResult {
    const check = this.canAccessTopicTest(userId, topicId, testNumber);
    if (!check.allowed) {
      throw new Error(check.reason);
    }

    const settings = this.getSettings();
    const prog = this.getUserProgress(userId);
    if (!prog.question_attempts) prog.question_attempts = [];
    if (!prog.concept_performance) prog.concept_performance = {};

    let score = 0;
    const totalQuestions = answers.length || 20;
    const answersReview: ReviewQuestionItem[] = [];
    const categoryStats: Record<string, { correct: number; total: number }> = {};

    answers.forEach((ans) => {
      const q = this.data.questions.find((x) => x.question_id === ans.question_id) || {
        question_id: ans.question_id,
        topic_id: topicId,
        level_id: testNumber === 1 ? 1 : 6,
        category: 'Checkpoint Review',
        difficulty: 'Medium',
        question: 'Topic Test Question',
        option_a: 'Option A',
        option_b: 'Option B',
        option_c: 'Option C',
        option_d: 'Option D',
        correct_answer: 'A',
        explanation: 'Review fundamental formulas and logical patterns for this topic.',
      };

      const cat = q.category || 'General';
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
      categoryStats[cat].total += 1;

      const isCorrect = (ans.selected_answer || '').trim().toUpperCase() === q.correct_answer.toUpperCase();
      if (isCorrect) {
        score += 1;
        categoryStats[cat].correct += 1;
      }
      answersReview.push({
        question_id: q.question_id,
        question: q.question,
        your_answer: ans.selected_answer || 'None',
        correct_answer: q.correct_answer,
        explanation: q.explanation || 'Review fundamental formulas and logical patterns for this topic.',
        category: cat,
        topic_id: topicId,
        difficulty: q.difficulty,
        is_correct: isCorrect,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
      });
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= settings.testCutoff;

    if (passed) {
      if (testNumber === 1) prog.topic_test1_passed[topicId] = true;
      if (testNumber === 2) prog.topic_test2_passed[topicId] = true;
    }

    const categoryBreakdown: Record<string, { correct: number; total: number; percentage: number }> = {};
    const weakAreas: string[] = [];
    const strongAreas: string[] = [];

    Object.keys(categoryStats).forEach((cat) => {
      const c = categoryStats[cat];
      const pct = Math.round((c.correct / c.total) * 100);
      categoryBreakdown[cat] = { correct: c.correct, total: c.total, percentage: pct };
      if (pct < 70) weakAreas.push(cat);
      else strongAreas.push(cat);
    });

    const testResult: TopicTestResult = {
      test_id: `test_${topicId}_t${testNumber}_${Date.now()}`,
      topic_id: topicId,
      test_number: testNumber,
      score,
      total_questions: totalQuestions,
      percentage,
      status: passed ? 'PASSED' : 'FAILED',
      cutoff: settings.testCutoff,
      unlocked_levels: passed
        ? testNumber === 1
          ? 'Levels 6-10 are now UNLOCKED!'
          : `${TOPICS_META[topicId].name} is now 100% COMPLETED!`
        : 'Please enter Revision Mode to practice weak topics before retrying.',
      strong_areas: strongAreas,
      weak_areas: weakAreas,
      category_breakdown: categoryBreakdown,
      answers_review: answersReview,
    };

    prog.test_attempts.push(testResult);
    this.saveDatabase();
    return testResult;
  }

  // Final Aptitude Test Submission
  public submitFinalTest(
    userId: string,
    answers: Array<{ question_id: string; selected_answer: string }>
  ): FinalAptitudeResult {
    const dashboard = this.getDashboardState(userId);
    if (!dashboard.progression.final_aptitude_unlocked) {
      throw new Error('All 4 topics must be completed before submitting the Final Aptitude Test.');
    }

    const settings = this.getSettings();
    let score = 0;
    const totalQuestions = answers.length || 25;
    const answersReview: ReviewQuestionItem[] = [];

    const topicStats: Record<AptitudeTopicId, { score: number; total: number }> = {
      quantitative: { score: 0, total: 0 },
      logical: { score: 0, total: 0 },
      verbal: { score: 0, total: 0 },
      specialized: { score: 0, total: 0 },
    };

    answers.forEach((ans) => {
      const cleanId = ans.question_id.split('_').slice(-4).join('_');
      const q = this.data.questions.find((x) => x.question_id === ans.question_id || x.question_id === cleanId) || {
        question_id: ans.question_id,
        topic_id: 'quantitative' as AptitudeTopicId,
        level_id: 1,
        category: 'Aptitude Benchmark',
        difficulty: 'Medium',
        question: 'Benchmark Question',
        option_a: 'Option A',
        option_b: 'Option B',
        option_c: 'Option C',
        option_d: 'Option D',
        correct_answer: 'A',
        explanation: 'Review fundamental principles and calculation steps.',
      };
      const tid: AptitudeTopicId = q.topic_id || 'quantitative';

      topicStats[tid].total += 1;
      const isCorrect = ans.selected_answer.toUpperCase() === q.correct_answer.toUpperCase();
      if (isCorrect) {
        score += 1;
        topicStats[tid].score += 1;
      }

      answersReview.push({
        question_id: q.question_id,
        question: q.question,
        your_answer: ans.selected_answer,
        correct_answer: q.correct_answer,
        explanation: q.explanation || 'Detailed step-by-step mathematical reasoning.',
        category: q.category || 'General',
        topic_id: tid,
        difficulty: q.difficulty,
        is_correct: isCorrect,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
      });
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= settings.finalTestCutoff;

    const topicScores = {
      quantitative: {
        score: topicStats.quantitative.score,
        total: topicStats.quantitative.total || 7,
        percentage: Math.round((topicStats.quantitative.score / (topicStats.quantitative.total || 1)) * 100),
      },
      logical: {
        score: topicStats.logical.score,
        total: topicStats.logical.total || 6,
        percentage: Math.round((topicStats.logical.score / (topicStats.logical.total || 1)) * 100),
      },
      verbal: {
        score: topicStats.verbal.score,
        total: topicStats.verbal.total || 6,
        percentage: Math.round((topicStats.verbal.score / (topicStats.verbal.total || 1)) * 100),
      },
      specialized: {
        score: topicStats.specialized.score,
        total: topicStats.specialized.total || 6,
        percentage: Math.round((topicStats.specialized.score / (topicStats.specialized.total || 1)) * 100),
      },
    };

    const sortedTopics = Object.entries(topicScores).sort((a, b) => b[1].percentage - a[1].percentage);
    const strongest = TOPICS_META[sortedTopics[0][0] as AptitudeTopicId].name;
    const weakest = TOPICS_META[sortedTopics[sortedTopics.length - 1][0] as AptitudeTopicId].name;

    const recommended: string[] = [];
    Object.entries(topicScores).forEach(([k, v]) => {
      if (v.percentage < 70) {
        recommended.push(TOPICS_META[k as AptitudeTopicId].name);
      }
    });

    const result: FinalAptitudeResult = {
      attempt_id: `final_apt_${Date.now()}`,
      score,
      total_questions: totalQuestions,
      percentage,
      status: passed ? 'QUALIFIED' : 'NOT_QUALIFIED',
      cutoff: settings.finalTestCutoff,
      topic_scores: topicScores,
      strongest_topic: strongest,
      weakest_topic: weakest,
      recommended_topics: recommended.length > 0 ? recommended : ['Continue maintaining high performance across all 4 pillars'],
      technical_unlocked: passed,
      answers_review: answersReview,
    };

    const prog = this.getUserProgress(userId);
    prog.final_aptitude_attempts.push(result);
    this.saveDatabase();
    return result;
  }

  // Technical Round Execution & Multimodal 3-Level Evaluation
  public getActiveTechnicalInterview(userId: string): TechnicalInterviewSession | null {
    const prog = this.getUserProgress(userId);
    const active = (prog.technical_sessions || []).find((s) => s.status === 'IN_PROGRESS');
    return active || null;
  }

  public resetTechnicalInterview(userId: string): boolean {
    const prog = this.getUserProgress(userId);
    prog.technical_sessions = (prog.technical_sessions || []).filter((s) => s.status === 'COMPLETED');
    this.saveDatabase();
    return true;
  }

  public async startTechnicalInterview(
    userId: string,
    domain: TechnicalDomainId,
    isRetake = false
  ): Promise<TechnicalInterviewSession> {
    const isDemo = this.isDemoUser(userId);
    const dashboard = this.getDashboardState(userId);
    if (!isDemo && !dashboard.progression.technical_unlocked) {
      throw new Error('Technical Round is locked until you successfully qualify the Final Aptitude Test.');
    }

    const prog = this.getUserProgress(userId);
    if (!prog.technical_sessions) prog.technical_sessions = [];

    // If not a retake and there is already an active session in progress with matching domain, reuse it
    if (!isRetake) {
      const existingActive = prog.technical_sessions.find((s) => s.status === 'IN_PROGRESS' && s.domain === domain);
      if (existingActive && existingActive.questions && existingActive.questions.length >= 30) {
        return existingActive;
      }
    }

    // Determine previous weak topics if retake
    const previousCompleted = prog.technical_sessions.filter((s) => s.domain === domain && s.status === 'COMPLETED');
    const weakTopics: string[] = [];
    previousCompleted.forEach((sess) => {
      sess.responses.forEach((resp) => {
        if (resp.evaluation && resp.evaluation.score < 60) {
          const qObj = sess.questions.find((q) => q.question_id === resp.question_id);
          if (qObj && qObj.topic) weakTopics.push(qObj.topic);
        }
      });
    });

    const generated = await generateAITechnicalQuestions(domain, isRetake, weakTopics);
    const questions = generated && generated.length >= 30 ? generated : getCuratedDomainQuestions(domain);

    const session: TechnicalInterviewSession = {
      session_id: `tech_sess_${domain}_${Date.now()}`,
      user_id: userId,
      domain,
      status: 'IN_PROGRESS',
      current_question_index: 0,
      total_questions: questions.length,
      current_level: 1,
      attempt_number: previousCompleted.length + 1,
      is_retake: isRetake,
      questions,
      responses: [],
    };

    // Close any previous stale active session
    prog.technical_sessions.forEach((s) => {
      if (s.status === 'IN_PROGRESS') s.status = 'COMPLETED';
    });

    prog.technical_sessions.push(session);
    this.saveDatabase();
    return session;
  }

  public async evaluateTechnicalStep(
    userId: string,
    sessionId: string,
    questionId: string,
    responseType: 'text' | 'voice' | 'code' | 'diagram',
    responseText: string,
    codeSnippet?: string,
    diagramData?: string,
    timeTakenSeconds?: number
  ): Promise<{ session: TechnicalInterviewSession; currentEvaluation: any }> {
    const prog = this.getUserProgress(userId);
    const session = prog.technical_sessions.find((s) => s.session_id === sessionId);
    if (!session) {
      throw new Error('Interview session not found');
    }

    const currentIdx = session.current_question_index;
    const question = session.questions.find((q) => q.question_id === questionId) || session.questions[currentIdx];
    
    const evaluation = await evaluateTechnicalAnswer({
      domain: session.domain,
      question: question.question,
      response_type: responseType,
      response_text: responseText,
      code_snippet: codeSnippet,
      diagram_data: diagramData,
      time_taken_seconds: timeTakenSeconds,
    });

    session.responses.push({
      question_id: question.question_id,
      question: question.question,
      level: question.level || ((session.current_question_index < 10 ? 1 : session.current_question_index < 20 ? 2 : 3) as 1 | 2 | 3),
      topic: question.topic || 'Core Concept',
      response_type: responseType,
      response: [responseText, codeSnippet, diagramData].filter(Boolean).join('\n'),
      code_snippet: codeSnippet,
      evaluation,
      timestamp: new Date().toISOString(),
    });

    // Advance to next question
    session.current_question_index += 1;

    // Update current level indicator (10 questions per level)
    if (session.current_question_index < 10) {
      session.current_level = 1;
    } else if (session.current_question_index < 20) {
      session.current_level = 2;
    } else {
      session.current_level = 3;
    }

    // Finalize session when all questions are answered
    if (session.current_question_index >= session.total_questions) {
      session.status = 'COMPLETED';
      session.completed_at = new Date().toISOString();

      // Compute scores per level
      const l1Responses = session.responses.slice(0, 10);
      const l2Responses = session.responses.slice(10, 20);
      const l3Responses = session.responses.slice(20, 30);

      const l1Avg = l1Responses.length > 0
        ? Math.round(l1Responses.reduce((acc, r) => acc + (r.evaluation?.score || 0), 0) / l1Responses.length)
        : 75;
      const l2Avg = l2Responses.length > 0
        ? Math.round(l2Responses.reduce((acc, r) => acc + (r.evaluation?.score || 0), 0) / l2Responses.length)
        : 75;
      const l3Avg = l3Responses.length > 0
        ? Math.round(l3Responses.reduce((acc, r) => acc + (r.evaluation?.score || 0), 0) / l3Responses.length)
        : 75;

      session.level_scores = {
        level1: l1Avg,
        level2: l2Avg,
        level3: l3Avg,
      };

      // Compute weighted overall score (Level 1: 25%, Level 2: 35%, Level 3: 40%)
      const weightedScore = Math.round((l1Avg * 0.25) + (l2Avg * 0.35) + (l3Avg * 0.40));
      session.overall_score = weightedScore;

      // Compute multi-metric breakdown
      const allEvaluations = session.responses.map((r) => r.evaluation).filter(Boolean);
      const avgCorrectness = Math.round(allEvaluations.reduce((acc, e) => acc + (e.correctness || e.score || 0), 0) / allEvaluations.length);
      const avgDepth = Math.round(allEvaluations.reduce((acc, e) => acc + (e.technical_depth || e.score || 0), 0) / allEvaluations.length);
      const avgClarity = Math.round(allEvaluations.reduce((acc, e) => acc + (e.clarity || 80), 0) / allEvaluations.length);
      const avgConfidence = Math.round(allEvaluations.reduce((acc, e) => acc + (e.confidence_score || 80), 0) / allEvaluations.length);
      const problemSolving = Math.round((l2Avg * 0.4) + (l3Avg * 0.6));

      session.metrics_breakdown = {
        technical_knowledge: avgCorrectness,
        concept_understanding: avgDepth,
        problem_solving: problemSolving,
        communication: avgClarity,
        confidence_level: avgConfidence,
      };

      session.passed = weightedScore >= this.getSettings().technicalCutoff;
    }

    this.saveDatabase();
    return { session, currentEvaluation: evaluation };
  }

  // HR Round Execution & Voice Evaluation
  public startHRInterview(userId: string): HRInterviewSession {
    const isDemo = this.isDemoUser(userId);
    const dashboard = this.getDashboardState(userId);
    if (!isDemo && !dashboard.progression.hr_unlocked) {
      throw new Error('HR Round is locked until you successfully clear the Technical Interview.');
    }

    const session: HRInterviewSession = {
      session_id: `hr_sess_${Date.now()}`,
      user_id: userId,
      status: 'IN_PROGRESS',
      current_question_index: 0,
      total_questions: HR_QUESTIONS_BANK.length,
      questions: HR_QUESTIONS_BANK,
      responses: [],
    };

    const prog = this.getUserProgress(userId);
    prog.hr_sessions.push(session);
    this.saveDatabase();
    return session;
  }

  public async evaluateHRStep(
    userId: string,
    sessionId: string,
    questionId: string,
    responseType: 'text' | 'voice',
    responseText: string
  ): Promise<{ session: HRInterviewSession; currentEvaluation: any }> {
    const prog = this.getUserProgress(userId);
    const session = prog.hr_sessions.find((s) => s.session_id === sessionId);
    if (!session) {
      throw new Error('HR session not found');
    }

    const question = session.questions.find((q) => q.question_id === questionId) || session.questions[session.current_question_index];
    const evaluation = await evaluateHREvaluation({
      question: question.question,
      response_text: responseText,
    });

    session.responses.push({
      question_id: question.question_id,
      question: question.question,
      response_type: responseType,
      response: responseText,
      evaluation,
    });

    session.current_question_index += 1;
    if (session.current_question_index >= session.total_questions) {
      session.status = 'COMPLETED';
      session.completed_at = new Date().toISOString();
      const avgScore = Math.round(
        session.responses.reduce((sum, r) => sum + r.evaluation.score, 0) / session.responses.length
      );
      session.overall_score = avgScore;
      session.passed = avgScore >= this.getSettings().hrCutoff;
    }

    this.saveDatabase();
    return { session, currentEvaluation: evaluation };
  }

  // Final Performance Report Generator
  public async getFinalReport(userId: string): Promise<FinalReportData> {
    const user = this.getUserById(userId) || this.data.users[0];
    const prog = this.getUserProgress(user.user_id);
    const dashboard = this.getDashboardState(user.user_id);

    const latestFinalApt = prog.final_aptitude_attempts[prog.final_aptitude_attempts.length - 1] || {
      score: 22,
      total_questions: 25,
      percentage: 88,
      status: 'QUALIFIED',
      topic_scores: {
        quantitative: { score: 6, total: 7, percentage: 85 },
        logical: { score: 5, total: 6, percentage: 83 },
        verbal: { score: 5, total: 6, percentage: 83 },
        specialized: { score: 6, total: 6, percentage: 100 },
      },
    };

    const completedTech = prog.technical_sessions.filter((s) => s.status === 'COMPLETED');
    const latestTech = completedTech[completedTech.length - 1] || {
      domain: 'fullstack' as TechnicalDomainId,
      overall_score: 84,
      passed: true,
      questions: [{ question_id: 'q1' }, { question_id: 'q2' }, { question_id: 'q3' }],
    };

    const completedHR = prog.hr_sessions.filter((s) => s.status === 'COMPLETED');
    const latestHR = completedHR[completedHR.length - 1] || {
      overall_score: 86,
      passed: true,
      questions: [{ question_id: 'q1' }, { question_id: 'q2' }, { question_id: 'q3' }],
    };

    const compositeScore = Math.round(
      (latestFinalApt.percentage * 0.4) + (latestTech.overall_score * 0.35) + (latestHR.overall_score * 0.25)
    );

    const isQualified = compositeScore >= 65 && latestTech.passed && latestHR.passed;

    const aiFeedback = await generateFinalAIFeedback({
      candidate_name: user.name,
      domain: latestTech.domain,
      aptitude_scores: {
        quantitative: latestFinalApt.topic_scores.quantitative.percentage,
        logical: latestFinalApt.topic_scores.logical.percentage,
        verbal: latestFinalApt.topic_scores.verbal.percentage,
        specialized: latestFinalApt.topic_scores.specialized.percentage,
      },
      technical_score: latestTech.overall_score,
      hr_score: latestHR.overall_score,
      overall_score: compositeScore,
    });

    const report: FinalReportData = {
      report_id: `rep_${Date.now()}`,
      user_name: user.name,
      user_email: user.email,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      selected_domain: latestTech.domain.toUpperCase(),
      aptitude: {
        quantitative: latestFinalApt.topic_scores.quantitative.percentage,
        logical: latestFinalApt.topic_scores.logical.percentage,
        verbal: latestFinalApt.topic_scores.verbal.percentage,
        specialized: latestFinalApt.topic_scores.specialized.percentage,
        final_aptitude_score: latestFinalApt.percentage,
        status: latestFinalApt.status,
      },
      technical: {
        domain: latestTech.domain,
        score: latestTech.overall_score,
        status: latestTech.passed ? 'CLEARED' : 'FAILED',
        question_count: latestTech.questions?.length || 3,
      },
      hr: {
        score: latestHR.overall_score,
        status: latestHR.passed ? 'RECOMMENDED' : 'NOT_RECOMMENDED',
        question_count: latestHR.questions?.length || 3,
      },
      overall: {
        score: compositeScore,
        qualification_status: isQualified ? 'QUALIFIED' : 'NEEDS_REVISION',
        badge: compositeScore >= 85 ? 'Senior Hire Ready' : compositeScore >= 70 ? 'Interview Qualified' : 'Development Needed',
      },
      ai_feedback: {
        summary: aiFeedback.executive_summary,
        strengths: aiFeedback.key_strengths,
        weaknesses: aiFeedback.critical_weaknesses,
        action_plan: aiFeedback.personalized_action_plan.map((p) => `${p.title}: ${p.focus} (${p.timeframe})`),
        executive_summary: aiFeedback.executive_summary,
        key_strengths: aiFeedback.key_strengths,
        critical_weaknesses: aiFeedback.critical_weaknesses,
        recommended_topics: aiFeedback.recommended_topics,
        personalized_action_plan: aiFeedback.personalized_action_plan,
      },
    };

    return report;
  }

  // Performance History Aggregator
  public getPerformanceHistory(userId: string) {
    const prog = this.getUserProgress(userId);
    return {
      level_attempts: prog.level_attempts,
      test_attempts: prog.test_attempts,
      final_aptitude_attempts: prog.final_aptitude_attempts,
      technical_interviews: prog.technical_sessions,
      hr_interviews: prog.hr_sessions,
    };
  }

  // Quick seed / Unlock for testing (Admin feature)
  public quickUnlockMilestone(userId: string, milestone: 'level5' | 'all_topics' | 'technical' | 'hr' | 'complete') {
    const prog = this.getUserProgress(userId);
    const topicIds: AptitudeTopicId[] = ['quantitative', 'logical', 'verbal', 'specialized'];

    if (milestone === 'level5') {
      topicIds.forEach((tid) => {
        prog.topic_levels_passed[tid] = [1, 2, 3, 4, 5];
        prog.topic_test1_passed[tid] = false;
        prog.topic_test2_passed[tid] = false;
      });
    } else if (milestone === 'all_topics') {
      topicIds.forEach((tid) => {
        prog.topic_levels_passed[tid] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        prog.topic_test1_passed[tid] = true;
        prog.topic_test2_passed[tid] = true;
      });
    } else if (milestone === 'technical' || milestone === 'hr' || milestone === 'complete') {
      topicIds.forEach((tid) => {
        prog.topic_levels_passed[tid] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        prog.topic_test1_passed[tid] = true;
        prog.topic_test2_passed[tid] = true;
      });
      if (!prog.final_aptitude_attempts.length || prog.final_aptitude_attempts[prog.final_aptitude_attempts.length - 1].status !== 'QUALIFIED') {
        prog.final_aptitude_attempts.push({
          attempt_id: `seed_final_${Date.now()}`,
          score: 22,
          total_questions: 25,
          percentage: 88,
          status: 'QUALIFIED',
          cutoff: 70,
          topic_scores: {
            quantitative: { score: 6, total: 7, percentage: 85 },
            logical: { score: 5, total: 6, percentage: 83 },
            verbal: { score: 5, total: 6, percentage: 83 },
            specialized: { score: 6, total: 6, percentage: 100 },
          },
          strongest_topic: 'Specialized & Technical Aptitude',
          weakest_topic: 'Logical Reasoning',
          recommended_topics: ['Continue practice'],
          technical_unlocked: true,
        });
      }

      if (milestone === 'hr' || milestone === 'complete') {
        if (!prog.technical_sessions.length || !prog.technical_sessions[0].passed) {
          prog.technical_sessions.push({
            session_id: `seed_tech_${Date.now()}`,
            user_id: userId,
            domain: 'fullstack',
            status: 'COMPLETED',
            current_level: 3,
            current_question_index: 3,
            total_questions: 3,
            questions: DOMAIN_DEFAULTS.fullstack,
            level_scores: {
              level1: 88,
              level2: 85,
              level3: 82,
            },
            metrics_breakdown: {
              technical_knowledge: 88,
              concept_understanding: 86,
              problem_solving: 84,
              communication: 85,
              confidence_level: 88,
            },
            responses: [
              {
                question_id: 'fs_q1',
                question: DOMAIN_DEFAULTS.fullstack[0].question,
                response_type: 'text',
                response: 'React uses Fiber reconciliation with O(n) heuristic diffing algorithm.',
                evaluation: {
                  score: 85,
                  correctness: 90,
                  technical_depth: 80,
                  clarity: 85,
                  confidence_score: 88,
                  verbal_status: 'CORRECT',
                  verbal_feedback: 'Clear explanation of React Fiber reconciliation.',
                  spoken_response: 'Excellent explanation of Fiber reconciliation and heuristic diffing.',
                  what_you_got_right: ['Accurate algorithmic concepts', 'Clear breakdown of microtask batching'],
                  what_you_missed: ['Could mention concurrent rendering prioritization'],
                  improved_answer: 'React uses a Fiber-based reconciliation engine with an O(n) heuristic diffing algorithm.',
                  feedback: 'Excellent breakdown of React Fiber diffing mechanism.',
                  strengths: ['Accurate algorithmic concepts'],
                  weaknesses: [],
                  suggested_improvements: [],
                },
                level: 1,
                topic: 'React & Virtual DOM',
                timestamp: new Date().toISOString(),
              },
            ],
            overall_score: 85,
            passed: true,
            completed_at: new Date().toISOString(),
          });
        }
      }

      if (milestone === 'complete') {
        prog.hr_sessions.push({
          session_id: `seed_hr_${Date.now()}`,
          user_id: userId,
          status: 'COMPLETED',
          current_question_index: 3,
          total_questions: 3,
          questions: HR_QUESTIONS_BANK,
          responses: [
            {
              question_id: 'hr_q1',
              question: HR_QUESTIONS_BANK[0].question,
              response_type: 'voice',
              response: 'I am a passionate software engineer focused on building resilient distributed systems.',
              evaluation: {
                score: 88,
                relevance: 90,
                clarity: 85,
                communication_quality: 90,
                feedback: 'Clear storytelling and strong leadership alignment.',
                strengths: ['Authentic narrative'],
                weaknesses: [],
              },
            },
          ],
          overall_score: 88,
          passed: true,
          completed_at: new Date().toISOString(),
        });
      }
    }

    this.saveDatabase();
    return this.getDashboardState(userId);
  }

  public resetUserProgress(userId: string) {
    this.data.user_progress[userId] = this.createDefaultUserProgress(userId);
    this.saveDatabase();
    return this.getDashboardState(userId);
  }

  // --- ADMIN DEMO MODE (College Project Presentation) ---
  public static DEMO_USER_ID = 'user_demo_presentation';
  public static DEMO_USER_EMAIL = 'demo@interview.com';

  public getOrCreateDemoUser(): { user: User; token: string } {
    let demoUser = this.data.users.find(
      (u) => u.email.toLowerCase() === Database.DEMO_USER_EMAIL.toLowerCase() || u.user_id === Database.DEMO_USER_ID
    );

    if (!demoUser) {
      demoUser = {
        user_id: Database.DEMO_USER_ID,
        name: 'Demo Candidate (College Presentation)',
        email: Database.DEMO_USER_EMAIL,
        password_hash: this.hashPassword('Demo@123'),
        created_at: new Date().toISOString(),
      };
      this.data.users.push(demoUser);
    }

    if (!this.data.user_progress[Database.DEMO_USER_ID]) {
      this.initDemoProgress(Database.DEMO_USER_ID);
    }

    this.saveDatabase();
    return { user: demoUser, token: `token_${demoUser.user_id}` };
  }

  public initDemoProgress(userId: string = Database.DEMO_USER_ID): UserProgressData {
    const demoProgress: UserProgressData = {
      user_id: userId,
      topic_levels_passed: {
        quantitative: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        logical: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        verbal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        specialized: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      topic_test1_passed: {
        quantitative: true,
        logical: true,
        verbal: true,
        specialized: true,
      },
      topic_test2_passed: {
        quantitative: true,
        logical: true,
        verbal: true,
        specialized: true,
      },
      level_attempts: [],
      test_attempts: [],
      final_aptitude_attempts: [
        {
          attempt_id: `demo_final_apt_${Date.now()}`,
          score: 22,
          total_questions: 25,
          percentage: 88,
          status: 'QUALIFIED',
          cutoff: this.getSettings().finalTestCutoff || 70,
          topic_scores: {
            quantitative: { score: 6, total: 7, percentage: 85 },
            logical: { score: 5, total: 6, percentage: 83 },
            verbal: { score: 5, total: 6, percentage: 83 },
            specialized: { score: 6, total: 6, percentage: 100 },
          },
          strongest_topic: 'Specialized & Technical Aptitude',
          weakest_topic: 'Logical Reasoning',
          recommended_topics: ['Continue maintaining high performance across all 4 pillars'],
          technical_unlocked: true,
          answers_review: [
            {
              question_id: 'demo_rev_q1',
              question: 'A train 150 meters long passes a pole in 9 seconds. What is the speed of the train in km/h?',
              your_answer: 'B',
              correct_answer: 'B',
              explanation: 'Speed = Distance / Time = 150m / 9s = 50/3 m/s. Convert to km/h: (50/3) * (18/5) = 60 km/h.',
              category: 'Speed, Time & Distance',
              topic_id: 'quantitative',
              difficulty: 'Medium',
              is_correct: true,
              option_a: '54 km/h',
              option_b: '60 km/h',
              option_c: '65 km/h',
              option_d: '72 km/h',
            },
            {
              question_id: 'demo_rev_q2',
              question: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?',
              your_answer: 'A',
              correct_answer: 'A',
              explanation: 'The first and last letters are reversed, and every intermediate letter is incremented by +1 in reverse order. MEDICINE becomes EOJDJEFM.',
              category: 'Coding & Decoding',
              topic_id: 'logical',
              difficulty: 'Medium',
              is_correct: true,
              option_a: 'EOJDJEFM',
              option_b: 'EOJDEJFM',
              option_c: 'MFEJDJOE',
              option_d: 'EMDJOFJE',
            },
            {
              question_id: 'demo_rev_q3',
              question: 'Identify the antonym of the word "TACITURN":',
              your_answer: 'C',
              correct_answer: 'C',
              explanation: 'Taciturn means reserved or uncommunicative in speech. Loquacious or Talkative is the exact opposite.',
              category: 'Vocabulary & Antonyms',
              topic_id: 'verbal',
              difficulty: 'Medium',
              is_correct: true,
              option_a: 'Reserved',
              option_b: 'Silent',
              option_c: 'Loquacious',
              option_d: 'Reticent',
            },
            {
              question_id: 'demo_rev_q4',
              question: 'Which data structure is fundamentally used for Breadth-First Search (BFS) graph traversal?',
              your_answer: 'B',
              correct_answer: 'B',
              explanation: 'BFS explores neighbor vertices layer-by-layer in FIFO order, requiring a Queue data structure.',
              category: 'Data Structures & Algorithms',
              topic_id: 'specialized',
              difficulty: 'Easy',
              is_correct: true,
              option_a: 'Stack',
              option_b: 'Queue',
              option_c: 'Priority Queue',
              option_d: 'Binary Search Tree',
            },
          ],
        },
      ],
      technical_sessions: [],
      hr_sessions: [],
      recent_questions_answered: [],
      question_attempts: [],
      concept_performance: {},
      active_level_attempts: {},
    };

    this.data.user_progress[userId] = demoProgress;
    this.saveDatabase();
    return demoProgress;
  }

  public resetDemoProgress(): UserDashboardState {
    this.initDemoProgress(Database.DEMO_USER_ID);
    return this.getDashboardState(Database.DEMO_USER_ID);
  }
}

export const db = new Database();
