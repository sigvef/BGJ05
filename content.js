function Content(type, value) {
    this.type  = type;
    this.value = value;
};

// coins.
Content.COINS = {
TOP:   0,
       MID:   1,
       LOW:   2,
       BONUS: 3
};

Content.POWERUPS = {
SPEED: 0,
       GODMODE: 1,
       BREAKER: 2
};

Content.LIVES = {
LIFE: 0
};



// types.
Content.COIN    = "coin";
Content.POWERUP = "powerup";
Content.LIVE    = "life";

Content.prototype.getValue = function() {
    switch (this.value) {
        case Content.COINS.BONUS: return 100;
        case Content.COINS.TOP:   return 10;
        case Content.COINS.MID:   return 5;
        case Content.COINS.LOW:   return 1;
        case Content.POWERUPS.GODMODE: return 5;
        case Content.POWERUPS.SPEED:   return 5;
        case Content.POWERUPS.BREAKER:   return 5;
        case Content.LIVES.LIFE:   return 20;
    }
    return 0;
};

Content.prototype.isCoin = function() {
    return this.type == Content.COIN;
};

Content.prototype.isBonus = function() {
    return this.value == Content.COINS.BONUS;
};

Content.prototype.isPowerup = function() {
    return this.type == Content.POWERUP;
};

Content.prototype.isLife = function() {
    return this.type == Content.LIVE;
};
