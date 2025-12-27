from firebase_admin import auth
from utils.exception import AuthError

def verify_firebase_token(id_token: str):
    try:
        # Verify Firebase token (works for both Google and email/password auth)
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception:
        raise AuthError()
