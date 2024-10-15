class Cell {
  constructor (x, y, ROWS, COLS, BOMBS) {
    this.place = [x, y];
    this.isBomb = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this.neighborCount = 0;
    this.ROWS = ROWS;
    this.COLS = COLS;
    this.BOMBS = BOMBS;

    this.btnID = x + "," + y;
  }

  reveal() {
    if(!this.isRevealed && !this.isFlagged) {
      revealedSquares++;
      if(this.ROWS*this.COLS-this.BOMBS == revealedSquares) {
          setTimeout(() => won(), 1);
      }
      this.isRevealed = true;
      document.getElementById(this.btnID).className = "revealed";
  
      if(this.isBomb){
        document.getElementById(this.btnID).className = "bomb";
        setTimeout(()=> {gameOver(this.ROWS, this.COLS)}, 1);
        return;
      } else {
        if(this.neighborCount != 0) {
          document.getElementById(this.btnID).innerHTML = this.neighborCount;
        }
      }
  
      if(this.neighborCount == 0) {
        for(let i=this.place[0]-1; i<=this.place[0]+1; i++) {
          for(let j=this.place[1]-1; j<=this.place[1]+1; j++) {
            if(i>=0 && i<this.ROWS && j>=0 && j<this.COLS){
  
              var neighbor = cells[i][j];
              if(!(i==this.place[0] && j==this.place[1]) && !neighbor.isRevealed) {
                  neighbor.reveal();
              }
            }
          }
        }
      }

    }
  }

  countBombs(cells) {
    this.neighborCount = 0;
    for(let k=this.place[0]-1; k<=this.place[0]+1; k++) {
      for(let l=this.place[1]-1; l<=this.place[1]+1; l++){
        // console.log(k + "," +  l)
        // console.log(cells)
        if(k>=0 && k<cells.length && l>=0 && l<cells[0].length) {
          if(cells[k][l].isBomb){
              this.neighborCount++;
          }
        }
      }
    }
    // document.getElementById(this.btnID).innerHTML = this.neighborCount;
  }

  cord() {
    var flagCount = 0;
    for(let i=this.place[0]-1; i<=this.place[0]+1; i++) {
      for(let j=this.place[1]-1; j<=this.place[1]+1; j++) {
        if(i>=0 && i<this.ROWS && j>=0 && j<this.COLS){
          if(cells[i][j].isFlagged) {
            flagCount++;
          }
        }
      }
    }

    if(flagCount == this.neighborCount) {   
      for(let i=this.place[0]-1; i<=this.place[0]+1; i++) {
        for(let j=this.place[1]-1; j<=this.place[1]+1; j++) {
          if(i>=0 && i<this.ROWS && j>=0 && j<this.COLS){
            if(!cells[i][j].isFlagged && !isGameOver){
              cells[i][j].reveal();
            }
          }          
        }
      }
    }
  }
}