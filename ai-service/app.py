from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load the zero-shot-classification pipeline
classifier = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")

@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()
    print("🔍 Received data:", data)

    # Ensure the input text is provided
    input_text = data.get("text", "").strip()
    if not input_text:
        return jsonify({"error": "No text provided"}), 400

    # Define candidate labels for classification
    labels = [
        "Network Issue", "VPN Problem", "Email Problem", 
        "Software Bug", "Hardware Failure", "Access Issue", 
        "General Query"
    ]

    # Run the classification
    result = classifier(input_text, candidate_labels=labels)
    print("🧠 Classification result:", result)

    # Extract the top classification and build a dummy suggestion
    classification = result["labels"][0]
    suggestion = f"Please follow up with IT support regarding: {classification.lower()}."

    return jsonify({
        "classification": classification,
        "suggestion": suggestion
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

