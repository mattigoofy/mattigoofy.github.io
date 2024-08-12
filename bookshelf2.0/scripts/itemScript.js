var currentShelf = 0;


document.getElementById("itemAddButton").addEventListener('click', function() {
    const button = document.getElementById("itemAddButton");

    switch(button.innerHTML) {
        case "ADD":
            document.getElementById("itemScreen").style.display = "none";
            var title = document.getElementById("itemTitleInput").value; 
            var regisseur = document.getElementById("itemRegisseurInput").value;
            var timesSeen = document.getElementById("itemSeenInput").value;   
            var playtime = document.getElementById("itemPlaytimeInput").value;
            var selectedOptions = [];
            document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
                if (checkbox.checked) {
                    selectedOptions.push(checkbox.value);
                }
            });
            var score = document.getElementById("itemScoreInput").value;
            var actors = document.getElementById("actorsInput").value;
            var extraInfo = document.getElementById("itemExtraInfoInput").value;
            var inGroup = document.getElementById("groupScreen").style.display != "none";
            console.log(document.getElementById("groupScreen").style.display)
            createDVDonShelf(false, inGroup, title);
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
            break;
    }
})

document.getElementById("deleteItemButton").addEventListener('click', function() {
    var inGroup = document.getElementById("groupScreen").style.display != "none";
    if(inGroup) {
        document.getElementById("moviesInGroup").innerHTML = "";
    } else {
        for(let i=0; i<=currentShelf; i++) {
            console.log(i)
            document.getElementById("books" + i).innerHTML = "";
        }
    }
    document.getElementById("itemScreen").style.display = "none";
    document.getElementById("deleteItemButton").style.display = "none";
})


// 
// dropdown logic
// 
function updateButtonText() {
    console.log("hello");
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
function createDVDonShelf(isGroup, inGroup, title) {
    var shelf = document.getElementById("books" + currentShelf).getBoundingClientRect();
    var dvds = document.getElementsByClassName("dvd");
    var lastDVD = dvds.item(dvds.length - 1).getBoundingClientRect();
    if((shelf.x + shelf.width) - (lastDVD.x + lastDVD.width) < lastDVD.width) {
        currentShelf++;
        if(currentShelf >= amountOfStartingSHelfs) {
            createShelfs();
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
        })
        
        document.getElementById("books" + currentShelf).appendChild(dvd);

    } else {
        if(inGroup) {
            var dvd = document.createElement("div")
            dvd.className = "dvdInGroup";
            dvd.innerHTML = title;
            dvd.addEventListener('click', function() {
                document.getElementById("itemTitleInput").value = title;
                document.getElementById("itemScreen").style.display = "flex";
                disableAllInputs(true, "item");
                document.getElementById("itemAddButton").disabled = false;
                document.getElementById("itemAddButton").innerHTML = "EDIT";
            })

            document.getElementById("moviesInGroup").appendChild(dvd);
            
        }else {
            var dvd = document.createElement("div")
            dvd.className = "dvd";
            dvd.innerHTML = title;
            dvd.addEventListener('click', function() {
                document.getElementById("itemTitleInput").value = title;
                document.getElementById("itemScreen").style.display = "flex";
                disableAllInputs(true, "item");
                document.getElementById("itemAddButton").disabled = false;
                document.getElementById("itemAddButton").innerHTML = "EDIT";
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


function addInfoToItem(key) {
    if(key != "") {
        // firebase
    } else {
        document.getElementById("itemTitleInput").value = ""; 
        document.getElementById("itemRegisseurInput").value = "";
        document.getElementById("itemSeenInput").value = "0";   
        document.getElementById("itemPlaytimeInput").value = "";
        document.getElementById("dropdownButton").value = "Options ▼";
        document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
            checkbox.cheked = false;
        });
        document.getElementById("itemScoreInput").value = "";
        document.getElementById("actorsInput").value = "";
        document.getElementById("itemExtraInfoInput").value = "";
    }
}