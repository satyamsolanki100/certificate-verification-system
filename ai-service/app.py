from flask import Flask, request, jsonify
import hashlib
import os
from PyPDF2 import PdfReader

app = Flask(__name__)

def calculate_hash(file_path):
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256.update(chunk)
    return sha256.hexdigest()

def analyze_pdf(file_path):
    risk_score = 0
    tampered = False

    try:
        reader = PdfReader(file_path)
        metadata = reader.metadata

        # Metadata anomaly
        if metadata is None:
            risk_score += 20

        # Page count check
        if len(reader.pages) == 0:
            risk_score += 40

        # File size anomaly
        size = os.path.getsize(file_path)
        if size < 5000:
            risk_score += 25

        # Suspicious producer metadata
        if metadata and "/Producer" not in str(metadata):
            risk_score += 15

        if risk_score > 40:
            tampered = True

    except Exception:
        tampered = True
        risk_score = 80

    return tampered, risk_score

@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = "temp.pdf"
    file.save(file_path)

    file_hash = calculate_hash(file_path)
    tampered, risk_score = analyze_pdf(file_path)

    os.remove(file_path)

    return jsonify({
        "hash": file_hash,
        "tampered": tampered,
        "riskScore": risk_score
    })

if __name__ == "__main__":
    app.run(port=6000, debug=True)