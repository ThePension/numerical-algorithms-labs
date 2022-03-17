function JS_Hello() {
    const target = parseFloat($("target_value").value);
    const nbBits = parseInt($("b_value").value);

    if (isNaN(target) || isNaN(nbBits))
        return window.alert("Veuillez entrer des nombres");

    const sign = target < 0 ? 1 : 0;

    const e = Math.ceil(Math.log2(Math.abs(target)));
    let e_length = 1;
    let d = 0;

    if (e != 0) {
        e_length = Math.log2(Math.abs(e)) + 2;
        d = Math.pow(2, e_length - 1) - 2;
    }

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

    if (sign === 1) base *= -1;

    $('result').textContent = `\nAvec ${nbBits} bits, ${target} se fait rapproché par ${base * M}`;
}

/**
 * @brief Transforms an Integer to a Binary array
 * @param {Number} int An integer
 * @returns {Array<Number>} Binary array
 */
function intToBinary(int) {
    const binaryArray = [];

    if (isNaN(int)) return binaryArray;

    while (int != 0) {
        binaryArray.push(int % 2);
        int = parseInt(int / 2);
    }

    return binaryArray.reverse();
}

/**
 * Gets an HTML element by its ID
 * @param {String} id The id
 * @returns {HTMLElement} The element
 */
function $(id) {
    return document.getElementById(id);
}