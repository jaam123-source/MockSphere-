import uuid
from flask import Blueprint, request, jsonify
from .models import db, InterviewSession, InterviewResponse
from .ai_service import generate_technical_questions, evaluate_technical_answer
from .config import Config

technical_bp = Blueprint('technical', __name__)

@technical_bp.route('/start', methods=['POST'])
def start_interview():
    data = request.get_json() or {}
    domain = data.get('domain', 'fullstack')
    user_id = data.get('user_id', 'usr_demo')

    session_id = f"tech_{uuid.uuid4().hex[:12]}"
    session = InterviewSession(
        session_id=session_id,
        user_id=user_id,
        domain=domain,
        current_round='TECHNICAL',
        status='IN_PROGRESS'
    )
    db.session.add(session)
    db.session.commit()

    questions = generate_technical_questions(domain, 3)
    return jsonify({
        'session_id': session_id,
        'domain': domain,
        'questions': questions
    })

@technical_bp.route('/evaluate', methods=['POST'])
def evaluate_response():
    data = request.get_json() or {}
    domain = data.get('domain', 'fullstack')
    question = data.get('question', '')
    response_type = data.get('response_type', 'text')
    response_text = data.get('response_text', '')
    code_snippet = data.get('code_snippet')
    diagram_data = data.get('diagram_data')

    evaluation = evaluate_technical_answer(
        domain, question, response_text, code_snippet, diagram_data
    )
    return jsonify({'evaluation': evaluation})
