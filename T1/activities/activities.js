//str -> bool
//nombre no vacío
const validateName = (name) => {
    return name.replaceAll(" ","") != ""
}

//Enum(str) -> bool
//sea parte del enum
const validateActivityType = (type) => {
    let types = [
        "artistica", 
        "deportiva", 
        "tecnologica",
        "social",
        "recreativa"
    ]
    return types.includes(type)
}

const week = [
        "lunes", 
        "martes", 
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo"
    ]
//str -> bool
//día válido de la semana
const validateDay = (day) => {
    return week.includes(day)
}

//Arr[str] -> bool
//que haya al menos 1 día y que todos sean válidos
const validateDays = (days) => {
    if (days.length == 0) 
        return false
    for (const day of days) {
        if (!validateDay(day))
            return false
    }
    return true
}

//str -> bool
//tiempo válido
const validateTime = (time) => {
    let reg = /^\d\d:\d\d$/
    if (reg.test(time)) {
        let hour_minutes = time.split(":")
        let hour = hour_minutes[0]
        let minutes = hour_minutes[1]
        return 0<=hour && hour<24 && 0<=minutes && minutes<60
    } else {
        return false
    }
}

//str, str -> bool
//un horario no termine antes de empezar
const validateSchedule = (start, end) => {
    if (validateTime(start) && validateTime(end)) {
        let hour_start = start.split(":")[0]
        let minutes_start = start.split(":")[1]
        let hour_end = end.split(":")[0]
        let minutes_end = end.split(":")[1]
        if (hour_start == hour_end) {
            return minutes_start < minutes_end
        } else {
            return hour_start < hour_end
        }
    } else {
        return false
    }
}

//JSON{str: [str, str], ...} -> bool
const validateSchedules = (schedules) => {
    for (const day in schedules) {
        if (!validateSchedule(schedules[day][0], schedules[day][1]))
            return false
    }
    return true
}

//str -> bool
//soporta diversos formatos de video e imagen
const validateFile = (file) => {
    let reg = /.+\.jpeg|.+\.png|.+\.webp|.+\.gif|.+\.svg|.+\.webm|.+\.ogg|.+\.mp4|.+\.roq|.+\.wav$/g
    return reg.test(file)
}

//str -> bool
//link no vacío
const validateURL = validateName

//str -> void -> void
//lógica para modificar el valor del botón
const handleDayButton = (day) => () => {
    let day_element = document.getElementById(day)
    if (day_element.value == " ") {
        day_element.value = day
    } else {
        day_element.value = " "
    }
}

//void -> arr[str]
const getDays = () => {
    let arr = []
    for (const day of week) {
        arr.push(document.getElementById(day).value)
    }
    arr.filter((value) => value!=" ")
    return arr.filter((value) => value!=" ")
}

//Arr[str] -> JSON{str: [str,str], ...}
const getSchedules = (days) => {
    let result = {}
    for (let day of days) {
        let start = document.getElementById(day+"-inicio").value
        let end = document.getElementById(day+"-fin").value
        result[day] = [start, end]
    }
    return result
}

//event -> void
const validateRegister = (event) => {
    let name = document.getElementById("name").value
    let type = document.getElementById("activity-type").value
    let days = getDays()
    let schedules = getSchedules(days)
    let file = document.getElementById("file").value
    let url = document.getElementById("url").value
    

    let validName = validateName(name)
    let validType = validateActivityType(type)
    let validDays = validateDays(days)
    let validSchedules = validateSchedules(schedules)
    let validFile = validateFile(file)
    let validURL = validateURL(url)

    if (validDays) {
        schedules = getSchedules(days)
    }
    

    event.preventDefault()
}

//boton para registrar
let button = document.getElementById("registrar")
button.addEventListener("click", validateRegister)

//lógica de botones de los días
for (const day of week) {
    document.getElementById(day).addEventListener("click", handleDayButton(day))
}