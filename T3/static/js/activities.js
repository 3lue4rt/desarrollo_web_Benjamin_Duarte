//str -> bool
//nombre no vacío
const validateName = (name) => {
    return name.replaceAll(" ","") != "" && name.length <= 45
}

const validateDescription = (desc) => {
    return desc.replaceAll(" ","") != "" && desc.length <= 500
}

//Enum(str) -> bool
//sea parte del enum
const validateActivityType = (type) => {
    let types = [
        'Artística',
        'Deportiva',
        'Tecnológica',
        'Social',
        'Recreativa',
        'Otra'
    ]
    return types.includes(type)
}

const week = [
        "Lunes", 
        "Martes", 
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo"
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
    file = file.toLowerCase()
    let reg = /.+\.jpg|.+\.jpeg|.+\.png|.+\.webp|.+\.gif|.+\.svg|.+\.webm|.+\.mp4$/
    return reg.test(file)
}

//str -> bool
//link no vacío
const validateURL = (url) => {
    return url.replaceAll(" ","") != "" && url.length <= 500
}

//str -> void -> void
//lógica para modificar el valor del botón
const handleDayButton = (day) => () => {
    let day_element = document.getElementById(day)
    let schedule = document.getElementById(day+"-horario")
    if (day_element.value == " ") {
        day_element.value = day
        schedule.style.display = "block"
    } else {
        day_element.value = " "
        schedule.style.display = "none"
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
    let desc = document.getElementById("description").value
    let type = document.getElementById("activity-type").value
    let days = getDays()
    let schedules = getSchedules(days)
    let file = document.getElementById("file").value
    let url = document.getElementById("url").value
    

    let validName = validateName(name)
    let validDescription = validateDescription(desc)
    let validType = validateActivityType(type)
    let validDays = validateDays(days)
    let validSchedules = validateSchedules(schedules)
    let validFile = validateFile(file)
    let validURL = validateURL(url)
    
    let error = ""

    if (!validDays) {
        document.getElementById("warning").style.display = "block"
        error += "Seleccione por lo menos un día\n"
    }
    if(!validDescription) {
        document.getElementById("description").style.background = "red"
        error += "Sobrepasó el limite de 500 en la descripción\n"
    }
    if(!validName) {
        document.getElementById("name").style.background = "red"
        error += "Nombre inválido\n"
    }
    if(!validFile) {
        document.getElementById("file").style.background = "red"
        error += "Tipo de archivo inválido\n"
    }
    if(!validURL) {
        document.getElementById("url").style.background = "red"
        error += "Ingrese una url válida\n"
    }
    if(!validType) {
        document.getElementById("activity-type").style.background = "red"
        error += "Ingrese un tipo de actividad válido\n"
    }
    if(!validSchedules) {
        error += "Elija un horario válido para cada día seleccionado\n"
        for (const day in schedules) {
            document.getElementById(day+"-horario").style.background = "red"
        }
    }

    let validForm = validName && validType && validDays && validSchedules && validFile && validURL && validDescription

    event.preventDefault()

    if (validForm) {
        console.log(document.getElementById("activity-form"))
        document.getElementById("activity-form").submit()
    } else {
        alert(error)
    }
}

//boton para registrar
let button = document.getElementById("registrar")
button.addEventListener("click", validateRegister)

//lógica de botones de los días
for (const day of week) {
    document.getElementById(day).addEventListener("click", handleDayButton(day))
    document.getElementById(day).addEventListener("click", (event) => {
        document.getElementById("warning").style.display = "none"
    })
    document.getElementById(day+"-inicio").addEventListener("click", (event) => {
        document.getElementById(day+"-horario").style.background = "white"
    })
    document.getElementById(day+"-fin").addEventListener("click", (event) => {
        document.getElementById(day+"-horario").style.background = "white"
    })
}

document.getElementById("name").addEventListener("input", (event) => {
    document.getElementById("name").style.background = "white"
})

document.getElementById("description").addEventListener("input", (event) => {
    document.getElementById("description").style.background = "white"
})

document.getElementById("activity-type").addEventListener("input", (event) => {
    document.getElementById("activity-type").style.background = "white"
})

document.getElementById("file").addEventListener("input", (event) => {
    document.getElementById("file").style.background = "white"
})

document.getElementById("url").addEventListener("input", (event) => {
    document.getElementById("url").style.background = "white"
})
