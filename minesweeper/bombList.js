const bombList = new function() {
    this.list = [];
    this.rows;
    this.cols;

    this.containsBomb = function(x, y) {
        for(let i=0; i<this.list.length; i++) {
            if(this.list[i][0] == x && this.list[i][1] == y) {
                return true;
            }
        }
    }

    this.findBomb = function(x, y) {
        for(let i=0; i<this.list.length; i++) {
            if(this.list[i][0] == x && this.list[i][1] == y) {
                return i;
            }
        }
    }

    this.moveBomb = function moveBomb(i, j, BOMBS) {
        do {
            // var x = Math.floor(Math.random()*(ROWS-1));
            // var y = Math.floor(Math.random()*(COLS-1));
            var x = Math.floor(Math.random()*(this.rows));
            var y = Math.floor(Math.random()*(this.cols));
        } while(this.containsBomb(x, y))
            
        this.list.push([x,y]);
        let idx = this.findBomb(i, j);
        this.list.splice(idx,1);
        createField(this.rows, this.cols, BOMBS);
    }

    this.addBombs = function(BOMBS) {
        this.list = [];
        for(let i=0; i<BOMBS; i++) {
            do {
                // var x = Math.floor(Math.random()*(ROWS-1));
                // var y = Math.floor(Math.random()*(COLS-1));
                var x = Math.floor(Math.random()*(this.rows));
                var y = Math.floor(Math.random()*(this.cols));
            } while(this.containsBomb(x,y))
                
            this.list.push([x,y])
        }
    }
}