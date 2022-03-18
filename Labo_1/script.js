function submit_process() {
    const target = parseFloat($("target_value").value);
    const nbBits = parseInt($("b_value").value);

    if (isNaN(target) || isNaN(nbBits))
        return window.alert("Veuillez entrer des nombres");

    const float_number = encode_to_float(target, nbBits);
    const float_code = decode_to_float(float_number);

    console.log(`Encode : ${float_number}`);
    console.log(`Decode ; ${float_code}`);
}

function encode_to_float(target, nbBits) {
    const sign = target < 0 ? 1 : 0;
    const e = Math.ceil(Math.log2(Math.abs(target)));
    const e_length = exponent_size(nbBits);
    const d = Math.pow(2, e_length - 1) - 2;
    const exponent_value = e + d;
    const n = nbBits - 1 - e_length;
    const mantis_array = [];

    let M = 0.5;
    let base = Math.pow(2, e);

    for (let k = 0; k < n; k++) {
        const divider = 4 * Math.pow(2, k);

        if ((M + 1 / divider) * base <= target) {
            M += 1 / divider;
            mantis_array.push(1);
        }
        else {
            mantis_array.push(0);
        }
    }

    return [sign, ...intToBinary(exponent_value, e_length), ...mantis_array];
}

/**
 * 
 * @param {Array<Number>} float_number The array with the binary code
 * @returns {String}
 */
function decode_to_float(float_number) {
    const length = float_number.length;
    const exponent_length = exponent_size(length);
    const mantisse_length = length - 1 - exponent_length;
    const d = Math.pow(2, exponent_length-1) - 2;
    
    const sign = float_number[0];
    let e = [];
    let mantisse = [];

    for (let k = 1; k < exponent_length+1; k++) {
        e.push(float_number[k]);
    }

    for (let k = exponent_length+1; k < length; k++) {
        mantisse.push(float_number[k]);
    }

    let exponent = binaryToInt(e);
    exponent -= d;

    console.log(exponent);

    let float_code = Math.pow(2, exponent);

    console.log(float_code);

    let m = 0.5;
    for (let k = 0; k < mantisse_length; k++) {
        const divider = 4 * Math.pow(2, k);

        if(mantisse[k] == 1)
        {
            m += 1/divider;
        }
    }

    float_code *= m * ((-2*sign) + 1);
    
    return float_code;
}

/**
 * @brief Transforms an Integer to a Binary array
 * @param {Number} int An integer
 * @param {Number} length The length of the binary code
 * @returns {Array<Number>} Binary array
 */
function intToBinary(int, length) {
    const binaryArray = [];

    if (isNaN(int)) return binaryArray;

    while (int != 0) {
        binaryArray.push(int % 2);
        int = parseInt(int / 2);
    }

    while (binaryArray.length != length) {
        binaryArray.push(0);
    }

    return binaryArray.reverse();
}

/**
 * @brief Transforms a binary array to an Integer
 * @param {Array<Number>} binary The binary array
 * @returns {Number} The Integer
 */
 function binaryToInt(binary) {
    let int = 0;

    const array = binary.reverse();

    for (let k = 0; k < array.length; k++) {
        int += array[k] * Math.pow(2, k);
    }

    return int;
}

/**
 * Gets an HTML element by its ID
 * @param {String} id The id
 * @returns {HTMLElement} The element
 */
function $(id) {
    return document.getElementById(id);
}

function exponent_size(size) {
    if (size < 12) {
        return 5;
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