class Cell {
  constructor (x, y) {
    this.place = [x, y];
    this.isBomb = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this.neighborCount = 0;

    this.btnID = x + "," + y;
  }

  reveal() {
    if(!this.isRevealed && !this.isFlagged) {
      revealedSquares++;
      if(ROWS*COLS-BOMBS == revealedSquares) {
          setTimeout(() => won(), 1);
      }
      this.isRevealed = true;
      document.getElementById(this.btnID).className = "revealed";
  
      if(this.isBomb){
        document.getElementById(this.btnID).className = "bomb";
        setTimeout(()=> {gameOver()}, 1);
        return;
      } else {
        if(this.neighborCount != 0) {
          document.getElementById(this.btnID).innerHTML = this.neighborCount;
        }
      }
  
      if(this.neighborCount == 0) {
        for(let i=this.place[0]-1; i<=this.place[0]+1; i++) {
          for(let j=this.place[1]-1; j<=this.place[1]+1; j++) {
            if(i>=0 && i<ROWS && j>=0 && j<COLS){
  
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
        if(k>=0 && k<ROWS && l>=0 && l<COLS) {
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
        if(i>=0 && i<ROWS && j>=0 && j<COLS){
          if(cells[i][j].isFlagged) {
            flagCount++;
          }
        }
      }
    }

    if(flagCount == this.neighborCount) {   
      for(let i=this.place[0]-1; i<=this.place[0]+1; i++) {
        for(let j=this.place[1]-1; j<=this.place[1]+1; j++) {
          if(i>=0 && i<ROWS && j>=0 && j<COLS){
            if(!cells[i][j].isFlagged && !isGameOver){
              cells[i][j].reveal();
            }
          }          
        }
      }
    }
  }
}