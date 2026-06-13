import re
import filetype
from database import db
from werkzeug.datastructures import FileStorage

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

def validate_dia(dia: str | None):
    return dia in {'Lunes','Martes','Miercoles','Jueves','Viernes','Sábado','Domingo'}

def parse_schedule(schedule: dict[str, tuple[str, str]]) -> dict[str, tuple[str, str]]:
    parsed: dict[str, tuple[str, str]] = {} # Día: (hora_inicio, duración)
    for day in schedule:
        init_hour, init_min = schedule[day][0].split(":")
        final_hour, final_min = schedule[day][1].split(":")

        if not (0<=int(final_hour)<24 and \
                0<=int(init_hour)<24 and \
                0<=int(final_min)<60 and \
                0<=int(init_min)<60):
            raise Exception

        delta_hour = int(final_hour) - int(init_hour)
        delta_min = int(final_min) - int(init_min)

        duration = delta_hour*60-delta_min

        delta_hour = duration // 60
        delta_min = duration % 60

        delta_hour = str(delta_hour)
        delta_min = str(delta_min)

        if len(delta_hour)<2:
            delta_hour = "0" + delta_hour
        if len(delta_min)<2:
            delta_min = "0" + delta_min
        parsed[day] = (schedule[day][0], delta_hour+":"+delta_min)

    return parsed

def validate_schedule(schedule: dict[str, tuple[str, str]]):
    if len(schedule) == 0: return False
    try:
        _ = parse_schedule(schedule)
    except:
        return False
    return True

#    let reg = /.+\.jpg|.+\.jpeg|.+\.png|.+\.webp|.+\.gif|.+\.svg|.+\.webm|.+\.ogg|.+\.mp4|.+\.roq|.+\.wav$/
def validate_file(act_file: FileStorage | None):
    ALLOWED_EXTENSIONS = {"png", 
                          "jpg", 
                          "jpeg", 
                          "gif", 
                          "webp", 
                          "svg", 
                          "webm",
                          "mp4",}
    ALLOWED_MIMETYPES = {"image/jpeg", 
                         "image/png", 
                         "image/gif", 
                         "image/webp", 
                         "image/svg", 
                         "video/webm",
                         "video/mp4",}

    # check if a file was submitted
    if act_file is None:
        return False

    # check if the browser submitted an empty file
    if act_file.filename == "":
        return False
    
    # check file extension
    ftype_guess = filetype.guess(act_file)

    if ftype_guess is None or \
       ftype_guess.extension not in ALLOWED_EXTENSIONS or \
       ftype_guess.mime not in ALLOWED_MIMETYPES:
        return False
    
    return True

def validate_description(desc: str | None) -> bool:
    return desc is not None and len(desc) < 500

def validate_act_type(act_type: str | None) -> bool:
    return act_type in ['Artística','Deportiva','Tecnológica','Social','Recreativa','Otra']

def validate_url(url: str | None) -> bool:
    return url is not None and len(url)>0

def validate_actividad(name: str | None,
                      description: str | None,
                      act_type: str | None,
                      schedule: dict[str, tuple[str, str]],
                      file: FileStorage | None,
                      url: str | None) -> bool:
    return validate_names(name) and \
           validate_description(description) and \
           validate_act_type(act_type) and \
           validate_schedule(schedule) and \
           validate_file(file) and \
           validate_url(url)