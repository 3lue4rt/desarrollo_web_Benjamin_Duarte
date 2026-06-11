from flask import Flask, render_template, request, session, redirect, url_for
from utils.validations import validate_register
from database import db

app = Flask(__name__)
app.secret_key = "secret_key"

@app.route("/", methods=["GET"])
def portada():
    return render_template("portada.html")

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

@app.route("/miembros", methods=["GET"])
def miembros():
    return render_template("portada.html")

@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    return render_template("portada.html")
