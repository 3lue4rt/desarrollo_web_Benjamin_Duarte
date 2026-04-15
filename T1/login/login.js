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
    return !isNaN(phone) && 0 <= parseInt(phone)  && parseInt(phone) <= 99999999 && phone.length==8
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
    let names = document.getElementById("names")
    let surnames = document.getElementById("surnames")
    let memberTypes = document.getElementById("member-type")
    let phone = document.getElementById("phone")
    let email = document.getElementById("email")
    let password = document.getElementById("password")
    let password_confirm = document.getElementById("password-confirm")

    let validNames = validateName(names.value)
    let validSurnames = validateSurname(surnames.value)
    let validMemberType = validateMemberType(memberTypes.value)
    let validPhone = validatePhone(phone.value)
    let validEmail = validateEmail(email.value)
    let validPassword = validatePassword(password.value)
    let validPassword_confirm = validatePassword(password_confirm.value)

    const changeColor = (valid, element) => {
        if (!valid) {
            element.style.borderBlockColor = "red"
            element.style.background = "#fe8e8e"
        } else {
            element.style.borderBlockColor = "black"
            element.style.background = "white"
        }
    }

    if (password.value!=password_confirm.value) {
        document.getElementById("warning").style.display = "block"
        validPassword_confirm = false
    } else {
        document.getElementById("warning").style.display = "none"
    }

    changeColor(validNames, names)
    changeColor(validSurnames, surnames)
    changeColor(validMemberType, memberTypes)
    changeColor(validPhone, phone)
    changeColor(validEmail, email)
    changeColor(validPassword, password)
    changeColor(validPassword_confirm, password_confirm)
    
    

    validForm = validNames && validSurnames && validMemberType && validPhone && validEmail && validPassword && password.value==password_confirm.value

    if (validForm) {
        window.location.href = "../activities/"
    }
    event.preventDefault()
}

let button = document.getElementById("registrar")
button.addEventListener("click", validateLogin)