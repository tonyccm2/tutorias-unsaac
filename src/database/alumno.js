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
const alumnosContainer = document.getElementById("Lista-alumnos");

let editStatus = false;
let id = '';

/**
* Save a New Task in Firestore
* @param {string} title the title of the Task
* @param {string} description the description of the Task
*/
const saveAlumno = (codigo,nombres,apPaterno,apMaterno,
  codigoEP,codTutor,descripcion) =>
db.collection("Alumno").doc().set({
codigo
,nombres
,apPaterno
,apMaterno
,codigoEP
,codTutor
,descripcion
});
//recupera los Alumno
const getAlumnos = () => db.collection("Alumno").get();

const onGetAlumno = (callback) => db.collection("Alumno").onSnapshot(callback);
//borrar
const deleteAlumno = (id) => db.collection("Alumno").doc(id).delete();
//recupera 1 Alumno por ID
const getAlumno = (id) => db.collection("Alumno").doc(id).get();
//actualiza
const updateAlumno = (id, updatedAlumno) => db.collection('Alumno').doc(id).update(updatedAlumno);

//******************************************************************/
//ventanas y funcionalidades

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetAlumno((querySnapshot) => {
      alumnosContainer.innerHTML = "";
      querySnapshot.forEach((doc) => {
      const alumno = doc.data();
      // FRONT-END ?????????????
      alumnosContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
      <h3 class="h5">${alumno.codigo}</h3>
      <p>${alumno.nombres}</p>
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
  AlumnoForm["codigo-alumno"].value = alumno.codigo;
  AlumnoForm["nombres-alumno"].value = alumno.nombres;
  AlumnoForm["apPaterno-alumno"].value = alumno.apPaterno;
  AlumnoForm["apMaterno-alumno"].value = alumno.apMaterno;
  AlumnoForm["codigoEP-alumno"].value = alumno.codigoEP;
  AlumnoForm["codTutor-alumno"].value = alumno.codTutor;
  AlumnoForm["descripcion-alumno"].value = alumno.descripcion;
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

const codigo = AlumnoForm["codigo-alumno"];
const nombres = AlumnoForm["nombres-alumno"];
const apPaterno = AlumnoForm["apPaterno-alumno"];
const apMaterno = AlumnoForm["apMaterno-alumno"];
const codigoEP = AlumnoForm["codigoEP-alumno"];
const codTutor = AlumnoForm["codTutor-alumno"];
const descripcion = AlumnoForm["descripcion-alumno"];
//intenta hacer la peticion sin lanzar error y cerrar
try {
  if (!editStatus) {
      await saveAlumno(codigo.value, nombres.value, apPaterno.value, apMaterno.value, codigoEP.value
          ,codigoEP.value, codTutor.value,descripcion.value);
  } else {
      await updateAlumno(id, {
          codigo: codigo.value,  
          nombre: nombres.value, 
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
