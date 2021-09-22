// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC0zer2obvU5MQrJ2Pe-8_MMCzuwbB-ItU",
  authDomain: "tutoria-electron.firebaseapp.com",
  projectId: "tutoria-electron",
  storageBucket: "tutoria-electron.appspot.com",
  messagingSenderId: "933581286361",
  appId: "1:933581286361:web:bbfe963bc60d1a770fc7c8",
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const formDocente = document.getElementById("formDocente");
const docentesContainer = document.getElementById("lista-docentes");

let editStatus = false;
let id = "";

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */
const saveDocente = (
  codigo,
  password,
  nombres,
  apPaterno,
  apMaterno,
  codigoEP,
  categoria
) =>
  db.collection("docentes").doc().set({
    codigo,
    password,
    nombres,
    apPaterno,
    apMaterno,
    codigoEP,
    categoria,
  });
//recupera los docentes
const getDocentes = () => db.collection("docentes").get();

const onGetDocente = (callback) =>
  db.collection("docentes").onSnapshot(callback);
//borrar
const deleteDocente = (id) => db.collection("docentes").doc(id).delete();
//recupera 1 docente por ID
const getDocente = (id) => db.collection("docentes").doc(id).get();
//actualiza
const updateDocente = (id, updatedDocente) =>
  db.collection("docentes").doc(id).update(updatedDocente);

//******************************************************************/
//ventanas y funcionalidades

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetDocente((querySnapshot) => {
    docentesContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const docente = doc.data();
      // FRONT-END ?????????????
      docentesContainer.innerHTML += `<table class = "table-striped table-bordered table-hover" id="tablaarticulos">
        <thead>          
          <tr>
            <td>${docente.codigo}</td>
            <td>${docente.nombres}</td>
            <td>${docente.apPaterno}</td>
            <td>${docente.apMaterno}</td>
            <td>${docente.codigoEP}</td>
            <td>${docente.categoria}</td>
            <td>
              <button class="btn btn-primary btn-delete" data-id="${doc.id}">
              🗑 Delete
              </button>
              <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
              🖉 Edit
              </button>
            </td>
          </tr>
        </thead>
      </table>`;
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
          formDocente["codigo"].value = docente.codigo;
          formDocente["password"].value = docente.contrasenia;
          formDocente["nombres"].value = docente.nombres;
          formDocente["apellido-paterno"].value = docente.apPaterno;
          formDocente["apellido-materno"].value = docente.apMaterno;
          formDocente["codigo-ep"].value = docente.codigoEP;
          formDocente["categoria"].value = docente.categoria;
          //mostramos mas???
          editStatus = true;
          id = doc.id;
          formDocente["btn-docente-form"].innerText = "Update";
          //actualiza
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});
//funcionalidad subir a la nube
formDocente.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = formDocente["codigo"];
  const password = formDocente["password"];
  const nombres = formDocente["nombres"];
  const apPaterno = formDocente["apellido-paterno"];
  const apMaterno = formDocente["apellido-materno"];
  const codigoEP = formDocente["codigo-ep"];
  const categoria = formDocente["categoria"];
  //intenta hacer la peticion sin lanzar error y cerrar
  try {
    if (!editStatus) {
      await saveDocente(
        codigo.value,
        password.value,
        nombres.value,
        apPaterno.value,
        apMaterno.value,
        codigoEP.value,
        categoria.value
      );
    } else {
      await updateDocente(id, {
        codigo: codigo.value,
        password: password.value,
        nombres: nombres.value,
        apPaterno: apPaterno.value,
        apMaterno: apMaterno.value,
        codigoEP: codigoEP.value,
        categoria: categoria.value,
      });
      //regresa a estar vacio y poder usarla nuevamente
      editStatus = false;
      id = "";
      formDocente["btn-docente-form"].innerText = "Save";
    }

    formDocente.reset();
    codigo.focus(); // title.focus ??
  } catch (error) {
    console.log(error);
  }
});
