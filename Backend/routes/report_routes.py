# from flask import Blueprint, request, g
# from middleware.auth_middleware import auth_required
# from utils.response import success_response
# from services.report_service import process_report


# from utils.exception import ReportNotFoundError

# report_bp = Blueprint("report", __name__, url_prefix="/reports")

# @report_bp.route("/upload", methods=["POST"])
# @auth_required
# def upload_report():
#     if "file" not in request.files:
#         return {"error": "No file provided"}, 400

#     file = request.files["file"]
#     language = request.form.get("language", "en")

#     result = process_report(
#         file=file,
#         user_id=g.user["uid"],
#         language=language
#     )

#     return success_response(result, "Report processed successfully")



from flask import Blueprint, request, g
from middleware.auth_middleware import auth_required
from services.report_service import process_report
from services.report_repository import (
    get_reports_for_user,
    get_report_by_name_and_type
)
from utils.response import success_response
from utils.exception import ReportNotFoundError
from services.report_repository import get_report_by_name_and_type
from services.comparison_service import compare_reports

report_bp = Blueprint("reports", __name__, url_prefix="/reports")

# Upload report
@report_bp.route("/upload", methods=["POST"])
@auth_required
def upload_report():
    file = request.files.get("file")
    report_type = request.form.get("reportType")
    language = request.form.get("language", "en")

    if not file or not report_type:
        return {"error": "file and reportType required"}, 400

    report_id, summary = process_report(
        file,
        g.user["uid"],
        report_type,
        language
    )

    return success_response({
        "reportId": report_id,
        "summary": summary
    })


# Dropdown list
# @report_bp.route("", methods=["GET"])
# @auth_required
# def list_reports():
#     docs = get_reports_for_user(g.user["uid"])
#     result = []

#     for d in docs:
#         data = d.to_dict()
#         result.append({
#             "reportName": data["reportName"],
#             "reportType": data["reportType"],
#             "createdAt": data["createdAt"]
#         })

#     return success_response(result)
@report_bp.route("", methods=["GET"])
@auth_required
def list_reports():
    docs = get_reports_for_user(g.user["uid"])
    result = []

    for d in docs:
        data = d.to_dict()

        result.append({
            "reportName": data.get("reportName", "Unknown Report"),
            "reportType": data.get("reportType", "UNKNOWN"),
            "createdAt": data.get("createdAt")
        })

    return success_response(result)


# Get summary by report name + type
@report_bp.route("/summary", methods=["GET"])
@auth_required
def get_report_summary():
    name = request.args.get("name")
    rtype = request.args.get("type")

    report = get_report_by_name_and_type(g.user["uid"], name, rtype)
    if not report:
        print("Report not found:", name, rtype)
        raise ReportNotFoundError()

    return success_response({
        "reportName": report["reportName"],
        "reportType": report["reportType"],
        "summary": report["summary"]
    })

# @report_bp.route("/compare", methods=["POST"])
# @auth_required
# def compare_reports_route():
#     data = request.json
#     old_id = data.get("oldReportId")
#     new_id = data.get("newReportId")
#     language = data.get("language", "en")

#     old_report = get_report_by_id(old_id)
#     new_report = get_report_by_id(new_id)

#     if not old_report or not new_report:
#         raise ReportNotFoundError()

#     if old_report["userId"] != g.user["uid"]:
#         raise ReportNotFoundError()

#     comparison = compare_reports(old_report, new_report, language)

#     return success_response({
#         "comparison": comparison
#     })