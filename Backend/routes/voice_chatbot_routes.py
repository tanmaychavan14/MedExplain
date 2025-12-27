from flask import Blueprint, request, g, send_file
from middleware.auth_middleware import auth_required
from services.voice_service import speech_to_text, text_to_speech, get_supported_languages
from services.chatbot_service import generate_chat_response
from services.chatbot_repository import (
    get_chat_session,
    add_message_to_session
)
from routes.chatbot_routes import get_report_with_retry
from utils.response import success_response
import io
import base64

voice_chatbot_bp = Blueprint("voice_chatbot", __name__, url_prefix="/voice-chatbot")


@voice_chatbot_bp.route("/languages", methods=["GET"])
def get_languages():
    """
    Get list of supported languages
    """
    return success_response({
        "languages": get_supported_languages()
    })


@voice_chatbot_bp.route("/speech-to-text", methods=["POST"])
@auth_required
def convert_speech_to_text():
    """
    Convert audio to text.
    Body: { audio: base64_string, language: "en" | "hi" | "mr" }
    """
    try:
        data = request.json
        audio_base64 = data.get("audio")
        language = data.get("language", "en")
        
        if not audio_base64:
            return {"error": "Audio data required"}, 400
        
        # Convert base64 to bytes
        audio_bytes = base64.b64decode(audio_base64)
        
        print(f"🎤 Converting speech to text (language: {language})...")
        
        # Convert speech to text
        text = speech_to_text(audio_bytes, language)
        
        if not text:
            return {"error": "Could not recognize speech. Please try again."}, 400
        
        return success_response({
            "text": text,
            "language": language
        })
    
    except Exception as e:
        print(f"❌ Error in speech-to-text: {str(e)}")
        return {"error": f"Speech recognition failed: {str(e)}"}, 500


@voice_chatbot_bp.route("/text-to-speech", methods=["POST"])
@auth_required
def convert_text_to_speech():
    """
    Convert text to speech.
    Body: { text: string, language: "en" | "hi" | "mr", gender: "female" | "male" }
    """
    try:
        data = request.json
        text = data.get("text")
        language = data.get("language", "en")
        gender = data.get("gender", "female")
        
        if not text:
            return {"error": "Text required"}, 400
        
        print(f"🔊 Converting text to speech (language: {language}, gender: {gender})...")
        
        # Convert text to speech
        audio_bytes = text_to_speech(text, language, gender)
        
        if not audio_bytes:
            return {"error": "Could not generate speech"}, 500
        
        # Convert to base64 for easy transmission
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        return success_response({
            "audio": audio_base64,
            "language": language,
            "text": text
        })
    
    except Exception as e:
        print(f"❌ Error in text-to-speech: {str(e)}")
        return {"error": f"Speech synthesis failed: {str(e)}"}, 500


@voice_chatbot_bp.route("/voice-message", methods=["POST"])
@auth_required
def send_voice_message():
    """
    Complete voice interaction: audio input → text → AI response → audio output
    
    Body: { 
        sessionId: string,
        audio: base64_string,
        language: "en" | "hi" | "mr",
        gender: "female" | "male" (optional, default: "female")
    }
    
    Response: {
        userText: string,
        responseText: string,
        responseAudio: base64_string,
        sessionId: string,
        language: string
    }
    """
    try:
        data = request.json
        session_id = data.get("sessionId")
        audio_base64 = data.get("audio")
        language = data.get("language", "en")
        gender = data.get("gender", "female")
        
        if not session_id or not audio_base64:
            return {"error": "sessionId and audio required"}, 400
        
        print(f"\n{'='*60}")
        print(f"🎤 Voice Message Request (Session: {session_id[:8]}...)")
        print(f"{'='*60}")
        
        # Step 1: Convert speech to text
        print("Step 1: Converting speech to text...")
        audio_bytes = base64.b64decode(audio_base64)
        user_message = speech_to_text(audio_bytes, language)
        
        if not user_message:
            return {"error": "Could not recognize speech. Please speak clearly and try again."}, 400
        
        print(f"✅ User said: '{user_message}'")
        
        # Step 2: Get session and report
        print("Step 2: Fetching session and report...")
        session = get_chat_session(session_id, g.user["uid"])
        if not session:
            return {"error": "Session not found"}, 404
        
        report = get_report_with_retry(
            g.user["uid"],
            session.get("reportName"),
            session.get("reportType"),
            max_attempts=3
        )
        
        if not report:
            return {"error": "Report not found. Please try uploading it again."}, 404
        
        report_summary = report.get("summary", "")
        print(f"✅ Report found: {report.get('reportName')}")
        
        # Step 3: Get conversation history
        messages = session.get("messages", [])
        print(f"✅ Conversation history: {len(messages)} messages")
        
        # Step 4: Add user message to session
        add_message_to_session(session_id, "user", user_message, g.user["uid"])
        
        # Step 5: Generate AI response
        print("Step 3: Generating AI response...")
        bot_response = generate_chat_response(
            user_message,
            report_summary,
            messages,
            language
        )
        
        print(f"✅ Bot response: '{bot_response[:100]}...'")
        
        # Step 6: Add bot response to session
        add_message_to_session(session_id, "assistant", bot_response, g.user["uid"])
        
        # Step 7: Convert response to speech
        print("Step 4: Converting response to speech...")
        response_audio_bytes = text_to_speech(bot_response, language, gender)
        response_audio_base64 = base64.b64encode(response_audio_bytes).decode('utf-8')
        
        print(f"✅ Audio generated: {len(response_audio_bytes)} bytes")
        print(f"{'='*60}\n")
        
        return success_response({
            "userText": user_message,
            "responseText": bot_response,
            "responseAudio": response_audio_base64,
            "sessionId": session_id,
            "language": language
        })
    
    except Exception as e:
        print(f"❌ Error in voice message: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": f"Voice interaction failed: {str(e)}"}, 500


@voice_chatbot_bp.route("/test", methods=["GET"])
def test_voice_service():
    """
    Test endpoint to verify voice services are working
    """
    try:
        # Test TTS
        test_text = "Hello, this is a test of the voice service."
        audio_bytes = text_to_speech(test_text, "en", "female")
        
        return success_response({
            "message": "Voice service is working!",
            "audioSize": len(audio_bytes),
            "supportedLanguages": get_supported_languages()
        })
    
    except Exception as e:
        return {"error": f"Voice service test failed: {str(e)}"}, 500