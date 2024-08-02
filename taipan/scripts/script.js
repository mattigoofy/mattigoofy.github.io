var team1Color = "#8f3f76";
var team2Color = "#6c9474";
var borderColor = "#ff4500";

//
// teamSwitch_handler
//
document.getElementById("teamSwitch").addEventListener('click', function(){
    if(document.getElementById("teamSwitch").innerHTML === "Team 1") {
        document.getElementById("teamSwitch").innerHTML = "Team 2";
        document.getElementById("teamSwitch").style.color = team2Color;
    } else {
        document.getElementById("teamSwitch").innerHTML = "Team 1";
        document.getElementById("teamSwitch").style.color = team1Color;
    }
})



//
// addButton_handler
//
document.getElementById("addButton").addEventListener('click', function(){
    var points = parseInt(document.getElementById("inputPoints").value);
    //console.log(scoreTeam1)
    if(!isNaN(points) && document.getElementById("teamSwitch").innerHTML === "Team 1") {
            scoreTeam1.push(scoreTeam1[scoreTeam1.length-1] + points);
            scoreTeam2.push(scoreTeam2[scoreTeam2.length-1] + (100 - points));
    } else if(!isNaN(points) && document.getElementById("teamSwitch").innerHTML === "Team 2"){
            scoreTeam1.push(scoreTeam1[scoreTeam1.length-1] + (100 - points));
            scoreTeam2.push(scoreTeam2[scoreTeam2.length-1] + points);
    } else {
        scoreTeam1.push(scoreTeam1[scoreTeam1.length-1]);
        scoreTeam2.push(scoreTeam2[scoreTeam2.length-1]);
    }
    
    // taipans
    var won = document.getElementById("taipanWon").checked? 1 : -1;
    for(let i=0; i<taipans.length; i++) {
        if(taipans.item(i).checked) {
            switch(i) {
                case 0:
                    scoreTeam1[scoreTeam1.length-1] += 100*won;
                    break;
                case 1:
                    scoreTeam2[scoreTeam2.length-1] += 100*won;
                    break;
                case 2:
                    scoreTeam1[scoreTeam1.length-1] += 200*won;
                    break;
                case 3:
                    scoreTeam2[scoreTeam2.length-1] += 200*won;
                    break;
            }
            break;
        }
    }
    
    // een en twee
    for(let i=0; i<eentwees.length; i++) {
        if(eentwees.item(i).checked) {
            if(i == 0) {
                scoreTeam1[scoreTeam1.length-1] += 200;
            } else {
                scoreTeam2[scoreTeam2.length-1] += 200;
            }
        }
    }
   
    scoreTeam1Div = document.getElementById("scoreTeam1");
    scoreTeam1Div.innerHTML = scoreTeam1Div.innerHTML + "<br>|<br>" + scoreTeam1[scoreTeam1.length-1];
    scoreTeam2Div = document.getElementById("scoreTeam2");
    scoreTeam2Div.innerHTML = scoreTeam2Div.innerHTML + "<br>|<br>" + scoreTeam2[scoreTeam2.length-1];
    
    // reset everything
    document.getElementById("inputPoints").value = "";
    for(let i=0; i<taipans.length; i++) {
        taipans.item(i).checked = false;
    }
    for(let i=0; i<eentwees.length; i++) {
        eentwees.item(i).checked = false;
    }
    document.getElementById("inputPoints").disabled = false;
    document.getElementById("taipanWon").checked = true;
    
    // round setting
    round = round == 0? 3 : round - 1;
    players[4] = round;
    localStorage.setItem("taipanPlayers", JSON.stringify(players));
    const names = document.getElementsByClassName("nameInputs");
    for(let i=0; i<names.length; i++) {
        if(i == round) {
            names.item(i).style.borderColor = borderColor;
            names.item(i).style.borderWidth = "5px";
        } else {
            names.item(i).style.borderColor = "black";
            names.item(i).style.borderWidth = "2px";
        }
    }
    
    var scores = document.getElementById("scores");
    scores.scrollTop = scores.scrollHeight;
    
    localStorage.setItem("taipanScoreTeam1", JSON.stringify(scoreTeam1));
    localStorage.setItem("taipanScoreTeam2", JSON.stringify(scoreTeam2));
    
    document.getElementById("backButton").innerHTML = "back";
    if(scoreTeam1[scoreTeam1.length-1] >= 1000 || scoreTeam2[scoreTeam2.length-1] >= 1000) {
        finishGame();
    }
})


//
// taipans_handlers
//
const taipans = document.getElementsByClassName("taipanInput");
for(let i=0; i<taipans.length; i++) {
    taipans[i].addEventListener('change', function(){onlyOneTaipanSelected(i);})
}

function onlyOneTaipanSelected(index) {
    for(let i=0; i<taipans.length; i++) {
        if(i != index) {
            taipans.item(i).checked = false;
            //alert(i)
        }
    }
}


//
// eentwee_handler
//
const eentwees = document.getElementsByClassName("1en2Input");
for(let i=0; i<eentwees.length; i++) {
    eentwees[i].addEventListener('change', function(){onlyOne1en2Selected(i)})
}

function onlyOne1en2Selected(index) {
    for(let i=0; i<eentwees.length; i++) {
        if(i != index) {
            eentwees.item(i).checked = false;
        }
    }
    if(eentwees.item(0).checked || eentwees.item(1).checked) {
        document.getElementById("inputPoints").disabled = true;
        document.getElementById("inputPoints").value = "";
    } else {
        document.getElementById("inputPoints").disabled = false;
    }
}


//
// endButton_handler
//
document.getElementById("endButton").addEventListener('click', finishGame);


//
// finishGame_functie
//
function finishGame() {
    if(scoreTeam1[scoreTeam1.length-1] == scoreTeam2[scoreTeam2.length-1]) {
        document.getElementById("winningTeam").innerHTML = "1&2";
    } else if(scoreTeam1[scoreTeam1.length-1] > scoreTeam2[scoreTeam2.length-1]) {
        document.getElementById("winningTeam").innerHTML = "1";
    } else {
        document.getElementById("winningTeam").innerHTML = "2";
    }
    document.getElementById("gameDone").style.display = "block";
    document.getElementById("finalScore").innerHTML = scoreTeam1[scoreTeam1.length-1] + " - " + scoreTeam2[scoreTeam2.length-1];
    document.getElementById("backButton").innerHTML = "Next to shuffle";
}

//
// newGame_handler
//
document.getElementById("newGame").addEventListener('click', function() {
    document.getElementById("scoreTeam1").innerHTML = "<b>Team 1</b>";
    document.getElementById("scoreTeam2").innerHTML = "<b>Team 2</b>";
    localStorage.removeItem("taipanScoreTeam1");
    localStorage.removeItem("taipanScoreTeam2");
    
    scoreTeam1 = [0];
    scoreTeam2 = [0];
    
    round = 0; 
    players = ["", "", "", "", round];
    localStorage.setItem("taipanPlayers", JSON.stringify(players));
    const names = document.getElementsByClassName("nameInputs");
    for(let i=0; i<names.length; i++) {
        names.item(i).value = players[i];
    }
    for(let i=0; i<names.length; i++) {
        if(i == round) {
            names.item(i).style.borderColor = borderColor;
            names.item(i).style.borderWidth = "5px";
        } else {
            names.item(i).style.borderColor = "black";
            names.item(i).style.borderWidth = "2px";
        }
    }
    
    document.getElementById("gameDone").style.display = "none";
})


//
// backButton_handler
//
document.getElementById("backButton").addEventListener('click', function() {
    document.getElementById("backButton").innerHTML = "Back";
    
    scoreTeam1Div = document.getElementById("scoreTeam1");
    var index1 = scoreTeam1Div.innerHTML.lastIndexOf('|');
    if(index1 != -1) {
        scoreTeam1Div.innerHTML = scoreTeam1Div.innerHTML.slice(0, index1 - 4);
        console.log(scoreTeam1Div.innerHTML)
        if(scoreTeam1Div.innerHTML.length < 14) {
            document.getElementById("backButton").innerHTML = "Next to shuffle";
        }
    } else {
        document.getElementById("backButton").innerHTML = "Next to shuffle";
    }
    
    scoreTeam2Div = document.getElementById("scoreTeam2");
    var index2 = scoreTeam2Div.innerHTML.lastIndexOf('|');
    scoreTeam2Div.innerHTML = index2!=-1? scoreTeam2Div.innerHTML.slice(0, index2 - 4): scoreTeam2Div.innerHTML;
    
    if(scoreTeam1.length != 1) {
        scoreTeam1.pop();
    }
    if(scoreTeam2.length != 1) {
        scoreTeam2.pop();
    }
    
    localStorage.setItem("taipanScoreTeam1", JSON.stringify(scoreTeam2));
    localStorage.setItem("taipanScoreTeam2", JSON.stringify(scoreTeam2));
    
    round = round == 3? 0 : round + 1;
    players[4] = round;
    localStorage.setItem("taipanPlayers", JSON.stringify(players));
    const names = document.getElementsByClassName("nameInputs");
    for(let i=0; i<names.length; i++) {
        if(i == round) {
            names.item(i).style.borderColor = borderColor;
            names.item(i).style.borderWidth = "5px";
        } else {
            names.item(i).style.borderColor = "black";
            names.item(i).style.borderWidth = "2px";
        }
    }
    
    document.getElementById("gameDone").style.display = "none";
})

/*document.getElementById("inputPoints").addEventListener('input', function(){
    var value = parseInt(document.getElementById("inputPoints").value);
    //console.log(document.getElementById("inputPoints").value)
    if(isNaN(value)) {
        //document.getElementById("inputPoints").value = parseInt(toString(document.getElementById("inputPoints").value).slice(0, -1));
        console.log(document.getElementById("inputPoints").value);
    }
})*/


//
// inputNames_handler
//
const names = document.getElementsByClassName("nameInputs");
for(let i=0; i<names.length; i++) {
    names.item(i).addEventListener('blur', ()=>{writePlayers(i)});
}

function writePlayers(i) {
    players[i] = names.item(i).value;
    localStorage.setItem("taipanPlayers", JSON.stringify(players));
    console.log(localStorage.getItem("taipanPlayers"));
}


//
// picture_handler
//
document.getElementById("logo").addEventListener('click', function() {
    var logo = document.getElementById("logo");
    if(logo.src.includes("taipan.jpg")) {
        logo.setAttribute("src", "tichu.jpg");
        document.getElementById("gameStyle").setAttribute("href", "styles/tichu.css");
        document.getElementById("table").innerHTML = document.getElementById("table").innerHTML.replaceAll("Taipan", "Tichu");
        document.getElementById("taipanWonLabel").innerHTML = document.getElementById("taipanWonLabel").innerHTML.replaceAll("Taipan", "Tichu");
    } else {
        logo.setAttribute("src", "taipan.jpg");
        document.getElementById("gameStyle").setAttribute("href", "styles/taipan.css");
        document.getElementById("table").innerHTML = document.getElementById("table").innerHTML.replaceAll("Tichu", "Taipan");
        document.getElementById("taipanWonLabel").innerHTML = document.getElementById("taipanWonLabel").innerHTML.replaceAll("Tichu", "Taipan");
    }
})