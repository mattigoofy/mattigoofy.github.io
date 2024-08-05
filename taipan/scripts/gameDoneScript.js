// script.js
/*document.addEventListener('DOMContentLoaded', () => {
    const rocket = document.getElementById('rocket');
    const explosion = document.getElementById('explosion');
    const table = document.getElementById('results-table');

    rocket.addEventListener('animationend', () => {
        rocket.style.display = "none";
        const rocketRect = rocket.getBoundingClientRect();
        explosion.style.top = `${rocketRect.top + window.scrollY}px`;
        createFirework();
        explosion.style.display = 'block';

        setTimeout(() => {
            explosion.querySelector('h1').style.animation = 'fadeIn 2s forwards';
        }, 100); // Slight delay to start fadeIn of text

        setTimeout(() => {
            table.style.display = 'table';
            table.style.animation = 'fadeIn 2s forwards';
        }, 1000);
    });

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
});*/


document.getElementById("gameDone").addEventListener('click', function(){
    document.getElementById("scoreTeam1").innerHTML = "<b>Team 1</b>";
    document.getElementById("scoreTeam2").innerHTML = "<b>Team 2</b>";
    localStorage.removeItem("taipanScoreTeam1");
    localStorage.removeItem("taipanScoreTeam2");
    localStorage.removeItem("taipanStatistics");
    
    scoreTeam1 = [0];
    scoreTeam2 = [0];
    
    /*taipansWon = [0,0,0,0];
    taipansLost = [0,0,0,0];
    eentweesWon = [0,0];*/
    statistics = [0,0,0,0, 0,0,0,0, 0,0];
    
    round = 0; 
    players = ["", "", "", "", round];
    team1Names = "Team 1";
    team2Names = "Team 2";
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
    document.getElementById("backButton").innerHTML = "Next to shuffle";
    
    const rocket = document.getElementById('rocket');
    const explosion = document.getElementById('explosion');
    const table = document.getElementById('results-table');
    const info = document.getElementById("pressToContinue");
    
    rocket.style.animation = "none";
    rocket.style.display = "block";
    explosion.style.display = 'none';
    explosion.querySelector('h1').style.animation = 'none';
    table.style.display = 'none';
    table.style.animation = 'none';
    info.style.display = "none";
    info.style.animation = 'none';
    document.getElementById("finalScore").style.display = "none";
    document.getElementById("finalScore").style.animation = "none";
        
    document.getElementById("teamSwitch").innerHTML = "Team 1";
    var cells = document.getElementById("taipan_table").getElementsByTagName("th");
    cells[1].innerHTML = "Team 1";
    cells[2].innerHTML = "Team 2";

})
