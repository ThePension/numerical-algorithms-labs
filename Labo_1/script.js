/**
 * @brief Run all unit tests
 */
function runAllTests() {
    // BINARY SUBTRACTION
    testBinarySubtraction1();
    testBinarySubtraction2();
    testBinarySubtraction3();
    testBinarySubtraction4();

    // BINARY ADDITION
    testBinaryAddition();

    // MANTISSA SHIFTING
    testMantisShifting();

    // FLOAT ADDITION
    testFloatAddition1();
    testFloatAddition2();
    testFloatAddition3();

    // FLOAT SUBTRACTION
    testFloatSubtraction1();
    testFloatSubtraction2();
    testFloatSubtraction3();
}

/**
 * @brief Process the user input and then encode, decode and display the number
 */
function submit_conversion() {
    const target = parseFloat($("target_value").value);
    const nbBits = parseInt($("b_value").value);

    if (isNaN(target) || isNaN(nbBits))
        return window.alert("Veuillez entrer des nombres");

    if (nbBits < 7 || nbBits > 256)
        return window.alert("Le nombre de bits doit être entre 7 et 256");

    const float_number = encode_to_float(target, nbBits);
    const float_code = decode_to_float(float_number);

    $('binary_code').innerText = `Code binaire après encodage : ${float_number.join('')}`;
    $('binary_decode').innerText = `Code float après décodage : ${float_code}`;
}

/**
 * 
 */
function submit_decode(){
    const target = $("binary_value").value.split('').map(b => b = parseInt(b));
    
    if(target.filter(b => Math.abs(b) > 1).length > 0)
    {
        $('binary_code').innerText = `Binary input not valid...`;
        return;
    }

    if (target.length < 1)
        return window.alert("Veuillez entrer des nombres");

    const float_code = decode_to_float(target);
    const float_number = encode_to_float(float_code, target.length);

    $('binary_code').innerText = `Code binaire après encodage : ${float_number.join('')}`;
    $('binary_decode').innerText = `Code float après décodage : ${float_code}`;
}

/**
 * @brief Process the user input (two number), encode the numbers, add them, and then display the number
 */
function submit_addition() {
    const num1 = parseFloat($("num1").value);
    const num2 = parseFloat($("num2").value);
    const nbBits = parseInt($("b_value").value);

    if (isNaN(num1) || isNaN(num2) || isNaN(nbBits))
        return window.alert("Veuillez entrer des nombres");

    if (nbBits < 7 || nbBits > 256)
        return window.alert("Le nombre de bits doit être entre 7 et 256");

    const float_number = float_addition(num1, num2, nbBits);
    const float_code = decode_to_float(float_number);

    $('binary_code_addition').innerText = `Code binaire après encodage : ${float_number.join('')}`;
    $('binary_decode_addition').innerText = `Code float après décodage : ${float_code}`;
}

function submit_subtraction() {
    const num1 = parseFloat($("num1_sub").value);
    const num2 = parseFloat($("num2_sub").value);
    const nbBits = parseInt($("b_value").value);

    if (isNaN(num1) || isNaN(num2) || isNaN(nbBits))
        return window.alert("Veuillez entrer des nombres");

    if (nbBits < 7 || nbBits > 256)
        return window.alert("Le nombre de bits doit être entre 7 et 256");

    const float_number = float_subtraction(num1, num2, nbBits);
    const float_code = decode_to_float(float_number);

    $('binary_code_subtraction').innerText = `Code binaire après encodage : ${float_number.join('')}`;
    $('binary_decode_subtraction').innerText = `Code float après décodage : ${float_code}`;
}

function float_subtraction(num1, num2, nbBits) {
    const e_length = exponent_size(nbBits);

    const target_abs1 = Math.abs(num1);
    let e1 = Math.ceil(Math.log2(target_abs1));

    const target_abs2 = Math.abs(num2);
    let e2 = Math.ceil(Math.log2(target_abs2));

    let exponent_diff = Math.abs(e1 - e2);

    let maxExponent = 0;

    let mantis_array1 = getMantis(num1, nbBits, e1, e_length); // Get mantis of number 1
    let mantis_array2 = getMantis(num2, nbBits, e2, e_length); // Get mantis of number 2

    // NORMALIZE MANTIS 1
    while (mantis_array1.includes(1) && mantis_array1[0] == 0) {
        mantis_array1.shift();
        mantis_array1.push(0);
        e1 -= 1;
    }

    // NORMALIZE MANTIS 2
    while (mantis_array2.includes(1) && mantis_array2[0] == 0) {
        mantis_array2.shift();
        mantis_array2.push(0);
        e2 -= 1;
    }

    mantis_array1.unshift(1); // Add hidden bit (1)
    mantis_array2.unshift(1); // Add hidden bit (1)

    if (e1 > e2) {
        maxExponent = e1;

        // Shift mantis of number2 by exponent_diff
        mantis_array2 = shiftMantis(mantis_array2, exponent_diff);
    } else {
        maxExponent = e2;

        // Shift mantis of number1 by exponent_diff
        mantis_array1 = shiftMantis(mantis_array1, exponent_diff);
    }

    const sign = (num1 - num2) < 0 ? 1 : 0;
    let mantisRes_array = subBinaryNumbers(mantis_array1, mantis_array2);

    // NORMALIZE RESULTING MANTIS
    while (mantisRes_array.includes(1) && mantisRes_array[0] == 0) {
        mantisRes_array.shift();
        mantisRes_array.push(0);
        maxExponent -= 1;
    }

    mantisRes_array.shift(); // Remove hidden bit

    const d = Math.pow(2, e_length - 1) - 2;
    const exponent_value = maxExponent + d;

    return [sign, ...intToBinary(exponent_value, e_length), ...mantisRes_array];
}

function float_addition(num1, num2, nbBits) {
    // ZEROS
    if (num1 == 0) return encode_to_float(num2, nbBits);
    if (num2 == 0) return encode_to_float(num1, nbBits);

    const e_length = exponent_size(nbBits);

    const target_abs1 = Math.abs(num1);
    const e1 = Math.ceil(Math.log2(target_abs1));

    const target_abs2 = Math.abs(num2);
    const e2 = Math.ceil(Math.log2(target_abs2));

    let exponent_diff = Math.abs(e1 - e2);

    let maxExponent = 0;

    let mantis_array1 = getMantis(num1, nbBits, e1, e_length); // Get mantis of number 1
    let mantis_array2 = getMantis(num2, nbBits, e2, e_length); // Get mantis of number 2

    mantis_array1.unshift(1); // Add hidden bit (1)
    mantis_array2.unshift(1); // Add hidden bit (1)

    if (e1 > e2) {
        maxExponent = e1;

        // Shift mantis of number2 by exponent_diff
        mantis_array2 = shiftMantis(mantis_array2, exponent_diff);
    } else {
        maxExponent = e2;

        // Shift mantis of number1 by exponent_diff
        mantis_array1 = shiftMantis(mantis_array1, exponent_diff);
    }

    let sign = 0;
    let mantisRes_array;

    if (num1 > 0 && num2 > 0) { // + +
        sign = 0;
        mantisRes_array = addBinaryNumbers(mantis_array1, mantis_array2);
    } else if (num1 < 0 && num2 < 0) { // - -
        sign = 1;
        mantisRes_array = addBinaryNumbers(mantis_array1, mantis_array2);
    } else { // - + OR + -
        return float_subtraction(num1, num2, nbBits);
    }

    // OVERFLOW
    let overflowDec = Math.abs(mantisRes_array.length - mantis_array1.length);
    if (overflowDec > 0) {
        for (let i = 0; i < overflowDec; i++) mantisRes_array.pop(); // Remove weaker bit
        maxExponent += overflowDec; // Increase exponent
    }

    // NORMALIZE MANTIS
    while (mantisRes_array.includes(1) && mantisRes_array[0] == 0) {
        mantisRes_array.shift();
        mantisRes_array.push(0);
        maxExponent -= 1;
    }

    mantisRes_array.shift(); // Remove hidden bit

    const d = Math.pow(2, e_length - 1) - 2;
    const exponent_value = maxExponent + d;

    return [sign, ...intToBinary(exponent_value, e_length), ...mantisRes_array];
}

function subBinaryNumbers(num1, num2) {
    let res = [];
    let borrow = 0;

    for (let i = num1.length - 1; i >= 0; i--) {
        // If borrow == 1, that means that the current bit of the top number has been borrowed
        // So we have to set it to 0 if the current bit == 1
        if (borrow == 1 && num1[i] == 1) {
            num1[i] = 0;
            borrow = 0;
        }

        if (num1[i] == 0 && num2[i] == 1) { // BORROW CASE
            res.unshift(1);
            borrow = 1;
        } else {
            res.unshift(Math.abs(num1[i] - num2[i]));
        }
    }

    if (borrow == 1) res[0] = 0;

    return res;
}

/**
 * @brief Add two binary numbers
 * 
 * @param {Array<Number>} num1 The first number
 * @param {Array<Number>} num2 The second number
 * @returns {Array<Number>} The result of the addition
 */
function addBinaryNumbers(num1, num2) {
    let resBinary = [];
    let carry = 0;
    for (let i = num1.length - 1; i >= 0; i--) {
        if (num1[i] == 1 && num2[i] == 1) {
            if (carry == 1) resBinary.push(1);
            else resBinary.push(0);
            carry = 1;
        } else {
            if (carry == 0) resBinary.push(num1[i] || num2[i]);
            else {
                if ((num1[i] || num2[i]) == 1) resBinary.push(0);
                else {
                    resBinary.push(1);
                    carry = 0;
                }
            }
        }
    }
    if (carry == 1) resBinary.push(1);
    return resBinary.reverse();
}

/**
 * @brief Shift a array
 * 
 * @param {Array<Number>} array The mantis
 * @param {Number} nbShifts The number of shifts needed
 * @returns {Array<Number>} The mantis shifter
 */
function shiftMantis(array, nbShifts) {
    for (let i = 0; i < nbShifts; i++) {
        array.pop();
        array.unshift(0);
    }
    return array;
}

/**
 * @brief Encode a number to binary array
 * 
 * @param {Number} target The number to encode
 * @param {Number} nbBits Length of the binary array
 * @returns {Array<Number>} Binary array
 */
function encode_to_float(target, nbBits) {
    if (target == 0) {
        return Array(nbBits).fill(0);
    }

    const target_abs = Math.abs(target);

    const sign = target < 0 ? 1 : 0;
    const e = Math.ceil(Math.log2(target_abs));
    const e_length = exponent_size(nbBits);
    const d = Math.pow(2, e_length - 1) - 2;
    const exponent_value = e + d;
    const mantis_array = getMantis(target, nbBits, e, e_length);

    return [sign, ...intToBinary(exponent_value, e_length), ...mantis_array];
}

/**
 * @brief Get the binary mantis of a number
 * 
 * @param {Number} target The number to get mantis from
 * @param {*} nbBits Length of the binary array
 * @param {*} exponent Exponent of the number
 * @param {*} exponent_length Length of the exponent
 * @returns {Array<Number>} Binary array
 */
function getMantis(target, nbBits, exponent, exponent_length) {
    const n = nbBits - 1 - exponent_length;
    const mantis_array = [];
    const target_abs = Math.abs(target);

    let M = 0.5;
    let base = Math.pow(2, exponent);

    for (let k = 0; k < n; k++) {
        const divider = 4 * Math.pow(2, k);

        if ((M + 1 / divider) * base <= target_abs) {
            M += 1 / divider;
            mantis_array.push(1);
        } else {
            mantis_array.push(0);
        }
    }

    return mantis_array;
}

/**
 * @brief Decode the binary code to a number
 * 
 * @param {Array<Number>} float_number The array with the binary code
 * @returns {Number}
 */
function decode_to_float(float_number) {
    const length = float_number.length;
    const exponent_length = exponent_size(length);
    const mantisse_length = length - 1 - exponent_length;
    const d = Math.pow(2, exponent_length - 1) - 2;
    const sign = float_number[0];

    let e = [];
    let mantisse = [];

    for (let k = 1; k < exponent_length + 1; k++) {
        e.push(float_number[k]);
    }

    for (let k = exponent_length + 1; k < length; k++) {
        mantisse.push(float_number[k]);
    }

    const exponent = binaryToInt(e) - d;
    let float_code = Math.pow(2, exponent);

    let m = 0.5;
    for (let k = 0; k < mantisse_length; k++) {
        const divider = 4 * Math.pow(2, k);

        if (mantisse[k] == 1) {
            m += 1 / divider;
        }
    }

    float_code *= m * ((-2 * sign) + 1);

    return float_code;
}

/**
 * @brief Transforms an Integer to a Binary array
 * 
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
 * 
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
 * @brief Gets an HTML element by its ID
 * 
 * @param {String} id The id
 * @returns {HTMLElement} The element
 */
function $(id) {
    return document.getElementById(id);
}

/**
 * @brief Returns the length of the exponent part
 * 
 * @param {Number} size The number of bits for the binary code
 * @returns {Number}
 */
function exponent_size(size) {
    if (size < 12) {
        return 5;
    } else if (size < 128) {
        //estimation de la fonction suivant "IEEE std 754-2008", formule wolframealpha : quadratic fit {(16;5),(32;8),(64;11),(128;15)}, R_2 0.994108
        return Math.round(-0.000588038 * Math.pow(size, 2) + 0.171371 * size + 2.66667);
    } else {
        //IEEE Std 754-2008 e > 128 : round(4 ×log2 (k)) – 13
        return Math.round(4 * Math.log2(size) - 13);
    }
}

/**
 * @brief Compare two array
 * 
 * @param {Array} arr1 The first array
 * @param {Array} arr2 The second array
 * @returns {Boolean}
 */
function compareArray(arr1, arr2) {
    // First, test numbers length
    if (arr1.length != arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) return false;
    }

    return true; // Array are the same
}

/*****************
 *   UNIT TESTS   *
 *****************/

function testBinarySubtraction1() {
    let num1 = [1, 1, 0];
    let num2 = [1, 0, 1];

    let resTheorique = [0, 0, 1];
    let resEmpirique = subBinaryNumbers(num1, num2);

    console.assert(compareArray(resTheorique, resEmpirique), "Binary subtraction doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testBinarySubtraction2() {
    let num1 = [1, 0, 1, 1, 0]; // = 22
    let num2 = [0, 1, 1, 0, 1]; // = 13

    let resTheorique = [0, 1, 0, 0, 1]; // 9
    let resEmpirique = subBinaryNumbers(num1, num2);

    console.assert(compareArray(resTheorique, resEmpirique), "Binary subtraction doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testBinarySubtraction3() {
    let num1 = [1, 0, 0, 1]; // = 9
    let num2 = [0, 1, 0, 1]; // = 5

    let resTheorique = [0, 1, 0, 0]; // 4
    let resEmpirique = subBinaryNumbers(num1, num2);

    console.assert(compareArray(resTheorique, resEmpirique), "Binary subtraction doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testBinarySubtraction4() {
    let num1 = [0, 1, 0, 1]; // = 5
    let num2 = [1, 0, 0, 1]; // = 9

    let resTheorique = [0, 1, 0, 0]; // (-)4
    let resEmpirique = subBinaryNumbers(num1, num2);

    console.assert(compareArray(resTheorique, resEmpirique), "Binary subtraction doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testMantisShifting() {
    const initialMantis = [1, 0, 1, 1, 0];
    const nbShift = 3;

    const resTheorique = [0, 0, 0, 1, 0];
    const resEmpirique = shiftMantis(initialMantis, nbShift);

    console.assert(compareArray(resTheorique, resEmpirique), "Mantis shifting doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testBinaryAddition() {
    let num1 = [0, 0, 1, 0];
    let num2 = [0, 1, 1, 0];

    let resTheorique = [1, 0, 0, 0];
    let resEmpirique = addBinaryNumbers(num1, num2);

    console.assert(compareArray(resTheorique, resEmpirique), "Binary addition doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testFloatAddition1() {
    let num1 = 13;
    let num2 = 26;
    let nbBits = 16;

    let resTheorique = 39;
    let resEmpirique = decode_to_float(float_addition(num1, num2, nbBits));

    console.assert(resEmpirique == resTheorique, "Float addition doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testFloatAddition2() {
    let num1 = -1;
    let num2 = -23;
    let nbBits = 75;

    let resTheorique = -24;
    let resEmpirique = decode_to_float(float_addition(num1, num2, nbBits));

    console.assert(resEmpirique == resTheorique, "Float addition doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testFloatAddition3() {
    let num1 = 45;
    let num2 = 23;
    let nbBits = 75;

    let resTheorique = 22;
    let resEmpirique = decode_to_float(float_addition(num1, num2, nbBits));

    console.assert(resEmpirique == resTheorique, "Float addition (subtraction) doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testFloatSubtraction1() {
    let num1 = 12;
    let num2 = 19;
    let nbBits = 75;

    let resTheorique = -7;
    let resEmpirique = decode_to_float(float_subtraction(num1, num2, nbBits));

    console.assert(resEmpirique == resTheorique, "Float subtraction doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testFloatSubtraction2() {
    let num1 = 28;
    let num2 = 16;
    let nbBits = 75;

    let resTheorique = 12;
    let resEmpirique = decode_to_float(float_subtraction(num1, num2, nbBits));

    console.assert(resEmpirique == resTheorique, "Float subtraction doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}

function testFloatSubtraction3() {
    let num1 = 29;
    let num2 = 29;
    let nbBits = 75;

    let resTheorique = 0;
    let resEmpirique = decode_to_float(float_subtraction(num1, num2, nbBits));

    console.assert(resEmpirique == resTheorique, "Float subtraction doesn't work. \nExpected result : " + resTheorique + " \nReal result : " + resEmpirique);
}