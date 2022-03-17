function setup() {
    
    const canvas = document.querySelector('#canvas');
    drawFunctionOnCanvas(canvas, -50, 50, 'blue', f1);

}

function drawAxis(canvas, unitInPixels = 1){
    if (!canvas.getContext) { return; }

    const ctx = canvas.getContext('2d');

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
    if (!canvas.getContext) {
        return;
    }

    unitInPixels = canvas.width / (borneMax - borneMin);

    drawAxis(canvas, unitInPixels);

    borneMin *= unitInPixels;
    borneMax *= unitInPixels;

    const ctx = canvas.getContext('2d');

    ctx.setTransform(1, 0, 0, -1, 0, canvas.height); // FLIP ON Y AXIS

    let decX = canvas.width / 2;
    let decY = canvas.height / 2;
    // set line stroke and line width
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    let oldX = borneMin;
    let oldY = f(oldX);

    for(let x = borneMin; x < borneMax; x += 1){
        
        let y = f(x / unitInPixels) * unitInPixels;
        console.log("X : " + x + " ; Y : " + y);
        ctx.beginPath();
        ctx.moveTo(oldX + decX, oldY + decY);
        ctx.lineTo(x + decX, y + decY);
        ctx.stroke();
        oldX = x;
        oldY = y;
    }
}

function g(f, x){
    return x + f(x);
}

function f1(x){
    return Math.sin(x) - (x/13);
}

function f3(x)
{
    if(x % 2 == 0) return x;
    else return -x;
}

function f2(x) { return x; }

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