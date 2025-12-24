from firebase_admin_init import db
from firebase_admin import firestore
from datetime import datetime
from typing import List, Dict, Optional

def create_chat_session(user_id: str, report_id: str, report_name: str, report_type: str, language: str) -> str:
    """
    Create a new chat session for a report.
    
    Returns:
        Session ID
    """
    session_data = {
        "userId": user_id,
        "reportId": report_id,
        "reportName": report_name,
        "reportType": report_type,
        "language": language,  
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "messages": []
    }
    
    ref = db.collection("chat_sessions").document()
    ref.set(session_data)
    return ref.id


def get_chat_session(session_id: str, user_id: str) -> Optional[Dict]:
    """
    Get a chat session by ID, ensuring it belongs to the user.
    """
    doc_ref = db.collection("chat_sessions").document(session_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        return None
    
    data = doc.to_dict()
    
    # Security check: ensure session belongs to user
    if data.get("userId") != user_id:
        return None
    
    data["id"] = doc.id
    return data


def get_chat_sessions_for_report(user_id: str, report_id: str) -> List[Dict]:
    """
    Get all chat sessions for a specific report.
    """
    query = (
        db.collection("chat_sessions")
        .where("userId", "==", user_id)
        .where("reportId", "==", report_id)
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .stream()
    )
    
    sessions = []
    for doc in query:
        data = doc.to_dict()
        data["id"] = doc.id
        sessions.append(data)
    
    return sessions


def add_message_to_session(session_id: str, role: str, content: str, user_id: str) -> bool:
    """
    Add a message to a chat session.
    
    Args:
        session_id: The session ID
        role: "user" or "assistant"
        content: The message content
        user_id: User ID for security check
    
    Returns:
        True if successful, False otherwise
    """
    # Verify session belongs to user
    session = get_chat_session(session_id, user_id)
    if not session:
        return False
    
    message = {
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow()
    }
    
    doc_ref = db.collection("chat_sessions").document(session_id)
    doc_ref.update({
        "messages": firestore.ArrayUnion([message]),
        "updatedAt": datetime.utcnow()
    })
    
    return True


def get_session_messages(session_id: str, user_id: str) -> List[Dict]:
    """
    Get all messages from a chat session.
    """
    session = get_chat_session(session_id, user_id)
    if not session:
        return []
    
    return session.get("messages", [])

