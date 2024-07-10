//
// game over
//
function gameOver() {
    running = false;
    // setTimeout(()=> {document.getElementById("gameOver").style.display = "block";}, gameSpeed*10-100)
    document.getElementById("gameOver").style.display = "block";
    
    
    var objects = document.getElementsByClassName("object");
    var amountOfObjects = objects.length;
    for(let i=0; i<amountOfObjects; i++){
        if(objects[i]!=undefined){
            objects[i].style.animationPlayState = 'paused';
        }
    }

    // speeder.style.animationPlayState = 'paused';
    speeder.style.transition = "50s";
    document.getElementById("explosion").style.display = "block";

    var backgroundTop = document.getElementsByClassName("backgroundTop");
    for(let i=0; i<backgroundTop.length; i++) {
        backgroundTop[i].style.animation = "none";
    }
    var backgroundBottom = document.getElementsByClassName("backgroundBottom");
    for(let i=0; i<backgroundBottom.length; i++) {
        backgroundBottom[i].style.animation = "none";
    }

    if(mode == modes[0]){
        if(scorebord[0] < score || scorebord[0] == "-") {
            scorebord[2] = scorebord[1];
            scorebord[1] = scorebord[0];
            scorebord[0] = score;
        } else if(scorebord[1] < score || scorebord[1] == "-") {
            scorebord[2] = scorebord[1];
            scorebord[1] = score;
        } else if(scorebord[2] < score || scorebord[2] == "-") {
            scorebord[2] = score;
        }
        localStorage.setItem("speederScorebord", scorebord);
        document.getElementById("scorebord").innerHTML = "<u>scorebord</u><br>1: " + scorebord[0] + "<br>2: " + scorebord[1] + "<br>3: " + scorebord[2];
    }
        
    // const audio = document.querySelector("audio");
    // audio.volume = 0.2;
    // audio.pause();
}



//
// start game
//
function startGame() {
    document.getElementById("choosePlace").style.display = "none";
    document.getElementById("chooseDifficulty").style.display = "none";
    document.getElementById("startGame").style.display = "none";

    // place = placeInput;
    // changePlace();

    var objects = document.getElementsByClassName("object");
    var amountOfObjects = objects.length;
    for(let i=0; i<amountOfObjects; i++){
        if(objects[0]!=undefined){
            objects[0].remove();
        }
    }

    gameSpeed = gameSpeedStart;
    seconds = 0;
    score = 0;
    document.getElementById("score").textContent = score;

    running = true;
    speeder.style.bottom = "150px";
    speeder.style.transform = "rotate(0deg)"

    speeder.style.transition = "1s";
    
    document.getElementById("explosion").style.display = "none";

    // var gameSpeed = 15;
    var background1 = document.getElementsByClassName("background1");
    for(let i=0; i<background1.length; i++) {
        background1[i].style.animation = "background1 "+gameSpeed/100*15+"s linear infinite";
    }
    var background2 = document.getElementsByClassName("background2");
    for(let i=0; i<background2.length; i++) {
        background2[i].style.animation = "background2 "+gameSpeed/100*15+"s linear infinite";
    }
    var background3 = document.getElementsByClassName("background3");
    for(let i=0; i<background3.length; i++) {
        background3[i].style.animation = "background3 "+gameSpeed/100*15+"s linear infinite";
    }
    // console.log("started")
    
    // const audio = document.querySelector("audio");
    // audio.currentTime = 0;
    // audio.volume = 0.2;
    // audio.play();

    main();
}



//
// continue game
//
function continueGame() {
    running = true;

    var objects = document.getElementsByClassName("object");
    var amountOfObjects = objects.length;
    for(let i=0; i<amountOfObjects; i++){
        if(objects[i]!=undefined){
            objects[i].style.animationPlayState = 'running';
            window.requestAnimationFrame(() => {
                const totalObjectLeft = 1539;       // ongeveer                
                var objectSpeed = gameSpeed/100*2;
                var objectLeft = objects[i]!=undefined? objects[i].getBoundingClientRect().left: -20;
                setTimeout(()=>{objects[0].remove();}, (objectSpeed*1000-100)*objectLeft/totalObjectLeft );
            })
        }
    }

    var background1 = document.getElementsByClassName("background1");
    for(let i=0; i<background1.length; i++) {
        background1[i].style.animation = "background1 "+gameSpeed/100*15+"s linear infinite";
    }
    var background2 = document.getElementsByClassName("background2");
    for(let i=0; i<background2.length; i++) {
        background2[i].style.animation = "background2 "+gameSpeed/100*15+"s linear infinite";
    }
    var background3 = document.getElementsByClassName("background3");
    for(let i=0; i<background3.length; i++) {
        background3[i].style.animation = "background3 "+gameSpeed/100*15+"s linear infinite";
    }

    main();
}



//
// pause game
//
function pauseGame(){
    document.getElementById("continueGame").style.display = "block";
    running = false;

    var objects = document.getElementsByClassName("object");
    var amountOfObjects = objects.length;
    for(let i=0; i<amountOfObjects; i++){
        if(objects[i]!=undefined){
            objects[i].style.animationPlayState = 'paused';
            // window.requestAnimationFrame(() => {
            //     var objectLeft = objects[i]!=undefined? objects[i].getBoundingClientRect().left: -20;
            //     objects[i].style.animation = "none";
            //     objects[i].style.left = objectLeft;
            //     objects[i].style.position = "absolute";
            // })
        }
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
// next stage
//
function nextStage(place, direction) {
    changePlace(place);    
    document.getElementById("infoBoxText").innerHTML = direction;

    running = false;    
    score = 0;
    document.getElementById("score").textContent = score;

    document.getElementById("infoBox").style.display = "block";
    
    var objects = document.getElementsByClassName("object");
    var amountOfObjects = objects.length;
    for(let i=0; i<amountOfObjects; i++){
        if(objects[0]!=undefined){
            // objects[i].style.animationPlayState = 'paused';
            objects[0].remove();
        }
    }

    // speeder.style.animationPlayState = 'paused';
    // speeder.style.transition = "50s";

    var backgroundTop = document.getElementsByClassName("backgroundTop");
    for(let i=0; i<backgroundTop.length; i++) {
        backgroundTop[i].style.animation = "none";
    }
    var backgroundBottom = document.getElementsByClassName("backgroundBottom");
    for(let i=0; i<backgroundBottom.length; i++) {
        backgroundBottom[i].style.animation = "none";
    }
}