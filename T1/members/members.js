/*
        <tr>
            <td>Hugo</td>
            <td>Gonzalez</td>
            <td>Pre-grado</td>
            <td>+56 9 74146024</td>
            <td>hugo.gonzalez@gmail.com</td>
        </tr>
*/

//Person{} -> HTMLElement
//dada un Json de persona hace una fila de tabla
const personToRow = (person) => {
    let tr = document.createElement("tr")
    const createCell = (data) => {
        let td = document.createElement("td")
        td.innerText = data
        tr.appendChild(td)
    }
    for (const key in person) {
        createCell(person[key])
    }
    
    return tr
}

//(db{}->db{}) -> void
//rellena la tabla con la base de datos
const fillTable = (filter) => {
    let table = document.getElementById("table")
    for (const data of filter(db)) {
        table.appendChild(personToRow(data))
    }
}

let table = document.getElementById("table")
    for (const data in db) {
        table.appendChild(personToRow(db[data]))
    }

//str -> db{} -> db{}
const filterByType = (tipo) => (db) => {
    return db.filter((person) => person["tipo"] == tipo)
}

const filterButton = (event) => {
    document.getElementById("table").remove()
    document.getElementById("table-div").innerHTML = '<table id="table" class="member-table"></table>'

    let type = document.getElementById("member-type").value
    if (type=="") {
        fillTable((x)=>x)
    } else {
        fillTable(filterByType(type))
    }

    event.preventDefault()
}

let button = document.getElementById("filtrar")
button.addEventListener("click", filterButton)