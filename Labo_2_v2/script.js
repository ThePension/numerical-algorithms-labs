const funcArray = [f1, f2];
var f = null;
var phi = null;

async function setup() {
    sleep = ms => new Promise(r => setTimeout(r, ms));

    const canvas = document.querySelector('#canvas');

    let borneMin = parseInt($("borneMin").value);
    let borneMax = parseInt($("borneMax").value);
    phi = parseFloat($("phi").value);
    const index = parseInt($("function_select").value);

    f = funcArray[index];

    unitInPixels = canvas.width / (borneMax - borneMin);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    drawAxis(canvas, unitInPixels); // Draw the axis

    ctx.setTransform(1, 0, 0, -1, canvas.width / 2, canvas.height / 2); // Flip Y to the top and place the (0,0) in the middle

    await drawFunctionOnCanvas(canvas, borneMin, borneMax, 'red', f);
    await drawFunctionOnCanvas(canvas, borneMin, borneMax, 'blue', g);
    await drawFunctionOnCanvas(canvas, borneMin, borneMax, 'green', fPlusG);

    if (phi != 0)
        await findRacines(canvas, borneMin, borneMax, 'pink');

    ctx.resetTransform(); // restore transform
}

function drawAxis(canvas, unitInPixels = 1) {
    if (!canvas.getContext) { return; }

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.beginPath();
    let w = canvas.width;
    // X AXIS
    ctx.moveTo(0, w / 2);
    ctx.lineTo(w, w / 2);
    ctx.moveTo(w, w / 2);
    ctx.lineTo(w - 10, w / 2 + 10);
    ctx.moveTo(w, w / 2);
    ctx.lineTo(w - 10, w / 2 - 10);

    let dec = unitInPixels;

    for (let i = -canvas.width + dec; i < canvas.width - dec; i += dec) {
        ctx.moveTo(i, w / 2 - 5);
        ctx.lineTo(i, w / 2 + 5);
    }

    let h = canvas.height;

    // Y AXIS
    ctx.moveTo(h / 2, 0);
    ctx.lineTo(h / 2, h);
    ctx.moveTo(h / 2, 0);
    ctx.lineTo(h / 2 - 10, 10);
    ctx.moveTo(h / 2, 0);
    ctx.lineTo(h / 2 + 10, 10);

    for (let i = -canvas.height + dec; i < canvas.height - dec; i += dec) {
        ctx.moveTo(h / 2 - 5, i);
        ctx.lineTo(h / 2 + 5, i);
    }

    ctx.stroke();
}

async function drawFunctionOnCanvas(canvas, borneMin, borneMax, lineColor, funct) {
    unitInPixels = canvas.width / (borneMax - borneMin);

    borneMin *= unitInPixels;
    borneMax *= unitInPixels;

    const ctx = canvas.getContext('2d');

    // set line stroke and line width
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    let oldX = borneMin;
    let oldY = funct(oldX / unitInPixels) * unitInPixels;

    for (let x = borneMin; x < borneMax; x += 1) {
        let y = funct(x / unitInPixels) * unitInPixels;
        ctx.beginPath();
        ctx.moveTo(oldX, oldY);
        ctx.lineTo(x, y);
        ctx.stroke();
        oldX = x;
        oldY = y;
    }
}

async function findRacines(canvas, borneMin, borneMax, lineColor) {
    unitInPixels = canvas.width / (borneMax - borneMin);

    let startX = borneMin * unitInPixels;
    let stopX = borneMax * unitInPixels;
    let i = startX;

    const ctx = canvas.getContext('2d');
    let racinesArray = [];

    while (i < stopX) {
        let result = findRacine(i, unitInPixels, 1000);
        console.log(result[0]);
        if (result[0]) {
            if (!racinesArray.includes(result[1])) {
                drawRacine(canvas, i, unitInPixels, lineColor);
                racinesArray.push(result[1]);
                console.log("Racine : " + result[1] / unitInPixels);
            }
        }
        i++;
    }

    $("result").innerText = "Zéro(s) de la fonction : \n\n";
    let counter = 0;

    $("result").innerText += racinesArray.map(el => el = `X${counter++} : ${el / unitInPixels}`).join('\n');
}

function drawRacine(canevas, startX, unitInPixels, lineColor) {
    const ctx = canevas.getContext('2d');

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    let oldX = startX;
    let oldY = fPlusG(startX / unitInPixels) * unitInPixels;

    let x = oldY;
    let y = x;

    let count = 0;

    ctx.beginPath();
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(x, y);
    ctx.stroke();

    while (Math.abs(oldX - x) > 0.01 && count < 100) {
        oldX = x
        oldY = y;

        y = fPlusG(x / unitInPixels) * unitInPixels;

        ctx.strokeStyle = lineColor;
        ctx.beginPath();

        ctx.moveTo(oldX, oldY);
        ctx.lineTo(x, y);
        ctx.stroke();

        oldX = x;
        oldY = y;
        x = y;

        ctx.moveTo(oldX, oldY);
        ctx.lineTo(x, y);
        ctx.stroke();

        count++;
    }

    ctx.strokeStyle = 'cyan';
    ctx.beginPath();
    ctx.moveTo(oldX, y);
    ctx.lineTo(oldX, 0);
    ctx.stroke();
}

function findRacine(startX, unitInPixels, itermax) {
    let oldX = startX;
    let oldY = fPlusG(startX / unitInPixels) * unitInPixels;

    let x = oldY;
    let y = x;

    let count = 0;

    while (count < itermax) {
        oldX = x
        oldY = y;

        y = fPlusG(x / unitInPixels) * unitInPixels;

        oldX = x;
        oldY = y;
        x = y;

        if (oldX == x) { // COMPUTER EPSILON
            console.log("find racine : " + x / unitInPixels);
            return [true, x];
        }
        count++;
    }

    return [false, 0];
}

function fPlusG(x) {
    return x + (phi * Math.abs(f(x)));
}

function g(x) {
    return x;
}

function f1(x) {
    return Math.sin(x) - (x / 13);
}

function f2(x) {
    return x / (1 - (x * x));
}

/**
 * 
 * @param {Float} deg The value in degrees 
 * @returns {Float} The value in radians
 */
function degToRad(deg) {
    return (deg * Math.PI) / 180;
}

/**
 * Gets an HTML element by its ID
 * @param {String} id The id
 * @returns {HTMLElement} The element
 */
function $(id) {
    return document.getElementById(id);
}