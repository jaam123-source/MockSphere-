from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .database import init_db
from .auth import auth_bp
from .aptitude import aptitude_bp
from .technical import technical_bp
from .hr import hr_bp
from .report import report_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    init_db(app)

    # Register API Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(aptitude_bp, url_prefix='/api/aptitude')
    app.register_blueprint(technical_bp, url_prefix='/api/technical')
    app.register_blueprint(hr_bp, url_prefix='/api/hr')
    app.register_blueprint(report_bp, url_prefix='/api/report')

    @app.route('/api/health')
    def health():
        return jsonify({'status': 'online', 'system': 'AI-Powered Multimodal Interview Platform'})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
