from services.gemini_service import generate_comparison_analysis

def compare_reports(old_report, new_report, language):
    # Use the specialized JSON comparison function
    return generate_comparison_analysis(old_report["summary"], new_report["summary"], language)
