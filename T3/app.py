from flask import Flask, render_template, request, session, redirect, url_for
from utils.validations import validate_register, validate_actividad
from werkzeug.utils import secure_filename
from database import db
import filetype
import hashlib
import os
import uuid


app = Flask(__name__)
app.secret_key = "secret_key"

@app.route("/", methods=["GET"])
def portada():
    users = db.get_last_5_users()
    if session.get("user", None):
        return render_template("portada.html", user=session.get("user", None), users=users)
    return render_template("portada.html", users=users)

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method=="POST":
        email = request.form.get("email")
        password = request.form.get("password")
        status, error = db.login_user(email, password)
        if status:
            session["user"] = email
            return redirect(url_for("portada"))
        else:
            print(error)
            return render_template("login.html", error=error)
    elif request.method=="GET":
        if session.get("user", None):
            print(session.get("user", None))
            return redirect(url_for("portada"))
        else:
            return render_template("login.html")

    return render_template("login.html")

@app.route("/logout", methods=["GET"])
def logout():
    session.pop("user", None)
    return redirect(url_for("portada"))

@app.route("/registrar", methods=["GET", "POST"])
def registrar():
    if request.method=="POST":
        names = request.form.get("names")
        memberTypes = request.form.get("member-type")
        email = request.form.get("email")
        phone = request.form.get("phone")
        region = request.form.get("region")
        comuna = request.form.get("comuna")
        password = request.form.get("password")
        password_confirm = request.form.get("password-confirm")
        error = ""
        if validate_register(names,
                             memberTypes,
                             email,
                             phone,
                             region,
                             comuna,
                             password,
                             password_confirm):
            status, msg = db.register_user(names,
                                           memberTypes,
                                           email,
                                           phone,
                                           region,
                                           comuna,
                                           password)
            if status:
                session["user"] = email
                return redirect(url_for("portada"))
            error += msg
        else:
            error += "Uno de los campos no es válido"
        print(error)
        return render_template("registrar.html", error=error)
    elif request.method == "GET":
        if session.get("user", None):
            return redirect(url_for("portada"))
        else:
            return render_template("registrar.html")
            

    return render_template("registrar.html")

@app.route("/actividades", methods=["GET"])
def actividades():
    user = session.get("user", None)
    if user is None: return redirect(url_for("registrar"))
    return render_template("actividades.html", user=user)

WEEK = [
        "Lunes", 
        "Martes", 
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo"
    ]

@app.route("/actividades/post", methods=["POST"])
def post_actividad():
    email = session.get("user", None)
    if email is None: return redirect(url_for("portada"))
    name = request.form.get("name")
    desc = request.form.get("description")
    act_type = request.form.get("activity-type")
    days: list[str] = []
    for day in WEEK:
        day_req = request.form.get(day)
        if day_req is not None and day_req != " ":
            days.append(day_req)
    schedule = {}
    for day in days:
        start = request.form.get(day+"-inicio")
        end = request.form.get(day+"-fin")
        if start is not None and end is not None:
            schedule[day] = (start, end)
    file = request.files.get("file")
    url = request.form.get("url")
    if file is not None and \
       file.filename is not None and \
       validate_actividad(name, desc, act_type, schedule, file, url):
        # 1. generate random name for img

        _filename = hashlib.sha256(
            secure_filename(file.filename).encode("utf-8")
            ).hexdigest()
        guess = filetype.guess(file)
        if guess is not None:
            _extension = guess.extension
            img_filename = f"{_filename}_{str(uuid.uuid4())}.{_extension}"
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], img_filename))
            user = db.get_user_by_email(email)
            

    return redirect(url_for("actividades"))

@app.route("/miembros", methods=["GET"])
def miembros():
    if session.get("user", None):
        return render_template("portada.html", user=session.get("user", None))
    return redirect(url_for("portada"))

@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    if session.get("user", None):
        return render_template("portada.html", user=session.get("user", None))
    return redirect(url_for("portada"))
