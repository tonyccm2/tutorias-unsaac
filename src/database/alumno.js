//Your web app's Firebase configuration
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

const AlumnoForm = document.getElementById("formAlumno");
const alumnosContainer = document.getElementById("lista-alumnos");

let editStatus = false;
let id = '';

/**
* Save a New Task in Firestore
* @param {string} title the title of the Task
* @param {string} description the description of the Task
*/
const saveAlumno = (codigo,nombres,apPaterno,apMaterno,
  codigoEP,codTutor,descripcion) =>
db.collection("alumnos").doc().set({
codigo
,nombres
,apPaterno
,apMaterno
,codigoEP
,codTutor
,descripcion
});
//recupera los Alumno
const getAlumnos = () => db.collection("alumnos").get();

const onGetAlumno = (callback) => db.collection("alumnos").onSnapshot(callback);
//borrar
const deleteAlumno = (id) => db.collection("alumnos").doc(id).delete();
//recupera 1 Alumno por ID
const getAlumno = (id) => db.collection("alumnos").doc(id).get();
//actualiza
const updateAlumno = (id, updatedAlumno) => db.collection('alumnos').doc(id).update(updatedAlumno);

//******************************************************************/
//ventanas y funcionalidades

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetAlumno((querySnapshot) => {
      alumnosContainer.innerHTML = "";
      querySnapshot.forEach((doc) => {
      const alumno = doc.data();
      // FRONT-END ?????????????
      alumnosContainer.innerHTML += `<table class = "table-striped table-bordered table-hover" id="tablaarticulos">
      <thead>          
        <tr>
          <td>${alumno.codigo}</td>
          <td>${alumno.nombres}</td>
          <td>${alumno.apPaterno}</td>
          <td>${alumno.apMaterno}</td>
          <td>${alumno.codigoEP}</td>
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
const btnsDelete = alumnosContainer.querySelectorAll(".btn-delete");
btnsDelete.forEach((btn) =>
btn.addEventListener("click", async (e) => {
  console.log(e.target.dataset.id);
  try {
      //borra el Alumno o manda mensaje aviso
      await deleteAlumno(e.target.dataset.id);
  } catch (error) {console.log(error);}
  })
);
// funcionalidad boton-editar
const btnsEdit = alumnosContainer.querySelectorAll(".btn-edit");
btnsEdit.forEach((btn) => {
btn.addEventListener("click", async (e) => {
  try {
  const doc = await getAlumno(e.target.dataset.id);
  const alumno = doc.data();
  // recuperamos al form todos los valores
  AlumnoForm["codigo"].value = alumno.codigo;
  AlumnoForm["nombres"].value = alumno.nombres;
  AlumnoForm["apellido-paterno"].value = alumno.apPaterno;
  AlumnoForm["apellido-materno"].value = alumno.apMaterno;
  AlumnoForm["codigo-ep"].value = alumno.codigoEP;
  AlumnoForm["codigo-tutor"].value = alumno.codTutor;
  AlumnoForm["descripcion"].value = alumno.descripcion;
  //mostramos mas???
  editStatus = true;
  id = doc.id;
  AlumnoForm["btn-alumno-form"].innerText = "Update";
  //actualiza
  } catch (error) {console.log(error);}
      });
  });
});
});

//funcionalidad subir a la nube
AlumnoForm.addEventListener("submit", async (e) => {
e.preventDefault();

const codigo = AlumnoForm["codigo"];
const nombres = AlumnoForm["nombres"];
const apPaterno = AlumnoForm["apellido-paterno"];
const apMaterno = AlumnoForm["apellido-materno"];
const codigoEP = AlumnoForm["codigo-ep"];
const codTutor = AlumnoForm["codigo-tutor"];
const descripcion = AlumnoForm["descripcion"];
//intenta hacer la peticion sin lanzar error y cerrar
try {
  if (!editStatus) {
      await saveAlumno(codigo.value, nombres.value, apPaterno.value, apMaterno.value, codigoEP.value
          , codTutor.value,descripcion.value);
  } else {
      await updateAlumno(id, {
          codigo: codigo.value,  
          nombres: nombres.value, 
          apPaterno: apPaterno.value, 
          apMaterno: apMaterno.value, 
          codigoEP: codigoEP.value, 
          codTutor: codTutor.value,
          descripcion:descripcion.value,
      })
      //regresa a estar vacio y poder usarla nuevamente
      editStatus = false;
      id = '';
      AlumnoForm['btn-alumno-form'].innerText = 'Save';
      }

  AlumnoForm.reset();
  codigo.focus(); // title.focus ??
  } catch (error) {console.log(error);}
});
