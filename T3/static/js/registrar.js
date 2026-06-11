//str -> bool
//nombre no vacío
const validateName = (name) => {
    return name.replaceAll(" ","") != ""
}

//Enum(str) -> bool
//sea parte del enum
const validateMemberType = (type) => {
    let types = [
        "pregrado", 
        "postgrado", 
        "funcionario",
        "academico"
    ]
    return types.includes(type)
}

//str -> bool
//esté entre 00000000 y 99999999
const validatePhone = (phone) => {
    phone = phone.replaceAll(" ","") //saca los espacios del numero
    return !isNaN(phone) && 0 <= parseInt(phone)  && parseInt(phone) <= 99999999 && phone.length==8
}

//str -> bool
// alfabetico && @ && alfabetico && . && alfabetico
const validateEmail = (email) => {
    email = email.trim().toLowerCase()
    let reg = /^[a-z.]+@[a-z]+\.[a-z]+/g //forma abc@abc.abc
    return reg.test(email)
}

const validateRegion = (region) => {
    for (let r of region_comuna["regiones"]) {
        if (r["nombre"]==region) {
            return true
        }
    }
    return false
}

const validateComuna = (region) => (comuna) => {
    for (let r of region_comuna["regiones"]) {
        if (r["nombre"]==region) {
            for (let c of r["comunas"]) {
                if (c["nombre"]==comuna)
                    return true
            }
            return false
        }
    }
    return false
}
//str->bool
//minimo:
// - un numero
// - largo 8
// - una mayuscula
// - una minuscula
// - un carácter especial
const validatePassword = (password) => {
    let has_number = /\d+/g.test(password)
    let has_lowercase = /[a-z]+/g.test(password)
    let has_uppercase = /[A-Z]+/g.test(password)
    let has_special = /\W+/g.test(password)
    return has_number && has_lowercase && has_uppercase && has_special && password.length>=8
}

//void->void
//maneja la validación de inputs formulario de registrar
const validateRegistrer = (event) => {
    event.preventDefault()
    let names = document.getElementById("names")
    let memberTypes = document.getElementById("member-type")
    let email = document.getElementById("email")
    let phone = document.getElementById("phone")
    let region = document.getElementById("region")
    let comuna = document.getElementById("comuna")
    let password = document.getElementById("password")
    let password_confirm = document.getElementById("password-confirm")

    let msg = ""

    const addToMsg = (element, validator, warning) => {
        if (!validator(element.value)) {
            element.style.borderBlockColor = "red"
            /*element.style.background = "#fe8e8e"*/
            msg += warning + "\n"
        } else {
            element.style.borderBlockColor = "black"
        }
    }

    addToMsg(names, validateName, "El nombre debe contener al menos 1 letra")
    addToMsg(memberTypes, validateMemberType, "Seleccione un miembro válido")
    addToMsg(email, validateEmail, "email inválido")
    addToMsg(phone, validatePhone, "Ingrese solo 8 números, sin el +56 9")
    addToMsg(region, validateRegion, "Seleccione una región válida")
    addToMsg(comuna, validateComuna(region.value), "Seleccione una comuna válida")
    addToMsg(password, validatePassword, "La contraseña debe contener 1 número, una mayúscula, una minúscula, un caracter especial y ser de largo 8")
    
    if (password.value != password_confirm.value) {
        msg += "Las contraseñas no coinciden\n"
        password_confirm.style.borderBlockColor = "red"
    } else {
        password_confirm.style.borderBlockColor = "black"
    }

    if (msg!="") {
        alert(msg)
    } else {
        document.getElementById("register-form").submit()
    }
    
}

let button = document.getElementById("registrar")
button.addEventListener("click", validateRegistrer

)

let comunas = document.getElementById("comuna")

const deleteComunas = () => {
    comunas.innerHTML = '<option value="">-- Elija una opción --</option>'
}
const fillComunas = (regionToFill) => {
    deleteComunas()
    for (let region of region_comuna["regiones"]) {
        if (region.nombre == regionToFill) {
            for (let comuna of region.comunas) {
                let newComuna = document.createElement("option")
                newComuna.value = comuna.nombre
                newComuna.innerText = comuna.nombre
                comunas.appendChild(newComuna)
            }
            break
        }
    }
}

let regiones = document.getElementById("region")
for (let region of region_comuna["regiones"]) {
    let newRegion = document.createElement("option")
    newRegion.value = region.nombre
    newRegion.innerText = region.nombre
    regiones.appendChild(newRegion)
}

regiones.addEventListener("input", (event) => {
    fillComunas(regiones.value)
})