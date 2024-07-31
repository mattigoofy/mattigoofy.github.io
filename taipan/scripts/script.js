var scoreTeam1 = 0;
var scoreTeam2 = 0;


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
        scoreTeam1 += points;
        /*scoreTeam2 += (100 - points);*/
        
        scoreTeam1Div = document.getElementById("scoreTeam1");
        scoreTeam1Div.innerHTML = scoreTeam1Div.innerHTML + "<br>|<br>" + scoreTeam1;
    } else {
        var points = parseInt(document.getElementById("inputPoints").value);
        /*scoreTeam1 += (100 - points);*/
        scoreTeam2 += points;
        
        scoreTeam2Div = document.getElementById("scoreTeam2");
        scoreTeam2Div.innerHTML = scoreTeam2Div.innerHTML + "<br>|<br>" + scoreTeam2;
    }
    
    document.getElementById("inputPoints").value = "";
})