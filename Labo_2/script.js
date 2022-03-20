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

    ctx.setTransform(1, 0, 0, -1, 0, canvas.height); // FLIP ON Y AXIS

    await drawFunctionOnCanvas(canvas, borneMin, borneMax, 'red', f1);
    await drawFunctionOnCanvas(canvas, borneMin, borneMax, 'blue', g);
    await drawFunctionOnCanvas(canvas, borneMin, borneMax, 'green', fPlusG);

    await drawFindRacines(canvas, borneMin, borneMax, 'pink', f1);
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

async function drawFunctionOnCanvas(canvas, borneMin, borneMax, lineColor, f){
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
        // await sleep(0.01);
    }
}

async function drawFindRacines(canvas, borneMin, borneMax, lineColor, f){
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
    let oldY = fPlusG(borneMin);
    let count = 0;
    let x = borneMin + 1;
    let y = 0;
    while(x < borneMax){
        // console.log("fPlusG("+x/ unitInPixels+") = " + fPlusG(x/ unitInPixels));
        // console.log("g("+x/ unitInPixels+") = " + g(x/ unitInPixels));
        if(fPlusG(x / unitInPixels) > g(x / unitInPixels)){
            // console.log("Au-dessus");
            ctx.strokeStyle = 'pink';
            // F(X)
            y = g(x / unitInPixels) * unitInPixels;
            ctx.beginPath();
            ctx.moveTo(oldX + decX, oldY + decY);
            ctx.lineTo(x + decX, y + decY);
            ctx.stroke();
            oldX = x;
            oldY = y;

            await sleep(100);

            // G(X)
            y = fPlusG(x / unitInPixels) * unitInPixels;
            ctx.beginPath();
            ctx.moveTo(oldX + decX, oldY + decY);
            ctx.lineTo(x + decX, y + decY);
            ctx.stroke();
            oldX = x;
            oldY = y;
            count++;

            x = g(x / unitInPixels) * unitInPixels;
            x = y;
            if(Math.abs(oldX - x) < 0.00001) {
                ctx.strokeStyle = 'cyan';
                ctx.beginPath();
                ctx.moveTo(oldX + decX, y + decY);
                ctx.lineTo(oldX + decX, decY);
                ctx.stroke();
                console.log("Racine : " + x / unitInPixels);
                x += unitInPixels;
            }
            
            await sleep(100);
        }
        else
        {
           x += unitInPixels;
           oldX = x;
           y = fPlusG(x / unitInPixels) * unitInPixels;
           oldY = y;
        }  

        if(count > 1000) {
            console.log("Counter max reached");
            return;
        }   
    }

    oldX = borneMax;
    oldY = fPlusG(borneMax);
    count = 0;
    x = borneMax - 1;
    y = 0;
    while(x > borneMin){
        if(g(x / unitInPixels) > fPlusG(x / unitInPixels)){
            console.log("test");
            // console.log("Au-dessus");
            ctx.strokeStyle = 'orange';
            // F(X)
            y = g(x / unitInPixels) * unitInPixels;
            ctx.beginPath();
            ctx.moveTo(oldX + decX, oldY + decY);
            ctx.lineTo(x + decX, y + decY);
            ctx.stroke();
            oldX = x;
            oldY = y;

            await sleep(100);

            // G(X)
            y = fPlusG(x / unitInPixels) * unitInPixels;
            ctx.beginPath();
            ctx.moveTo(oldX + decX, oldY + decY);
            ctx.lineTo(x + decX, y + decY);
            ctx.stroke();
            oldX = x;
            oldY = y;
            count++;

            x = g(x / unitInPixels) * unitInPixels;
            x = y;
            if(Math.abs(oldX - x) < 0.00001) {
                ctx.strokeStyle = 'cyan';
                ctx.beginPath();
                ctx.moveTo(oldX + decX, y + decY);
                ctx.lineTo(oldX + decX, decY);
                ctx.stroke();
                console.log("Racine : " + x / unitInPixels);
                x -= unitInPixels;
            }
            
            await sleep(100);
        }
        count++;
        if(count > 1000) return;
    }
}

function fPlusG(x){
    return phi * f1(x) + g(x);
}

function g(x){
    return x;
}

function f1(x){
    return -x / 2 + 1; //  Math.sin(x) - (x/13);
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