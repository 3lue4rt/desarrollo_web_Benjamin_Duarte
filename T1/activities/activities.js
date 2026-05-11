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

// Source - https://stackoverflow.com/a/1026087
// Posted by Steve Harrison, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-14, License - CC BY-SA 4.0

const capitalizeFirstLetter= (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

//{str: [str, str] ...} -> str
//parsea un schedule JSON a str
const parseSchedule = (schedule) => {
    const msg = (schedule, day) => capitalizeFirstLetter(day)+" de "+schedule[day][0]+" a "+schedule[day][1]
    let len = 0
    let days = []
    for (const day in schedule) {
        len++
        days.push(day)
    }
    let finalMsg = ""
    if (len==1) {
        let day = days[0]
        return msg(schedule, day)
    } else {
        let separator = ", "
        for (const day of days) {
            if (len==2) {
                separator= " y "
            } else if (len == 1) {
                separator= ""
            }
            finalMsg+= msg(schedule, day) + separator
            len--
        }
        return finalMsg
    }
}


/*
    <p class="actividad">Fútbol (Deportiva), Lunes de 16:00 a 20:00
        <a href="media/futbol.jpg" target="_blank">imagen</a>, 
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">enlace</a>.
    </p>
*/

//str, str, {str: [str, str], ...}, str, str -> void
const addActivity = (name, type, schedule, file, url) => {
    let p = document.createElement("p")
    let aMedia = document.createElement("a")
    let aLink = document.createElement("a")

    p.className = "actividad"
    p.innerText = name + " (" + capitalizeFirstLetter(type) + "), "+parseSchedule(schedule)+", "
    p.appendChild(aMedia)
    p.appendChild(aLink)
    aMedia.innerText = "imagen, "
    aLink.innerText = "enlace."
    aMedia.href = "media/" + file
    aMedia.target = "_blank"
    aLink.href = url
    aLink.target = "_blank"


    let parent = document.getElementById("my-activities")
    parent.appendChild(p)
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

    if (!validDays) {
        document.getElementById("warning").style.display = "block"
        for (const day of week) {
            document.getElementById(day).style.transform = "scale(1.5)"
        }
    } else {
        document.getElementById("warning").style.display = "none"
        for (const day of week) {
            document.getElementById(day).style.transform = "scale(1)"
        }
    }

    if(!validName) {
        document.getElementById("name").style.background = "red"
    } else {
        document.getElementById("name").style.background = "white"
    }

    if(!validFile) {
        document.getElementById("file").style.background = "red"
    } else {
        document.getElementById("file").style.background = "white"
    }

    if(!validURL) {
        document.getElementById("url").style.background = "red"
    } else {
        document.getElementById("url").style.background = "white"
    }

    if(!validType) {
        document.getElementById("activity-type").style.background = "red"
    } else {
        document.getElementById("activity-type").style.background = "white"
    }

    console.log(validSchedules)
    if(!validSchedules) {
        for (const day of week) {
            document.getElementById(day+"-horario").style.background = "red"
        }
    } else {
        for (const day of week) {
            document.getElementById(day+"-horario").style.background = "#f5d6ff"
        }
    }

    

    let validForm = validName && validType && validDays && validSchedules && validFile && validURL

    if (validForm) {
        addActivity(name, type, schedules, file, url)
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