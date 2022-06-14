/* ==================================================== *\
|*                       GLOBALS                        *|
\* ==================================================== */

pendulums_number = 5;

pendulums = [];

/*

Variables:
    T = position of top anchor mass
    R = rest length
    k = spring constant
    g = gravity
    b = damping constan

    L# = displacement of spring from rest length
    S# = spring stretch
    m# = mass of the ball

    f#x,f#y = force of the ball
    a#x,a#y = Acceleration of the ball
*/

// Global system constant
let square_side = 20;
/*
let square_side = 20;
let Tx;
let Ty;
let R = 50;
let b = 0;
let k = 5;
let g = 9.81;
*/

// Mouse handling variables
let over_spring1 = false;
let over_spring2 = false;
let locked_spring1 = false;
let locked_spring2 = false;
let xOffset_spring1 = 0.0;
let yOffset_spring1 = 0.0;
let xOffset_spring2 = 0.0;
let yOffset_spring2 = 0.0;

/* ==================================================== *\
|*                        SETUP                         *|
\* ==================================================== */

function setup() {
    for(let i = 0; i < pendulums_number; i++)
    {
        pendulums.push(new DoublePendulum(i / 1000, color(map(i, 0, pendulums_number, 0, 255), map(i, 0, pendulums_number, 0, 255), map(i, 0, pendulums_number, 0, 255))));
    }
    // Create the canevas
    let canvas = createCanvas(windowWidth, windowHeight - 50);
    canvas.parent('sketch');
    frameRate(60);
}

/* ==================================================== *\
|*                       DRAW 60 Hz                     *|
\* ==================================================== */

function draw() {
    background(130, 130, 250);
    strokeWeight(2);
    stroke(0);
    fill(0);

    // Test if the mouse is over one of the springs
    handleMouseOverSprings();

    for(let i = 0; i < pendulums.length; i++)
    {
        pendulums[i].update();
        pendulums[i].show();
    }

    // Draw White rectangle where the graph will be
    /*if (!ispaused) {
        drawGraph();
    }*/

}



function drawGraph() {

    /*stroke(0);
    fill(0);

    line(0, Ty, width / 2, Ty);
    line(width / 4, 0, width / 4, height);

    translate((width / 4), Ty);

    stroke(spring_line_color);
    fill(spring_line_color);

    if (oldx != null && oldy != null) {
        line(oldx, oldy, s1[0] + s2[0], s1[1] + s2[1]);
    }

    oldx = s1[0] + s2[0];
    oldy = s1[1] + s2[1];

    resetMatrix();*/
}

/* ==================================================== *\
|*                 DRAG AND DROP SPRINGS                *|
\* ==================================================== */

function handleMouseOverSprings() {
    // TODO : Improve over box
    // For now the over box are simple uncentered square

    /*if (
        mouseX > s1x + Tx - 2 * square_side &&
        mouseX < s1x + Tx + 2 * square_side &&
        mouseY > s1y + Ty - 2 * square_side &&
        mouseY < s1y + Ty + 2 * square_side
    ) {
        over_spring1 = true;
    } else {
        over_spring1 = false;
    }

    if (
        mouseX > s1[0] + s2[0] + Tx - 2 * square_side &&
        mouseX < s1[0] + s2[0] + Tx + 2 * square_side &&
        mouseY > s1[1] + s2[1] + Ty - 2 * square_side &&
        mouseY < s1[1] + s2[1] + Ty + 2 * square_side
    ) {
        over_spring2 = true;
    } else {
        over_spring2 = false;
    }*/
}

function mousePressed() {
    /*if (over_spring1) {
        locked_spring1 = true;
        xOffset_spring1 = mouseX - s1[0];
        yOffset_spring1 = mouseY - s1[1];
    } else {
        locked_spring1 = false;
    }

    if (over_spring2) {
        locked_spring2 = true;
        xOffset_spring2 = mouseX - s2[0];
        yOffset_spring2 = mouseY - s2[1];
    } else {
        locked_spring2 = false;
    }*/
}

function mouseDragged() {
    /*if (locked_spring1) {
        s1x = mouseX - xOffset_spring1;
        s1y = mouseY - yOffset_spring1;
    }

    if (locked_spring2) {
        s2[0] = mouseX - xOffset_spring2;
        s2[1] = mouseY - yOffset_spring2;
    }

    if (locked_spring1 || locked_spring2) {
        a1x = 0;
        a1y = 0;
        a2x = 0;
        a2y = 0;
    }*/
}

function mouseReleased() {
    // locked_spring1 = false;
    // locked_spring2 = false;
}