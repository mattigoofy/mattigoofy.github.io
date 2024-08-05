var round = 0;


//
// score_Team_1
//
var scoreTeam1 = localStorage.getItem("taipanScoreTeam1");
try {
    if(scoreTeam1 == null) {
        throw "null";
    } else {
        scoreTeam1 = JSON.parse(scoreTeam1);
    }
} catch(e) {
    scoreTeam1 = [0];
}


//
// score_Team_2
var scoreTeam2 = localStorage.getItem("taipanScoreTeam2");
try {
    if(scoreTeam2 == null) {
        throw "null";
    } else {
        scoreTeam2 = JSON.parse(scoreTeam2);
    }
} catch(e) {
    scoreTeam2 = [0];
}


//
// visualisatie_scores
//
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


//
// players
//
var players = localStorage.getItem("taipanPlayers");
var team1Names;
var team2Names;
    
try {
    if(players == null) {
        throw "null";
    } else {
        players = JSON.parse(players);
        round = players[4];
        const names = document.getElementsByClassName("nameInputs");
        for(let i=0; i<names.length; i++) {
            names.item(i).value = players[i];
        }
        names.item(round).style.borderColor = "#ff4500";
        names.item(round).style.borderWidth = "5px";
        
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
    
    }
} catch(e) {
    players = ["", "", "", "", round];
    names.item(round).style.borderColor = "#ff4500";
    names.item(round).style.borderWidth = "5px";
    team1Names = "Team 1";
    team2Names = "Team 2";
}

document.getElementById("teamSwitch").innerHTML = team1Names.length>15? "Team 1": team1Names;
var cells = document.getElementById("taipan_table").getElementsByTagName("th");
cells[1].innerHTML = team1Names.length>15? "Team 1": team1Names.replace("&", "&<br>");
cells[2].innerHTML = team2Names.length>15? "Team 2": team2Names.replace("&", "&<br>");



//
// statistics
//
var statistics = localStorage.getItem("taipanStatistics");
try {
    if(statistics == null) {
        throw "null";
    } else {
        statistics = JSON.parse(statistics);
    }
} catch(e) {
    statistics = [0,0,0,0, 0,0,0,0, 0,0];
}

