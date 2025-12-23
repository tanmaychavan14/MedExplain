from flask import Blueprint, request, g
from middleware.auth_middleware import auth_required
from services.report_repository import get_report_by_name_and_type
from services.report_service import process_report
from services.comparison_service import compare_reports
from services.comparison_repository import save_comparison, get_comparison_by_meta
from utils.response import success_response
from utils.exception import ReportNotFoundError

comparison_bp = Blueprint("comparisons", __name__, url_prefix="/comparisons")


@comparison_bp.route("", methods=["POST"])
@auth_required
def compare():
    data = request.form if request.form else request.json

    old_name = data.get("oldReportName")
    old_type = data.get("oldReportType")
    new_name = data.get("newReportName")
    new_type = data.get("newReportType")
    language = data.get("language", "en")

    if not old_name or not old_type:
        return {"error": "oldReportName and oldReportType required"}, 400

    # Normalize inputs
    old_name = old_name.strip().lower()
    old_type = old_type.strip().upper()
    language = language.strip().lower()

    old_report = get_report_by_name_and_type(
        g.user["uid"], old_name, old_type
    )

    if not old_report:
        raise ReportNotFoundError()

    # CASE 1: New report uploaded
    if "file" in request.files:
        file = request.files["file"]
        if not new_type:
            return {"error": "newReportType required for upload"}, 400

        new_type = new_type.strip().upper()

        process_report(
            file=file,
            user_id=g.user["uid"],
            report_type=new_type,
            language=language
        )

        new_name = file.filename.strip().lower()

    # CASE 2: New report selected from dropdown
    if not new_name or not new_type:
        return {"error": "newReportName and newReportType required"}, 400

    new_name = new_name.strip().lower()
    new_type = new_type.strip().upper()

    new_report = get_report_by_name_and_type(
        g.user["uid"], new_name, new_type
    )

    if not new_report:
        raise ReportNotFoundError()

    # Compare
    comparison_text = compare_reports(old_report, new_report, language)

    # Store comparison
    comparison_id = save_comparison({
        "userId": g.user["uid"],
        "oldReportName": old_name,
        "oldReportType": old_type,
        "newReportName": new_name,
        "newReportType": new_type,
        "comparisonText": comparison_text
    })

    return success_response({
        "comparisonId": comparison_id,
        "comparison": comparison_text
    })


@comparison_bp.route("", methods=["GET"])
@auth_required
def get_comparison():
    old_name = request.args.get("old")
    old_type = request.args.get("oldType")
    new_name = request.args.get("new")
    new_type = request.args.get("newType")

    if not all([old_name, old_type, new_name, new_type]):
        return {"error": "old, oldType, new, newType required"}, 400

    comp = get_comparison_by_meta(
        g.user["uid"],
        old_name,
        old_type,
        new_name,
        new_type
    )

    if not comp:
        return {"error": "Comparison not found"}, 404

    return success_response({
        "comparison": comp["comparisonText"]
    })

