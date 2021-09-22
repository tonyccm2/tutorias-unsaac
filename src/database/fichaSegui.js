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

const fichaForm = document.getElementById("my-form");//fichaSegui-form
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
const saveFicha = (cod,name,nd_name,st_name,cod_school,cod_tutor,description) =>
db.collection("fichaSegui").doc().set({// actualizado con "Ficha Seguimiento.html 
  cod
  ,name
  ,nd_name
  ,st_name
  ,cod_school
  ,cod_tutor
  ,description
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
      // FRONT-END ?????????????  // actualizado cod y description de .html
      fichasContainer.innerHTML += `<div class="card">
    <h3 class="h5">${ficha.cod}</h3>
    <p>${ficha.description}</p>
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
          //_____ Nos basamos en "Ficha Seguimiento.html"_______
          // recuperamos al form todos los valores
          //                    
          fichaForm["cod"].value = ficha.cod;
          fichaForm["name"].value = ficha.name;
          fichaForm["nd_name"].value = ficha.nd_name;
          fichaForm["st_name"].value = ficha.st_name;
          fichaForm["cod_school"].value = ficha.cod_school;
          fichaForm["cod_tutor"].value = ficha.cod_tutor;
          fichaForm["description"].value = ficha.description;
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

  const cod = fichaForm["cod"];
  const name =   fichaForm["name"];
  const nd_name = fichaForm["nd_name"];
  const st_name = fichaForm["st_name"];
  const cod_school = fichaForm["cod_school"];
  const cod_tutor = fichaForm["cod_tutor"];
  const description = fichaForm["description"];
  //intenta hacer la peticion sin lanzar error y cerrar
  try {
    if (!editStatus) {
      await saveFicha(cod.value, name.value, nd_name.value, st_name.value, cod_school.value
          , cod_tutor.value, description.value,);
    } else {
      await updateFicha(id, {// actualizado con los ID de "Ficha Seguimiento.html"
        cod: cod.value,
        name: name.value,
        nd_name: nd_name.value,
        st_name: st_name.value,
        cod_school: cod_school.value,
        cod_tutor: cod_tutor.value,
        description: description.value,
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