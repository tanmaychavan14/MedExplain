from PyPDF2 import PdfReader

def extract_text(file):
    reader = PdfReader(file)
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    if not text.strip():
        raise ValueError("No readable text found in PDF")

    return text
