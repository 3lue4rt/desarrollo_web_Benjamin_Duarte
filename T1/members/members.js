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

//void->void
//rellena la tabla con la base de datos
const fillTable = () => {
    let table = document.getElementById("table")
    for (const data in db) {
        table.appendChild(personToRow(db[data]))
    }
}

