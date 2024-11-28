//Al hacer loguin esta funcion nos crea el panel de nuestro usuario a la izquierda.
const buildUserPanel = (user) => {
    let ref = JSON.parse(user)
    let div = document.getElementById("panelUserInfo")
    div.innerHTML = ` <img src="${ref.foto}" style="width: 100px; height: 100px"> </img>
                    <p>${ref.nombre}</p>
                    <p>${ref.email}</p>
                    <p class="hoverOn" id="followersDisplay">Seguidores: ${countFollowers(ref.seguidores)}</p>
                    <p class="hoverOn" id="followsDisplay">Seguidos: ${countFollowers(ref.seguidos)}</p>
                    <button class="btn btn-light" id="editarPerfil">Editar mi perfil</button>
    `

    document.getElementById("editarPerfil").onclick = () => {
        //Se abre un sweet alert para elegir que es lo que quiero cambiar del perfil
        sweetAlertEditarPerfil()
    }
}

//Con esta funcion elegimos que dato queremos cambiar de nuestro perfil.
const sweetAlertEditarPerfil = async () => {
    await Swal.fire({
        title: "¿Que dato deseas cambiar?",
        input: "select",
        inputOptions: {
            Datos: {
                nombre: user.nombre,
                email: user.email,
                password: user.password,
            },
        },
        inputPlaceholder: "Elige lo que deseas cambiar",
        showCancelButton: true,
        inputValidator: (value) => {
            updateUserItem(value)
        }
    });
}

//Esta funcion es la que hace el update de ese dato que queremos cambiar.
const updateUserItem = async (userItem) => {
    let ref = JSON.parse(localStorage.getItem("umedsUsers"))
    const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "Nuevo " + userItem,
        inputPlaceholder: "Digita tu nuevo " + userItem,
        inputAttributes: {
            "aria-label": "Type your message here"
        },
        showCancelButton: true
    });
    if (text) {
        user[userItem] = text
        ref.forEach(refs => {
            refs.find((el) => el.id == user.id)[userItem] = text
        });
        localStorage.setItem("userUmeds", JSON.stringify(user))
        localStorage.setItem("umedsUsers", JSON.stringify(ref))
        location.reload()
    }
}

//Esta funcion cuenta nuestros seguidores para mostrarlos en el panel.
const countFollowers = (seguidores) => {
    return seguidores.length
}

//Esta funcion cuenta nuestros seguidos para mostrarlos en el panel.
const countFollows = (seguidores) => {
    return seguidores.length
}

buildUserPanel(localStorage.getItem("userUmeds"))


