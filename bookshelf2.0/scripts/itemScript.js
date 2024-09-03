// import { writeItem } from "./firebase";



document.getElementById("itemAddButton").addEventListener('click', function() {
    const button = document.getElementById("itemAddButton");

    switch(button.innerHTML) {
        case "ADD":
            document.getElementById("itemScreen").style.display = "none";
            var title = document.getElementById("itemTitleInput").value; 
            var regisseur = document.getElementById("itemRegisseurInput").value;
            var timesSeen = document.getElementById("itemSeenInput").value;   
            var playtime = document.getElementById("itemPlaytimeInput").value;
            var genres = [];
            document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
                if (checkbox.checked) {
                    genres.push(checkbox.value);
                }
            });
            var score = document.getElementById("itemScoreInput").value;
            var actors = document.getElementById("actorsInput").value;
            var extraInfo = document.getElementById("itemExtraInfoInput").value;

            var inGroup = document.getElementById("groupScreen").style.display != "none";
            console.log(document.getElementById("groupScreen").style.display);
            var groupTitle = null;
            if(inGroup) {
                groupTitle = document.getElementById("groupTitleInput").value;
                // firebase.writeItem(groupTitle, title, regisseur, timesSeen, playtime, selectedOptions, score, actors, extraInfo);
                itemsNotYetStored.push({groupTitle, title, regisseur, timesSeen, playtime, genres, score, actors, extraInfo});
                createDVDonShelf(false, groupTitle, title, title);
            } else {
                firebase.writeItem("", title, regisseur, timesSeen, playtime, genres, score, actors, extraInfo);
            }
            break;
        case "EDIT":
            disableAllInputs(false, "item");
            document.getElementById("itemAddButton").innerHTML = "SAVE";
            document.getElementById("deleteItemButton").style.display = "block";
            break;
        case "SAVE":
            disableAllInputs(true, "item");
            document.getElementById("itemAddButton").disabled = false;
            document.getElementById("itemAddButton").innerHTML = "EDIT";
            document.getElementById("deleteItemButton").style.display = "none";
            
            var title = document.getElementById("itemTitleInput").value; 
            var regisseur = document.getElementById("itemRegisseurInput").value;
            var timesSeen = document.getElementById("itemSeenInput").value;   
            var playtime = document.getElementById("itemPlaytimeInput").value;
            var genres = [];
            document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
                if (checkbox.checked) {
                    genres.push(checkbox.value);
                }
            });
            var score = document.getElementById("itemScoreInput").value;
            var actors = document.getElementById("actorsInput").value;
            var extraInfo = document.getElementById("itemExtraInfoInput").value;

            var inGroup = document.getElementById("groupScreen").style.display != "none";
            console.log(document.getElementById("groupScreen").style.display);
            var groupTitle = null;
            if(inGroup) {
                groupTitle = document.getElementById("groupTitleInput").value;
                firebase.writeItem(groupTitle, title, regisseur, timesSeen, playtime, genres, score, actors, extraInfo);
                // itemsNotYetStored.push({groupTitle, title, regisseur, timesSeen, playtime, genres, score, actors, extraInfo});
                // createDVDonShelf(false, groupTitle, title, title);
                // firebase.writeItem("", title, regisseur, timesSeen, playtime, genres, score, actors, extraInfo);
            } else {
                firebase.writeItem("", title, regisseur, timesSeen, playtime, genres, score, actors, extraInfo);
            }
            break;
    }
})

document.getElementById("deleteItemButton").addEventListener('click', function() {
    // var inGroup = document.getElementById("groupScreen").style.display != "none";
    // if(inGroup) {
    //     document.getElementById("moviesInGroup").innerHTML = "";
    // } else {
    //     for(let i=0; i<=currentShelf; i++) {
    //         console.log(i)
    //         document.getElementById("books" + i).innerHTML = "";
    //     }
    // }
    title = document.getElementById("itemTitleInput").value;
    firebase.deleteNode(title);
    document.getElementById("itemScreen").style.display = "none";
    document.getElementById("deleteItemButton").style.display = "none";
})



// 
// dropdown logic
// 
function updateButtonText() {
    const selectedOptions = [];
    document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            selectedOptions.push(checkbox.value);
        }
    });
    if (selectedOptions.length > 0) {
        document.getElementById('dropdownButton').textContent = selectedOptions.join(', ');
    } else {
        document.getElementById('dropdownButton').textContent = 'Options ▼';
    }
}




// 
// adding_dvd_to_shelf
// 
function createDVDonShelf(isGroup, groupTitle, title, key) {
    var dvds = document.getElementsByClassName("dvd");
    if(dvds.length > 0){
        var shelf = document.getElementById("books" + currentShelf).getBoundingClientRect();
        var lastDVD = dvds.item(dvds.length - 1).getBoundingClientRect();
        if((shelf.x + shelf.width) - (lastDVD.x + lastDVD.width) < lastDVD.width) {
            currentShelf++;
            if(currentShelf >= amountOfStartingSHelfs) {
                createShelfs();
            }
        }
    }

    if(isGroup) {
        var dvd = document.createElement("div")
        dvd.className = "dvd groupdvd";
        dvd.innerHTML = title;
        dvd.addEventListener('click', function() {
            document.getElementById("groupTitleInput").value = title;
            document.getElementById("groupScreen").style.display = "flex";
            disableAllInputs(true, "group");
            document.getElementById("groupAddButton").disabled = false;
            document.getElementById("groupAddButton").innerHTML = "EDIT";

            firebase.readGroup(key);
        })
        
        document.getElementById("books" + currentShelf).appendChild(dvd);

    } else {
        if(groupTitle != null) {
            var dvd = document.createElement("div")
            dvd.className = "dvdInGroup";
            dvd.innerHTML = title;
            dvd.addEventListener('click', function() {
                document.getElementById("itemTitleInput").value = title;
                document.getElementById("itemScreen").style.display = "flex";
                disableAllInputs(true, "item");
                document.getElementById("itemAddButton").disabled = false;
                document.getElementById("itemAddButton").innerHTML = "EDIT";

                firebase.readItem(groupTitle + "/" + key)
            })

            document.getElementById("moviesInGroup").appendChild(dvd);
            
        } else {
            var dvd = document.createElement("div")
            dvd.className = "dvd";
            dvd.innerHTML = title;
            dvd.addEventListener('click', function() {
                document.getElementById("itemTitleInput").value = title;
                document.getElementById("itemScreen").style.display = "flex";
                disableAllInputs(true, "item");
                document.getElementById("itemAddButton").disabled = false;
                document.getElementById("itemAddButton").innerHTML = "EDIT";

                firebase.readItem(key);
            })

            document.getElementById("books" + currentShelf).appendChild(dvd);
        }
    }
}


function disableAllInputs(yes, screen) {
    const itemScreen = document.getElementById(screen + 'Screen');

    // Select all input elements and disable them
    if(screen == "item") {
        const inputs = itemScreen.querySelectorAll('input');
        inputs.forEach(input => input.disabled = yes);
    } else {
        document.getElementById("groupTitleInput").disabled = yes;
        document.getElementById("groupRegisseurInput").disabled = yes;
    }

    // Select all buttons and disable them
    const buttons = itemScreen.querySelectorAll('button');
    buttons.forEach(button => button.disabled = yes);
    document.getElementById(screen + "AddButton").disabled = false;
    closeButtons[0].disabled = false;
    closeButtons[1].disabled = false;

    // Select all textareas and disable them
    const textareas = itemScreen.querySelectorAll('textarea');
    textareas.forEach(textarea => textarea.disabled = yes);

    // Select all select elements and disable them (if you have any dropdowns)
    const selects = itemScreen.querySelectorAll('select');
    selects.forEach(select => select.disabled = yes);
}



//
// scoreInput_checking
//
document.getElementById("itemScoreInput").addEventListener('keyup', function(){
    const element = document.getElementById("itemScoreInput");
    var max_chars = 1;
        
    if(element.value.length > max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
    if(element.value > "5") {
        element.value = "5";
    }
})



// function addInfoToItem(key) {
//     if(key != "") {
//         // firebase
//     } else {
//         document.getElementById("itemTitleInput").value = ""; 
//         document.getElementById("itemRegisseurInput").value = "";
//         document.getElementById("itemSeenInput").value = "0";   
//         document.getElementById("itemPlaytimeInput").value = "";
//         document.getElementById("dropdownButton").value = "Options ▼";
//         document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
//             checkbox.cheked = false;
//         });
//         document.getElementById("itemScoreInput").value = "";
//         document.getElementById("actorsInput").value = "";
//         document.getElementById("itemExtraInfoInput").value = "";
//     }
// }