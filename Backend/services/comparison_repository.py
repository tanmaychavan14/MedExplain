from firebase_admin_init import db
from datetime import datetime

def save_comparison(data):
    ref = db.collection("comparisons").document()
    ref.set({**data, "createdAt": datetime.utcnow()})
    return ref.id


def get_comparison_by_meta(user_id, old_name, old_type, new_name, new_type):
    old_name = old_name.strip().lower()
    new_name = new_name.strip().lower()
    old_type = old_type.strip().upper()
    new_type = new_type.strip().upper()
    query = (
        db.collection("comparisons")
        .where("userId", "==", user_id)
        .where("oldReportName", "==", old_name)
        .where("newReportName", "==", new_name)
        .limit(1)
        .stream()
    )
    for doc in query:
        return doc.to_dict()
    return None
