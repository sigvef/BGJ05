try{
    var Coord = require('./coord');
    var Cell = require('./cell');
}catch(e){}

function Pattern(connections) {
    this.top = connections['top'];
    this.right = connections['right'];
    this.bottom = connections['bottom'];
    this.left = connections['left'];
};

Pattern.prototype.inCenter = function(index) {
    return index == 1;
};

Pattern.prototype.beforeCenter = function(index) {
    return index == 0;
};

Pattern.prototype.internalCellAt = function(row, col) {
    var isWall;

    if (this.inCenter(row) && this.inCenter(col)) {
        isWall = false;
    }
    else if (! (this.inCenter(row) || this.inCenter(col))) {
        isWall = true;
    }
    else if (this.top && this.beforeCenter(row) && this.inCenter(col)) {
        isWall = false;
    }
    else if (this.bottom && ! this.beforeCenter(row) && this.inCenter(col)) {
        isWall = false;
    }
    else if (this.left && this.beforeCenter(col) && this.inCenter(row)) {
        isWall = false;
    }
    else if (this.right && ! this.beforeCenter(col) && this.inCenter(row)) {
        isWall = false;
    }
    else {
        isWall = true;
    }

    return new Cell(isWall);
};

Pattern.translateGlobalToPattern = function(row, col) {
    var pattern_row = Math.floor(row / 3);
    var pattern_col = Math.floor(col / 3);
    return new Coord(pattern_row, pattern_col);
};

try{
    module.exports = Pattern;
}catch(e){}
