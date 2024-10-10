var ROWS = 8;
var COLS = 10;
var BOMBS = 2;
var bombList = [];
var revealedSquares = 0;

function createField() {
    revealedSquares = 0;
    var TABLE = document.getElementById("field");
    TABLE.innerHTML = "";

    for(let i=0; i<ROWS; i++) {
        var row = document.createElement("tr");

        for(let j=0; j<COLS; j++) {
            var col = document.createElement("td");
            col.id = i + "," + j
            // console.log([i,j])
            // col.innerHTML = bombList.includes([i,j])? "o": "x";
            // var text;
            if(containsBomb(bombList, i, j)) {
                var text = document.createTextNode("X");
                col.appendChild(text)
                col.className = "bomb";
                // col.innerHTML = "x";
            }

            row.appendChild(col);
        }
        TABLE.appendChild(row);
    }

    for(let i=0; i<ROWS; i++) {
        for(let j=0; j<COLS; j++) {
            var counter = 0;
            if(!containsBomb(bombList, i, j)){
                for(let k=i-1; k<=i+1; k++) {
                    for(let l=j-1; l<=j+1; l++){
                        if(containsBomb(bombList, k, l)){
                            counter++;
                        }
                    }
                }
                if(counter == 0) {
                    document.getElementById(i + "," + j).innerHTML = ".";
                    document.getElementById(i + "," + j).className = "empty"
                } else {
                    document.getElementById(i + "," + j).innerHTML = counter;
                }
            }
            var btn = document.createElement("button");
            btn.addEventListener('mousedown', function(e) {
                if(e.which === 1 || e.button === 0) {
                    this.style.display = "none";
                    document.getElementById(i + "," + j).className += " revealed";
                    if(document.getElementById(i + "," + j).className.includes("bomb")) {
                        setTimeout(()=> {gameOver()}, 1);
                    } else if(document.getElementById(i + "," + j).className.includes("empty")) {
                        emptySquares(i, j);
                    }

                    revealedSquares++;
                    if(ROWS*COLS-BOMBS == revealedSquares) {
                        setTimeout(() => won());
                    }
                } else if(e.which === 3 || e.button === 2) {
                    this.style.backgroundColor = "red";
                }
            })
            document.getElementById(i + "," + j).appendChild(btn);
        }
    }
}

function addBombs(BOMBS) {
    bombList = [];
    for(let i=0; i<BOMBS; i++) {
        do {
        var x = Math.floor(Math.random()*ROWS);
        var y = Math.floor(Math.random()*COLS);
        } while(bombList.includes([x,y]))
            
        bombList.push([x,y])
    }
    // bombList = [[0, 8], [3, 2], [7, 6], [5, 3], [2, 2], [6, 7], [4, 0], [1, 6], [3, 6],[4, 4]];
}

function containsBomb(bombList, x, y) {
    for(let i=0; i<bombList.length; i++) {
        if(bombList[i][0] == x && bombList[i][1] == y) {
            return true;
        }
    }
}

function gameOver() {
    alert("Game over");
    addBombs(BOMBS);
    createField();
}

function won() {
    alert("You won");
    addBombs(BOMBS);
    createField();
}

function emptySquares(x, y) {
    // console.log("emptying")
    console.log(x, y);
    for(let i=x-1; i<=x+1; i++) {
        for(let j=y-1; j<=y+1; j++) {
            if(i>=0 && i<ROWS && j>=0 && j<COLS){
                // console.log(i + "," + j);

                var neighbor = document.getElementById(i + "," + j);
                // console.log(neighbor);
                if(neighbor.className.includes("empty") && !(i==x && j==y) && !neighbor.className.includes("revealed")) {
                    emptySquares(i, j);
                }

                document.getElementById(i + "," + j).getElementsByTagName("button")[0].style.display = "none";
                if(!document.getElementById(i + "," + j).className.includes("revealed")){
                    document.getElementById(i + "," + j).className += " revealed";
                    revealedSquares++;
                }
                // var query = "#" + i + "," + j + " > button";
                // console.log(query);
                // console.log(document.querySelector(query));
                // document.querySelector(query)[0].style.display = "none";
            }
        }
    }
}

function revealSquare(x, y) {

}

addBombs(BOMBS);
createField();


function onMouseDown(e)
{
    if (e.which === 1 || e.button === 0)
    {
        console.log('"Left" at ' + e.clientX + 'x' + e.clientY);
    }

    if (e.which === 2 || e.button === 1)
    {
        console.log('"Middle" at ' + e.clientX + 'x' + e.clientY);
    }

    if (e.which === 3 || e.button === 2)
    {
        console.log('"Right" at ' + e.clientX + 'x' + e.clientY);
    }

    if (e.which === 4 || e.button === 3)
    {
        console.log('"Back" at ' + e.clientX + 'x' + e.clientY);
    }

    if (e.which === 5 || e.button === 4)
    {
        console.log('"Forward" at ' + e.clientX + 'x' + e.clientY);
    }
}

window.addEventListener('mousedown', onMouseDown);
document.addEventListener('contextmenu', e => e?.cancelable && e.preventDefault())