class Post {
    constructor(postId, userId, content, nombreUsuario, fotoUsuario, fotoPost, fileUrl, comments) {
        this.postId = postId,
            this.userId = userId,
            this.content = content,
            this.nombreUsuario = nombreUsuario,
            this.fotoUsuario = fotoUsuario,
            this.fotoPost = fotoPost,
            this.fileUrl = fileUrl,
            this.comments = [],
            this.likes = 0,
            this.shares = 0
    }
}

document.getElementById("loader").style.display = "none";

let usersUrl = "./db/posts.json"
let posts = []

//Esta activo es un parametro que uso para validar si ya se desplegaron los comentarios de un post.
//Si es false se abren los comentarios y si es true se cierran los comentarios.
let estaActivo = false

//Este es el usuario
const user = JSON.parse(localStorage.getItem("userUmeds"))

//Esta funcion muestra todos los posts en lo que seria el feed.
//Contiene la funcion checkIfuserLikes que busca si le dimos like o no a un post en particular.
const printearPosts = (nombreUsuario, content, fotoUsuario, postUserId, postId, postFoto, fileUrl) => {

    const checkIfuserLikes = (postId) => {
        if (user && user.likes.includes(postId)) {
            return `<li class="fa-regular fa-heart" style="color: red" value="${postId}">${contarLikes(postId)}</li>`
        } else {
            return `<li class="fa-regular fa-heart" value="${postId}">${contarLikes(postId)}</li>`
        }
    }

    //Tomo la referencia del contenedor para posts en el html
    let user = JSON.parse(localStorage.getItem("userUmeds"))
    let postContainer = document.getElementById("posts")
    let container = document.createElement("div")
    container.style.borderStyle = "outset"
    container.style.marginBottom = "10px"
    container.innerHTML = `
                               <div class="row">
                                <div class="col-md-1"><img src="${fotoUsuario}" class="fotoDelUser"></img></div>
                                <div class="col-md">
                                <li style="list-style-type: none" class="refUserProfile" value="${postUserId}"><p class="nombreUserLink">${nombreUsuario + " "}${(user && user.id == postUserId) ? `<li class="editarPost" style="list-style-type: none" value="${postId}"><i class="fa-regular fa-pen-to-square"  ></i></li>` : ""}</p></li></div>               
                                </div>
                                <div>
                                    <div class="row" >                              
                                        ${postFoto.toLowerCase().split('.').pop() == "mp4" || postFoto.toLowerCase().split('.').pop() == "mpeg"
            ?
            `<video width="320" height="320" controls>
                                            <source src="${postFoto}" type="video/mp4">
                                            Your browser does not support the video tag.
                                            </video>`
            :
            `<img style="width=200px; height=200px" src=${postFoto}></img>`}
                                        <div class="col-md post-contenido"><p class="lead">${content}  ${(fileUrl != "") ? `<br><a href="${fileUrl}">Descargar</a>` : ""}<p/></div>    
                                    </div>
                                    <div class="row"> 
                                        <div class="col-md">  
                                        <li style="list-style-type: none" value="${postId}">${checkIfuserLikes(postId)}</li><li class="fa-regular fa-comment" value="${postId}"> ${contarComments(postId)}</li>
                                        </div>
                                        </div>
                                </div>
    `
    postContainer.appendChild(container)
}

//Esta funcion es la que hace el fetch a posts.json para traerlos en caso de no haber posts en el localstorage.
//En la linea 147 hay un if que chequea si existen posts en el localstorage. Si no existen ejecuta esta funcion.
const checkPosts = async () => {
    resp = await fetch(usersUrl)
    const data = await resp.json()
    data.forEach(post => {
        const postToPush = new Post(post.postId, post.userId, post.content, post.nombreUsuario, post.fotoUsuario, post.fotoPost, post.fileUrl)
        posts.push(postToPush)
        localStorage.setItem("posts", JSON.stringify(posts))
        printearPosts(post.nombreUsuario, post.content, post.fotoUsuario, post.userId, post.postId, post.fotoPost, post.fileUrl)
    });
}

//Funcion que cuenta los likes de cada post.
const contarLikes = (postId) => {
    let posts = JSON.parse(localStorage.getItem("posts"))
    return posts[postId - 1].likes
}

//Funcion que cuenta los posts de cada post.
const contarComments = (postId) => {
    let posts = JSON.parse(localStorage.getItem("posts"))
    return posts[postId - 1].comments.length
}

//Funcion que elimina un elemento de un array. Ejemplo sacar un like de nuestro usuario y sacarlo tambien del array de users.
function removeElement(array, elementToRemove) {
    array.forEach((item, index) => {
        if (item === elementToRemove) {
            array.splice(index, 1);
        }
    });
    return array;
}

const darLike = (postId) => {
    let posts = JSON.parse(localStorage.getItem("posts"))
    let users = JSON.parse(localStorage.getItem("umedsUsers"))
    //Aca valido si estamos logueados y si el id del post esta en nuestro user. Si no esta pusheo ese id al array de likes.
    if (localStorage.getItem("userUmeds") && !user.likes.includes(postId)) {
        user.likes.push(postId)
        //Aqui actualizo el array de likes sumandole +1.
        posts[postId - 1].likes = parseInt(posts[postId - 1].likes + 1)
        //Actualizo en el localstorage los posts, el usuario y los usuarios.
        localStorage.setItem("posts", JSON.stringify(posts))
        localStorage.setItem("userUmeds", JSON.stringify(user))
        users.forEach(ref => {
            saveUserLikes = ref.find((el) => el.id === user.id)

            saveUserLikes.likes.push(postId)
        });
        localStorage.setItem("umedsUsers", JSON.stringify(users))
        //Llamo a update likes que cambia el color del corazon si ya le dimos like y hace update de la cantidad de likes.
        updateLikes(postId, posts[postId - 1].likes = posts[postId - 1].likes, "red")

        //Aca es lo mismo solo que quitamos el like. Si incluye el id de ese post en lugar de sumarle 1 le restamos uno.
    } else if (localStorage.getItem("userUmeds") && user.likes.includes(postId)) {
        posts[postId - 1].likes = posts[postId - 1].likes - 1
        removeElement(user.likes, postId)
        users.forEach(ref => {
            saveUserLikes = ref.find((el) => el.nombre === user.nombre)
            removeElement(saveUserLikes.likes, postId);
        });
        //Actualizamos el localstorage.
        localStorage.setItem("umedsUsers", JSON.stringify(users))
        localStorage.setItem("posts", JSON.stringify(posts))
        localStorage.setItem("userUmeds", JSON.stringify(user))
        //Actualizamos el contador de likes.
        updateLikes(postId, posts[postId - 1].likes = posts[postId - 1].likes, "black")
    }
}

const updateLikes = (postId, likes, color) => {
    let referencia = document.querySelectorAll(".fa-regular.fa-heart")
    for (let i = 0; i < likeBotones.length; i++) {
        if (referencia[i].value == postId) {
            referencia[i].style.color = color
            referencia[i].innerHTML = likes
        }
    }
}

//Esto es lo primero que se ejecuta, si los posts existen en el localstorage los muestra en el feed.
//Sino existen los busca en el posts.json.
if (localStorage.getItem("posts")) {
    const localStoragePosts = JSON.parse(localStorage.getItem("posts"))
    localStoragePosts.forEach(post => {
        const postToPush = new Post(post.postId, post.userId, post.content, post.nombreUsuario, post.fotoUsuario, post.fotoPost, post.comments, post.likes, post.shares)
        posts.push(postToPush)
        printearPosts(post.nombreUsuario, post.content, post.fotoUsuario, post.userId, post.postId, post.fotoPost, post.fileUrl)
    });
} else {
    checkPosts()
}

// import * as Bytescale from "@bytescale/sdk";
//Esta es la API de Bytescale para poder subir archivos, aqui esta mi Key para poder usarlo y subir archivos tipo pdf.
const uploadManager = new Bytescale.UploadManager({
    apiKey: "public_FW25cHhB17L4zwUPcABwgEcBw23C" // This is your API key.
});

//Esta funcion crea un nuevo post. 
//Filtra el tipo de archivo que se haya seleccionado.
//Si es una imagen o video lo sube a Imgur, si es un archivo a Bytescale y si es un post que contenga solo texto lo guarda y lo muestra.
async function nuevoPost() {

    const modalItem = document.getElementById('userModal');

    modalItem.innerHTML = '';
    //Este modal nos permite elegir un archivo, escribir un post y publicarlo.
    modalItem.innerHTML = ` <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                    <h5>Nuevo post</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <textarea type="text" placeholder="Todos los posts deben contener una descripcion aqui!" class="form-control" id="text"></textarea>
                                    <div class="modal-footer">
                                      <input type="file" id="upLoader">
                                        <br />
                                        <strong>
                                            <p id="url"></p>
                                        </strong>
                                    <button type="button" class="btn btn-primary" id="publicarPost">Publicar</button>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                          `;

    new bootstrap.Modal(modalItem).show();
    let button = document.getElementById("publicarPost")
    let text = document.getElementById("text")
    const fileInput = document.getElementById('upLoader');
    let ref = JSON.parse(localStorage.getItem("posts"))

    //Estos son las extensiones que acepta imgur. En handleFiles filtro si es multimedia o si es un archivo pdf por ejemplo.
    let fileExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "apng",
        "tiff",
        "mp4",
        "mpeg",
        "avi",
        "webm",
        "quicktime",
        "x-matroska",
        "x-flv",
        "x-msvideo",
        "x-ms-wmv"]

    const handleFiles = async () => {
        //Este if es por si no ingresaron ningun texto en el post
        if(text.value == ""){
            return
        }

        document.getElementById('userModal').style.display = "none";
        document.getElementById("loader").style.display = "block";
        const selectedFiles = [...fileInput.files];

        if (selectedFiles[0]) {
            //Aqui abajo agarro la extension del archivo seleccionado
            let fileType = selectedFiles[0].name.toLowerCase().split('.').pop()
            //Si la extension esta incluida en fileExtensions hace el upload hacia imgur.
            switch (fileExtensions.includes(fileType)) {

                case true:

                    const formdata = new FormData()
                    formdata.append("image", selectedFiles[0])
                    fetch("https://api.imgur.com/3/image/", {
                        method: "post",
                        headers: {
                            Authorization: "Client-ID 0e95e513f32844d"
                        },
                        body: formdata
                    }).then(data => data.json()).then(data => {
                        const nuevoPost = new Post(posts.length + 1, user.id, text.value, user.nombre, user.foto, data.data.link, "")
                        ref.push(nuevoPost);
                        localStorage.setItem("posts", JSON.stringify(ref))
                        printearPosts(user.nombre, text.value, user.foto, user.id, posts.length, data.data.link, "")
                        location.reload()
                    })

                    break;
                //Si no esta incluida lo hace a Bytescale
                case false:

                    try {
                        const { fileUrl, filePath } = await uploadManager.upload({
                            data: selectedFiles[0],
                            apiKey: "public_FW25cHhB17L4zwUPcABwgEcBw23C"
                        });
                        const nuevoPost = new Post(posts.length + 1, user.id, text.value, user.nombre, user.foto, "", fileUrl)
                        ref.push(nuevoPost);
                        localStorage.setItem("posts", JSON.stringify(ref))
                        printearPosts(user.nombre, text.value, user.foto, user.id, posts.length, "", fileUrl)
                        location.reload()

                    } catch (e) {
                        Swal.fire("Ups!.. Algo ha salido mal");
                    }

                    break;
            }
            //Si es solo texto lo guarda en el localstorage y lo muestra.
        } else {
            const nuevoPost = new Post(posts.length + 1, user.id, text.value, user.nombre, user.foto, "", "")
            ref.push(nuevoPost);
            localStorage.setItem("posts", JSON.stringify(ref))
            printearPosts(user.nombre, text.value, user.foto, user.id, posts.length, "", "")
            location.reload()
        }
    }
    button.addEventListener("click", handleFiles);
}

//Esta funcion nos permite comentar un post.
async function comentarPost(postId) {
    const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: posts[postId - 1].content,
        inputPlaceholder: "Tu comentario aqui...",
        inputAttributes: {
            "aria-label": "Digita tu nuevo comentario aqui"
        },
        showCancelButton: true
    });
    if (text) {
        let posts = JSON.parse(localStorage.getItem("posts"))
        posts[postId - 1].comments.push({ nombre: user.nombre, comment: text, img: user.foto })
        localStorage.setItem("posts", JSON.stringify(posts))
        location.reload()
    }
}

//Con esta funcion mostramos los comentarios.
const mostrarComments = (contenedor, comments) => {
    estaActivo = true
    if (comments) {
        comments.forEach(comment => {
            let div = document.createElement("div")
            div.innerHTML = `
                            <div class="row comments" id="comments">
                                <div class="col-md">
                                    <p>${comment.nombre}: ${comment.comment}</p>
                                </div>                            
                            </div>
                            `
            contenedor.append(div)
        })
    }
}

//Con esta funcion cerramos los comentarios
const cerrarComments = (contenedor) => {
    let rowComments = document.getElementsByClassName("comments")
    for (var i = rowComments.length - 1; i >= 0; --i) {
        rowComments[i].remove();
    }
    estaActivo = false
}

//Con esta funcion editamos nuestros posts.
async function editPost(postId) {
    let ref = JSON.parse(localStorage.getItem("posts"))
    const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "Nuevo post",
        inputPlaceholder: "Digita tu nuevo post aqui...",
        inputAttributes: {
            "aria-label": "Digita tu nuevo post aqui"
        },
        showCancelButton: true
    });
    if (text) {
        ref.find((el) => el.postId == postId).content = text
        localStorage.setItem("posts", JSON.stringify(ref))
        location.reload()
    }
}

//Estos de abajo son eventos de los botones de like, comentario, editar post, mostrar los comentarios etc.

let abrirPosteador = document.getElementById("abrirPosteador")
abrirPosteador.onclick = () => {
    if (user) {
        nuevoPost()
    }
}

let likeBotones = document.querySelectorAll(".fa-regular.fa-heart")
for (let i = 0; i < likeBotones.length; i++) {
    likeBotones[i].addEventListener('click', function () {
        if (user) {

            darLike(likeBotones[i].value)
        }
    });
}

let comentarBotones = document.querySelectorAll(".fa-regular.fa-comment")
for (let i = 0; i < comentarBotones.length; i++) {
    comentarBotones[i].addEventListener('click', function () {
        if (user) {
            comentarPost(comentarBotones[i].value)
        }
    });
}

let postEditBotones = document.querySelectorAll(".editarPost")
for (let i = 0; i < postEditBotones.length; i++) {
    postEditBotones[i].addEventListener('click', function () {
        if (user) {

            editPost(postEditBotones[i].value)
        }
    });
}

let postContainers = document.querySelectorAll(".col-md.post-contenido")
for (let i = 0; i < postContainers.length; i++) {
    let posts = JSON.parse(localStorage.getItem("posts"))
    postContainers[i].addEventListener('click', function () {
        if (estaActivo == false) {
            mostrarComments(postContainers[i], posts[i].comments)
        } else {
            cerrarComments(postContainers[i])
        }

    });
}

