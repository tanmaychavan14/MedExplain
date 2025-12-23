# To detect ther user data from pdf

import re

def anonymize(text: str) -> str:
    rules = [
        r"(Patient Name|Name)\s*[:\-].*",
        r"(Age|DOB)\s*[:\-].*",
        r"(Gender|Sex)\s*[:\-].*",
        r"(UHID|Patient ID|MRN)\s*[:\-].*",
        r"\b\d{10}\b",
        r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
        r"(Dr\.?\s+[A-Za-z ]+)",
        r"(Hospital|Clinic)\s*[:\-].*"
    ]

    sanitized = text
    for rule in rules:
        sanitized = re.sub(rule, "[REDACTED]", sanitized, flags=re.IGNORECASE)

    return sanitized
