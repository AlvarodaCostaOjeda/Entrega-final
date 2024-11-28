class User {
    constructor(id, nombre, carrera, titulo, email, seUnio, rol, foto, password, likes, seguidores, seguidos, mensajes) {
        this.id = id
        this.nombre = nombre,
            this.carrera = carrera,
            this.titulo = titulo,
            this.email = email,
            this.seUnio = seUnio,
            this.rol = rol,
            this.foto = foto,
            this.password = password,
            this.likes = likes,
            this.seguidores = seguidores,
            this.seguidos = seguidos,
            this.mensajes = mensajes
    }

    returnId() {
        return this.id
    }
    returnNombre() {
        return this.nombre
    }
}

let users = []
let url = "./db/users.json"

//Esta funcion ve si existen algo en el localstorage.
//Si no existe hace el fetch a los archivos json.
const checkUsers = async () => {
    let resp
    let data

    if (!localStorage.getItem("umedsUsers")) {
        resp = await fetch(url)
        data = await resp.json()

    } else {
        let ref2 = JSON.parse(localStorage.getItem("umedsUsers"))
        ref2.forEach(element => {
            data = element
        });

    }

    let email = document.getElementById("email").value
    let pass = document.getElementById("pass").value

    data.forEach(user => {
        if (email == user.email && pass == user.password) {
            const usuario = new User(user.id, user.nombre, user.carrera, user.titulo, user.email, user.seUnio, user.rol, user.foto, user.password, user.likes, user.seguidores, user.seguidos, user.mensajes)
            localStorage.setItem("userUmeds", JSON.stringify(usuario))
            users.push(data)
            localStorage.setItem("umedsUsers", JSON.stringify(users))
            document.getElementById("login").remove()
            document.getElementById("loginForm").remove()
            document.getElementById("crearUser").remove()
            crearUnBoton("barraNav", "Salir", "btn btn-light", "salir", salir)
            location.reload()
        }else{
            Swal.fire("Este usuario no existe");
        }
    });
}

//Funcion para crear un usuario.
//Esta funcion crea un nuevo usuario y lo coloca en el localstorage del usuario para mantener la sesion iniciada.
//Pero tambien lo coloca en el localstorage donde se guardan todos los usuarios.
//Asi al salir y volver a entrar busca a ese usuario en el array de usuarios del localstorage.
const crearUser = async () => {
    let resp
    let data
    let nombre
    let email
    let pass1
    let pass2

    if (!localStorage.getItem("umedsUsers")) {
        resp = await fetch(url)
        data = await resp.json()
    } else {
        let ref2 = JSON.parse(localStorage.getItem("umedsUsers"))
        ref2.forEach(element => {
            data = element
        });
    }

    const { value: formValues } = await Swal.fire({
        title: "Crea tu usuario:",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="Nombre">
          <input id="swal-input2" class="swal2-input" placeholder="Email">
          <input id="swal-input3" class="swal2-input" placeholder="Password">
          <input id="swal-input4" class="swal2-input" placeholder="Confirma tu password">
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                nombre = document.getElementById("swal-input1").value,
                email = document.getElementById("swal-input2").value,
                pass1 = document.getElementById("swal-input3").value,
                pass2 = document.getElementById("swal-input4").value,
            ];
        }
    });
    if (nombre != "" && nombre != "" && pass1 === pass2) {
        const usuario = new User(data.length + 1,
            nombre,
            "",
            "",
            email,
            "27/11/2024",
            0,
            "https://img.freepik.com/vector-gratis/gradiente-azul-usuario_78370-4692.jpg?t=st=1730397240~exp=1730400840~hmac=f376b1905df3e3fc44f4dca1c1b3f1e867a934b58bad996d426a7aa65436d1dc&w=740",
            pass1,
            [],
            [],
            [],
            [])

        let newArr = {
            id: data.length + 1,
            nombre: nombre,
            carrera: "",
            titulo: "",
            email: email,
            seUnio: "27/11/2024",
            rol: 0,
            foto: "https://img.freepik.com/vector-gratis/gradiente-azul-usuario_78370-4692.jpg?t=st=1730397240~exp=1730400840~hmac=f376b1905df3e3fc44f4dca1c1b3f1e867a934b58bad996d426a7aa65436d1dc&w=740",
            password: pass1,
            likes: [],
            seguidores: [],
            seguidos: [],
            mensajes: []
        }

        localStorage.setItem("userUmeds", JSON.stringify(usuario))
        users.push(data)
        users[0].push(newArr)

        localStorage.setItem("umedsUsers", JSON.stringify(users))
        document.getElementById("login").remove()
        document.getElementById("loginForm").remove()
        document.getElementById("crearUser").remove()
        location.reload()
    }else{
        Swal.fire("Las contraseñas no coinciden o te falto completar algun campo.");
    }
}

//Esta funcion crea un boton y por parametro se le pasan la div donde va a estar, funcion y propiedades html.
//Esta funcion es la que crea el boton "Salir"
const crearUnBoton = (contenedor, botonInnerText, botonClassName, botonId, funcion) => {
    let botonContainer = document.getElementById(contenedor)
    let boton = document.createElement("button")

    boton.innerText = botonInnerText
    boton.className = botonClassName
    boton.id = botonId

    boton.onclick = funcion

    botonContainer.append(boton)
}

//Esta funcion muestra un mensaje de error
const mostrarMensajeEror = () => {
    return console.error("Algo ha salido mal, intentalo nuevamente")
}

//Esta funcion cierra la sesion del usuario.
const salir = function () {
    //localStorage.removeItem("umedsUsers")
    localStorage.removeItem("userUmeds")
    //localStorage.removeItem("posts")
    location.reload()
}

//Esta funcion llama a CheckUsers. Con los values que vienen del formulario de login.
const login = () => {
    try {
        checkUsers()
    } catch (error) {
        mostrarMensajeEror()
    }
}

//Esta funcion crea el formulario del login.
const crearForm = () => {
    document.getElementById("login").style.display = "none"
    let div = document.getElementById("loginForm")
    div.innerHTML = `
                    <input placeholder="email" type="email" id="email" required></input>
                    <input placeholder="password" type="password" id="pass" value="123456" required></input>
                    <button class="btn btn-primary" id="entrar">Entrar</button>
    `
    let entrar = document.getElementById("entrar")
    entrar.onclick = () => {
        login()
    }
}

//Estos son eventos de los botones login, crear usuario y para limpiar el localstorage.
const loginBtn = document.getElementById("login")
loginBtn.onclick = () => {
    crearForm()
}

const crearU = document.getElementById("crearUser")
crearU.onclick = () => {
    crearUser()
}

const botonLimpiarLocalstorage = document.getElementById("limpiarPosts")
botonLimpiarLocalstorage.onclick = () => {
        localStorage.removeItem("umedsUsers")
        localStorage.removeItem("userUmeds")
        localStorage.removeItem("posts")
        location.reload()
}

//Aqui si el usuario esta logueado elimina el boton de login, el formulario de login y el boton de crear el usuario.
//Crea el boton salir.
if (localStorage.getItem('userUmeds')) {
    document.getElementById("login").remove()
    document.getElementById("loginForm").remove()
    document.getElementById("crearUser").remove()
    crearUnBoton("barraNav", "Salir", "btn btn-light", "salir", salir)
}
