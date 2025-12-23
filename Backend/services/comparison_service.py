
from services.gemini_service import generate_summary



def compare_reports(old_report, new_report, language):
    prompt = f"""
You are a medical report comparison assistant.

CRITICAL CONTEXT:
- Both reports belong to the SAME patient.
- Each report represents ONE medical test.
- Data is anonymized.

RULES:
- Do NOT diagnose.
- Do NOT suggest treatment.
- Only classify findings as Improved, Stable, or Worsened.
- Use simple language.
- End with a disclaimer.

Old Report Summary:
{old_report["summary"]}

New Report Summary:
{new_report["summary"]}

Task:
Compare the reports and explain changes clearly.
"""

    return generate_summary(prompt, language)

