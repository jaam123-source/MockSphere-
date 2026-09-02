export interface User {
  user_id: string;
  name: string;
  email: string;
  google_id?: string;
  role?: 'admin' | 'user';
  password_hash?: string;
  avatar_url?: string;
  auth_provider?: 'google' | 'password';
  created_at: string;
}

export type AptitudeTopicId = 'quantitative' | 'logical' | 'verbal' | 'specialized';

export type QuizMode = 'level' | 'test';

export interface AptitudeTopicInfo {
  id: AptitudeTopicId;
  name: string;
  icon: string;
  description: string;
  totalLevels: number;
  completedLevels: number;
  currentLevel: number;
  test1Passed: boolean;
  test2Passed: boolean;
  isCompleted: boolean;
  progressPercentage: number;
}

export interface AptitudeQuestion {
  question_id: string;
  topic_id: AptitudeTopicId;
  level_id: number;
  category: string; // concept
  concept?: string; // alias for concept
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  pool_type?: 'learning' | 'test1' | 'test2' | 'final';
}

export interface QuestionAttemptLog {
  attempt_id: string;
  user_id: string;
  question_id: string;
  topic_id: AptitudeTopicId;
  level_id: number;
  concept: string;
  attempt_number: number;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
  timestamp: string;
}

export interface ActiveLevelAttempt {
  attempt_id: string;
  topic_id: AptitudeTopicId;
  level_id: number;
  attempt_number: number;
  question_ids: string[];
  created_at: string;
}

export interface ConceptMastery {
  concept: string;
  topic_id: AptitudeTopicId;
  total_attempts: number;
  correct_attempts: number;
  accuracy_pct: number;
  last_attempted: string;
}

export interface QuestionSubmission {
  question_id: string;
  selected_answer: string;
}

export interface ReviewQuestionItem {
  question_id: string;
  question: string;
  your_answer: string;
  correct_answer: string;
  explanation: string;
  category: string;
  topic_id?: string;
  difficulty?: string;
  is_correct: boolean;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
}

export interface LevelAttemptResult {
  attempt_id: string;
  topic_id: AptitudeTopicId;
  level_id: number;
  attempt_number?: number;
  score: number;
  total_questions: number;
  percentage: number;
  status: 'PASSED' | 'FAILED';
  cutoff: number;
  next_level_unlocked: boolean;
  wrong_answers: Array<{
    question: string;
    your_answer: string;
    correct_answer: string;
    explanation: string;
    category: string;
  }>;
  answers_review?: ReviewQuestionItem[];
  category_breakdown: Record<string, { correct: number; total: number; percentage: number }>;
  weak_categories: string[];
  strong_categories: string[];
  concept_improvement_tips?: Record<string, string>;
}

export interface TopicTestResult {
  test_id: string;
  topic_id: AptitudeTopicId;
  test_number: 1 | 2;
  score: number;
  total_questions: number;
  percentage: number;
  status: 'PASSED' | 'FAILED';
  cutoff: number;
  unlocked_levels: string;
  strong_areas: string[];
  weak_areas: string[];
  category_breakdown: Record<string, { correct: number; total: number; percentage: number }>;
  answers_review: ReviewQuestionItem[];
}

export interface FinalAptitudeResult {
  attempt_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  status: 'QUALIFIED' | 'NOT_QUALIFIED';
  cutoff: number;
  topic_scores: {
    quantitative: { score: number; total: number; percentage: number };
    logical: { score: number; total: number; percentage: number };
    verbal: { score: number; total: number; percentage: number };
    specialized: { score: number; total: number; percentage: number };
  };
  strongest_topic: string;
  weakest_topic: string;
  recommended_topics: string[];
  technical_unlocked: boolean;
  answers_review?: ReviewQuestionItem[];
}

export type TechnicalDomainId =
  | 'fullstack'
  | 'genai'
  | 'cloud'
  | 'datascience'
  | 'cybersecurity';

export interface TechnicalDomainInfo {
  id: TechnicalDomainId;
  name: string;
  description: string;
  topics: string[];
  icon: string;
  category?: string;
}

export type ResponseMode = 'text' | 'voice' | 'code' | 'diagram';

export interface TechnicalQuestion {
  question_id: string;
  domain: TechnicalDomainId;
  level: 1 | 2 | 3;
  level_name: 'Level 1 — Basic' | 'Level 2 — Intermediate' | 'Level 3 — Practical';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'conceptual' | 'coding' | 'system_design' | 'scenario' | 'code_output' | 'debugging' | 'practical';
  question: string;
  code_snippet_display?: string;
  code_template?: string;
  diagram_prompt?: string;
  language?: string;
  hints?: string[];
  expected_key_points?: string[];
  improved_answer?: string;
}

export type TechnicalInterviewQuestion = TechnicalQuestion;

export interface TechnicalAnswerPayload {
  session_id: string;
  question_id: string;
  domain: TechnicalDomainId;
  question: string;
  response_type: ResponseMode;
  response_text: string;
  code_snippet?: string;
  diagram_data?: string;
  time_taken_seconds?: number;
}

export interface AIQuestionEvaluation {
  score: number; // 0 - 100
  correctness: number; // 0 - 100
  technical_depth: number; // 0 - 100
  clarity: number; // 0 - 100
  code_quality?: number; // 0 - 100
  confidence_score?: number; // 0 - 100
  verbal_status: 'CORRECT' | 'PARTIALLY CORRECT' | 'INCORRECT';
  verbal_feedback: string;
  spoken_response: string; // Natural AI interviewer spoken response
  feedback: string;
  what_you_got_right: string[];
  what_you_missed: string[];
  improved_answer: string;
  strengths: string[];
  weaknesses: string[];
  suggested_improvements: string[];
  follow_up_prompt?: string;
}

export interface TechnicalInterviewSession {
  session_id: string;
  user_id: string;
  domain: TechnicalDomainId;
  status: 'IN_PROGRESS' | 'COMPLETED';
  current_level: 1 | 2 | 3;
  current_question_index: number;
  total_questions: number;
  questions: TechnicalQuestion[];
  responses: Array<{
    question_id: string;
    question: string;
    level: 1 | 2 | 3;
    topic: string;
    response_type: ResponseMode;
    response: string;
    code_snippet?: string;
    evaluation: AIQuestionEvaluation;
    timestamp: string;
  }>;
  overall_score?: number;
  level_scores?: {
    level1: number;
    level2: number;
    level3: number;
  };
  metrics_breakdown?: {
    technical_knowledge: number;
    concept_understanding: number;
    problem_solving: number;
    communication: number;
    confidence_level: number;
  };
  passed?: boolean;
  is_retake?: boolean;
  attempt_number?: number;
  previous_weak_topics?: string[];
  completed_at?: string;
  created_at?: string;
}

export interface HRQuestion {
  question_id: string;
  category: 'behavioral' | 'situational' | 'culture' | 'career';
  question: string;
  intent: string;
}

export interface HRInterviewSession {
  session_id: string;
  user_id: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  current_question_index: number;
  total_questions: number;
  questions: HRQuestion[];
  responses: Array<{
    question_id: string;
    question: string;
    response_type: 'text' | 'voice';
    response: string;
    evaluation: {
      score: number;
      relevance: number;
      clarity: number;
      communication_quality: number;
      feedback: string;
      strengths: string[];
      weaknesses: string[];
    };
  }>;
  overall_score?: number;
  passed?: boolean;
  completed_at?: string;
}

export interface LevelPerformanceItem {
  level_id: number;
  topic_id: string;
  topic_name: string;
  attempt_number: number;
  score: number;
  total_questions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unanswered: number;
  percentage: number;
  cutoff: number;
  status: 'PASSED' | 'NOT PASSED';
}

export interface TopicPerformanceItem {
  topic_name: string;
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number;
}

export interface WrongAnswerItem {
  question_id?: string;
  question: string;
  your_answer: string;
  correct_answer: string;
  explanation: string;
  category?: string;
  level_id?: number;
}

export interface ComprehensiveAptitudeReport {
  has_data: boolean;
  missing_data_reason?: string;
  student_name: string;
  student_email: string;
  test_date: string;
  overall_score: number;
  total_questions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unanswered: number;
  overall_percentage: number;
  overall_accuracy: number;
  cutoff: number;
  overall_status: 'PASSED' | 'NOT PASSED';
  level_performance: LevelPerformanceItem[];
  topic_performance: TopicPerformanceItem[];
  strengths: string[];
  areas_to_improve: string[];
  wrong_answers: WrongAnswerItem[];
  final_analysis: string;
  recommendations: string[];
}

export interface FinalReportData {
  report_id: string;
  user_name: string;
  user_email: string;
  date: string;
  selected_domain: string;
  comprehensive_aptitude?: ComprehensiveAptitudeReport;
  aptitude: {
    quantitative: number;
    logical: number;
    verbal: number;
    specialized: number;
    final_aptitude_score: number;
    status: string;
  };
  technical: {
    domain: string;
    score: number;
    status: string;
    question_count: number;
  };
  hr: {
    score: number;
    status: string;
    question_count: number;
  };
  overall: {
    score: number;
    qualification_status: 'QUALIFIED' | 'NEEDS_REVISION';
    badge: 'Senior Hire Ready' | 'Interview Qualified' | 'Development Needed';
  };
  ai_feedback: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    action_plan: string[];
    executive_summary?: string;
    key_strengths?: string[];
    critical_weaknesses?: string[];
    recommended_topics?: string[];
    personalized_action_plan?: Array<{
      step: number;
      title: string;
      focus: string;
      timeframe: string;
    }>;
  };
}

export interface UserDashboardState {
  user: {
    user_id: string;
    name: string;
    email: string;
  };
  topics: Record<AptitudeTopicId, AptitudeTopicInfo>;
  progression: {
    all_topics_completed: boolean;
    final_aptitude_unlocked: boolean;
    final_aptitude_passed: boolean;
    technical_unlocked: boolean;
    technical_passed: boolean;
    hr_unlocked: boolean;
    hr_passed: boolean;
    final_report_available: boolean;
  };
  cutoffs: {
    levelCutoff: number;
    testCutoff: number;
    finalTestCutoff: number;
    technicalCutoff: number;
    hrCutoff: number;
  };
  stats: {
    total_levels_completed: number;
    total_tests_passed: number;
    overall_progress: number;
    pending_tests_count: number;
  };
}

export interface AdminSettings {
  levelCutoff: number;
  testCutoff: number;
  finalTestCutoff: number;
  technicalCutoff: number;
  hrCutoff: number;
  levelTimerMinutes: number;
  testTimerMinutes: number;
  finalTestTimerMinutes: number;
  aiModel: string;
  globalDemoMode?: boolean;
}

export interface EmailNotificationLog {
  id: string;
  to: string;
  userName: string;
  subject: string;
  interviewType: string;
  domainName?: string;
  sessionId: string;
  htmlContent: string;
  sentAt: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  previewUrl?: string;
  error?: string;
}

