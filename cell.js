function Cell(isWall) {
    this.wall = isWall;
    this.broken = false;
    this.content = null;
};

Cell.prototype.setAsPath = function() {
    this.wall = false;
};

Cell.prototype.setBroken = function() {
    this.broken = true;
    this.wall = false;
};

Cell.prototype.isWall = function() {
    return this.wall;
};

Cell.prototype.isPath = function() {
    return ! this.wall;
};

Cell.prototype.hasContent = function() {
    return this.content !== null;
};

Cell.prototype.removeContent = function() {
    return this.content = null;
};
