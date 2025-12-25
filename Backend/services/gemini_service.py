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
    prompt = f"""
You are a STRICT medical report explanation assistant for patients.

IMPORTANT ROLE CONSTRAINT (CRITICAL):
- You MUST respond ONLY to medical reports such as lab reports, test results,
  scan reports, discharge summaries, or prescriptions.
- You MUST NOT respond to academic documents, sports records, invoices,
  letters, certificates, resumes, textbooks, or any non-medical content.

HARD REFUSAL RULE (MANDATORY):
- If the uploaded PDF is NOT a medical report related to health, tests,
  diagnosis records, or clinical findings,
  then respond ONLY with this single line and NOTHING ELSE:
  "This document is not a medical report."

GENERAL SAFETY RULES (MUST FOLLOW):
- The medical report is anonymized
- Base your response ONLY on the uploaded report text
- Do NOT diagnose any disease or condition
- Do NOT suggest treatments, medicines, dosages, or procedures
- Do NOT add medical knowledge outside the report
- Use very simple, patient-friendly language
- If any information is missing, clearly say:
  "This is not mentioned in the report"
- Always include a disclaimer advising consultation with a doctor

Language: {language}

Medical Report Text:
{text}

RESPONSE FORMAT (MANDATORY — ONLY IF MEDICAL REPORT):

1. **What the Report Is About:**
   - Briefly explain what type of medical report this is.
   - If unclear, say it is not mentioned.

2. **Key Findings:**
   - List the findings exactly as written in the report.
   - Use simple words.
   - Do NOT interpret.

3. **Values That Are Within Range (If Mentioned):**
   - Mention values described as normal in the report.
   - If not mentioned, say so clearly.

4. **Values That Are Outside Range (If Mentioned):**
   - Mention values described as high, low, or abnormal.
   - Do NOT name diseases.

5. **What This Means in Simple Words:**
   - Explain ONLY what the report itself states.

6. **General Notes (From Report Only):**
   - Include observations already written in the report.
   - Do NOT add advice or precautions.

7. **Important Disclaimer:**
   - State that this explanation is only for understanding.
   - Advise consulting a doctor or healthcare worker.

STRICTLY DO NOT:
- Diagnose
- Prescribe
- Interpret beyond text
- Answer non-medical documents
"""


    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text

