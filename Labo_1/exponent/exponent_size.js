function exponent_size(size) {
    if (size < 9) {
        return 2;
    }
    else if (size < 128) {
        //estimation de la fonction suivant "IEEE std 754-2008", formule wolframealpha : quadratic fit {(16;5),(32;8),(64;11),(128;15)}, R_2 0.994108
        return Math.round(-0.000588038 * Math.pow(size, 2) + 0.171371 * size + 2.66667);
    }
    else {
        //IEEE Std 754-2008 e > 128 : round(4 ×log2 (k)) – 13
        return Math.round(4 * Math.log2(size) - 13);
    }
} 
