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
          fichaForm["ficha-tutorando"].value = ficha.tutorando;
          fichaForm["ficha-codigo"].value = ficha.codigo;
          fichaForm["ficha-direccion"].value = ficha.direccion;
          fichaForm["ficha-email"].value = ficha.email;
          fichaForm["ficha-personaReferencia"].value = ficha.personaReferencia;
          fichaForm["ficha-celularReferencia"].value = ficha.celularReferencia;
          fichaForm["ficha-semestre"].value = ficha.semestre;
          fichaForm["ficha-celular"].value = ficha.celular;
          fichaForm["ficha-fecha"].value = ficha.fecha;
          fichaForm["ficha-tipoTutoria"].value = ficha.tipoTutoria;
          fichaForm["ficha-descripcion"].value = ficha.descripcion;
          fichaForm["ficha-referencia"].value = ficha.referencia;
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

  const tutorando = fichaForm["ficha-tutorando"];
  const codigo =   fichaForm["ficha-codigo"];
  const direccion = fichaForm["ficha-direccion"];
  const email = fichaForm["ficha-email"];
  const personaReferencia = fichaForm["ficha-personaReferencia"];
  const celularReferencia = fichaForm["ficha-celularReferencia"];
  const semestre = fichaForm["ficha-semestre"];
  const celular = fichaForm["ficha-celular"];
  const fecha = fichaForm["ficha-fecha"];
  const tipoTutoria = fichaForm["ficha-tipoTutoria"];
  const descripcion = fichaForm["ficha-descripcion"];
  const referencia = fichaForm["ficha-referencia"];
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