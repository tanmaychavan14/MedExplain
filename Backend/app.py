from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

from routes.summarize import summarize_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(summarize_bp)

@app.route("/health")
def health():
    return "Backend running"

if __name__ == "__main__":
    app.run(debug=True)
