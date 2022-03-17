function setup() {
    const canvas = document.querySelector('#canvas');

    let borneMin = parseInt($("borneMin").value);
    let borneMax = parseInt($("borneMax").value);

    let phi = 2;

    unitInPixels = canvas.width / (borneMax - borneMin);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    drawAxis(canvas, unitInPixels); // Draw the axis

    ctx.setTransform(1, 0, 0, -1, 0, canvas.height); // FLIP ON Y AXIS

    drawFunctionOnCanvas(canvas, borneMin, borneMax, 'red', f1);
    drawFunctionOnCanvas(canvas, borneMin, borneMax, 'blue', g);
    drawFunctionOnCanvas(canvas, borneMin, borneMax, 'green', fPlusG);

    drawFindRacines(canvas, borneMin, borneMax, 'pink', f1);
}

function drawAxis(canvas, unitInPixels = 1){
    if (!canvas.getContext) { return; }

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.beginPath();
    let w = canvas.width;
    // X AXIS
    ctx.moveTo(0, w/2);
    ctx.lineTo(w, w/2);
    ctx.moveTo(w, w/2);
    ctx.lineTo(w - 10, w/2 + 10);
    ctx.moveTo(w, w/2);
    ctx.lineTo(w - 10, w/2 - 10);

    let dec = unitInPixels;

    for(let i = -canvas.width + dec; i < canvas.width - dec; i += dec){
        ctx.moveTo(i, w / 2 - 5);
        ctx.lineTo(i, w / 2 + 5);
    }

    let h = canvas.height;

    // Y AXIS
    ctx.moveTo(h/2, 0);
    ctx.lineTo(h/2, h);
    ctx.moveTo(h/2, 0);
    ctx.lineTo(h/2 - 10, 10);
    ctx.moveTo(h/2, 0);
    ctx.lineTo(h/2 + 10, 10);

    for(let i = -canvas.height + dec; i < canvas.height - dec; i += dec){
        ctx.moveTo(h/2 - 5, i);
        ctx.lineTo(h/2 + 5, i);
    }

    ctx.stroke();
}

function drawFunctionOnCanvas(canvas, borneMin, borneMax, lineColor, f){
    unitInPixels = canvas.width / (borneMax - borneMin);

    borneMin *= unitInPixels;
    borneMax *= unitInPixels;

    const ctx = canvas.getContext('2d');

    let decX = canvas.width / 2;
    let decY = canvas.height / 2;
    // set line stroke and line width
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    let oldX = borneMin;
    let oldY = f(oldX / unitInPixels) * unitInPixels;

    for(let x = borneMin; x < borneMax; x += 1){
        let y = f(x / unitInPixels) * unitInPixels;
        ctx.beginPath();
        ctx.moveTo(oldX + decX, oldY + decY);
        ctx.lineTo(x + decX, y + decY);
        ctx.stroke();
        oldX = x;
        oldY = y;
    }
}

function drawFindRacines(canvas, borneMin, borneMax, lineColor, f){
    unitInPixels = canvas.width / (borneMax - borneMin);

    borneMin *= unitInPixels;
    borneMax *= unitInPixels;

    const ctx = canvas.getContext('2d');

    let decX = canvas.width / 2;
    let decY = canvas.height / 2;
    // set line stroke and line width
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    let oldX = borneMin;
    let oldY = f(borneMin);

    let x = borneMin + 1;
    while(x < borneMax){
        // F(X)
        let y = g(x / unitInPixels) * unitInPixels;
        ctx.beginPath();
        ctx.moveTo(oldX + decX, oldY + decY);
        ctx.lineTo(x + decX, y + decY);
        ctx.stroke();
        oldX = x;
        oldY = y;

        // G(X)
        y = fPlusG(x / unitInPixels) * unitInPixels;
        ctx.beginPath();
        ctx.moveTo(oldX + decX, oldY + decY);
        ctx.lineTo(x + decX, y + decY);
        ctx.stroke();
        oldX = x;
        oldY = y;

        x = y;
        if(Math.abs(oldX - x) < 0.00001) { 
            console.log("Racine : " + x / unitInPixels);
            return;
        }
    }
}

function fPlusG(x){
    return f1(x) + g(x);
}

function g(x){
    return x;
}

function f1(x){
    return Math.sin(x) - (x/13);
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