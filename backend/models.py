from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AptitudeTopic(db.Model):
    __tablename__ = 'aptitude_topics'
    topic_id = db.Column(db.String(32), primary_key=True)
    topic_name = db.Column(db.String(128), nullable=False)

class AptitudeLevel(db.Model):
    __tablename__ = 'aptitude_levels'
    level_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    topic_id = db.Column(db.String(32), db.ForeignKey('aptitude_topics.topic_id'), nullable=False)
    level_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=True)
    difficulty = db.Column(db.String(32), default='Medium')

class AptitudeQuestion(db.Model):
    __tablename__ = 'aptitude_questions'
    question_id = db.Column(db.String(64), primary_key=True)
    topic_id = db.Column(db.String(32), db.ForeignKey('aptitude_topics.topic_id'), nullable=False)
    level_id = db.Column(db.Integer, nullable=False)
    question = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.Text, nullable=False)
    option_b = db.Column(db.Text, nullable=False)
    option_c = db.Column(db.Text, nullable=False)
    option_d = db.Column(db.Text, nullable=False)
    correct_answer = db.Column(db.String(8), nullable=False)
    explanation = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(32), default='Medium')
    category = db.Column(db.String(64), default='General')

class LevelAttempt(db.Model):
    __tablename__ = 'level_attempts'
    attempt_id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('users.user_id'), nullable=False)
    topic_id = db.Column(db.String(32), nullable=False)
    level_id = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(16), nullable=False) # 'PASSED' | 'FAILED'
    attempt_number = db.Column(db.Integer, default=1)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class TopicTest(db.Model):
    __tablename__ = 'topic_tests'
    test_id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('users.user_id'), nullable=False)
    topic_id = db.Column(db.String(32), nullable=False)
    test_number = db.Column(db.Integer, nullable=False) # 1 or 2
    score = db.Column(db.Integer, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(16), nullable=False) # 'PASSED' | 'FAILED'
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class TestResponse(db.Model):
    __tablename__ = 'test_responses'
    response_id = db.Column(db.String(64), primary_key=True)
    test_id = db.Column(db.String(64), db.ForeignKey('topic_tests.test_id'), nullable=False)
    question_id = db.Column(db.String(64), nullable=False)
    selected_answer = db.Column(db.String(8), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)

class InterviewSession(db.Model):
    __tablename__ = 'interview_sessions'
    session_id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('users.user_id'), nullable=False)
    domain = db.Column(db.String(64), nullable=False)
    current_round = db.Column(db.String(32), default='TECHNICAL') # 'TECHNICAL' | 'HR' | 'COMPLETED'
    status = db.Column(db.String(32), default='IN_PROGRESS')
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

class InterviewResponse(db.Model):
    __tablename__ = 'interview_responses'
    response_id = db.Column(db.String(64), primary_key=True)
    session_id = db.Column(db.String(64), db.ForeignKey('interview_sessions.session_id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    response_type = db.Column(db.String(32), default='text') # 'text', 'voice', 'code', 'diagram'
    score = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.Text, nullable=True)

class Result(db.Model):
    __tablename__ = 'results'
    result_id = db.Column(db.String(64), primary_key=True)
    session_id = db.Column(db.String(64), db.ForeignKey('interview_sessions.session_id'), nullable=False)
    aptitude_score = db.Column(db.Float, nullable=False)
    technical_score = db.Column(db.Float, nullable=False)
    hr_score = db.Column(db.Float, nullable=False)
    overall_score = db.Column(db.Float, nullable=False)
    qualification_status = db.Column(db.String(32), nullable=False) # 'QUALIFIED' | 'NEEDS_REVISION'

class InterviewHistory(db.Model):
    __tablename__ = 'interview_history'
    history_id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('users.user_id'), nullable=False)
    session_id = db.Column(db.String(64), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    domain = db.Column(db.String(64), nullable=False)
    score = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(32), nullable=False)
