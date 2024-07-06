var speeder = document.getElementById("speeder");
speeder.style.bottom = '150px';
var running = false;
var score = 0;
var scorebord = ["-", "-", "-"];
const gameSpeedStart = 200;
var showHitBoxes = false;
var place = "sandyRocks";


var cntr = 299;
changePlace();

var scorebord = localStorage.getItem("speederScorebord");
if(scorebord == null) {
    var scorebord = ["-", "-", "-"];
} else {
    scorebord = scorebord.split(",");
}
document.getElementById("scorebord").innerHTML = "<u>scorebord</u><br>1: " + scorebord[0] + "<br>2: " + scorebord[1] + "<br>3: " + scorebord[2];


function changePlace() {
    var imagesTop = document.getElementsByClassName("backgroundTop");
    imagesTop[0].setAttribute("src", "images/"+ place +"/background.png");
    imagesTop[1].setAttribute("src", "images/"+ place +"/background2.png");
    imagesTop[2].setAttribute("src", "images/"+ place +"/background.png");
    var imagesBottom = document.getElementsByClassName("backgroundBottom");
    imagesBottom[0].setAttribute("src", "images/"+ place +"/background.png");
    imagesBottom[1].setAttribute("src", "images/"+ place +"/background2.png");
    imagesBottom[2].setAttribute("src", "images/"+ place +"/background.png");
    var imageSpeeder = document.getElementById("speederImg");
    imageSpeeder.setAttribute("src", "images/"+ place +"/vehicle.png");
    switch (place) {
        case "space":
            document.getElementById("game").style.backgroundColor = "rgba(33, 6, 51, 0.57)";
            document.getElementById("speeder").style.height = "115px";
            document.getElementById("speeder").style.width = "220px";
            break;
        case "sandyRocks":
            document.getElementById("game").style.backgroundColor = "cornsilk";
            document.getElementById("speeder").style.height = "104px";
            document.getElementById("speeder").style.width = "306px";
            break;
    }
}


//
// main
//
var seconds = 0;
function main() {
    cntr+=1;
    setTimeout(() =>{
        // console.log(cntr);
        if(running){
            isGameOver();
            if(cntr == 1000){
                cntr = 1;
            }
            if(cntr%100 == 0){
                score++;
                seconds++;
                gameSpeed = Math.floor(100 + 200/Math.exp(seconds/25));
                // gameSpeed = Math.floor(100 + 200/Math.exp(seconds/25)) / screen.width * 1536;
                document.getElementById("score").textContent = score;
                speeder.style.transition = gameSpeed/gameSpeedStart + "s";
            }
            if(cntr%( Math.floor(gameSpeed*4/3) ) == 0){
                allFunctions[ Math.floor(Math.random() * (allFunctions.length-0.00000001)) ]();
                // createObject("point", 1)
            }
            main();
        }
    }, 10)
}



//
// create objects
//
var objectCntr = 0;
function createObject(type, position) { 
    var objectSpeed = gameSpeed/100*2;

    var object = document.createElement("div");
    object.className = type + " object"; 
    // object.id = type + "_" + objectCntr;
    // objectCntr++; 
    // object.innerHTML = object.id;
    // console.log(object.id);
     object.style.bottom = (position-1)*150 + "px";
    object.style.animation = "moveObstacle "+objectSpeed+"s linear";
    if(showHitBoxes){
        object.style.backgroundColor = "grey";
        object.style.border = "1px solid black"
    }
    
    var img = document.createElement("img");
    switch(type) {
        case "obstacle":
            img.setAttribute("src", "images/"+ place +"/rock1.png");
            break;
        case "point":
            img.setAttribute("src", "images/"+ place +"/coin.png");
            break;
    }
    img.className = "objectImg";
    object.appendChild(img);

    document.getElementById("game").appendChild(object);
    setTimeout(() => {
        if(document.getElementById("game").contains(object)) {
            document.getElementById("game").removeChild(object);
        }
    }, objectSpeed*1000-100);
}



//
// check for game over
//
function isGameOver() {
    var objects = document.getElementsByClassName("object");
    for(let i=0; i<objects.length; i++){
        window.requestAnimationFrame(() => {
            var objectLeft = objects[i]!=undefined? objects[i].getBoundingClientRect().left: null;
            var objectBottom = objects[i]!=undefined? Math.floor(objects[i].getBoundingClientRect().bottom): null;
            var objectTop = objects[i]!=undefined? Math.floor(objects[i].getBoundingClientRect().top): null;

            window.requestAnimationFrame(() => {
                var speederBottom = Math.floor(speeder.getBoundingClientRect().bottom);
                var speederTop = Math.floor(speeder.getBoundingClientRect().top);

                if( ( objectLeft > -20 && objectLeft < 306 && 
                    ((speederBottom >= objectTop && speederTop <= objectTop) ||
                    (speederBottom >= objectBottom && speederTop <= objectBottom) || 
                    (speederBottom <= objectBottom && speederTop >= objectTop ) ) &&
                    running)
                ){
                    if(objects[i].className.includes("obstacle")){
                        // console.log(objects[i])
                        // console.log(objectLeft > -20 && objectLeft < 400);
                        // console.log(speederBottom > objectTop && speederTop < objectTop);
                        // console.log(speederBottom > objectBottom && speederTop < objectBottom);
                        // console.log(speederBottom < objectBottom && speederTop > objectTop);
                        // console.log("speederBottom: " + speederBottom);
                        // console.log("speederTop: " + speederTop);
                        // console.log("objectBottom: " + objectBottom);
                        // console.log("objectTop: " + objectTop);
                        // console.log("objectLeft: " + objectLeft);
                        gameOver();
                    } else {
                        // score++;
                        // document.getElementById("score").textContent = score;
                        objects[i].remove();
                    }
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
    // console.log("game over")
    document.getElementById("gameOver").style.display = "block";
    
    var objects = document.getElementsByClassName("object");
    var amountOfObjects = objects.length;
    for(let i=0; i<amountOfObjects; i++){
        if(objects[i]!=undefined){
            window.requestAnimationFrame(() => {
                var objectLeft = objects[i]!=undefined? objects[i].getBoundingClientRect().left: -20;
                objects[i].style.animation = "none";
                objects[i].style.left = objectLeft;
                objects[i].style.position = "absolute";
            })
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
        
    // const audio = document.querySelector("audio");
    // audio.volume = 0.2;
    // audio.pause();
}


//
// start game
//
function startGame() {
    gameSpeed = gameSpeedStart;
    seconds = 0;

    running = true;
    speeder.style.bottom = "150px";
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
// move speeder
//
document.addEventListener('keydown', function(key) {
    // console.log(key.key);
    // var speeder = document.getElementById("speeder");
    var bottom = parseInt(speeder.style.bottom);
    // console.log(bottom)
    switch (key.key){
        case 'ArrowUp':
        case 'z':
            if(bottom!=300 && running){
                speeder.style.bottom = bottom + 150 + "px";
                speeder.style.transform = "rotate(-45deg)";
                setTimeout(()=> {speeder.style.transform = "rotate(0deg)"}, ( Math.floor(gameSpeed*4/3) ));
            }
            break;
        case 'ArrowDown':
        case 's':
            if(bottom!=0 && running){
                speeder.style.bottom = bottom - 150 + "px";
                speeder.style.transform = "rotate(45deg)";
                setTimeout(()=> {speeder.style.transform = "rotate(0deg)"}, ( Math.floor(gameSpeed*4/3) ));
            } 
            break;
        case ' ':
            if(document.getElementById("gameOver").style.display == "block"){
                document.getElementById("gameOver").style.display = "none";
                score = 0;
                document.getElementById("score").textContent = score;
                
                startGame();                    
            } else if(document.getElementById("startGame").style.display == "block") {
                document.getElementById("startGame").style.display = "none";
                startGame();
            }
            break;
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


//
// swipen
//
var startX = null;
var startY = null;
window.addEventListener("touchstart",function(event){
  if(event.touches.length === 1){
    //just one finger touched
    startX = event.touches.item(0).clientX;
    startY = event.touches.item(0).clientY;
  }else{
    //a second finger hit the screen, abort the touch
    startX = null;
    startY = null;
  }
});

window.addEventListener("touchend",function(event){
  var offsetX = 100;//at least 100px are a swipe
  var offsetY = 100;//at least 100px are a swipe
  var bottom = parseInt(speeder.style.bottom);
  if(startX){
    //the only finger that hit the screen left it
    var endX = event.changedTouches.item(0).clientX;
    var endY = event.changedTouches.item(0).clientY;

    // console.log(startY - endY);
    if(endY > startY + offsetY && Math.abs(startX - endX) < offsetX){
      //a left -> right swipe
      console.log("swiped down");
      if(bottom!=0 && running){
          speeder.style.bottom = bottom - 150 + "px";
          speeder.style.transform = "rotate(45deg)";
          setTimeout(()=> {speeder.style.transform = "rotate(0deg)"}, ( Math.floor(gameSpeed*4/3) ));
      } 
    }
    if(endY < startY - offsetY && Math.abs(startX - endX) < offsetX){
    //a right -> left swipe
      console.log("swiped up");
      if(bottom!=300 && running){
          speeder.style.bottom = bottom + 150 + "px";
          speeder.style.transform = "rotate(-45deg)";
          setTimeout(()=> {speeder.style.transform = "rotate(0deg)"}, ( Math.floor(gameSpeed*4/3) ));
      }
    }
  }
});



//
// show hitbox input
//
document.getElementById("showHitBoxInput").addEventListener('change', function() {
    if(document.getElementById("showHitBoxInput").checked) {
        showHitBoxes = true;
        speeder.style.backgroundColor = "grey";
    } else {
        showHitBoxes = false;
        speeder.style.backgroundColor = "transparent";
    }
})



//
// change place
//
document.getElementById("changePlace").addEventListener('click', function() {
    if(document.getElementById("changePlace").innerHTML == "sandyRocks") {
        document.getElementById("changePlace").innerHTML = "space";
        place = "space";
        changePlace();
    } else {
        document.getElementById("changePlace").innerHTML = "sandyRocks";
        place = "sandyRocks";
        changePlace();
    }
})