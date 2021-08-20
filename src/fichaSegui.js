//**************** conexion a FIREBASE ******** */ 
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

const fichaForm = document.getElementById("fichaSegui-form");
const fichasContainer = document.getElementById("fichaSegui-container");

let editStatus = false; // ????
let id = '';

/**
* Save a New Task in Firestore
* @param {string} title the title of the Task
* @param {string} description the description of the Task
****************fin conexion a FIREBASE**************************************
*/

//guardar
const saveFicha = (tutorando,codigo,direccion,email,personaReferencia,celularReferencia
  ,semestre,celular,fecha,tipoTutoria,descripcion,referencia) =>
db.collection("fichaSegui").doc().set({
  tutorando
  ,codigo
  ,direccion
  ,email
  ,personaReferencia
  ,celularReferencia
  ,semestre
  ,celular
  ,fecha
  ,tipoTutoria
  ,descripcion
  ,referencia
});
//recupera las fichas
const getFichas = () => db.collection("fichaSegui").get();

const onGetFicha = (callback) => db.collection("fichaSegui").onSnapshot(callback);
//borrar
const deleteFicha = (id) => db.collection("fichaSegui").doc(id).delete();
//recupera 1 ficha por ID
const getFicha = (id) => db.collection("fichaSegui").doc(id).get();
//actualiza
const updateFicha = (id, updatedFicha) => db.collection('fichaSegui').doc(id).update(updatedFicha);

//******************************************************************/
//ventanas y funcionalidades

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetFicha((querySnapshot) => {
    fichasContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const ficha = doc.data();
      // FRONT-END ?????????????
      fichasContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
    <h3 class="h5">${ficha.codigo}</h3>
    <p>${ficha.descripcion}</p>
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
    const btnsDelete = fichasContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
            //borra la ficha o manda mensaje aviso
          await deleteFicha(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );
      // funcionalidad boton-editar
    const btnsEdit = fichasContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getFicha(e.target.dataset.id);
          const ficha = doc.data();
          // recuperamos al form todos los valores
          taskForm["ficha-tutorando"].value = ficha.tutorando;
          taskForm["ficha-codigo"].value = ficha.codigo;
          taskForm["ficha-direccion"].value = ficha.direccion;
          taskForm["ficha-email"].value = ficha.email;
          taskForm["ficha-personaReferencia"].value = ficha.personaReferencia;
          taskForm["ficha-celularReferencia"].value = ficha.celularReferencia;
          taskForm["ficha-semestre"].value = ficha.semestre;
          taskForm["ficha-celular"].value = ficha.celular;
          taskForm["ficha-fecha"].value = ficha.fecha;
          taskForm["ficha-tipoTutoria"].value = ficha.tipoTutoria;
          taskForm["ficha-descripcion"].value = ficha.descripcion;
          taskForm["ficha-referencia"].value = ficha.referencia;
          //mostramos mas???
          editStatus = true;
          id = doc.id;
          fichaForm["btn-ficha-form"].innerText = "Update";
          //actualiza
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

//funcionalidad subir a la nube
fichaForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tutorando = taskForm["ficha-tutorando"];
  const codigo =   taskForm["ficha-codigo"];
  const direccion = taskForm["ficha-direccion"];
  const email = taskForm["ficha-email"];
  const personaReferencia = taskForm["ficha-personaReferencia"];
  const celularReferencia = taskForm["ficha-celularReferencia"];
  const semestre = taskForm["ficha-semestre"];
  const celular = taskForm["ficha-celular"];
  const fecha = taskForm["ficha-fecha"];
  const tipoTutoria = taskForm["ficha-tipoTutoria"];
  const descripcion = taskForm["ficha-descripcion"];
  const referencia = taskForm["ficha-referencia"];
  //intenta hacer la peticion sin lanzar error y cerrar
  try {
    if (!editStatus) {
      await saveFicha(tutorando.value, codigo.value, direccion.value, email.value, personaReferencia.value
          , celularReferencia.value, semestre.value, celular.value, fecha.value
          ,tipoTutoria.value, descricion.value, referencia.value,);
    } else {
      await updateFicha(id, {
        tutorando: tutorando.value,
        codigo: codigo.value,
        direccion: direccion.value,
        email: email.value,
        personaReferencia: personaReferencia.value,
        celularReferencia: celularReferencia.value,
        semestre: semestre.value,
        celular: celular.value,
        fecha: fecha.value,
        tipoTutoria: tipoTutoria.value,
        descripcion: descripcion.value,
        referencia: referencia.value,
      })
      //regresa a estar vacio y poder usarla nuevamente
      editStatus = false;
      id = '';
      fichaForm['btn-ficha-form'].innerText = 'Save';
    }
    
    fichaForm.reset();
    codigo.focus(); // title.focus ??
  } catch (error) {
    console.log(error);
  }
});