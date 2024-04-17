var months = ["jan", "feb", "mar", "apr", "may", "jun","jul","aug","sep","oct","nov","dec"];
var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var score = 0;

function generateDate(from, to) {
    return new Date(from.getTime() + Math.random()*(to.getTime() - from.getTime()));
}

function check(day){
    if(day == days[date.getDay()]){
        document.getElementById("ans").innerHTML = "correct";
        score++;
        document.getElementById("showScore").innerHTML = score;
    } else {
      document.getElementById("ans").innerHTML = "wrong, it's " + days[date.getDay()];
    }
}

function next() {
    date = generateDate(new Date(1500,5,3), new Date());
    document.getElementById("dateH2").innerHTML = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
    document.getElementById("ans").innerHTML = "";
}

var date = generateDate(new Date(1500,5,3), new Date());
document.getElementById("dateH2").innerHTML = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();