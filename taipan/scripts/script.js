/*var scoreTeam1 = [0];
var scoreTeam2 = [0];*/
var round = 0;


/*scoreTeam1Div = document.getElementById("scoreTeam1");
scoreTeam1Div.innerHTML = localStorage.getItem("taipanScoreTeam1") != null? localStorage.getItem("taipanScoreTeam1"): "<b>Team 1</b>";
scoreTeam2Div = document.getElementById("scoreTeam2");
scoreTeam2Div.innerHTML = localStorage.getItem("taipanScoreTeam2") != null? localStorage.getItem("taipanScoreTeam2"): "<b>Team 2</b>";
*/

console.log(localStorage.getItem("taipanScoreTeam1"));
//var scoreTeam1 = localStorage.getItem("taipanScoreTeam1") != null? JSON.parse(localStorage.getItem("taipanScoreTeam1")): [0];
//var scoreTeam2 = localStorage.getItem("taipanScoreTeam2") != null? JSON.parse(localStorage.getItem("taipanScoreTeam2")): [0];
//var scoreTeam1 = localStorage.getItem("taipanScoreTeam1") != null? localStorage.getItem("taipanScoreTeam1"): [0];
//var scoreTeam2 = localStorage.getItem("taipanScoreTeam2") != null? localStorage.getItem("taipanScoreTeam2"): [0];
//console.log(JSON.parse(scoreTeam1))
//scoreTeam1 = JSON.parse(scoreTeam1);
//scoreTeam2 = JSON.parse(scoreTeam2);
var scoreTeam1 = localStorage.getItem("taipanScoreTeam1");
/*if(scoreTeam1 != null) {
    scoreTeam1 = JSON.parse(scoreTeam1);
    //scoreTeam1 = JSON.parse("Tzam 1<br> bla blz bkzzzz")
} else {
    scoreTeam1 = [0];
}*/
try {
    if(scoreTeam1 == null) {
        throw "null";
    } else {
        scoreTeam1 = JSON.parse(scoreTeam1);
    }
} catch(e) {
    scoreTeam1 = [0];
}
var scoreTeam2 = localStorage.getItem("taipanScoreTeam2");
/*if(scoreTeam2 != null) {
    scoreTeam2 = JSON.parse(scoreTeam2);
} else {
    scoreTeam2 = [0];
}*/
try {
    if(scoreTeam2 == null) {
        throw "null";
    } else {
        scoreTeam2 = JSON.parse(scoreTeam2);
    }
} catch(e) {
    scoreTeam2 = [0];
}


//console.log(scoreTeam2Div.innerHTML.length)
/*if(scoreTeam2Div.innerHTML.length > 13) {
    document.getElementById("backButton").innerHTML = "Back";
}*/
if(scoreTeam1.length > 1 && scoreTeam2.length > 1) {
    var temp1 = "<b>Team 1</b>";
    var temp2 = "<b>Team 2</b>";
    for(let i=1; i<scoreTeam1.length; i++) {
        temp1 += "<br>|<br>" + scoreTeam1[i];
        temp2 += "<br>|<br>" + scoreTeam2[i];
    }
    document.getElementById("scoreTeam1").innerHTML = temp1;
    document.getElementById("scoreTeam2").innerHTML = temp2;
    
    document.getElementById("backButton").innerHTML = "Back";
}

document.getElementById("teamSwitch").addEventListener('click', function(){
    if(document.getElementById("teamSwitch").innerHTML === "Team 1") {
        document.getElementById("teamSwitch").innerHTML = "Team 2";
        document.getElementById("teamSwitch").style.color = "#6c9474";
    } else {
        document.getElementById("teamSwitch").innerHTML = "Team 1";
        document.getElementById("teamSwitch").style.color = "#8f3f76";
    }
})

document.getElementById("addButton").addEventListener('click', function(){
    var points = parseInt(document.getElementById("inputPoints").value);
    console.log(scoreTeam1)
    if(!isNaN(points) && document.getElementById("teamSwitch").innerHTML === "Team 1") {
            //scoreTeam1 += points;
            //scoreTeam2 += (100 - points);
            //console.log(scoreTeam1[scoreTeam1.length-1])
            scoreTeam1.push(scoreTeam1[scoreTeam1.length-1] + points);
            scoreTeam2.push(scoreTeam2[scoreTeam2.length-1] + (100 - points));
    } else if(!isNaN(points) && document.getElementById("teamSwitch").innerHTML === "Team 2"){
            //scoreTeam1 += (100 - points);
            //scoreTeam2 += points;
            scoreTeam1.push(scoreTeam1[scoreTeam1.length-1] + (100 - points));
            scoreTeam2.push(scoreTeam2[scoreTeam2.length-1] + points);
    } else {
        scoreTeam1.push(scoreTeam1[scoreTeam1.length-1]);
        scoreTeam2.push(scoreTeam2[scoreTeam2.length-1]);
    }
    
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
    
    for(let i=0; i<eentwees.length; i++) {
        if(eentwees.item(i).checked) {
            if(i == 0) {
                scoreTeam1[scoreTeam1.length-1] += 200;
            } else {
                scoreTeam2[scoreTeam2.length-1] += 200;
            }
        }
    }
    //console.log(scoreTeam1);
    //console.log(scoreTeam2);
    //console.log(scoreTeam1[scoreTeam1.length-1])
    scoreTeam1Div = document.getElementById("scoreTeam1");
    scoreTeam1Div.innerHTML = scoreTeam1Div.innerHTML + "<br>|<br>" + scoreTeam1[scoreTeam1.length-1];
    scoreTeam2Div = document.getElementById("scoreTeam2");
    scoreTeam2Div.innerHTML = scoreTeam2Div.innerHTML + "<br>|<br>" + scoreTeam2[scoreTeam2.length-1];
    
    document.getElementById("inputPoints").value = "";
    for(let i=0; i<taipans.length; i++) {
        taipans.item(i).checked = false;
    }
    for(let i=0; i<eentwees.length; i++) {
        eentwees.item(i).checked = false;
    }
    document.getElementById("inputPoints").disabled = false;
    document.getElementById("taipanWon").checked = true;
    
    round = round == 0? 3 : round - 1;
    const names = document.getElementsByClassName("nameInputs");
    for(let i=0; i<names.length; i++) {
        if(i == round) {
            names.item(i).style.borderColor = "#ff4500";
            names.item(i).style.borderWidth = "5px";
        } else {
            names.item(i).style.borderColor = "black";
            names.item(i).style.borderWidth = "2px";
        }
    }
    
    var scores = document.getElementById("scores");
    scores.scrollTop = scores.scrollHeight;
    
    //console.log(JSON.stringify(scoreTeam2))
    localStorage.setItem("taipanScoreTeam1", JSON.stringify(scoreTeam1));
    localStorage.setItem("taipanScoreTeam2", JSON.stringify(scoreTeam2));
    
    document.getElementById("backButton").innerHTML = "back";
    if(scoreTeam1[scoreTeam1.length-1] >= 1000) {
        document.getElementById("winningTeam").innerHTML = "1"
        document.getElementById("gameDone").style.display = "block";
    } else if(scoreTeam2[scoreTeam2.length-1] >= 1000) {
        document.getElementById("winningTeam").innerHTML = "2"
        document.getElementById("gameDone").style.display = "block";
    }
})


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


const eentwees = document.getElementsByClassName("1en2Input");
for(let i=0; i<eentwees.length; i++) {
    eentwees[i].addEventListener('change', function(){onlyOne1en2Selected(i)})
}

function onlyOne1en2Selected(index) {
    for(let i=0; i<eentwees.length; i++) {
        if(i != index) {
            eentwees.item(i).checked = false;
            //alert(i)
        }
        
        /*document.getElementById("inputPoints").disabled = false;
        if(eentwees.item(i).checked) {
            document.getElementById("inputPoints").disabled = true;
        }*/
    }
    if(eentwees.item(0).checked || eentwees.item(1).checked) {
        document.getElementById("inputPoints").disabled = true;
        document.getElementById("inputPoints").value = "";
    } else {
        document.getElementById("inputPoints").disabled = false;
    }
}


document.getElementById("endButton").addEventListener('click', finishGame);
document.getElementById("newGame").addEventListener('click', finishGame);

function finishGame() {
    document.getElementById("scoreTeam1").innerHTML = "<b>Team 1<b>";
    document.getElementById("scoreTeam2").innerHTML = "<b>Team 2<b>";
    localStorage.removeItem("taipanScoreTeam1");
    localStorage.removeItem("taipanScoreTeam2");
    
    scoreTeam1 = [0];
    scoreTeam2 = [0];
    
    document.getElementById("gameDone").style.display = "none";
}

document.getElementById("backButton").addEventListener('click', function() {
    document.getElementById("backButton").innerHTML = "Back";
    
    scoreTeam1Div = document.getElementById("scoreTeam1");
    var index1 = scoreTeam1Div.innerHTML.lastIndexOf('|');
    if(index1 != -1) {
        scoreTeam1Div.innerHTML = scoreTeam1Div.innerHTML.slice(0, index1 - 4);
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
    //console.log(scoreTeam1.length)
    //console.log(scoreTeam1);
    //console.log(scoreTeam2);
    
    localStorage.setItem("taipanScoreTeam1", JSON.stringify(scoreTeam2));
    localStorage.setItem("taipanScoreTeam2", JSON.stringify(scoreTeam2));
    
    round = round == 3? 0 : round + 1;
    const names = document.getElementsByClassName("nameInputs");
    for(let i=0; i<names.length; i++) {
        if(i == round) {
            names.item(i).style.borderColor = "#ff4500";
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