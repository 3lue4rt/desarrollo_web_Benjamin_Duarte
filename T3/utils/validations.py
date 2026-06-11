import re
from database import db

def validate_names(value:str | None) -> bool:
    return value!=None and len(value) > 0

def validate_member_type(member_type: str | None) -> bool:
    member_types = ["pregrado",
             "postgrado",
             "funcionario",
             "academico"]
    return member_type in member_types

def validate_phone(phone: str | None) -> bool:
    if not phone: return False
    phone = phone.replace(" ", "")
    try:
        phone_num = int(phone)
    except ValueError:
        return False
    return 0 <= phone_num <= 99999999 and len(phone)==8

def validate_email(email: str | None) -> bool:
    if not email: return False
    email = email.strip().lower()
    regex = re.compile(r"[a-z.]+@[a-z.]+\.[a-z]+")
    test = regex.match(email)
    return bool(test)

def validate_region_comuna(region: str | None, comuna: str | None) -> bool:
    if not (region and comuna): return False
    session = db.SessionLocal()
    region_db = session.query(db.Region).filter_by(nombre=region).first()
    if not region_db: 
        session.close()
        return False
    comuna_db = session.query(db.Comuna).filter_by(nombre=comuna, region_id=region_db.id).first()
    if not comuna_db:
        session.close() 
        return False
    session.close()
    return True
    

def validate_password(password: str | None) -> bool:
    if not password: return False
    def fast_test(regex: str) -> bool:
        return bool(re.compile(regex).search(password))
    has_num = fast_test(r"\d")
    has_lower = fast_test(r"[a-z]")
    has_upper = fast_test(r"[A-Z]")
    has_special = fast_test(r"\W")
    return has_num and has_lower and has_upper and has_special and len(password)>=8

def validate_register(names: str | None, 
                      member_type: str | None,
                      email: str | None,
                      phone: str | None,
                      region: str | None,
                      comuna: str | None,
                      password: str | None,
                      password_confirm: str | None) -> bool:
    
    return validate_names(names) and \
           validate_member_type(member_type) and \
           validate_email(email) and \
           validate_phone(phone) and \
           validate_region_comuna(region, comuna) and \
           validate_password(password) and \
           validate_password(password_confirm) and \
           password == password_confirm