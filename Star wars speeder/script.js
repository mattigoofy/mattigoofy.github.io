var speeder = document.getElementById("speeder");
speeder.style.bottom = '150px';
var running = false;
var score = 0;


var cntr = 299;
// main();


//
// main
//
function main() {
    cntr+=1;
    setTimeout(() =>{
        // console.log(cntr)
        if(running){
            isGameOver();
            if(cntr == 300){
                createObstacle();
                cntr = 0;
            }
            if(cntr%100 == 0){
                score++;
                // console.log(score);
                document.getElementById("score").textContent = score;
            }
            main();
        }
    }, 10)
}



//
// create obstacle
//
function createObstacle() {
    var obstacle = document.createElement("div");
    obstacle.className = "obstacle"; 
    obstacle.style.bottom = Math.floor((Math.random() * 450)/150)*150 + "px";
    
    var rock = document.createElement("img");
    rock.setAttribute("src", "rock1.png");
    rock.className = "rockImg"
    obstacle.appendChild(rock);

    document.getElementById("game").appendChild(obstacle);
    setTimeout(() => {document.getElementById("game").removeChild(obstacle)}, 4900);
}



//
// check for game over
//
function isGameOver() {
    var obstacles = document.getElementsByClassName("obstacle");
    for(let i=0; i<obstacles.length; i++){
        window.requestAnimationFrame(() => {
            var obstacleLeft = obstacles[i]!=undefined? obstacles[i].getBoundingClientRect().left: null;
            var obstacleBottom = obstacles[i]!=undefined? Math.floor(obstacles[i].getBoundingClientRect().bottom): null;
            var obstacleTop = obstacles[i]!=undefined? Math.floor(obstacles[i].getBoundingClientRect().top): null;

            window.requestAnimationFrame(() => {
                var speederbottom = Math.floor(speeder.getBoundingClientRect().bottom);
                var speederTop = Math.floor(speeder.getBoundingClientRect().top);

                if(obstacleLeft > -20 && obstacleLeft < 400 && 
                    ((speederbottom > obstacleTop && speederTop < obstacleTop) ||
                    (speederbottom > obstacleBottom && speederTop < obstacleBottom) || 
                    (speederbottom < obstacleBottom && speederTop > obstacleTop ))
                ){
                    gameOver();
                }

            })
        })
    }
}



//
// game over
//
function gameOver() {
    running = false;
    console.log("game over")
    document.getElementById("gameOver").style.display = "block";
    
    var obstacles = document.getElementsByClassName("obstacle");
    var amountOfObstacles = obstacles.length;
    for(let i=0; i<amountOfObstacles; i++){
        window.requestAnimationFrame(() => {
            var obstacleLeft = obstacles[i]!=undefined? obstacles[i].getBoundingClientRect().left: -20;
            obstacles[i].style.animation = "none";
            obstacles[i].style.left = obstacleLeft;
        })
    }

    var backgroundTop = document.getElementsByClassName("backgroundTop");
    for(let i=0; i<backgroundTop.length; i++) {
        backgroundTop[i].style.animation = "none";
    }
    var backgroundBottom = document.getElementsByClassName("backgroundBottom");
    for(let i=0; i<backgroundBottom.length; i++) {
        backgroundBottom[i].style.animation = "none";
    }
}


//
// start game
//
function startGame() {
    running = true;
    speeder.style.bottom = "150px";

    var background1 = document.getElementsByClassName("background1");
    for(let i=0; i<background1.length; i++) {
        background1[i].style.animation = "background1 15s linear infinite";
    }
    var background2 = document.getElementsByClassName("background2");
    for(let i=0; i<background2.length; i++) {
        background2[i].style.animation = "background2 15s linear infinite";
    }
    var background3 = document.getElementsByClassName("background3");
    for(let i=0; i<background3.length; i++) {
        background3[i].style.animation = "background3 15s linear infinite";
    }
    console.log("started")
    main();
}


//
// move speeder
//
document.addEventListener('keydown', function(key) {
    // console.log(key.key);
    var speeder = document.getElementById("speeder");
    var bottom = parseInt(speeder.style.bottom);
    // console.log(bottom)
    if(running){
        switch (key.key){
            case 'z':
                speeder.style.bottom = bottom!=300? bottom + 150 + "px": bottom;
                break;
            case 's':
                speeder.style.bottom = bottom!=0? bottom - 150 + "px": bottom;
                break;
        }
    }
})

//
// reset button
//
document.getElementById("resetButton").addEventListener('click', function() {
    document.getElementById("gameOver").style.display = "none";
    score = 0;
    document.getElementById("score").textContent = score;
    
    startGame();
})

//
// start buttton
//
document.getElementById("startButton").addEventListener('click', function() {
    document.getElementById("startGame").style.display = "none";
    const audio = document.querySelector("audio");
    audio.volume = 0.2;
    audio.play();
    startGame();
})




//
// music
//
// window.addEventListener("DOMContentLoaded", event => {
//     const audio = document.querySelector("audio");
//     audio.volume = 0.2;
//     audio.play();
// });