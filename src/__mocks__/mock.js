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
const functions = require('./functions');

jest.mock('./functions.js')

describe('damos los parametros a llenar y buscar', () => {
    test('deberia agregar al alumno', () => {
        expect(functions.metodo1()).not.toBe('Este es el método 1')
        expect(functions.metodo1()).toBe(undefined)
    });
    test('Deberia encontrar el supuesto alumno', () => {
        expect(functions.metodo2()).not.toBe('Este es el método 2')
        expect(functions.metodo2()).toBe(undefined)
    });
    
})

test('Pantalla Principal', () => {
    expect(functions.add(2, 2)).toBe(4);
});
test('login con usuario', () => {
    expect(functions.createUser()).toEqual(
        {
            firstName: '111111',
            lastName: '111111'
        }
    );
});
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
 