//TODO: move this status codes to separate file
module.exports.codes = {
    "SUCCESS": [400, ""],
    "INVALID_EMAIL_PASS":[401,"The email and password you have entered is incorrect"],
    "FAILURE": [500, "Parameter missing / Invalid Operation / Internal Server Error"],
    "INVALID_HEADERS": [501, "Invalid authentication headers."],
    "SESSION_EXPIRED": [502, "You session has timed out."],
    "UNATHORISED_ACCESS": [503, "You are not authorised to perform this operation"],
    "INVALID_CREDS": [504, "Invalid login details."],
    "ACCOUNT_BLOCKED": [505, "Your account is blocked"],
    "EMAIL_NOT_SENT": [506, "Your registration/password reset email was not sent."],
    "INVALID_TOKEN": [507, "Your token is invalid."],
    "OLD_PASSWORD_INVALID": [508, "Your old password is wrong"],
    "EMAIL_EXISTS": [509, "This email already exists."],
    "INVALID_USER": [510, "The user is invalid."],
    "IMAGE_SIZE_INVALID": [511, ""],
    "NO_DATA_FOUND": [512, "No data found."]
}
