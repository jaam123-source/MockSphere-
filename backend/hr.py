import uuid
from flask import Blueprint, request, jsonify
from .models import db, InterviewSession
from .ai_service import evaluate_hr_answer

hr_bp = Blueprint('hr', __name__)

@hr_bp.route('/start', methods=['POST'])
def start_hr():
    data = request.get_json() or {}
    user_id = data.get('user_id', 'usr_demo')
    session_id = f"hr_{uuid.uuid4().hex[:12]}"
    
    questions = [
        {"question_id": "hr1", "question": "Tell me about yourself and your career journey."},
        {"question_id": "hr2", "question": "Describe a difficult situation you handled and what you learned."},
        {"question_id": "hr3", "question": "Where do you see yourself in 5 years?"}
    ]
    return jsonify({'session_id': session_id, 'questions': questions})

@hr_bp.route('/evaluate', methods=['POST'])
def evaluate_hr():
    data = request.get_json() or {}
    question = data.get('question', '')
    response_text = data.get('response_text', '')
    evaluation = evaluate_hr_answer(question, response_text)
    return jsonify({'evaluation': evaluation})
