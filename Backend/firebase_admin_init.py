import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path

if not firebase_admin._apps:
    current_dir = Path(__file__).resolve().parent
    cred_path = current_dir / "serviceAccountKey.json"
    cred = credentials.Certificate(str(cred_path))
    firebase_admin.initialize_app(cred)

db = firestore.client()
