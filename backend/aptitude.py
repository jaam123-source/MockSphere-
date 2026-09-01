import random
from flask import Blueprint, request, jsonify
from .models import db, AptitudeQuestion, LevelAttempt, TopicTest
from .config import Config

aptitude_bp = Blueprint('aptitude', __name__)

@aptitude_bp.route('/topics', methods=['GET'])
def get_topics():
    return jsonify({
        'topics': {
            'quantitative': {'name': 'Quantitative Aptitude', 'levels': 10},
            'logical': {'name': 'Logical & Analytical Reasoning', 'levels': 10},
            'verbal': {'name': 'Verbal Ability', 'levels': 10},
            'specialized': {'name': 'Specialized & Technical Aptitude', 'levels': 10}
        }
    })

@aptitude_bp.route('/level/<topic_id>/<int:level_id>', methods=['GET'])
def get_level_questions(topic_id, level_id):
    questions = AptitudeQuestion.query.filter_by(topic_id=topic_id, level_id=level_id).all()
    q_list = [{
        'question_id': q.question_id,
        'category': q.category,
        'difficulty': q.difficulty,
        'question': q.question,
        'option_a': q.option_a,
        'option_b': q.option_b,
        'option_c': q.option_c,
        'option_d': q.option_d
    } for q in questions]
    random.shuffle(q_list)
    return jsonify({'questions': q_list[:10], 'time_limit_minutes': Config.LEVEL_TIMER_MINUTES})

@aptitude_bp.route('/level/<topic_id>/<int:level_id>/submit', methods=['POST'])
def submit_level(topic_id, level_id):
    data = request.get_json() or {}
    answers = data.get('answers', [])
    score = 0
    wrong_answers = []

    for ans in answers:
        q = AptitudeQuestion.query.filter_by(question_id=ans.get('question_id')).first()
        if q and q.correct_answer.upper() == ans.get('selected_answer', '').upper():
            score += 1
        elif q:
            wrong_answers.append({
                'question': q.question,
                'your_answer': ans.get('selected_answer'),
                'correct_answer': q.correct_answer,
                'explanation': q.explanation,
                'category': q.category
            })

    total = len(answers) or 10
    percentage = (score / total) * 100
    status = 'PASSED' if percentage >= Config.DEFAULT_LEVEL_CUTOFF else 'FAILED'

    return jsonify({
        'score': score,
        'total_questions': total,
        'percentage': percentage,
        'status': status,
        'cutoff': Config.DEFAULT_LEVEL_CUTOFF,
        'wrong_answers': wrong_answers
    })
