/*const {app, BrowserWindow, Menu} = require('electron');
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
 */ 
test('ventana agregar alumno', () => {
    expect(functions.isNull()).toBeNull();
});
test('Editar Alumno', () => {
    const load1 = 78787878787878789491321315313553453435435;
    const load2 = 343547354735735715671657165716571657146271651765;
    expect(load1 - load2).toBeLessThan(1600);
});
test('ventana agregar Docente', () => {
    expect(functions.checkValue(null)).toBeFalsy();
});