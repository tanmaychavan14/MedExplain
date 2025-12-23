class AppException(Exception):
    status_code = 400
    message = "Application error"

    def to_dict(self):
        return {
            "error": self.message
        }


class AuthError(AppException):
    status_code = 401
    message = "Unauthorized"

class ReportProcessingError(AppException):
    status_code = 500
    message = "Failed to process report"


class ReportNotFoundError(AppException):
    status_code = 404
    message = "Report not found"
