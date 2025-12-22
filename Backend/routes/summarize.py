from flask import Blueprint, request, jsonify
from firebase_admin_init import db
from services.document_parser import extract_text
from services.gemini_service import generate_summary

summarize_bp = Blueprint("summarize", __name__)

@summarize_bp.route("/summarize", methods=["POST"])
def summarize():

    if "report" not in request.files:
        return jsonify({"error": "No report uploaded"}), 400

    file = request.files["report"]
    file_hash = request.form.get("fileHash")
    user_id = request.form.get("userId")

    if not file_hash or not user_id:
        return jsonify({"error": "fileHash and userId required"}), 400

    doc_ref = db.collection("reports").document(file_hash)
    doc = doc_ref.get()

    if doc.exists:
        return jsonify({
            "summary": doc.to_dict()["summary"],
            "cached": True
        })

    try:
        text = extract_text(file)
        summary = generate_summary(text)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    doc_ref.set({
        "summary": summary,
        "uploadedBy": user_id,
        "fileName": file.filename
    })

    return jsonify({
        "summary": summary,
        "cached": False
    })
