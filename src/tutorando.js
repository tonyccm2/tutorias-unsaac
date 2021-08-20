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
  
  const tutorandoForm = document.getElementById("Tutorando-form");
  const TutorandoSContainer = document.getElementById("Tutorando-container");
  
  let editStatus = false; // ????
  let id = '';
  
  /**
  * Save a New Task in Firestore
  * @param {string} title the title of the Task
  * @param {string} description the description of the Task
  ****************fin conexion a FIREBASE**************************************
  */
  /*                           INICIO                                */
  //guardar
  const saveTutorando = (codigo,nombres,apellido_paterno,apellido_materno,cod_cp,cod_tutor, descripcion) =>
  db.collection("tutorando").doc().set({
    codigo
    ,nombres
    ,apellido_paterno
    ,apellido_materno
    ,cod_cp
    ,cod_tutor
    ,descripcion,
  });
  //recupera las fichas
  const getTutorando = () => db.collection("tutorando").get();
  
  const onGetTutorando = (callback) => db.collection("tutorando").onSnapshot(callback);
  //borrar
  const deleteTutorando = (id) => db.collection("tutorando").doc(id).delete();
  //recupera 1 ficha por ID
  const getTutorando = (id) => db.collection("tutorando").doc(id).get();
  //actualiza
  const updateTutorando = (id, updatedTutorando) => db.collection('tutorando').doc(id).update(updatedTutorando);
  
  //******************************************************************/
  //ventanas y funcionalidades
  
  window.addEventListener("DOMContentLoaded", async (e) => {
    onGetTutorando((querySnapshot) => {
      tutorandosContainer.innerHTML = "";
  
      querySnapshot.forEach((doc) => {
        const tutorando = doc.data();
        // FRONT-END ?????????????
        tutorandosContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
      <h3 class="h5">${tutorando.codigo}</h3>
      <p>${tutorando.descripcion}</p>
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
      const btnsDelete = tutorandosContainer.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) =>
        btn.addEventListener("click", async (e) => {
          console.log(e.target.dataset.id);
          try {
              //borra la al tutorando o manda mensaje aviso
            await deleteTutorando(e.target.dataset.id);
          } catch (error) {
            console.log(error);
          }
        })
      );
        // funcionalidad boton-editar
      const btnsEdit = tutorandosContainer.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          try {
            const doc = await getFicha(e.target.dataset.id);
            const tutorando = doc.data();
            // recuperamos al form todos los valores
            tutorandoForm["tutorando-codigo"].value = tutorando.codigo;
            tutorandoForm["tutorando-nombres"].value = tutorando.nombres;
            tutorandoForm["tutorando-apellido_paterno"].value = tutorando.apellido_paterno;
            tutorandoForm["tutorando-apellido_materno"].value = tutorando.apellido_materno;
            tutorandoForm["tutorando-cod_cp"].value = tutorando.cod_cp;
            tutorandoForm["tutorando-cod_tutor"].value = tutorando.cod_tutor;
            tutorandoForm["tutorando-descripcion"].value = tutorando.descripcion;
            editStatus = true;
            id = doc.id;
            tutorandoForm["btn-tutorando-form"].innerText = "Update";
            //actualiza
          } catch (error) {
            console.log(error);
          }
        });
      });
    });
  });
  
  //funcionalidad subir a la nube
  tutorandoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const codigo = tutorandoForm["tutorando-codigo"];
    const nombres =   tutorandoForm["tutorando-nombres"];
    const apellido_paterno = tutorandoForm["tutorando-apellido_paterno"];
    const apellido_materno = tutorandoForm["tutorando-apellido_materno"];
    const cod_cp = tutorandoForm["tutorando-cod_cp"];
    const cod_tutor = tutorandoForm["tutorando-cod_tutor"];
    const descripcion = tutorandoForm["tutorando-descripcion"];
    //intenta hacer la peticion sin lanzar error y cerrar
    try {
      if (!editStatus) {
        await saveTutorando(codigo.value, nombres.value, apellido_paterno.value, apellido_materno.value, cod_cp.value, cod_tutor.value, descripcion.value);
      } else {
        await updateTutorando(id, {
          codigo: codigo.value,
          nombres: nombres.value,
          apellido_paterno: apellido_paterno.value,
          apellido_materno: apellido_materno.value,
          cod_cp: cod_cp.value,
          cod_tutor: cod_tutor.value,
          descripcion: descripcion.value
        })
        //regresa a estar vacio y poder usarla nuevamente
        editStatus = false;
        id = '';
        tutorandoForm['btn-tutorando-form'].innerText = 'Save';
      }
      
      tutorandoForm.reset();
      codigo.focus(); 
    } catch (error) {
      console.log(error);
    }
  });