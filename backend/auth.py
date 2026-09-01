import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, request, jsonify
from .models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    if User.query.filter_by(email=email.lower()).first():
        return jsonify({'error': 'Email is already registered'}), 400

    user = User(
        user_id=f"usr_{uuid.uuid4().hex[:12]}",
        name=name,
        email=email.lower(),
        password_hash=generate_password_hash(password)
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'user': {
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email,
            'created_at': user.created_at.isoformat()
        },
        'token': f"token_{user.user_id}"
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email.lower()).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    return jsonify({
        'user': {
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email
        },
        'token': f"token_{user.user_id}"
    })
