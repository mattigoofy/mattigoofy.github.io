//
// move speeder
//
document.addEventListener('keydown', function(key) {
    // console.log(key.key);
    // var speeder = document.getElementById("speeder");
    var bottom = parseInt(speeder.style.bottom);
    // console.log(bottom)
    if(document.getElementById("infoBox").style.display == "block"){
        document.getElementById("infoBox").style.display = "none";
        startGame();
    } else {
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
                } else if(document.getElementById("continueGame").style.display == "block") {
                    document.getElementById("continueGame").style.display = "none";
                    continueGame();
                }
                break;
            case 'Escape':
                // console.log("dtop");
                if(document.getElementById("continueGame").style.display != "block" && document.getElementById("startGame").style.display != "block" && document.getElementById("gameOver").style.display != "block")
                pauseGame();
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



// //
// // start buttton
// //
// document.getElementById("startButton").addEventListener('click', function() {
//     document.getElementById("startGame").style.display = "none";
//     startGame();
// })



//
// chooseMode buttons
//
document.getElementById("startEndlesRunButton").addEventListener('click', function() {
    mode = modes[0];

    document.getElementById("startGameText").innerHTML = "Choose place";
    document.getElementById("chooseMode").style.display = "none";
    document.getElementById("chooseDifficulty").style.display = "none";
    document.getElementById("choosePlace").style.display = "block";
    // document.getElementById("infoBoxText").innerHTML = "Get as far as possible";
    document.getElementById("scorebord").innerHTML = "<u>scorebord</u><br>1: " + scorebord[0] + "<br>2: " + scorebord[1] + "<br>3: " + scorebord[2];
})

document.getElementById("startCampaignButton").addEventListener('click', function() {
    mode = modes[1];

    changePlace(places[1]);
    // // document.getElementById("infoBox").style.display = "block";
    // document.getElementById("startGame").style.display = "none";
    document.getElementById("startGameText").innerHTML = "Choose difficulty";
    document.getElementById("chooseMode").style.display = "none";
    document.getElementById("choosePlace").style.display = "none";
    document.getElementById("chooseDifficulty").style.display = "block";
    document.getElementById("infoBoxText").innerHTML = "Get to the space ship";
    document.getElementById("scorebord").innerHTML = "";
})



//
// choosePlace buttons
//
document.getElementById("sandyRocksButton").addEventListener('click', function() {
    changePlace(places[1]);
    document.getElementById("infoBox").style.display = "block";
    document.getElementById("choosePlace").style.display = "none";
    document.getElementById("chooseDifficulty").style.display = "none";
    document.getElementById("startGame").style.display = "none";
})

document.getElementById("spaceButton").addEventListener('click', function() {
    changePlace(places[0])
    document.getElementById("infoBox").style.display = "block";
    document.getElementById("choosePlace").style.display = "none";
    document.getElementById("chooseDifficulty").style.display = "none";
    document.getElementById("startGame").style.display = "none";
})

document.getElementById("forestButton").addEventListener('click', function() {
    changePlace(places[2])
    document.getElementById("infoBox").style.display = "block";
    document.getElementById("choosePlace").style.display = "none";
    document.getElementById("chooseDifficulty").style.display = "none";
    document.getElementById("startGame").style.display = "none";
})



//
// chooseDifficulty buttons
//
document.getElementById("easyButton").addEventListener('click', function() {
    document.getElementById("startGame").style.display = "none";
    document.getElementById("infoBox").style.display = "block";
    neededScore = [20, 30, 40];
})

document.getElementById("mediumButton").addEventListener('click', function() {
    document.getElementById("startGame").style.display = "none";
    document.getElementById("infoBox").style.display = "block";
    neededScore = [75, 100, 150];
})

document.getElementById("hardButton").addEventListener('click', function() {
    document.getElementById("startGame").style.display = "none";
    document.getElementById("infoBox").style.display = "block";
    neededScore = [100, 150, 200];
})



// 
// home button
//
document.getElementById("homeButton").addEventListener('click', function() {
    gameOver();
    running = false;
    document.getElementById("explosion").style.display = "none";
    speeder.style.bottom = "150px";
    speeder.style.transform = "rotate(0deg)";
    
    document.getElementById("startGameText").innerHTML = "Start game";
    document.getElementById("startGame").style.display = "block";
    document.getElementById("chooseMode").style.display = "block";
    document.getElementById("choosePlace").style.display = "none";
    document.getElementById("chooseDifficulty").style.display = "none";

    var objects = document.getElementsByClassName("object");
    var amountOfObjects = objects.length;
    for(let i=0; i<amountOfObjects; i++){
        if(objects[0]!=undefined){
            objects[0].remove();
        }
    }

    document.getElementById("gameOver").style.display = "none";
    document.getElementById("continueGame").style.display = "none";
})



// //
// // change place button
// //
// document.getElementById("changePlace").addEventListener('click', function() {
//     if(document.getElementById("changePlace").innerHTML == "sandyRocks") {
//         document.getElementById("changePlace").innerHTML = "space";
//         place = "space";
//         changePlace();
//     } else {
//         document.getElementById("changePlace").innerHTML = "sandyRocks";
//         place = "sandyRocks";
//         changePlace();
//     }
// })



// //
// // show hitbox input
// //
// document.getElementById("showHitBoxInput").addEventListener('change', function() {
//     if(document.getElementById("showHitBoxInput").checked) {
//         showHitBoxes = true;
//         speeder.style.backgroundColor = "grey";
//     } else {
//         showHitBoxes = false;
//         speeder.style.backgroundColor = "transparent";
//     }
// })



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
// music
//
// window.addEventListener("DOMContentLoaded", event => {
//     const audio = document.querySelector("audio");
//     audio.volume = 0.2;
//     audio.play();
// });