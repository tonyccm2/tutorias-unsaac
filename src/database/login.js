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

const formLoginAdmin        = document.querySelector('#formLoginAdmin')
const formNameAdmin         = document.querySelector('#nameAdmin')
const formPasswordAdmin     = document.querySelector('#passwordAdmin')

const formLoginDocente      = document.querySelector('#formLoginDocente')
const formNameDocente       = document.querySelector('#nameDocente')
const formPasswordDocente   = document.querySelector('#passwordDocente')

formLoginAdmin.addEventListener('submit', async e => {
    e.preventDefault();
    const admin = {
        name: formNameAdmin.value,
        password: formPasswordAdmin.value,
    }
    try {
        if(admin.name !== ''){
            const document = {
                name: '',
                password: '',
            }
            const collectionAdmin = await db.collection("admin").get().then((querySnapshot) => {
                console.log(querySnapshot);
                querySnapshot.forEach((doc) => {
                    if(doc.data().name === admin.name){
                        document.name = doc.data().name
                        document.password = doc.data().password
                    }
                });
            });
            if(document.name === ''){
                alert("ERROR: No existe administrador");
            }else{
                if(document.password === admin.password){
                    console.log("password correcto");
                    window.location="../admin/admin.html"; 
                }else{
                    alert("ERROR: Error en contraseña");
                }
            }
        }else{
            alert("ERROR: Campo nombre está vacío");
        }
        
    } catch (error) {
        console.log('Error encontrado: ',error);
    }

    formLoginAdmin.reset();
});


//login para docentes

formLoginDocente.addEventListener('submit', async e => {
    e.preventDefault();
    const docente = {
        name: formNameDocente.value,
        password: formPasswordDocente.value,
    }
    try {
        if(docente.name !== ''){
            const document = {
                name: '',
                password: '',
            }
            const collectionDocente = await db.collection("docentes").get().then((querySnapshot) => {
                console.log(querySnapshot);
                querySnapshot.forEach((doc) => {
                    if(doc.data().codigo === docente.name){
                        document.name = doc.data().codigo
                        document.password = doc.data().password
                    }
                });
            });
            if(document.name === ''){
                alert("ERROR: No existe docente");
            }else{
                if(document.password === docente.password){
                    console.log("password correcto");
                    window.location="../tutorandos/tutorandos.html"; 
                    
                }else{
                    alert("ERROR: Error en contraseña");
                }
            }
        }else{
            alert("ERROR: Campo nombre está vacío");
        }
        
    } catch (error) {
        console.log('Error encontrado: ',error);
    }

    formLoginAdmin.reset();
});
