// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, onValue  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
// import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAcGlbBk1PRK8HmbYYegIXIW-YNiBJOE38",
    authDomain: "bookshelf2-64b37.firebaseapp.com",
    projectId: "bookshelf2-64b37",
    storageBucket: "bookshelf2-64b37.appspot.com",
    messagingSenderId: "505313049232",
    appId: "1:505313049232:web:8a9046765b84d663b87615",
    databaseURL: "https://bookshelf2-64b37-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
const genreRef = ref(db, 'genres/' + currentItems);

imInside();


// 
// signin
// 
export function signin(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        console.log(user);

        imInside();
    })
    .catch((error) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
            alert(`Email address ${email} already in use.`);
            break;
            case 'auth/invalid-email':
            alert(`Email address ${email} is invalid.`);
            break;
            case 'auth/operation-not-allowed':
            alert(`Error during sign up.`);
            break;
            case 'auth/weak-password':
            alert('Password is not strong enough. Add additional characters including special characters and numbers.');
            break;
            default:
            console.log(error.message);
            alert("something went wrong, try again")
            break;
        }
    });
}



// 
// login
//
export function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Logged in 
        var user = userCredential.user;
        console.log(user);

        imInside();
    })
    .catch((error) => {
        switch (error.code) {
            case 'auth/invalid-password':
            alert(`Wrong password, try again.`);
            break;
            case 'auth/invalid-email':
            alert(`Email address ${email} is invalid.`);
            break;
            case 'auth/invalid-credential':
            alert(`Do you already have an account? if no try signing up :)`);
            break;
            case 'auth/operation-not-allowed':
            alert(`Error during sign up.`);
            break;
            case 'auth/auth/user-not-found':
            alert('Do you already have an account? if no try signing up :)');
            break;
            default:
            console.log(error.message);
            alert("Something went wrong, try again")
            break;
        }
    })
}



//
// logout_function
// 
export function logout() {
    auth.signOut();
    location.reload();
}



//
// check if he is inside
// 
function imInside() {
    auth.onAuthStateChanged(async function() {
        document.body.style.visibility = "visible";
        if(auth.currentUser != null){
            document.getElementById("login-screen").style.display = "none";
            onValue(genreRef, (snapchot) => {
                snapchot.forEach(genre => {
                    var lbl = document.createElement("label");
                    var input = document.createElement("input");
                    input.setAttribute('type', "checkbox");
                    input.setAttribute('value', genre.val());
                    input.addEventListener('change', updateButtonText);

                    lbl.appendChild(input);
                    lbl.appendChild(document.createTextNode(genre.val()));
                    document.getElementById("genreSelect").appendChild(lbl);
                });
            })
        }
    })
}