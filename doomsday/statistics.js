var score = localStorage.getItem("score");

var timesPlayed = localStorage.getItem("timesPLayed");

var currentStreak = localStorage.getItem("currentStreak");

var longestStreak = localStorage.getItem("longestStreak");

showStats();

function showStats(){
    document.getElementById("showScore").innerHTML = score;
    document.getElementById("showTimesPlayed").innerHTML = timesPlayed;
    document.getElementById("showCurrentStreak").innerHTML = currentStreak;
    document.getElementById("showLongestStreak").innerHTML = longestStreak;
}

function updateStats() {
    localStorage.setItem("score", score);
    localStorage.setItem("currentStreak", currentStreak);
    localStorage.setItem("longestStreak", longestStreak);
    localStorage.setItem("timesPlayed", timesPlayed);
}