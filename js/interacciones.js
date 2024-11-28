let userLinkProfile = document.querySelectorAll(".refUserProfile")
let buscador = document.getElementById("abrirBuscador")

//Use este loop para separar individualmente el link del nombre de cada usuario.
//Asi al hacer click en el nombre de algun usuario abre el perfil de ese usuario.
for (let i = 0; i < userLinkProfile.length; i++) {
    userLinkProfile[i].addEventListener('click', function () {
        showModal(userLinkProfile[i].value)
    });
}
//Muestra el perfil del usuario.
//data es el id del usuario de quien estamos viendo el perfil, y filtra con includes() para ver si seguimos o no a ese user.
//Los seguidos estan dentro del usuario en el localstorage.
//Osea a quienes seguimos se guardan en el localstorage del usuario.
//Y tambien se guarda nuestro id como seguidor en el array de users de ese user en particular.
const showModal = (data) => {
    Swal.close()
    let users = JSON.parse(localStorage.getItem("umedsUsers"))
    let resultado
    for (usuario of users) {
        resultado = usuario.find((el) => el.id === data)
    }

    const modalItem = document.getElementById('userModal');

    modalItem.innerHTML = '';

    modalItem.innerHTML = ` <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">${resultado.nombre}</h5>${(user.seguidos.includes(data)) ? `<li id="addFollow" class="addFollow" style="list-style-type: none" value="${data}"><i style="margin: 10px" class="fa-solid fa-user-minus"></i></li>` : `<li id="addFollow" class="addFollow" style="list-style-type: none" value="${data}"><i style="margin: 10px" class="fa-solid fa-user-plus"></i></li>`}
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body" id="modal-body">
                                    <img src="${resultado.foto}" style="width: 100px; height: 100px"></img>
                                    ${resultado.email}
                                    </div>
                                    <div id="userPostsPrint"></div>
                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                          `;

    new bootstrap.Modal(modalItem).show();
    printUserPosts(data)

    let follow = document.getElementById("addFollow")
    follow.onclick = () => {
        if (user && !user.seguidos.includes(data)) {
            let usuarios = JSON.parse(localStorage.getItem("umedsUsers"))
            usuarios.forEach(usuario => {
                let ref = usuario.find((usuario) => usuario.id === data)
                ref.seguidores.push(user.id)
                let ref2 = usuario.find((usuario) => usuario.id === user.id)
                ref2.seguidos.push(data)
            });
            localStorage.setItem("umedsUsers", JSON.stringify(usuarios))
            user.seguidos.push(data)
            localStorage.setItem("userUmeds", JSON.stringify(user))
            location.reload()
        } else {
            let index = user.seguidos.indexOf(data)
            user.seguidos.splice(index, 1)
            localStorage.setItem("userUmeds", JSON.stringify(user))
            location.reload()
        }
    }
};

//Se printean los posts en el perfil del usuario que queremos ver.
const printUserPosts = (userId) => {
    let div = document.getElementById("userPostsPrint")
    let posts = JSON.parse(localStorage.getItem("posts"))
    let userPosts = posts.filter((post) => post.userId === userId)

    userPosts.forEach(post => {
        let contenedor = document.createElement("div")
        contenedor.style.backgroundColor = "#f2f2f2"
        contenedor.innerHTML = `       
        ${post.fotoPost.toLowerCase().split('.').pop() == "mp4" || post.fotoPost.toLowerCase().split('.').pop() == "mpeg" ?
                `<video width="100%" height="320" controls>
                            <source src="${post.fotoPost}" type="video/mp4">
                            </video>` : `<img style="max-width: 100%" src=${post.fotoPost}></img>`}
                            <p style="margin: 10px">${post.content}</p>    
                            ${(post.fileUrl != "") ? `<p><a href="${post.fileUrl}">Descargar</a></p>` : ""}  
                                 
        `
        div.append(contenedor)
    });

}

//Abre el buscador y ejecuta una busqueda entre los posts y usuarios que tengan incluida esa palabra. Case sensitive.
const abrirBuscador = async () => {
    let resultUser = []
    let resultPost = []

    let users = JSON.parse(localStorage.getItem("umedsUsers"))
    let div = document.createElement("div")
    const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "¿Que estas buscando?",
        inputPlaceholder: "Type your message here...",
        inputAttributes: {
          "aria-label": "Type your message here"
        },
        showCancelButton: true
      });
      if (text) {
        posts.forEach(post => {
            if(post.content.includes(text)){
                resultPost.push(post)
            }
        });
        users.forEach(user => {
            user.forEach(element => {
                if(element.nombre.includes(text)){
                    resultUser.push(element)
                }
            });
        });
      }

      resultUser.forEach(element => {
        let p = document.createElement("p")
        p.innerHTML = `<p class="openUserProfileLink">${element.nombre}</p>`
        p.onclick = () => {showModal(element.id)}
        div.append(p)
      });

      resultPost.forEach(element => {
        let p = document.createElement("p")
        p.innerHTML = `<p class="openUserProfileLink">${element.nombreUsuario}: ${element.content}</p>`
        p.onclick = () => {showModal(element.userId)}
        div.append(p)
      });

      Swal.fire({
        title: "Resultados:",
        html: div,
        width: 600,
        padding: "3em",
        color: "#716add",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `
    });
      
}

//Luego de hacer login vemos a la izquierda nuestro perfil.
//Este evento espera un click en nuestros seguidores para mostrarnos quien nos sigue.
document.getElementById("followersDisplay").addEventListener("click", (event) => {
    let text = document.createElement("div")
    let p
    let usersReferencia = JSON.parse(localStorage.getItem("umedsUsers"))

    user.seguidores.forEach(element => {
        usersReferencia.forEach(user => {
            p = document.createElement("div")
            p.innerHTML = `<li class="openUserProfileLink" id="${user.find((el) => el.id == element).id}" style="list-style-type: none" value="${user.find((el) => el.id == element).id}"><p>${user.find((el) => el.id == element).nombre}</p></li>`
            p.onclick = () => { showModal(user.find((el) => el.id == element).id) }
            text.append(p)
        });
    });

    Swal.fire({
        title: "Seguidores:",
        html: text,
        width: 600,
        padding: "3em",
        color: "#716add",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `
    });
});

//Este evento espera un click en nuestros seguidos para mostrarnos a quienes seguimos.
document.getElementById("followsDisplay").addEventListener("click", (event) => {
    let text = document.createElement("div")
    let p
    let usersReferencia = JSON.parse(localStorage.getItem("umedsUsers"))

    user.seguidos.forEach(element => {
        usersReferencia.forEach(user => {
            p = document.createElement("div")
            p.innerHTML = `<li class="openUserProfileLink" id="${user.find((el) => el.id == element).id}" style="list-style-type: none" value="${user.find((el) => el.id == element).id}"><p>${user.find((el) => el.id == element).nombre}</p></li>`
            p.onclick = () => { showModal(user.find((el) => el.id == element).id) }
            text.append(p)
        });
    });

    Swal.fire({
        title: "Seguidos:",
        html: text,
        width: 600,
        padding: "3em",
        color: "#716add",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `
    });
});

//Evento de click en el nombre de algun usuario para abrir su perfil.
buscador.addEventListener('click', (event) => {
    abrirBuscador()
})