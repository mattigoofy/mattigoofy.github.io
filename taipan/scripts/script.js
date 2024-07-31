var scoreTeam1 = 0;
var scoreTeam2 = 0;
var round = 0;


scoreTeam1Div = document.getElementById("scoreTeam1");
scoreTeam1Div.innerHTML = localStorage.getItem("taipanScoreTeam1") != null? localStorage.getItem("taipanScoreTeam1"): "Team 1";
scoreTeam2Div = document.getElementById("scoreTeam2");
scoreTeam2Div.innerHTML = localStorage.getItem("taipanScoreTeam2") != null? localStorage.getItem("taipanScoreTeam2"): "Team 2";


document.getElementById("teamSwitch").addEventListener('click', function(){
    if(document.getElementById("teamSwitch").innerHTML === "Team 1") {
        document.getElementById("teamSwitch").innerHTML = "Team 2";
        document.getElementById("teamSwitch").style.color = "red";
    } else {
        document.getElementById("teamSwitch").innerHTML = "Team 1";
        document.getElementById("teamSwitch").style.color = "blue";
    }
})

document.getElementById("addButton").addEventListener('click', function(){
    if(document.getElementById("teamSwitch").innerHTML === "Team 1") {
        var points = parseInt(document.getElementById("inputPoints").value);
        if(!isNaN(points)) {
            scoreTeam1 += points;
            scoreTeam2 += (100 - points);
        }
    } else {
        var points = parseInt(document.getElementById("inputPoints").value);
        if(!isNaN(points)) {
            scoreTeam1 += (100 - points);
            scoreTeam2 += points;
        }
    }
    
    var won = document.getElementById("taipanWon").checked? 1 : -1;
    for(let i=0; i<taipans.length; i++) {
        if(taipans.item(i).checked) {
            switch(i) {
                case 0:
                    scoreTeam1 += 100*won;
                    break;
                case 1:
                    scoreTeam2 += 100*won;
                    break;
                case 2:
                    scoreTeam1 += 200*won;
                    break;
                case 3:
                    scoreTeam2 += 200*won;
                    break;
            }
            break;
        }
    }
    
    for(let i=0; i<eentwees.length; i++) {
        if(eentwees.item(i).checked) {
            if(i == 0) {
                scoreTeam1 += 200;
            } else {
                scoreTeam2 += 200;
            }
        }
    }
    
    scoreTeam1Div = document.getElementById("scoreTeam1");
    scoreTeam1Div.innerHTML = scoreTeam1Div.innerHTML + "<br>|<br>" + scoreTeam1;
    scoreTeam2Div = document.getElementById("scoreTeam2");
    scoreTeam2Div.innerHTML = scoreTeam2Div.innerHTML + "<br>|<br>" + scoreTeam2;
    
    document.getElementById("inputPoints").value = "";
    for(let i=0; i<taipans.length; i++) {
        taipans.item(i).checked = false;
    }
    for(let i=0; i<eentwees.length; i++) {
        eentwees.item(i).checked = false;
    }
    document.getElementById("inputPoints").disabled = false;
    document.getElementById("taipanWon").checked = false;
    
    round = round == 3? 0 : round + 1;
    const names = document.getElementsByClassName("nameInputs");
    for(let i=0; i<names.length; i++) {
        if(i == round) {
            names.item(i).style.borderColor = "green";
        } else {
            names.item(i).style.borderColor = "black";
        }
    }
    
    var scores = document.getElementById("scores");
    scores.scrollTop = scores.scrollHeight;
    
    localStorage.setItem("taipanScoreTeam1", scoreTeam1Div.innerHTML);
    localStorage.setItem("taipanScoreTeam2", scoreTeam2Div.innerHTML);
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


document.getElementById("endButton").addEventListener('click', function(){
    document.getElementById("scoreTeam1").innerHTML = "Team 1";
    document.getElementById("scoreTeam2").innerHTML = "Team 2";
    localStorage.removeItem("taipanScoreTeam1");
    localStorage.removeItem("taipanScoreTeam2");
})