class Cell {
  constructor (x, y) {
    this.place = [x, y];
    this.isBomb = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this.neighborCount = 0;

    this.btnID = "btn" + x + "," + y;
  }

  reveal() {

  }

  countBombs() {}

  countFlags() {}
}