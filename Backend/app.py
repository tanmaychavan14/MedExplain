# from flask import Flask
# from flask_cors import CORS
# from dotenv import load_dotenv
# from pathlib import Path

# env_path = Path(__file__).resolve().parent / ".env"
# load_dotenv(dotenv_path=env_path)

# from routes.summarize import summarize_bp

# app = Flask(__name__)
# CORS(app)

# app.register_blueprint(summarize_bp)

# @app.route("/health")
# def health():
#     return "Backend running"

# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, jsonify
from flask_cors import CORS

import config
import firebase_admin_init
from routes.report_routes import report_bp
from routes.auth_routes import auth_bp
from routes.health_routes import health_bp
from utils.exception import AppException
from routes.comparison_routes import comparison_bp
from routes.chatbot_routes import chatbot_bp
app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(health_bp)
app.register_blueprint(report_bp)
app.register_blueprint(comparison_bp)
app.register_blueprint(chatbot_bp)

@app.errorhandler(AppException)
def handle_app_exception(e):
    return jsonify(e.to_dict()), e.status_code

# if __name__ == "__main__":
#     app.run(debug=True)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)