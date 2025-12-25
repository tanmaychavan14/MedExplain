# from flask import Blueprint, request, g
# from middleware.auth_middleware import auth_required
# from services.chatbot_service import generate_chat_response
# from services.chatbot_repository import (
#     create_chat_session,
#     get_chat_session,
#     get_chat_sessions_for_report,
#     add_message_to_session,
#     get_session_messages
# )
# from services.report_repository import get_report_by_name_and_type
# from utils.response import success_response
# from utils.exception import ReportNotFoundError

# chatbot_bp = Blueprint("chatbot", __name__, url_prefix="/chatbot")

# @chatbot_bp.route("/session", methods=["POST"])
# @auth_required
# def create_session():
#     data = request.json
#     report_name = data.get("reportName")
#     report_type = data.get("reportType")
#     language = data.get("language", "en")

#     if not report_name or not report_type:
#         return {"error": "reportName and reportType required"}, 400
    
#     # Normalize inputs
#     report_name = report_name.strip().lower()
#     report_type = report_type.strip().upper()
    
#     print(f"🔍 Looking for report: {report_name} ({report_type}) for user {g.user['uid']}")
    
#     import time
#     report = None
#     for attempt in range(3):  # Try 3 times
#         report = get_report_by_name_and_type(g.user["uid"], report_name, report_type)
#         if report:
#             break
#         if attempt < 2:  # Don't sleep on last attempt
#             print(f"⏳ Attempt {attempt + 1}: Report not found, retrying...")
#             time.sleep(0.5)  # Wait 500ms before retry
    
#     if not report:
#         print(f"⚠️ Report not found immediately. Creating placeholder session.")
#         # Wait a moment and try again
#         import time
#         time.sleep(0.5)
#         report = get_report_by_name_and_type(g.user["uid"], report_name, report_type)
        
#         if not report:
#             print(f"❌ Report still not found after retry")
#             return {"error": "Report not found. Please wait a moment and try again."}, 404
    
#     print(f"✅ Found report: {report.get('id')}")
    
#     # Check if session already exists
#     existing_sessions = get_chat_sessions_for_report(g.user["uid"], report.get("id"))
    
#     if existing_sessions:
#         session = existing_sessions[0]
#         return success_response({
#             "sessionId": session["id"],
#             "messages": session.get("messages", [])
#         })
    
#     # Create new session
#     session_id = create_chat_session(
#         user_id=g.user["uid"],
#         report_id=report.get("id"),
#         report_name=report.get("reportName"),
#         report_type=report.get("reportType"),
#         language=language
#     )
    
#     return success_response({
#         "sessionId": session_id,
#         "messages": []
#     })

# @chatbot_bp.route("/session/<session_id>", methods=["GET"])
# @auth_required
# def get_session(session_id):
#     """
#     Get a chat session and its messages.
#     """
#     session = get_chat_session(session_id, g.user["uid"])
    
#     if not session:
#         return {"error": "Session not found"}, 404
    
#     return success_response({
#         "sessionId": session["id"],
#         "reportName": session.get("reportName"),
#         "reportType": session.get("reportType"),
#         "messages": session.get("messages", [])
#     })


# @chatbot_bp.route("/message", methods=["POST"])
# @auth_required
# def send_message():
#     """
#     Send a message to the chatbot.
#     Body: { sessionId, message }
#     """
#     data = request.json
#     session_id = data.get("sessionId")
#     user_message = data.get("message")
#     language = data.get("language", "en")  # 👈 ADD THIS

#     if not session_id or not user_message:
#         return {"error": "sessionId and message required"}, 400
    
#     # Get session
#     session = get_chat_session(session_id, g.user["uid"])
#     if not session:
#         return {"error": "Session not found"}, 404
    
#     # Get report summary
#     report = get_report_by_name_and_type(
#         g.user["uid"],
#         session.get("reportName"),
#         session.get("reportType")
#     )
    
#     if not report:
#         raise ReportNotFoundError()
    
#     report_summary = report.get("summary", "")
    
#     # Get conversation history
#     messages = session.get("messages", [])
    
#     # Add user message to session
#     add_message_to_session(session_id, "user", user_message, g.user["uid"])
    
#     # Generate chatbot response
#     try:
#         bot_response = generate_chat_response(user_message, report_summary, messages,language)
#     except Exception as e:
#         return {"error": f"Failed to generate response: {str(e)}"}, 500
    
#     # Add bot response to session
#     add_message_to_session(session_id, "assistant", bot_response, g.user["uid"])
    
#     return success_response({
#         "response": bot_response,
#         "sessionId": session_id
#     })

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
import time

chatbot_bp = Blueprint("chatbot", __name__, url_prefix="/chatbot")


def get_report_with_retry(user_id, report_name, report_type, max_attempts=3):
    """
    Try to get a report with retry logic to handle Firestore indexing delays.
    Returns report or None after all attempts.
    """
    for attempt in range(max_attempts):
        report = get_report_by_name_and_type(user_id, report_name, report_type)
        if report:
            print(f"✅ Found report on attempt {attempt + 1}")
            return report
        
        if attempt < max_attempts - 1:
            print(f"⏳ Attempt {attempt + 1}: Report not found, retrying...")
            time.sleep(0.5)  # Wait 500ms before retry
    
    print(f"⚠️ Report not found after {max_attempts} attempts")
    return None


@chatbot_bp.route("/session", methods=["POST"])
@auth_required
def create_session():
    data = request.json
    report_name = data.get("reportName")
    report_type = data.get("reportType")
    language = data.get("language", "en")

    if not report_name or not report_type:
        return {"error": "reportName and reportType required"}, 400
    
    # Normalize inputs
    report_name = report_name.strip().lower()
    report_type = report_type.strip().upper()
    
    print(f"🔍 Looking for report: {report_name} ({report_type})")
    
    # Try to get the report with retry logic
    report = get_report_with_retry(g.user["uid"], report_name, report_type)
    
    # If report found, check for existing session
    if report:
        existing_sessions = get_chat_sessions_for_report(g.user["uid"], report.get("id"))
        
        if existing_sessions:
            session = existing_sessions[0]
            print(f"📋 Returning existing session: {session['id']}")
            return success_response({
                "sessionId": session["id"],
                "messages": session.get("messages", [])
            })
        
        # Create new session with real report ID
        session_id = create_chat_session(
            user_id=g.user["uid"],
            report_id=report.get("id"),
            report_name=report.get("reportName"),
            report_type=report.get("reportType"),
            language=language
        )
        
        print(f"✅ Created new session: {session_id}")
        return success_response({
            "sessionId": session_id,
            "messages": []
        })
    
    # Report not found even after retries - create session anyway
    # This handles newly uploaded reports that aren't indexed yet
    print(f"⚠️ Creating session without report ID (will retry on message send)")
    session_id = create_chat_session(
        user_id=g.user["uid"],
        report_id="PENDING",  # Placeholder that indicates we need to find it later
        report_name=report_name,
        report_type=report_type,
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
    Body: { sessionId, message, language }
    """
    data = request.json
    session_id = data.get("sessionId")
    user_message = data.get("message")
<<<<<<< HEAD
    language = data.get("language", "en")  
=======
    language = data.get("language", "en")
>>>>>>> b8bc4231dd9e5b6d82022f39d0baff931750c988

    if not session_id or not user_message:
        return {"error": "sessionId and message required"}, 400
    
    # Get session
    session = get_chat_session(session_id, g.user["uid"])
    if not session:
        return {"error": "Session not found"}, 404
    
    # Try to get report with retry (in case it wasn't found during session creation)
    report = get_report_with_retry(
        g.user["uid"],
        session.get("reportName"),
        session.get("reportType"),
        max_attempts=3
    )
    
    if not report:
        # Even if report not found, we can still try to help with general medical questions
        return {"error": "Report not found. Please try uploading it again."}, 404
    
    report_summary = report.get("summary", "")
    
    # Update session with real report ID if it was PENDING
    if session.get("reportId") == "PENDING" and report:
        from firebase_admin_init import db
        db.collection("chat_sessions").document(session_id).update({
            "reportId": report.get("id")
        })
        print(f"✅ Updated session {session_id} with report ID: {report.get('id')}")
    
    # Get conversation history
    messages = session.get("messages", [])
    
    # Add user message to session
    add_message_to_session(session_id, "user", user_message, g.user["uid"])
    
    # Generate chatbot response
    try:
        bot_response = generate_chat_response(user_message, report_summary, messages, language)
    except Exception as e:
        print(f"❌ Error generating response: {str(e)}")
        return {"error": f"Failed to generate response: {str(e)}"}, 500
    
    # Add bot response to session
    add_message_to_session(session_id, "assistant", bot_response, g.user["uid"])
    
    return success_response({
        "response": bot_response,
        "sessionId": session_id
    })