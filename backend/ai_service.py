import os
import json
from google import genai

client = None

def get_client():
    global client
    api_key = os.getenv("GEMINI_API_KEY")
    if not client and api_key:
        client = genai.Client(api_key=api_key)
    return client

def generate_technical_questions(domain, count=3):
    ai = get_client()
    if not ai:
        return [
            {
                "question_id": f"q_{domain}_1",
                "domain": domain,
                "topic": f"{domain} Architecture",
                "difficulty": "Medium",
                "type": "conceptual",
                "question": f"Explain the core architectural patterns and state management principles in {domain} systems.",
                "hints": ["Focus on separation of concerns and data flow"],
                "expected_key_points": ["Modularity", "Scalability", "Fault tolerance"]
            }
        ]

    prompt = f"Generate {count} technical interview questions for domain: {domain}. Output JSON array."
    response = ai.models.generate_content(
        model="gemini-3.7-flash",
        contents=prompt
    )
    return json.loads(response.text)

def evaluate_technical_answer(domain, question, response_text, code_snippet=None, diagram_data=None):
    ai = get_client()
    if not ai:
        return {
            "score": 75,
            "correctness": 80,
            "technical_depth": 70,
            "clarity": 80,
            "feedback": "Demonstrates good conceptual grasp.",
            "strengths": ["Structured answer"],
            "weaknesses": ["Could include more specific benchmarks"]
        }

    contents = f"Domain: {domain}\nQuestion: {question}\nAnswer: {response_text}\nCode: {code_snippet}"
    response = ai.models.generate_content(
        model="gemini-3.7-flash",
        contents=contents
    )
    return json.loads(response.text)

def evaluate_hr_answer(question, response_text):
    ai = get_client()
    if not ai:
        return {
            "score": 80,
            "relevance": 85,
            "clarity": 80,
            "communication_quality": 85,
            "feedback": "Clear articulation using STAR structure.",
            "strengths": ["Strong communication"],
            "weaknesses": ["Add quantifiable metrics"]
        }

    response = ai.models.generate_content(
        model="gemini-3.7-flash",
        contents=f"Evaluate candidate response using STAR method:\nQuestion: {question}\nResponse: {response_text}"
    )
    return json.loads(response.text)
