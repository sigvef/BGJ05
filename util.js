Array.shuffle = function(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (--counter > -1) {
        // Pick a random index
        index = (Math.random() * counter) | 0;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

Math.roll = function(chance) {
        return Math.random() < chance;
};
