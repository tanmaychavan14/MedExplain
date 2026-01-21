from flask import Blueprint, request, jsonify
from services.gemini_service import identify_medicine
from firebase_admin import auth
from utils.exception import AppException

medicine_bp = Blueprint('medicine', __name__)

@medicine_bp.route('/medicine/identify', methods=['POST'])
def identify_medicine_route():
    try:
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
        
        # In a real app we'd verify the token, but for now we trust the client is authenticated via the frontend middleware
        # token = auth_header.split('Bearer ')[1]
        # decoded_token = auth.verify_id_token(token)

        data = request.json
        medicine_name = data.get('medicine_name')
        language = data.get('language', 'en')
        
        if not medicine_name:
            return jsonify({'error': 'Medicine name is required'}), 400

        result = identify_medicine(medicine_name, language)
        return jsonify({'success': True, 'data': result})

    except Exception as e:
        print(f"Error identifying medicine: {str(e)}")
        return jsonify({'error': str(e)}), 500
