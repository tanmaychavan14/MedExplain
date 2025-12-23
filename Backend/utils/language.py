def get_language_instruction(lang_code: str) -> str:
    if lang_code == "hi":
        return "Explain the report in simple Hindi."
    if lang_code == "mr":
        return "Explain the report in simple Marathi."
    return "Explain the report in simple English."
