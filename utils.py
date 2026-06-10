import re

def valid_email(email):
    return email.endswith("@gmail.com") or email.endswith("@usal.edu.lb")

def valid_password(password):
    has_letter = re.search(r"[A-Za-z]", password)
    has_number = re.search(r"[0-9]", password)
    return len(password) > 7 and has_letter and has_number

def valid_phone(phone):
    return bool(re.fullmatch(r"\+?[0-9]{7,15}", phone))
