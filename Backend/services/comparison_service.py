
from services.gemini_service import generate_summary



def compare_reports(old_report, new_report, language):
#     prompt = f"""
# You are a medical report comparison assistant.

# CRITICAL CONTEXT:
# - Both reports belong to the SAME patient.
# - Each report represents ONE medical test.
# - Data is anonymized.

# RULES:
# - Do NOT diagnose.
# - Do NOT suggest treatment.
# - Only classify findings as Improved, Stable, or Worsened.
# - Use simple language.
# - End with a disclaimer.

# Old Report Summary:
# {old_report["summary"]}

# New Report Summary:
# {new_report["summary"]}

# Task:
# Compare the reports and explain changes clearly.
# """
    prompt = f"""
You are a medical report comparison assistant designed for use in rural clinics.

CRITICAL CONTEXT (MUST FOLLOW):
- Both reports belong to the SAME patient
- Each report represents ONE medical test done at different times
- All data is anonymized
- You are NOT a doctor

STRICT SAFETY RULES (MANDATORY):
- Do NOT diagnose any disease or condition
- Do NOT suggest treatments, medicines, lifestyle changes, or remedies
- Do NOT add medical knowledge beyond what is written in the reports
- Only classify findings as: Improved, Stable, or Worsened
- If comparison is not possible, clearly say so
- Use very simple, patient-friendly language
- Be empathetic and reassuring
- Always end with a clear medical disclaimer

Old Report Summary:
{old_report["summary"]}

New Report Summary:
{new_report["summary"]}

TASK:
Compare the old and new report summaries and explain what has changed.

MANDATORY RESPONSE STRUCTURE:
You MUST respond ONLY using the following format.
Do NOT add extra sections or headings.

1. **Overall Change**
   - Clearly state whether the condition appears Improved, Stable, or Worsened.
   - If unclear, say "Cannot be determined from the reports".

2. **What Has Improved**
   - Mention only values or findings that are better in the new report.
   - If nothing improved, say "No improvement mentioned in the report".

3. **What Is Stable**
   - Mention values or findings that have not changed.
   - If nothing is stable, say "No stable findings mentioned".

4. **What Has Worsened**
   - Mention values or findings that are worse in the new report.
   - If nothing worsened, say "No worsening mentioned in the report".

5. **Simple Explanation for the Patient**
   - Explain the changes in very easy language.
   - Avoid medical terms and fear-inducing words.

6. **Important Disclaimer**
   - Clearly state that this comparison is for understanding only.
   - Strongly advise consulting a doctor or healthcare professional.

IMPORTANT:
- Base your response ONLY on the given summaries
- Do NOT guess or infer missing information
- Keep the tone calm, supportive, and respectful

Provide the response now.
"""
    return generate_summary(prompt, language)

