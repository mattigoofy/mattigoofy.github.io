var months = ["jan", "feb", "mar", "apr", "may", "jun","jul","aug","sep","oct","nov","dec"];
var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function generateDate(from, to) {
    return new Date(from.getTime() + Math.random()*(to.getTime() - from.getTime()));
}

function check(day){
    setAnsDiv();
    timesPlayed++;

    if(day == days[date.getDay()]){
        document.getElementById("ans").innerHTML = "<br><br>correct";
        score++;
        currentStreak++;
    } else {
        document.getElementById("ans").innerHTML = "<br><br>wrong, it's " + days[date.getDay()];
        currentStreak = 0;    
    }
    if(currentStreak>longestStreak){longestStreak = currentStreak;}
    updateStats();
}

function next() {
    document.getElementById("ans").style.display = "none";
    date = generateDate(new Date(1500,5,3), new Date());
    document.getElementById("dateH2").innerHTML = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
    document.getElementById("ans").innerHTML = "";
}

var date = generateDate(new Date(1500,5,3), new Date());
document.getElementById("dateH2").innerHTML = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

function setAnsDiv(){
    ansDiv = document.getElementById("ans");
    circleDiv = document.getElementById("circle");

    ansDiv.style.display = "block";
    ansDiv.style.top = circleDiv.getBoundingClientRect().top + "px";
    ansDiv.style.left = circleDiv.getBoundingClientRect().left + "px";
    ansDiv.style.width = (circleDiv.getBoundingClientRect().right - circleDiv.getBoundingClientRect().left) + "px";
    ansDiv.style.height = (circleDiv.getBoundingClientRect().bottom - circleDiv.getBoundingClientRect().top) + "px";
}