from google import genai
import os

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

client = genai.Client(api_key=api_key)

def generate_summary(report_text: str) -> str:
    prompt = f"""
You are a medical assistant designed for rural clinics.

IMPORTANT RULES:
- Base explanations only on verified medical knowledge
  (WHO, NIH, Mayo Clinic standard ranges).
- If information is uncertain, say so clearly.
- Do NOT diagnose diseases.
- Use very simple, patient-friendly language.

Medical Report:
{report_text}

Task:
Explain the report in simple terms.
Mention if values are low or high.
Suggest consulting a doctor when abnormal.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        if not hasattr(response, 'text') or not response.text:
            raise ValueError("Empty or invalid response from Gemini API")
        
        return response.text
    except Exception as e:
        raise Exception(f"Error generating summary with Gemini API: {str(e)}")
