//str -> bool
//nombre no vacío
const validateName = (name) => {
    return name.replaceAll(" ","") != ""
}

//str -> bool
//apellido no vacío
const validateSurname = validateName

//Enum(str) -> bool
//sea parte del enum
const validateMemberType = (type) => {
    let types = [
        "pre-grado", 
        "post-grado", 
        "funcionario",
        "academico"
    ]
    return types.includes(type)
}

//str -> bool
//esté entre 00000000 y 99999999
const validatePhone = (phone) => {
    phone = phone.replaceAll(" ","") //saca los espacios del numero
    return !isNaN(phone) && 0 <= phone  && phone <= 99999999
}

//str -> bool
// alfabetico && @ && alfabetico && . && alfabetico
const validateEmail = (email) => {
    email = email.trim().toLowerCase()
    let reg = /^[a-z.]+@[a-z]+\.[a-z]+/g //forma abc@abc.abc
    return reg.test(email)
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
//maneja la validación de inputs formulario de login
const validateLogin = (event) => {
    let names = document.getElementById("names").value
    let surnames = document.getElementById("surnames").value
    let memberTypes = document.getElementById("member-type").value
    let phone = document.getElementById("phone").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    let password_confirm = document.getElementById("password-confirm").value

    let validNames = validateName(names)
    let validSurnames = validateName(surnames)
    let validMemberType = validateMemberType(memberTypes)
    let validPhone = validatePhone(phone)
    let validEmail = validateEmail(email)
    let validPassword = validatePassword(password)

    validForm = validNames && validSurnames && validMemberType && validPhone && validEmail && validPassword && password==password_confirm

    if (validForm) {
        window.location.href = "../activities/"
    } else {
        alert("mala")
    }
    event.preventDefault()
}

let button = document.getElementById("registrar")
button.addEventListener("click", validateLogin)