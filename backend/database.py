import os
from .models import db, AptitudeTopic, AptitudeLevel, AptitudeQuestion

def init_db(app):
    os.makedirs(os.path.join(os.path.dirname(__file__), '../database'), exist_ok=True)
    db.init_app(app)
    with app.app_context():
        db.create_all()
        seed_initial_topics_and_questions()

def seed_initial_topics_and_questions():
    if AptitudeTopic.query.first():
        return # already seeded

    topics = [
        ('quantitative', 'Quantitative Aptitude'),
        ('logical', 'Logical & Analytical Reasoning'),
        ('verbal', 'Verbal Ability'),
        ('specialized', 'Specialized & Technical Aptitude')
    ]

    for tid, tname in topics:
        topic = AptitudeTopic(topic_id=tid, topic_name=tname)
        db.session.add(topic)
        
        # 10 levels per topic
        for lvl in range(1, 11):
            level = AptitudeLevel(
                topic_id=tid,
                level_number=lvl,
                title=f"{tname} - Level {lvl}",
                description=f"Curated problem sets and foundational learning concepts for Level {lvl}.",
                difficulty='Easy' if lvl <= 3 else 'Medium' if lvl <= 7 else 'Hard'
            )
            db.session.add(level)

    db.session.commit()
