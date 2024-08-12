document.getElementById("addMoviesToGroupButton").addEventListener('click', function() {
    disableAllInputs(false, "item");
    document.getElementById("itemScreen").style.display = "flex";
    document.getElementById("itemAddButton").innerHTML = "ADD";
    addInfoToItem("");
})

document.getElementById("groupAddButton").addEventListener('click', function() {
    const button = document.getElementById("groupAddButton");

    switch(button.innerHTML) {
        case "ADD":
            document.getElementById("groupScreen").style.display = "none";
            var title = document.getElementById("groupTitleInput").value; 
            var regisseur = document.getElementById("groupRegisseurInput").value;
            var extraInfo = document.getElementById("groupExtraInfoInput").value;
            createDVDonShelf(true, false, title);
            break;
        case "EDIT":
            disableAllInputs(false, "group");
            document.getElementById("groupAddButton").innerHTML = "SAVE";
            document.getElementById("deleteGroupButton").style.display = "block";
            break;
        case "SAVE":
            disableAllInputs(true, "group");
            document.getElementById("groupAddButton").disabled = false;
            document.getElementById("groupAddButton").innerHTML = "EDIT";
            document.getElementById("deleteGroupButton").style.display = "none";
            break;
    }

})



document.getElementById("deleteGroupButton").addEventListener('click', function() {
    for(let i=0; i<=currentShelf; i++) {
        console.log(i)
        document.getElementById("books" + i).innerHTML = "";
    }
    document.getElementById("groupScreen").style.display = "none";
    document.getElementById("deleteGroupButton").style.display = "none";
})





function addInfoToGroup(key) {
    if(key != "") {
        // firebase
    } else {
        document.getElementById("groupTitleInput").value = ""; 
        document.getElementById("groupRegisseurInput").value = "";
        document.getElementById("groupSeenInput").value = "";   
        document.getElementById("groupPlaytimeInput").value = "";
        document.getElementById("groupGenres").value = "None";
        document.getElementById("groupScoreInput").value = "";
        document.getElementById("groupExtraInfoInput").value = "";
        document.getElementById("moviesInGroup").innerHTML = "";
    }
}