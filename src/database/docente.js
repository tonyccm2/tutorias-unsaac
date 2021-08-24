// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC0zer2obvU5MQrJ2Pe-8_MMCzuwbB-ItU",
    authDomain: "tutoria-electron.firebaseapp.com",
    projectId: "tutoria-electron",
    storageBucket: "tutoria-electron.appspot.com",
    messagingSenderId: "933581286361",
    appId: "1:933581286361:web:bbfe963bc60d1a770fc7c8"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
    
const db = firebase.firestore();

const docenteForm = document.getElementById("docente-form");
const docentesContainer = document.getElementById("docentes-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */
const saveDocente = (codigo,contrasenia,nombres,apPaterno,apMaterno,
    codigoEP,categoria) =>
db.collection("Docente").doc().set({
codigo
,contrasenia
,nombres
,apPaterno
,apMaterno
,codigoEP
,categoria
,
});
//recupera los docentes
const getDocentes = () => db.collection("Docente").get();

const onGetDocente = (callback) => db.collection("Docente").onSnapshot(callback);
//borrar
const deleteDocente = (id) => db.collection("Docente").doc(id).delete();
//recupera 1 docente por ID
const getDocente = (id) => db.collection("Docente").doc(id).get();
//actualiza
const updateDocente = (id, updatedDocente) => db.collection('Docente').doc(id).update(updatedDocente);

//******************************************************************/
//ventanas y funcionalidades

window.addEventListener("DOMContentLoaded", async (e) => {
onGetFicha((querySnapshot) => {
docentesContainer.innerHTML = "";

querySnapshot.forEach((doc) => {
const docente = doc.data();
// FRONT-END ?????????????
docentesContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
<h3 class="h5">${docente.codigo}</h3>
<p>${docente.nombres}</p>
<div>
<button class="btn btn-primary btn-delete" data-id="${doc.id}">
🗑 Delete
</button>
<button class="btn btn-secondary btn-edit" data-id="${doc.id}">
🖉 Edit
</button>
</div>
</div>`;
});
//funcionalidad boton-borrar
const btnsDelete = docentesContainer.querySelectorAll(".btn-delete");
btnsDelete.forEach((btn) =>
btn.addEventListener("click", async (e) => {
console.log(e.target.dataset.id);
try {
//borra el docente o manda mensaje aviso
await deleteDocente(e.target.dataset.id);
} catch (error) {
console.log(error);
}
})
);
// funcionalidad boton-editar
const btnsEdit = docentesContainer.querySelectorAll(".btn-edit");
btnsEdit.forEach((btn) => {
btn.addEventListener("click", async (e) => {
try {
const doc = await getDocente(e.target.dataset.id);
const docente = doc.data();
// recuperamos al form todos los valores
docenteForm["codigo-docente"].value = docente.codigo;
docenteForm["contrasenia-docente"].value = docente.contrasenia;
docenteForm["nombres-docente"].value = docente.nombres;
docenteForm["apPaterno-docente"].value = docente.apPaterno;
docenteForm["apMaterno-docente"].value = docente.apMaterno;
docenteForm["codigoEP-docente"].value = docente.codigoEP;
docenteForm["categoria-docente"].value = docente.categoria;
//mostramos mas???
editStatus = true;
id = doc.id;
docenteForm["btn-docente-form"].innerText = "Update";
//actualiza
} catch (error) {
console.log(error);
}
});
});
});
});

//funcionalidad subir a la nube
docenteForm.addEventListener("submit", async (e) => {
e.preventDefault();

const codigo = docenteForm["docente-codigo"];
const contrasenia =   docenteForm["docente-contrasenia"];
const nombres = docenteForm["docente-nombres"];
const apPaterno = docenteForm["docente-apPaterno"];
const apMaterno = docenteForm["docente-apMaterno"];
const codigoEP = docenteForm["docente-codigoEP"];
const categoria = docenteForm["docente-categoria"];
//intenta hacer la peticion sin lanzar error y cerrar
try {
if (!editStatus) {
await saveFicha(codigo.value, contrasenia.value, nombres.value, apPaterno.value, apMaterno.value
, codigoEP.value, categoria.value,);
} else {
await updateFicha(id, {
    codigo: codigo.value, 
    contrasenia: contrasenia.value, 
    nombre: nombres.value, 
    apPaterno: apPaterno.value, 
    apMaterno: apMaterno.value, 
    codigoEP: codigoEP.value, 
    categoria: categoria.value,
})
//regresa a estar vacio y poder usarla nuevamente
editStatus = false;
id = '';
docenteForm['btn-docente-form'].innerText = 'Save';
}

docenteForm.reset();
codigo.focus(); // title.focus ??
} catch (error) {
console.log(error);
}
});
