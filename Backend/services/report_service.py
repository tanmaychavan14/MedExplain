# import os
# import uuid

# import traceback
# from services.pdf_service import extract_text_from_pdf
# from services.deidentification_service import anonymize
# from services.gemini_service import generate_summary
# from services.report_repository import save_report
# from utils.exception import ReportProcessingError

# UPLOAD_DIR = "storage/uploads"

# def process_report(file, user_id: str, language: str):
#  try:
#     os.makedirs(UPLOAD_DIR, exist_ok=True)

#     report_id = str(uuid.uuid4())
#     file_path = os.path.join(UPLOAD_DIR, f"{report_id}.pdf")
#     file.save(file_path)

#     raw_text = extract_text_from_pdf(file_path)
    
#     if not raw_text.strip():
#      raise ValueError("No extractable text found in PDF")
#     safe_text = anonymize(raw_text)
#     summary = generate_summary(safe_text, language)
#     report_data = {
#             "userId": user_id,
#             "language": language,
#             "sanitizedText": safe_text,
#             "summary": summary,
#             "reportType": "UNKNOWN"
#         }
#     report_id = save_report(report_data)
#     return {
#         "report_id": report_id,
#         "language": language,
#         "summary": summary
#     }
#  except Exception as e:
#    traceback.print_exc()
#    raise ReportProcessingError()


import os, uuid, traceback
from services.pdf_service import extract_text_from_pdf
from services.deidentification_service import anonymize
from services.gemini_service import generate_summary
from services.report_repository import save_report
from utils.exception import ReportProcessingError

UPLOAD_DIR = "storage/uploads"

def process_report(file, user_id, report_type, language):
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        filename = file.filename
        file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.pdf")
        file.save(file_path)

        raw_text = extract_text_from_pdf(file_path)
        if not raw_text.strip():
            raise ValueError("Empty PDF")

        safe_text = anonymize(raw_text)
        summary = generate_summary(safe_text, language)

        report_data = {
            "userId": user_id,
            "reportType": report_type,
            "reportName": filename,
            "summary": summary,
            "sanitizedText": safe_text,
            "language": language
        }

        report_id = save_report(report_data)
        return report_id, summary

    except Exception:
        traceback.print_exc()
        raise ReportProcessingError()
