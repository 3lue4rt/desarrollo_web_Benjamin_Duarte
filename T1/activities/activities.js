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

//str -> bool
//día válido
const validateDay = (day) => {
    let days = [
        "lunes", 
        "martes", 
        "miercoles",
        "juevos",
        "viernes",
        "sabado",
        "domingo"
    ]
    return days.includes(day)
}

//str -> [str,str]
//separa la hora de los minutos
const splitTime = (time) => {
    return time.split(":")
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


