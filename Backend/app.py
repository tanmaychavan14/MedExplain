from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import logging
from pathlib import Path

# --- Logging Configuration ---
# Configure logging to display in the terminal
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
# import config
# import firebase_admin_init
from routes.report_routes import report_bp
from routes.auth_routes import auth_bp
from routes.health_routes import health_bp
from utils.exception import AppException
from routes.comparison_routes import comparison_bp
from routes.chatbot_routes import chatbot_bp
from routes.voice_chatbot_routes import voice_chatbot_bp
from routes.medical_term_routes import medical_term_bp
from routes.symptom_checker_routes import symptom_checker_bp
from routes.medicine_routes import medicine_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(voice_chatbot_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(health_bp)
app.register_blueprint(report_bp)
app.register_blueprint(comparison_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(medical_term_bp)
app.register_blueprint(symptom_checker_bp)
app.register_blueprint(medicine_bp)

# --- Request Logging Hooks ---
@app.before_request
def log_request_info():
    """Log details of the incoming request."""
    logger.info(f" INCOMING REQUEST: {request.method} {request.path}")
    if request.endpoint:
        logger.info(f"    Handling Function: {request.endpoint}")
    # Optional: Log body for non-file requests if needed, but keeping it clean for now
    # if request.is_json:
    #     logger.info(f"    Body: {request.json}")

@app.after_request
def log_response_info(response):
    """Log details of the outgoing response."""
    logger.info(f"  RESPONSE: {response.status} for {request.path}")
    return response

# --- Error Handling ---
@app.errorhandler(AppException)
def handle_app_exception(e):
    logger.error(f" APP ERROR in {request.path}: {e.to_dict()}")
    return jsonify(e.to_dict()), e.status_code

@app.errorhandler(Exception)
def handle_generic_exception(e):
    """Capture and log any unhandled exceptions."""
    logger.exception(f" CRITICAL ERROR in {request.path}: {str(e)}")
    return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    logger.info(f" Server starting on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)