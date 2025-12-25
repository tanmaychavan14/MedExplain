from flask import Blueprint, request, g
from middleware.auth_middleware import auth_required
from services.chatbot_service import generate_chat_response
from services.chatbot_repository import (
    create_chat_session,
    get_chat_session,
    get_chat_sessions_for_report,
    add_message_to_session,
    get_session_messages
)
from services.report_repository import get_report_by_name_and_type
from utils.response import success_response
from utils.exception import ReportNotFoundError

chatbot_bp = Blueprint("chatbot", __name__, url_prefix="/chatbot")

@chatbot_bp.route("/session", methods=["POST"])
@auth_required
def create_session():
    data = request.json
    report_name = data.get("reportName")
    report_type = data.get("reportType")
    language = data.get("language", "en")  # 👈 ADD

    if not report_name or not report_type:
        return {"error": "reportName and reportType required"}, 400
    
    # Normalize inputs
    report_name = report_name.strip().lower()
    report_type = report_type.strip().upper()
    
    # Get the report to get its ID and summary
    report = get_report_by_name_and_type(g.user["uid"], report_name, report_type)
    if not report:
        raise ReportNotFoundError()
    
    # Check if session already exists for this report
    existing_sessions = get_chat_sessions_for_report(g.user["uid"], report.get("id"))
    
    if existing_sessions:
        # Return existing session
        session = existing_sessions[0]
        return success_response({
            "sessionId": session["id"],
            "messages": session.get("messages", [])
        })
    
    # Create new session
    session_id = create_chat_session(
        user_id=g.user["uid"],
        report_id=report.get("id"),
        report_name=report.get("reportName"),
        report_type=report.get("reportType"),
        language=language
    )
    
    return success_response({
        "sessionId": session_id,
        "messages": []
    })


@chatbot_bp.route("/session/<session_id>", methods=["GET"])
@auth_required
def get_session(session_id):
    """
    Get a chat session and its messages.
    """
    session = get_chat_session(session_id, g.user["uid"])
    
    if not session:
        return {"error": "Session not found"}, 404
    
    return success_response({
        "sessionId": session["id"],
        "reportName": session.get("reportName"),
        "reportType": session.get("reportType"),
        "messages": session.get("messages", [])
    })


@chatbot_bp.route("/message", methods=["POST"])
@auth_required
def send_message():
    """
    Send a message to the chatbot.
    Body: { sessionId, message }
    """
    data = request.json
    session_id = data.get("sessionId")
    user_message = data.get("message")
    language = data.get("language", "en")  

    if not session_id or not user_message:
        return {"error": "sessionId and message required"}, 400
    
    # Get session
    session = get_chat_session(session_id, g.user["uid"])
    if not session:
        return {"error": "Session not found"}, 404
    
    # Get report summary
    report = get_report_by_name_and_type(
        g.user["uid"],
        session.get("reportName"),
        session.get("reportType")
    )
    
    if not report:
        raise ReportNotFoundError()
    
    report_summary = report.get("summary", "")
    
    # Get conversation history
    messages = session.get("messages", [])
    
    # Add user message to session
    add_message_to_session(session_id, "user", user_message, g.user["uid"])
    
    # Generate chatbot response
    try:
        bot_response = generate_chat_response(user_message, report_summary, messages,language)
    except Exception as e:
        return {"error": f"Failed to generate response: {str(e)}"}, 500
    
    # Add bot response to session
    add_message_to_session(session_id, "assistant", bot_response, g.user["uid"])
    
    return success_response({
        "response": bot_response,
        "sessionId": session_id
    })

