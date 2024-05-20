import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

const URL_GENERAL= 'http://localhost:3000/categories' //'https://api.escuelajs.co/api/v1/categories' 
const tbody = document.querySelector('tbody')
const form = document.querySelector("form")
const name = document.querySelector("#name")
const image = document.querySelector("#url-image")
let id


index()

form.addEventListener('submit', async (event) => {
    event.preventDefault()// evitar que la pagina se recargue
    //ACA DEBEMOS LLAMAR A LA FUNCION QUE SE ENCARGA DE GUARDAR

    if (id===undefined){
        await create (name, image) //envia los inputs a la funcion que se encarga de guardar

    }else{
        await update (id,name,image) //envia los inputs y el id a la funcion que se encarga de actualizar
    }
    await index() // Volvemos a recargar la lista
    form.reset()
    


})

tbody.addEventListener('click', async function (event) {
    // ACA DEBEMOS LOCALIZAR A LOS ESCUCHADORES DE EVENTOS

    if (event.target.classList.contains("btn-danger")){
        
        id=event.target.getAttribute("data-id")// le sacamos el id al boton rojo
        
        await deleteItem(id) // enviamos el id a la funcion que se encarga de eliminar
        await index()
    }

    if (event.target.classList.contains("btn-warning")){ // nos aseguramos que estamos presionando el boton amarillo
         id = event.target.getAttribute("data-id")// le sacamos el id al boton amarillo
        
        const categoryFound=await find(id) // enviamos el id a la funcion que se encarca de traerlo
        name.value=categoryFound.name // ponemoss el nombre de la category en el input
        image.value=categoryFound.image // ponemos la url de la image en el input
        
    }
    })


async function index() {
    const response = await fetch(URL_GENERAL) //Llamamos a los datos
    const data = await response.json() //convertimos los datos JSON a Javascript

    tbody.innerHTML = ""
    data.forEach(element => {
        tbody.innerHTML += `
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>
                <img width="100px" src=${element.image} alt=${element.name}>
            </td>
            <td>${element.creationAt}</td>
            <td>${element.updatedAt}</td>
            <td>
                <button type="button" data-id=${element.id} class="btn btn-warning">Edit</button>
                <button type="button" data-id=${element.id} class="btn btn-danger">Delete</button>
            </td>
        `
    })
}

async function find(id) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA BUSCAR UNA CATEGORIA

    const response = await fetch(`${URL_GENERAL}/${id}`) // vamos y traemos todo el element 
    const data = await response.json() //Convertimos el elemento a javascript
    return data // retornamos al elemento
}

async function create(name, image) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA CREAR UNA CATEGORIA
    
    // Preparamos a la nueva catergoria que vamos a guardar
    const newCategory ={
        name: name.value,
        image: image.value,
    }
    await fetch(URL_GENERAL,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(newCategory),
    })
}

async function update(id, name, image) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA ACTUALIZAR UNA CATEGORIA
//preparamos a la nueva catergoria que vamos a guardar
const updateCategory={
    name:name.value,
    image:image.value,
}

//Hacemos la petición
await fetch(`${URL_GENERAL}/${id}`,{
    method:"PUT",
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify(updateCategory)
})

id=undefined

}

async function deleteItem(id) {

    //ACA DEBEMOS PROGRAMAR LA PETICION PARA ELIMINAR UNA CATEGORIA

    await fetch(`${URL_GENERAL}/${id}` ,{
        method:'DELETE'
    })



}