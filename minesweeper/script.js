var ROWS = 8;
var COLS = 10;
var BOMBS = 4;
var bombList = [];
var revealedSquares = 0;
var cells = [];
var isGameOver = false;

function createField() {
    cells = [];
    revealedSquares = 0;
    var TABLE = document.getElementById("field");
    TABLE.innerHTML = "";

    for(let i=0; i<ROWS; i++) {
        var row = document.createElement("tr");
        var cellRow = [];

        for(let j=0; j<COLS; j++) {
            var col = document.createElement("td");
            var cell = new Cell(i, j);
            cellRow.push(cell);
            
            if(containsBomb(bombList, i, j)) {
                cell.isBomb = true;
            }
            var btn = document.createElement("button");
            btn.id = i + "," + j;
            btn.addEventListener('mousedown', cellClick)
            col.appendChild(btn);

            row.appendChild(col);
        }
        cells.push(cellRow);
        TABLE.appendChild(row);
    }

    for(let i=0; i<ROWS; i++) {
        for(let j=0; j<COLS; j++) {
            if(!cells[i][j].isBomb) {
                cells[i][j].countBombs(cells);
            }
        }
    }
}

function addBombs(BOMBS) {
    bombList = [];
    for(let i=0; i<BOMBS; i++) {
        do {
            // var x = Math.floor(Math.random()*(ROWS-1));
            // var y = Math.floor(Math.random()*(COLS-1));
            var x = Math.floor(Math.random()*(ROWS));
            var y = Math.floor(Math.random()*(COLS));
        } while(containsBomb(bombList, x,y))
            
        bombList.push([x,y])
    }
}

function moveBomb(BOMBS, i, j) {
    do {
        // var x = Math.floor(Math.random()*(ROWS-1));
        // var y = Math.floor(Math.random()*(COLS-1));
        var x = Math.floor(Math.random()*(ROWS));
        var y = Math.floor(Math.random()*(COLS));
    } while(containsBomb(bombList, x, y))
        
    bombList.push([x,y]);
    let idx = findBomb(bombList, i, j);
    bombList.splice(idx,1);
    createField();
}

function containsBomb(bombList, x, y) {
    for(let i=0; i<bombList.length; i++) {
        if(bombList[i][0] == x && bombList[i][1] == y) {
            return true;
        }
    }
}

function findBomb(bombList, x, y) {    
    for(let i=0; i<bombList.length; i++) {
        if(bombList[i][0] == x && bombList[i][1] == y) {
            return i;
        }
    }
}

function cellClick(e) {
    if(!isGameOver) {
        place = this.id.split(",")
        if(e.which === 3 || e.button === 2 || document.getElementById("setFlagInput").checked) {                    
            if(!cells[place[0]][place[1]].isRevealed) {
                if(!cells[place[0]][place[1]].isFlagged) {
                    this.className = "flagged"
                    cells[place[0]][place[1]].isFlagged = true;
                } else{
                    this.className = "";
                    cells[place[0]][place[1]].isFlagged = false;
                }
            }
        
        } else if((e.which === 1 || e.button === 0) || !document.getElementById("setFlagInput").checked) {
            if(!cells[place[0]][place[1]].isFlagged) {
                if(cells[place[0]][place[1]].isBomb) {
                    if(revealedSquares != 0) {
                        setTimeout(()=> {gameOver()}, 1);
                        return;
                    } else {
                        moveBomb(bombList, place[0], place[1]);
                        cells[place[0]][place[1]].reveal();
                    }
                } else if(!cells[place[0]][place[1]].isRevealed){
                    cells[place[0]][place[1]].reveal();
                } else {
                    cells[place[0]][place[1]].cord();
                }
            } else {
                this.className = "";
                cells[place[0]][place[1]].isFlagged = false;
            }
        }
    }
}

function gameOver() {
    isGameOver = true;
    
    revealedSquares = ROWS*COLS;
    for(let i=0; i<ROWS; i++) {
        for(let j=0; j<COLS; j++) {
            cells[i][j].reveal();
        }
    }
    setTimeout(() =>{
        // alert("Game over")
        document.getElementById("endGame").style.display = "block";
        document.getElementById("endGame").className = "lost";
        document.getElementById("endGame"). innerHTML = "GAME OVER";
    }, 200);
    // alert("Game over");
}

function won() {
    isGameOver = true;
    // alert("You won");
    document.getElementById("endGame").style.display = "block";
    document.getElementById("endGame").className = "won";
    document.getElementById("endGame"). innerHTML = "YOU WON";
}


function start() {
    if(Number.isInteger(parseInt(document.getElementById("rowsIn").value))) {
        ROWS = document.getElementById("rowsIn").value<100? document.getElementById("rowsIn").value: 8;
    } else {
        ROWS = 8;
    }
    if(Number.isInteger(parseInt(document.getElementById("colsIn").value))) {
        COLS = document.getElementById("colsIn").value<15? document.getElementById("colsIn").value: 10;
    } else {
        COLS = 10;
    }
    if(Number.isInteger(parseInt(document.getElementById("bombsIn").value))) {
        BOMBS = document.getElementById("bombsIn").value < ROWS*COLS? document.getElementById("bombsIn").value: 4;
    } else {
        BOMBS = 4;
    }

    revealedSquares = 0;
    addBombs(BOMBS);
    createField();
    isGameOver = false
}


document.getElementById("restartBtn").addEventListener('click', function() {
    start();
})

fieldEditors = document.getElementsByClassName("fieldEditors");
for(let i=0; i<fieldEditors.length; i++) {
    fieldEditors[i].addEventListener('change', function() {
        start();
    })
}

document.addEventListener('contextmenu', e => e?.cancelable && e.preventDefault())
document.getElementById("endGame").addEventListener('click', function() {
    this.style.display = "none";
})



start();
