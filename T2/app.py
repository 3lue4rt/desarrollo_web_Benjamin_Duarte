from flask import Flask, render_template

app = Flask(__name__)

app = Flask(__name__)
app.secret_key = "secret_key"

@app.route("/", methods=["GET"])
def portada():
    return render_template("portada.html")

@app.route("/login", methods=["GET"])
def login():
    return render_template("portada.html")

@app.route("/miembros", methods=["GET"])
def miembros():
    return render_template("portada.html")

@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    return render_template("portada.html")
