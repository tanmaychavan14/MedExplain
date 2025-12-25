from firebase_admin_init import db
from datetime import datetime


def save_report(data):
    ref = db.collection("reports").document()
    ref.set({**data, "createdAt": datetime.utcnow()})
    return ref.id


def get_reports_for_user(user_id):
    return db.collection("reports").where("userId", "==", user_id).stream()


def get_report_by_name_and_type(user_id, report_name, report_type):
    if not user_id or not report_name or not report_type:
        return None

    report_name = report_name.strip().lower()
    report_type = report_type.strip().upper()

    print("QUERY VALUES:")
    print("userId:", user_id)
    print("reportName:", report_name)
    print("reportType:", report_type)

    query = (
        db.collection("reports")
        .where("userId", "==", user_id)
        .where("reportName", "==", report_name)
        .where("reportType", "==", report_type)
        .limit(1)
        .stream()
    )

    docs = list(query)
    print("FOUND:", len(docs))

    if not docs:
        return None

    doc = docs[0]
    data = doc.to_dict()
    data["id"] = doc.id
    return data


