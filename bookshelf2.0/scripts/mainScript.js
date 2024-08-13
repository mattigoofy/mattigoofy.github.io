const firebase = {};
var currentItems = "movies";

var itemsNotYetStored = [];

const amountOfStartingSHelfs = 4;
var currentShelf = 0;

var amountOfShelfs = 1;
function createShelfs() {
    var shelf = document.createElement("div");
    shelf.className = "shelf";

    var books = document.createElement("div");
    books.className = "books"
    books.id = "books" + amountOfShelfs;
    amountOfShelfs++;

    document.getElementById("case").appendChild(shelf);
    document.getElementById("case").appendChild(books);

    if(amountOfShelfs == 5) {
        document.getElementById("case").className = "caseLotsOfShelfs";
    }
}

for(let i=0; i<amountOfStartingSHelfs-1; i++) {
    createShelfs();
}



// 
// add buttons
// 
document.getElementById("addItem").addEventListener('click', function(){
    disableAllInputs(false, "item")
    document.getElementById("itemScreen").style.display = "flex";
    document.getElementById("itemAddButton").innerHTML = "ADD";
    firebase.readItem(null, false);
})

document.getElementById("addGroup").addEventListener('click', function(){
    disableAllInputs(false, "group")
    document.getElementById("groupScreen").style.display = "flex";
    document.getElementById("groupAddButton").innerHTML = "ADD";
    firebase.readGroup(null);
})


// 
// close buttons
// 
const closeButtons = document.getElementsByClassName("closeButton");
closeButtons[0].addEventListener('click', function() {
    document.getElementById("groupScreen").style.display = "none";
    document.getElementById("deleteGroupButton").style.display = "none";
    itemsNotYetStored = [];
})
closeButtons[1].addEventListener('click', function() {
    document.getElementById("itemScreen").style.display = "none";
    document.getElementById("deleteItemButton").style.display = "none";
})



// 
// button to add or remove watched
// 
const watchedInput = document.getElementById("itemSeenInput");
document.getElementById("seenMinus").addEventListener('click', function(){
    if(watchedInput.value != 0) {
        watchedInput.value--;
    }
})
document.getElementById("seenPlus").addEventListener('click', function(){
    watchedInput.value++;
})



// 
// logout button
// 
document.getElementById("logoutButton").addEventListener('click', function() {
    firebase.logout();
})



//
// key events
//
document.addEventListener('keydown', function(e) {
    // console.log(e.key);
    switch(e.key) {
        case "Escape":
            if(document.getElementById("itemScreen").style.display == "none") {
                document.getElementById("groupScreen").style.display = "none";
            } else {
                document.getElementById("itemScreen").style.display = "none";
            }
    }
})