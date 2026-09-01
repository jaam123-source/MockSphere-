from flask import Blueprint, jsonify
from .models import db, Result

report_bp = Blueprint('report', __name__)

@report_bp.route('/<session_id>', methods=['GET'])
def get_report(session_id):
    return jsonify({
        'session_id': session_id,
        'aptitude_score': 85.0,
        'technical_score': 82.0,
        'hr_score': 88.0,
        'overall_score': 84.7,
        'qualification_status': 'QUALIFIED',
        'feedback': {
            'strengths': ['Strong analytical foundation', 'Clear communication'],
            'weaknesses': ['Edge-case analysis in system design'],
            'action_plan': ['Practice concurrency drills', 'Review distributed transactions']
        }
    })
