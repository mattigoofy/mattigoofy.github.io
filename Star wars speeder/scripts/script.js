// var unitSize = 150 / 1395 * window.width;
var unitSize = 150;

var speeder = document.getElementById("speeder");
// speeder.style.bottom = '150px';
speeder.style.bottom = unitSize + 'px';
var running = false;
var score = 0;
var scorebord = ["-", "-", "-"];
const gameSpeedStart = 200;
var showHitBoxes = false;
var places = ["space", "sandyRocks", "forest"]
var place;
var prevPlace;
var modes = ["endlessRun", "campaign"];
var mode;
// var neededScore = [100, 150, 200];
// var neededScore = [10, 15, 20];          // vo te testen
var neededScore;

var cntr = 299;
// changePlace();

var scorebord = localStorage.getItem("speederScorebord");
if(scorebord == null) {
    var scorebord = ["-", "-", "-"];
} else {
    scorebord = scorebord.split(",");
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
                document.getElementById("score").textContent = score;
                seconds++;
                gameSpeed = Math.floor(100 + 200/Math.exp(seconds/25));
                // gameSpeed = Math.floor(100 + 200/Math.exp(seconds/25)) / screen.width * 1536;
                speeder.style.transition = gameSpeed/gameSpeedStart + "s";

                if(mode == modes[1]){
                    if(score == neededScore[0] && place == places[0]){
                        var index = places.indexOf(prevPlace);
                        if(index!=places.length-1) {
                            nextStage(places[index+1], "Get to the spaceship");
                        }
                    } else if(score == neededScore[1] && place == places[1]) {
                        nextStage(places[0], "Get to the next planet");
                    } else if(score == neededScore[2] && place == places[2]){
                        nextStage(places[0], "Get to the next planet");
                    }
                }
            }
            if(cntr%( Math.floor(gameSpeed*4/3) ) == 0){
                allFunctions[ Math.floor(Math.random() * (allFunctions.length-0.00000001)) ]();
                // createObject("obstacle", 1)
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
     object.style.bottom = (position-1)*unitSize + "px";
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
        if(document.getElementById("game").contains(object) && running) {
            document.getElementById("game").removeChild(object);
        }
    }, objectSpeed*1000-100);
}



//
// change place
//
function changePlace(placeInput) {
    prevPlace = place;
    place = placeInput;
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
        case places[0]:
            document.getElementById("game").style.backgroundColor = "rgba(33, 6, 51, 0.57)";
            document.getElementById("speeder").style.height = "115px";
            document.getElementById("speeder").style.width = "220px";
            break;
        case places[1]:
            document.getElementById("game").style.backgroundColor = "cornsilk";
            document.getElementById("speeder").style.height = "104px";
            document.getElementById("speeder").style.width = "306px";
            break;
        case places[2]:
            document.getElementById("game").style.backgroundColor = "rgba(6, 58, 19, 0.57)";
            document.getElementById("speeder").style.height = "104px";
            document.getElementById("speeder").style.width = "306px";
            break;
    }

    document.getElementById("title").innerHTML = place;
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
                        document.getElementById("explosion").style.bottom = speeder.style.bottom;
                        // console.log(speeder.style.bottom)
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