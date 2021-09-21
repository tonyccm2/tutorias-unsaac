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
  

  const TutorandoContainer = document.getElementById("tabla-alumnos");
  
  /**
  * Save a New Task in Firestore
  * @param {string} title the title of the Task
  * @param {string} description the description of the Task
  ****************fin conexion a FIREBASE**************************************
  */
  
  //recupera las fichas
  const getTutorandos = () => db.collection("alumnos").get();
  
  const onGetTutorando = (callback) => db.collection("alumnos").onSnapshot(callback);
  //recupera 1 ficha por ID
  const getTutorando = (id) => db.collection("alumnos").doc(id).get();
  
  //******************************************************************/
  //ventanas y funcionalidades
  
  window.addEventListener("DOMContentLoaded", async (e) => {
    onGetTutorando((querySnapshot) => {
      TutorandoContainer.innerHTML = "";
  
      querySnapshot.forEach((doc) => {
        const tutorando = doc.data();
        // FRONT-END ?????????????
        if (tutorando.codTutor == "0001")
        {
          TutorandoContainer.innerHTML += `<tbody>
                <li><tr *ngFor="let tarjeta of listTarjetas" class="card card-body mt-2 border-primary">
                    <td>${tutorando.codigo}</td>
                    <td>${tutorando.nombres}</td>
                    <td>${tutorando.apPaterno}</td>
                    <td>${tutorando.apMaterno}</td>
                    <td>${tutorando.codigoEP}</td>
                    <td>${tutorando.descripcion}</td>
                    <td>
                        <i (click)="editarAlumno(Alumno)" class="far fa-edit text-info"></i>
                    </td>
                </tr></li>                                                    
            </tbody>`;
          }
        });
      });
  });
  