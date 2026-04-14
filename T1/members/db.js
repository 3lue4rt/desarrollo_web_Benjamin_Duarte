const size = 100

const names = [
    "Monk", 
    "Hugo", 
    "Isi", 
    "Joel", 
    "Diego", 
    "Luis", 
    "Gabriel",
    "Catalina", 
    "Alina", 
    "Sofía"
]

const surnames = [
    "Balbontín",
    "Gonzalez",
    "Perez",
    "Riquelme",
    "Orellana",
    "Muñoz",
    "Tapia",
    "Cepeda",
    "Gonzales",
    "Arce"
]

const types = [
    "pre-grado",
    "post-grado",
    "funcionario",
    "academico"
]

//num -> int
const randomInt = (max) => {
    return Math.floor(Math.random() * max);
}

//array[A] -> A
const randomChoice = (arr) => {
    return arr[randomInt(arr.length)]
}

//void -> str
const createRandomName = () => {
    return randomChoice(names)
}

//void -> str
const createRandomSurname = () => {
    return randomChoice(surnames)
}

//str, str -> str
const createEmail = (name, surname) => {
    return name.toLowerCase() + "." + surname.toLowerCase() + "@gmail.com"
}

//void -> str
const createRandomPhone = () => {
    let phone = ""

    for (let _=0;_<8;_++) { //8 veces
        phone += String(randomInt(10))
    }
    return "+56 9 "+phone
}

//void -> str
const createRandomType = () => {
    return randomChoice(types)
}

//void -> {}
const createPerson = () => {
    let person = {}
    person["nombre"] = createRandomName()
    person["apellido"] = createRandomSurname()
    person["tipo"] = createRandomType()
    person["telefono"] = createRandomPhone()
    person["email"] = createEmail(person["nombre"], person["apellido"])
    return person
}

//Arr[Person], int -> void
//rellena la base de datos con size personas
const fillDB = (db, size) => {
    for (let _=0;_<size;_++) {
        db.push(createPerson())
    }
}

//"base de datos"
let db = []
fillDB(db, size)
