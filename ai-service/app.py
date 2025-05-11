from flask import Flask, request, jsonify
from transformers import pipeline
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
classifier = pipeline("zero-shot-classification")

CATEGORIES = ["Bug Report", "Feature Request", "Billing Issue", "General Query"]

@app.route('/', methods=['POST'])
def classify():
    content = request.json["content"]
    logging.info(f"Classifying ticket: {content}")
    result = classifier(content, CATEGORIES)
    top = result['labels'][0]
    return jsonify({
        'classification': top,
        'answer': f"It looks like a {top.lower()}. We're working on it!"
    })

if __name__ == '__main__':
    app.run(debug=True)
