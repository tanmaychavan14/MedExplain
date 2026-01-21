# from google import genai
# import os

# api_key = os.getenv("GEMINI_API_KEY")
# if not api_key:
#     raise ValueError("GEMINI_API_KEY environment variable is not set")

# client = genai.Client(api_key=api_key)

# def generate_summary(report_text: str) -> str:
#     prompt = f"""
# You are a medical assistant designed for rural clinics.

# IMPORTANT RULES:
# - Base explanations only on verified medical knowledge
#   (WHO, NIH, Mayo Clinic standard ranges).
# - If information is uncertain, say so clearly.
# - Do NOT diagnose diseases.
# - Use very simple, patient-friendly language.

# Medical Report:
# {report_text}

# Task:
# Explain the report in simple terms.
# Mention if values are low or high.
# Suggest consulting a doctor when abnormal.
# """

#     try:
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=prompt
#         )
        
#         if not hasattr(response, 'text') or not response.text:
#             raise ValueError("Empty or invalid response from Gemini API")
        
#         return response.text
#     except Exception as e:
#         raise Exception(f"Error generating summary with Gemini API: {str(e)}")


# import google.generativeai as genai
# import os
# from utils.language import get_language_instruction

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# model = genai.GenerativeModel("gemini-2.5-flash")

# def generate_summary(report_text: str, language: str) -> str:
#     language_instruction = get_language_instruction(language)

#     prompt = f"""
# You are a medical report explanation assistant.

# IMPORTANT RULES:
# - The report is anonymized.
# - Do NOT diagnose.
# - Do NOT suggest treatment.
# - Only explain findings in simple language.
# - Include a disclaimer.

# {language_instruction}

# Medical Report:
# {report_text}
# """

#     response = model.generate_content(prompt)
#     return response.text

from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_summary(text: str, language: str) -> str:
#     prompt = f"""
# You are a medical report explanation assistant.

# RULES:
# - The report is anonymized
# - Do NOT diagnose
# - Do NOT suggest treatment
# - Explain findings in simple language
# - Add a disclaimer

# Language: {language}

# Report:
# {text}
# """
#     prompt = f"""
# You are a medical report explanation assistant for patients.

# IMPORTANT RULES (MUST FOLLOW):
# - The medical report is anonymized
# - Base your response ONLY on the uploaded report text
# - Do NOT diagnose any disease or condition
# - Do NOT suggest treatments, medicines, dosages, or procedures
# - Do NOT add medical knowledge outside the report
# - Use very simple, patient-friendly language
# - If any information is missing, clearly say:
#   "This is not mentioned in the report"
# - Always include a disclaimer advising consultation with a doctor

#  Language: {language}

#  Medical Report Text:
#  {text}

# RESPONSE FORMAT (MANDATORY):

# 1. **What the Report Is About**
#    - Briefly explain what type of report this is (blood test, scan, etc.)
#    - If unclear, say it is not mentioned.

# 2. Key Findings
#    - List the main findings exactly as stated in the report.
#    - Use simple words.
#    - Do NOT interpret beyond the report.

# 3. Values That Are Within Range (If Mentioned)
#    - Mention findings described as normal or within range.
#    - If not mentioned, say so clearly.

# 4. Values That Are Outside Range (If Mentioned)
#    - Mention findings described as high, low, or abnormal in the report.
#    - Do NOT label them as diseases or problems.

# 5. What This Means in Simple Words
#    - Explain what the report itself says these findings indicate.
#    - Do NOT add assumptions or medical conclusions.

# 6. General Care Notes (Based on Report Only)
#    - Mention only general observations already written in the report.
#    - Do NOT suggest remedies, treatments, or lifestyle changes.

# 7. Important Disclaimer
#    - Clearly state that this explanation is for understanding only.
#    - Advise the patient to consult a doctor or healthcare worker.

# STRICTLY DO NOT:
# - Diagnose
# - Prescribe
# - Suggest home remedies
# - Suggest precautions unless explicitly written in the report
# """

    prompt = f"""
You are a medical report explanation assistant for patients.

IMPORTANT ROLE CONSTRAINT (CRITICAL):
- You MUST respond ONLY to medical reports.
- If the document is NOT a medical report, respond with strictly:
  `{{"insights": [], "summary_text": "This document is not a medical report."}}`

Input Language: {language}
Medical Report Text:
{text}


TASK:
Analyze the report and output a JSON object with three parts:
1. `insights`: A list of modular blocks for quick scanning.
2. `summary_text`: A detailed, patient-friendly explanation in Markdown.
3. `visualizations`: A list of numerical data points extracted from the report for plotting.

JSON STRUCTURE (STRICTLY FOLLOW THIS):
{{
  "insights": [
    {{
      "category": "String (e.g., Blood Health, Liver Function, Vitals)",
      "emoji": "String (e.g., 🩸, 🫀, 🫁)",
      "insight": "String (Brief, 1-sentence summary of this aspect)",
      "status": "String ('positive', 'warning', 'negative', 'neutral')"
    }}
  ],
  "visualizations": [
    {{
      "label": "String (e.g., 'Hemoglobin')",
      "value": Number (The numerical value extracted),
      "unit": "String (e.g., 'g/dL', '%', 'mg/dL')",
      "min_range": Number (Lower bound of normal range, or null if N/A),
      "max_range": Number (Upper bound of normal range, or null if N/A),
      "status": "String ('Normal', 'High', 'Low')"
    }}
  ],
  "summary_text": "Markdown string containing: \\n\\n1. **What the Report Is About**\\n2. **Key Findings**\\n3. **Values Outside Range**\\n4. **Doctor Notes**\\n5. **Disclaimer**"
}}

RULES FOR INSIGHTS:
- Group related findings (e.g., RBC, WBC -> "Blood Health").
- If values are normal, status is "positive".
- If values are slightly off but not critical, status is "warning".
- If values are critical/high/low, status is "warning" or "negative".
- Create 3-5 insight blocks max.

RULES FOR VISUALIZATIONS:
- Extract up to 10 key numerical parameters.
- Ensure 'value', 'min_range', and 'max_range' are clean numbers (no strings like '<5').
- If a range is single-sided (e.g., '< 200'), set min_range=0 and max_range=200.

RULES FOR SUMMARY_TEXT:
- Same rules as before: Simple language, No diagnosis, No treatment advice.
- Use Markdown formatting.

OUTPUT MUST BE VALID JSON ONLY. NO MARKDOWN CODE BLOCKS around the JSON.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            'response_mime_type': 'application/json'
        }
    )
    
    text = response.text.strip()
    # Remove markdown code formatting if present
    if text.startswith("```json"):
        text = text[7:].strip()
    elif text.startswith("```"):
        text = text[3:].strip()
    if text.endswith("```"):
        text = text[:-3].strip()

    return text


def explain_medical_term(term: str, language: str = "en") -> str:
    """
    Explain a medical term in simple, patient-friendly language
    """
    prompt = f"""
You are a medical terminology explainer for patients.

RULES:
- Explain in VERY simple, everyday language
- Avoid using complex medical jargon
- Use analogies or comparisons when helpful
- Keep the explanation concise (2-4 sentences)
- If it's a test/measurement, mention what it measures
- Do NOT provide medical advice or diagnosis

Language: {language}

Medical Term: {term}

Provide a simple explanation that a patient without medical knowledge can understand.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text


def analyze_symptoms(symptoms: str, language: str = "en") -> str:
    """
    Analyze symptoms and provide possible conditions (educational only)
    """
    prompt = f"""
You are a symptom analysis assistant for educational purposes.

CRITICAL SAFETY RULES (MUST FOLLOW):
- This is for INFORMATION ONLY, NOT medical diagnosis
- Use phrases like "may indicate", "could be related to", "commonly associated with"
- ALWAYS include urgent care warnings for serious symptoms
- Keep the explanation concise (2-4 sentences)
- ALWAYS end with strong advice to consult a healthcare professional
- If symptoms seem serious (chest pain, difficulty breathing, severe bleeding, etc.),
  IMMEDIATELY advise seeking emergency medical care

Language: {language}

Symptoms Described: {symptoms}

Remember: Be helpful but cautious. Patient safety is paramount.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )


    return response.text


def generate_comparison_analysis(old_summary: str, new_summary: str, language: str = "en") -> str:
    """
    Compare two medical reports and return a structured JSON analysis.
    """
    prompt = f"""
You are a highly intelligent medical comparison assistant.

CRITICAL CONTEXT:
- Comparing medical reports for the SAME patient.
- Goal: Identify changes, trends, and health progress.
- Old Report (Base): {{old_summary}}
- New Report (Current): {{new_summary}}
- Language: {{language}}

TASK:
Analyze the differences and output a STRICT JSON object.

JSON STRUCTURE (MANDATORY):
{{
  "overall_status": "String ('Improved', 'Stable', 'Worsened', 'Mixed')",
  "status_color": "String ('green', 'blue', 'red', 'orange')",
  "changes": [
    {{
      "parameter": "String (e.g., 'Hemoglobin')",
      "change_type": "String ('Improved', 'Stable', 'Worsened', 'New Finding')",
      "details": "String (e.g., 'Increased from 11.2 to 13.5')",
      "significance": "String (Brief medical implication)"
    }}
  ],
  "visualizations": [
     {{
        "label": "String (e.g., 'Hemoglobin')",
        "old_value": Number (or null if not found),
        "new_value": Number (or null if not found),
        "unit": "String (e.g., 'g/dL')"
     }}
  ],
  "summary_markdown": "String (A patient-friendly paragraph summarizing the progress in Markdown)",
  "recommendation": "String (General advice based on the trend, e.g., 'Continue current medication...')",
  "disclaimer": "String (Standard medical disclaimer)"
}}

RULES:
1. "changes": Extract 3-7 key distinct changes.
2. "status_color": green (good), red (bad), blue (stable), orange (mixed/attention needed).
3. "summary_markdown": Use bolding for emphasis. Keep it encouraging but realistic.
4. "details": Be specific with numbers if available in the summaries.
5. "visualizations": Extract ONLY parameters where BOTH old and new numerical values are clearly present. Max 5 items.
6. NO MARKDOWN CODE BLOCKS (` ```json `). JUST THE RAW JSON STRING.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            'response_mime_type': 'application/json'
        }
    )
    
    text = response.text.strip()
    # Remove markdown code formatting if present
    if text.startswith("```json"):
        text = text[7:].strip()
    elif text.startswith("```"):
        text = text[3:].strip()
    if text.endswith("```"):
        text = text[:-3].strip()

    return text

def identify_medicine(medicine_name: str, language: str = 'en') -> str:
    prompt = f"""
You are a helpful medical assistant.
User wants to know about the medicine: "{medicine_name}".

Provide a structured JSON response with the following fields:
1. "purpose": Simply strictly in 3-5 words what it treats (e.g., "Diabetes / Blood Sugar").
2. "best_time": When to take it (e.g., "Before food", "After food", "At night").
3. "side_effects": One or two common side effects (e.g., "Nausea, Dizziness").
4. "name_confirmed": The full correct generic or brand name if the user had a typo.

Language: {language}
Output raw JSON only.

Example JSON:
{{
  "purpose": "Pain relief & fever",
  "best_time": "After food",
  "side_effects": "Nausea, Gastric irritation",
  "name_confirmed": "Dolo 650 (Paracetamol)"
}}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            'response_mime_type': 'application/json'
        }
    )
    return response.text.strip()
