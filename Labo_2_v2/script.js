async function setup() {
    sleep = ms => new Promise(r => setTimeout(r, ms));

    const canvas = document.querySelector('#canvas');

    let borneMin = parseInt($("borneMin").value);
    let borneMax = parseInt($("borneMax").value);

    phi = parseInt($("phi").value);

    unitInPixels = canvas.width / (borneMax - borneMin);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    drawAxis(canvas, unitInPixels); // Draw the axis

    ctx.setTransform(1, 0, 0, -1, canvas.width / 2, canvas.height / 2); // Flip Y to the top and place the (0,0) in the middle

    await drawFunctionOnCanvas(canvas, borneMin, borneMax, 'red', f1);
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

async function drawFunctionOnCanvas(canvas, borneMin, borneMax, lineColor, f) {
    unitInPixels = canvas.width / (borneMax - borneMin);

    borneMin *= unitInPixels;
    borneMax *= unitInPixels;

    const ctx = canvas.getContext('2d');

    // set line stroke and line width
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    let oldX = borneMin;
    let oldY = f(oldX / unitInPixels) * unitInPixels;

    for (let x = borneMin; x < borneMax; x += 1) {
        let y = f(x / unitInPixels) * unitInPixels;
        ctx.beginPath();
        ctx.moveTo(oldX, oldY);
        ctx.lineTo(x, y);
        ctx.stroke();
        oldX = x;
        oldY = y;
        // await sleep(0.01);
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
        if (result) {
            console.log("Racine : " + result / unitInPixels);
            if (!racinesArray.includes(result)) {
                drawRacine(canvas, i, unitInPixels, lineColor);
                racinesArray.push(result);
            }
        }
        i++;
    }
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
    sleep(50);

    while (Math.abs(oldX - x) > 0.01 && count < 100) {
        oldX = x
        oldY = y;

        y = fPlusG(x / unitInPixels) * unitInPixels;

        ctx.strokeStyle = lineColor;
        ctx.beginPath();

        ctx.moveTo(oldX, oldY);
        ctx.lineTo(x, y);
        ctx.stroke();
        sleep(50);

        oldX = x;
        oldY = y;
        x = y;

        ctx.moveTo(oldX, oldY);
        ctx.lineTo(x, y);
        ctx.stroke();
        sleep(50);

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
            return x;
        }
        count++;
    }

    return false;
}

function fPlusG(x) {
    return phi * f1(x) + g(x);
}

function g(x) {
    return x;
}

function f1(x) {
    return Math.sin(x) - (x / 13); //x / (1 - (x * x)); //-x / 2 + 1; //
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