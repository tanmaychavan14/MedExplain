from google.cloud import speech_v1p1beta1 as speech
from gtts import gTTS
import os
import io

# Lazy client initialization for Speech-to-Text
_speech_client = None


def get_speech_client():
    """Lazy initialization of Speech-to-Text client"""
    global _speech_client
    if _speech_client is None:
        if not os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'serviceAccountKey.json'
        _speech_client = speech.SpeechClient()
        print("✅ Speech-to-Text client initialized (Google Cloud)")
    return _speech_client


def get_language_config(language: str):
    """Get language-specific configuration"""
    configs = {
        "en": {
            "stt_code": "en-IN",  # Google Cloud Speech-to-Text
            "tts_code": "en",     # gTTS language code
            "tts_tld": "co.in"    # gTTS accent (Indian English)
        },
        "hi": {
            "stt_code": "hi-IN",
            "tts_code": "hi",
            "tts_tld": "co.in"
        },
        "mr": {
            "stt_code": "mr-IN",
            "tts_code": "mr",
            "tts_tld": "co.in"
        }
    }
    return configs.get(language, configs["en"])


def speech_to_text(audio_bytes: bytes, language: str = "en") -> str:
    """
    Convert speech to text using Google Cloud Speech-to-Text
    (Works with Python 3.13)
    
    Args:
        audio_bytes: Audio data in bytes
        language: Language code ("en", "hi", "mr")
    
    Returns:
        Transcribed text
    """
    try:
        lang_config = get_language_config(language)
        speech_client = get_speech_client()
        
        audio = speech.RecognitionAudio(content=audio_bytes)
        
        # Try WEBM_OPUS first (most browsers use this)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
            sample_rate_hertz=48000,
            language_code=lang_config["stt_code"],
            enable_automatic_punctuation=True,
            model="latest_long",
            use_enhanced=True
        )
        
        try:
            response = speech_client.recognize(config=config, audio=audio)
        except Exception as e:
            # If WEBM fails, try LINEAR16 (WAV)
            print(f"⚠️ WEBM failed, trying LINEAR16: {e}")
            config.encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16
            config.sample_rate_hertz = 16000
            response = speech_client.recognize(config=config, audio=audio)
        
        if not response.results:
            print("⚠️ No speech detected")
            return ""
        
        transcript = response.results[0].alternatives[0].transcript
        confidence = response.results[0].alternatives[0].confidence
        
        print(f"✅ Transcribed ({confidence:.2%} confidence): {transcript}")
        
        return transcript.strip()
    
    except Exception as e:
        print(f"❌ Speech-to-text error: {str(e)}")
        raise Exception(f"Speech recognition failed: {str(e)}")


def text_to_speech(text: str, language: str = "en", voice_gender: str = "female") -> bytes:
    """
    Convert text to speech using gTTS (free, simple)
    
    Args:
        text: Text to convert to speech
        language: Language code ("en", "hi", "mr")
        voice_gender: "female" or "male" (gTTS doesn't support gender, ignored)
    
    Returns:
        Audio data as bytes (MP3 format)
    """
    try:
        lang_config = get_language_config(language)
        
        # Create gTTS object
        tts = gTTS(
            text=text,
            lang=lang_config["tts_code"],
            tld=lang_config["tts_tld"],  # Indian accent
            slow=False
        )
        
        # Convert to bytes
        audio_fp = io.BytesIO()
        tts.write_to_fp(audio_fp)
        audio_fp.seek(0)
        audio_bytes = audio_fp.read()
        
        print(f"✅ Generated speech ({len(audio_bytes)} bytes): {text[:50]}...")
        
        return audio_bytes
    
    except Exception as e:
        print(f"❌ Text-to-speech error: {str(e)}")
        raise Exception(f"Speech synthesis failed: {str(e)}")


def get_supported_languages():
    """Get list of supported languages"""
    return {
        "en": "English (India)",
        "hi": "Hindi (भारत)",
        "mr": "Marathi (मराठी)"
    }