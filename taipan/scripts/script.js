const team1Color = "#8f3f76";
const team2Color = "#6c9474";
const borderColor = "#ff4500";



//
// teamSwitch_handler
//
var currentTeamForPoints = 1
document.getElementById("teamSwitch").addEventListener('click', function(){
    if(currentTeamForPoints === 1) {
        document.getElementById("teamSwitch").innerHTML = team2Names.length>15? "Team 2": team2Names;
        document.getElementById("teamSwitch").style.color = team2Color;
        currentTeamForPoints = 2;
    } else {
        document.getElementById("teamSwitch").innerHTML = team1Names.length>15? "Team 1": team1Names;
        document.getElementById("teamSwitch").style.color = team1Color;
        currentTeamForPoints = 1;
    }
})



//
// addButton_handler
//
document.getElementById("addButton").addEventListener('click', function(){
    var points = parseInt(document.getElementById("inputPoints").value);
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
                    if(won == 1) {
                        statistics[0]++;
                        showDragon(1, false);
                    } else {
                        statistics[2]++;
                    }
                    break;
                case 1:
                    scoreTeam2[scoreTeam2.length-1] += 100*won;
                    if(won == 1) {
                        statistics[1]++;
                        showDragon(2, false);
                    } else {
                        statistics[3]++;
                    }
                    
                    break;
                case 2:
                    scoreTeam1[scoreTeam1.length-1] += 200*won;
                    if(won == 1) {
                        statistics[4]++;
                        showDragon(1, true);
                    } else {
                        statistics[6]++;
                    }
                    break;
                case 3:
                    scoreTeam2[scoreTeam2.length-1] += 200*won;
                    if(won == 1) {
                        statistics[5]++;
                        showDragon(2, true);
                    } else {
                        statistics[7]++;
                    }
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
                statistics[8]++;
                showDog(1);
            } else {
                scoreTeam2[scoreTeam2.length-1] += 200;
                statistics[9]++;
                showDog(2);
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
    document.getElementById("taipanWon").disabled = false;
    
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
    localStorage.setItem("taipanStatistics", JSON.stringify(statistics));
    
    document.getElementById("backButton").innerHTML = "back";
    if(scoreTeam1[scoreTeam1.length-1] >= 1000 || scoreTeam2[scoreTeam2.length-1] >= 1000) {
        finishGame();
    }
})



//
// showAnimals_functions
//
function showDragon(winningTeam, bigTaipan) {
    var dragon = document.getElementById("dragon");
    document.body.removeChild(dragon);
    dragon.style.animation = "moveDragon 2s ease-out";
    
    if(winningTeam == 1) {
        if(bigTaipan) {
            dragon.style.left = "0";
            dragon.style.width = "50%";
            dragon.style.top = "-50%";
        } else {
            dragon.style.left = "14%";
            dragon.style.width = "25%";
            dragon.style.top = "-25%";
        }
        dragon.style.transform = "scaleX(-1)";
    } else {
        if(bigTaipan) {
            dragon.style.left = "50%";
            dragon.style.width = "50%";
            dragon.style.top = "-50%";
        } else {
            dragon.style.left = "64%";
            dragon.style.width = "25%";
            dragon.style.top = "-25%";
        }
        dragon.style.transform = "scaleX(1)";
    }
    
    document.body.appendChild(dragon);
}

function showDog(winningTeam) {
    var dog = document.getElementById("dog");
    document.body.removeChild(dog);
    dog.style.animation = "moveDog 2s ease-out";
    
    if(winningTeam == 1) {
        dog.style.left = "0";
        dog.style.transform = "scaleX(-1)";
    } else {
        dog.style.left = "50%";
        dog.style.transform = "scaleX(1)";
    }
    
    document.body.appendChild(dog);
}


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
    eentwee_taipan_setting();
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
    eentwee_taipan_setting();
}


// eentwee_taipan_function
function eentwee_taipan_setting() {
        if(taipans.item(0).checked || taipans.item(2).checked) {  //team 1
            switch(true) {
                case eentwees.item(0).checked:
                    taipanWon.checked = true;
                    taipanWon.disabled = true;
                    break;
                case eentwees.item(1).checked:
                    taipanWon.checked = false;
                    taipanWon.disabled = true;
                    break;
                default:
                    taipanWon.disabled = false;
                    break;
            }
        } else if(taipans.item(1).checked || taipans.item(3).checked) {
            switch(true) {
                case eentwees.item(0).checked:
                    taipanWon.checked = false;
                    taipanWon.disabled = true;
                    break;
                case eentwees.item(1).checked:
                    taipanWon.checked = true;
                    taipanWon.disabled = true;
                    break;
                default:
                    taipanWon.disabled = false;
                    break;
            }
        } else {
            taipanWon.disabled = false;
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
    const rocket = document.getElementById('rocket');
    const explosion = document.getElementById('explosion');
    const table = document.getElementById('results-table');
    const info = document.getElementById("pressToContinue");

    
    if(scoreTeam1[scoreTeam1.length-1] == scoreTeam2[scoreTeam2.length-1]) {
        document.querySelector("div#explosion h1").innerHTML = "It's a tie";
    } else if(scoreTeam1[scoreTeam1.length-1] > scoreTeam2[scoreTeam2.length-1]) {
        document.querySelector("div#explosion h1").innerHTML = team1Names + "<br>won";
    } else {
        document.querySelector("div#explosion h1").innerHTML = team2Names + "<br>won";
    }
    
    document.getElementById("finalScore").innerHTML = "<i>" + scoreTeam1[scoreTeam1.length-1] + " vs " + scoreTeam2[scoreTeam2.length-1] + "</i>";
    
    var rows = table.getElementsByTagName("tr");
    var cells0 = rows[0].getElementsByTagName("td");
    cells0[1].innerHTML = team1Names;
    cells0[2].innerHTML = team2Names;
    for(let i=1; i<rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        cells[1].innerHTML = statistics[2*i - 2];
        cells[2].innerHTML = statistics[2*i - 1];
    }
        
    
    document.getElementById("gameDone").style.display = "block";
    //document.getElementById("finalScore").innerHTML = scoreTeam1[scoreTeam1.length-1] + " - " + scoreTeam2[scoreTeam2.length-1];
    document.getElementById("backButton").innerHTML = "Next to shuffle";
    document.getElementById("rocket").style.animation = "launch 1s forwards linear";
    
    rocket.addEventListener('animationend', () => {
        //console.log("help")
        rocket.style.display = "none";
        //const rocketRect = rocket.getBoundingClientRect();
        //explosion.style.top = `${rocketRect.top + window.scrollY}px`;
        createFirework();
        explosion.style.display = 'block';

        setTimeout(() => {
            explosion.querySelector('h1').style.animation = 'fadeIn 2s forwards';
        }, 100); // Slight delay to start fadeIn of text

        setTimeout(()=>{
            document.getElementById("finalScore").style.display = "block";
            document.getElementById("finalScore").style.animation = "fadeIn 2s forwards";
        }, 500)
        
        setTimeout(() => {
            table.style.display = 'table';
            table.style.animation = 'fadeIn 2s forwards';
        }, 1000);
        
        setTimeout(()=> {
            info.style.display = "block";
            info.style.animation = 'fadeIn 2s forwards';
        }, 2000)
    });
}

function createFirework() {
    const colors = ["yellow", "orange", "red"];
    const amountOfRockets = 40;
    for (let i = 0; i < amountOfRockets; i++) {
        const particle = document.createElement('div');
        particle.classList.add('firework');
        particle.style.setProperty('--x', Math.cos((i / amountOfRockets) * 2 * Math.PI));
        particle.style.setProperty('--y', Math.sin((i / amountOfRockets) * 2 * Math.PI));
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        explosion.appendChild(particle);
    }
}


//
// backButton_handler
//
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
    
    if(players[1]=="" || players[3]=="") {
        team1Names = "Team 1";
    } else {
        team1Names = players[1] + " & " + players[3];
    }
    
    if(players[0]=="" || players[2]=="") {
        team2Names = "Team 2";
    } else {
        team2Names = players[0] + " & " + players[2];
    }
    
    var cells = document.getElementById("taipan_table").getElementsByTagName("th");
    cells[1].innerHTML = team1Names.length>15? "Team 1": team1Names.replace("&", "&<br>");
    cells[2].innerHTML = team2Names.length>15? "Team 2": team2Names.replace("&", "&<br>");
    
    const switchButton = document.getElementById("teamSwitch");
    if(currentTeamForPoints === 1) {
        switchButton.innerHTML = team1Names.length>15? "Team 1": team1Names;
    } else {
        switchButton.innerHTML = team2Names.length>15? "Team 2": team2Names
    }
    
    //var cells = rows[0].getElementsByTagName("td");
    
    //console.log(localStorage.getItem("taipanPlayers"));
    //console.log(team1Names + " - " + team2Names)
}


//
// picture_handler
//
document.getElementById("logo").addEventListener('click', function() {
    const logo = document.getElementById("logo");
    if(logo.src.includes("taipan.jpg")) {
        logo.setAttribute("src", "Tichu.jpg");
        document.getElementById("gameStyle").setAttribute("href", "styles/tichu.css");
        //document.getElementById("taipan_table").innerHTML = document.getElementById("taipan_table").innerHTML.replaceAll("Taipan", "Tichu");
        var taipanRows = document.getElementById("taipan_table").getElementsByTagName("tr");
        for(let i=1; i<taipanRows.length; i++) {
            var cells = taipanRows[i].getElementsByTagName("td");
            cells[0].innerHTML = cells[0].innerHTML.replaceAll("Taipan","Tichu")
        }
        document.getElementById("taipanWonLabel").innerHTML = document.getElementById("taipanWonLabel").innerHTML.replaceAll("Taipan", "Tichu");
        document.getElementById("dragon").setAttribute("src","tichuDragon.png");
        document.getElementById("dog").setAttribute("src","tichuDog.png");
        //document.getElementById("dog").style.bottom = "calc(20vh - 50%)";
    } else {
        logo.setAttribute("src", "taipan.jpg");
        document.getElementById("gameStyle").setAttribute("href", "styles/taipan.css");
        //document.getElementById("taipan_table").innerHTML = document.getElementById("taipan_table").innerHTML.replaceAll("Tichu", "Taipan");
        var taipanRows = document.getElementById("taipan_table").getElementsByTagName("tr");
        for(let i=1; i<taipanRows.length; i++) {
            var cells = taipanRows[i].getElementsByTagName("td");
            cells[0].innerHTML = cells[0].innerHTML.replaceAll("Tichu", "Taipan");
        }
        
        document.getElementById("taipanWonLabel").innerHTML = document.getElementById("taipanWonLabel").innerHTML.replaceAll("Tichu", "Taipan");
        document.getElementById("dragon").setAttribute("src","taipanDragon.png");
        document.getElementById("dog").setAttribute("src","taipanDog.png");
        //document.getElementById("dog").style.bottom = "calc(20vh - 20%)";
    }
}) 