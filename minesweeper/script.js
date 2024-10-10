var ROWS = 8;
var COLS = 10;
var BOMBS = 4;
var bombList = [];
var revealedSquares = 0;
var cells = [];

function createField() {
    if(Number.isInteger(parseInt(document.getElementById("rowsIn").value))) {
        ROWS = document.getElementById("rowsIn").value
    }
    if(Number.isInteger(parseInt(document.getElementById("colsIn").value))) {
        COLS = document.getElementById("colsIn").value
    }
    if(Number.isInteger(parseInt(document.getElementById("bombsIn").value))) {
        BOMBS = document.getElementById("bombsIn").value
    }

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
            // cells[i][j] = cell;
            cellRow.push(cell);
            // col.id = i + "," + j
            // console.log([i,j])
            // col.innerHTML = bombList.includes([i,j])? "o": "x";
            // var text;
            if(containsBomb(bombList, i, j)) {
                // var text = document.createTextNode("X");
                // col.appendChild(text)
                // col.className = "bomb";
                // col.innerHTML = "x";
                cell.isBomb = true;
            }
            var btn = document.createElement("button");
            btn.id = i + "," + j;
            btn.addEventListener('mousedown', function(e) {
                place = this.id.split(",")
                if(e.which === 1 || e.button === 0) {
                    if(!cells[place[0]][place[1]].isFlagged) {
                        // this.style.display = "none";
                        // document.getElementById(i + "," + j).className += " revealed";
                        // console.log(cells[place[0]][place[1]]);
                        if(cells[place[0]][place[1]].isBomb) {
                            setTimeout(()=> {gameOver()}, 1);
                            return;
                        } else if(!cells[place[0]][place[1]].isRevealed){
                            cells[place[0]][place[1]].reveal();
                        } else {
                            cells[place[0]][place[1]].cord();
                        }

                        // revealedSquares++;
                        // if(ROWS*COLS-BOMBS == revealedSquares) {
                        //     setTimeout(() => won());
                        // }
                    } else {
                        this.className = "";
                        cells[place[0]][place[1]].isFlagged = false;
                    }
                } else if(e.which === 3 || e.button === 2) {                    
                    if(!cells[place[0]][place[1]].isRevealed) {
                        if(!cells[place[0]][place[1]].isFlagged) {
                            this.className = "flagged"
                            cells[place[0]][place[1]].isFlagged = true;
                        } else{
                            // this.style.backgroundColor = "#F6F6F6";
                            this.className = "";
                            cells[place[0]][place[1]].isFlagged = false;

                        }
                    }
                }
            })
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
                // console.log(cells[i][j].neighborCount)
            }
            // var counter = 0;
            // if(!containsBomb(bombList, i, j)){
            //     for(let k=i-1; k<=i+1; k++) {
            //         for(let l=j-1; l<=j+1; l++){
            //             if(containsBomb(bombList, k, l)){
            //                 counter++;
            //             }
            //         }
            //     }
            //     if(counter == 0) {
            //         document.getElementById(i + "," + j).innerHTML = ".";
            //         document.getElementById(i + "," + j).className = "empty"
            //     } else {
            //         document.getElementById(i + "," + j).innerHTML = counter;
            //     }
            // }
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
    revealedSquares = ROWS*COLS;
    for(let i=0; i<ROWS; i++) {
        for(let j=0; j<COLS; j++) {
            cells[i][j].reveal();
        }
    }
    setTimeout(() =>{alert("Game over")}, 200);
    // alert("Game over");
}

function won() {
    alert("You won");
}


addBombs(BOMBS);
createField();


document.getElementById("restartBtn").addEventListener('click', function() {
    addBombs(BOMBS);
    createField();
})

document.addEventListener('contextmenu', e => e?.cancelable && e.preventDefault())