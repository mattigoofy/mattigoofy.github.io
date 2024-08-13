// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, onValue, set, update, remove  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
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
var basicPath;

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
// write_item_function
//
export function writeItem(relativePath, title, regisseur, timesWatched, playtime, genres, score, actors, extraInfo) {
    set(ref(db, basicPath + "/" + relativePath + "/" + title), {
        title: title,
        regisseur: regisseur,
        timesWatched: timesWatched,
        playtime: playtime,
        genres: genres,
        score: score,
        actors: actors,
        extraInfo: extraInfo
    })
}


// 
// write_group_function
// 
export function writeGroup(relativePath, title, regisseur, extraInfo, itemsNotYetStored) {
    itemsNotYetStored.forEach(item => {
        writeItem(relativePath + "/" + title, item.title, item.regisseur, item.timesSeen, item.playtime, item.genres, item.score, item.actors, item.extraInfo);
    })
    update(ref(db, basicPath + "/" + relativePath + "/" + title), {
        groupTitle: title,
        groupRegisseur: regisseur,
        groupInfo: extraInfo
    });
}



// 
// updateShelfs
// 
function updateShelfs() {
    onValue(ref(db, basicPath), (snapchot) => {
        for(let i=0; i<=currentShelf; i++) {
            document.getElementById("books" + i).innerHTML = "";
        }
        currentShelf = 0;

        snapchot.forEach(item => {
            // console.log(item.val().score);
            if(item.val().score == undefined) {
                createDVDonShelf(true, null, item.val().groupTitle, item.val().groupTitle);
            } else {
                createDVDonShelf(false, null, item.val().title, item.val().title);
            }
        })
    })
}



//
// read_items
//
export function readItem(path) {
    if(path != null) {
        onValue(ref(db, basicPath + "/" + path), (snapchot) => {
            document.getElementById("itemTitleInput").value = snapchot.val().title; 
            document.getElementById("itemRegisseurInput").value = snapchot.val().regisseur;
            document.getElementById("itemSeenInput").value = snapchot.val().timesWatched;   
            document.getElementById("itemPlaytimeInput").value = snapchot.val().playtime;
            if(snapchot.val().genres != undefined) {
                document.getElementById("dropdownButton").innerHTML = snapchot.val().genres.join(', ');
                document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
                    if (snapchot.val().genres.includes(checkbox.value)) {
                        checkbox.checked = true;
                    } else {
                        checkbox.checked = false;
                    }
                });
            }
            document.getElementById("itemScoreInput").value = snapchot.val().score;
            document.getElementById("actorsInput").value = snapchot.val().actors;
            document.getElementById("itemExtraInfoInput").value = snapchot.val().extraInfo;     
        })
    } else {
        document.getElementById("itemTitleInput").value = ""; 
        document.getElementById("itemRegisseurInput").value = "";
        document.getElementById("itemSeenInput").value = "0";   
        document.getElementById("itemPlaytimeInput").value = "";
        document.getElementById("dropdownButton").innerHTML = "Options ▼";
        document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.getElementById("itemScoreInput").value = "";
        document.getElementById("actorsInput").value = "";
        document.getElementById("itemExtraInfoInput").value = "";
    }
}



// 
// readGroup
// 
export function readGroup(key) {
    if(key != null) {
        onValue(ref(db, basicPath + "/" + key), (snapchot) => { 
            document.getElementById("groupTitleInput").value = snapchot.val().groupTitle; 
            document.getElementById("groupRegisseurInput").value = snapchot.val().groupRegisseur;
            document.getElementById("groupExtraInfoInput").value = snapchot.val().groupInfo;
            document.getElementById("moviesInGroup").innerHTML = "";

            var averageScore = 0;
            var genres = [];
            var totalTimesSeen = 0;
            var totalPlaytime = 0;
            var counter = 0;
            document.getElementById("moviesInGroup").innerHTML = "";
            snapchot.forEach(item => {
                if(item.val().title != null){
                    createDVDonShelf(false, snapchot.val().groupTitle, item.val().title, item.val().title);
                    averageScore += parseInt(item.val().score);
                    item.val().genres.forEach(genre => {
                        if(!genres.includes(genre)) {
                            genres.push(genre);
                        }
                    })
                    totalTimesSeen += parseInt(item.val().timesWatched);
                    totalPlaytime += parseInt(item.val().playtime == ""? 0: item.val().playtime);
                    counter++;
                }
            })
            if(counter > 0) {
                averageScore /= counter;
                totalTimesSeen = Math.floor(totalTimesSeen/counter);
            }

            document.getElementById("groupSeenInput").value = totalTimesSeen;   
            document.getElementById("groupPlaytimeInput").value = totalPlaytime;
            document.getElementById("groupGenres").innerHTML = genres.lenth > 0? genres.join(", "): "None";
            document.getElementById("groupScoreInput").value = averageScore;
        })
    } else {
        document.getElementById("groupTitleInput").value = ""; 
        document.getElementById("groupRegisseurInput").value = "";
        document.getElementById("groupSeenInput").value = "0";   
        document.getElementById("groupPlaytimeInput").value = "";
        document.getElementById("groupGenres").innerHTML = "None";
        document.getElementById("groupScoreInput").value = "";
        document.getElementById("groupExtraInfoInput").value = "";
        document.getElementById("moviesInGroup").innerHTML = "";
    }
}


// 
// delete_Node
// 
export function deleteNode(path) {
    // var ref = ref(db, basicPath + "/" + path);
    // remove(ref);
    console.log(basicPath + "/" + path)
    remove( ref(db, basicPath + "/" + path) );
}



// 
// edit_item
// 
// export function editItem() {

// }




//
// check if he is inside
// 
function imInside() {
    auth.onAuthStateChanged(async function() {
        document.body.style.visibility = "visible";
        if(auth.currentUser != null){
            basicPath = auth.currentUser.uid + "/" + currentItems;
            updateShelfs();
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