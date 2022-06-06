/* ==================================================== *\
|*                       GLOBALS                        *|
\* ==================================================== */


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



// Spring vectors composant
let s1x = 0;
let s1y = 100;
let s2x = -70;
let s2y = 90;

// Global system constant
let square_side = 20;
let Tx;
let Ty;
let R = 100;
let b = 0.005;
let k = 5;
let g = 9.81;

// First spring variables
let S1;
let L1 = 100;
let a1x = 0;
let a1y = 0;
let f1x;
let f1y;

// First spring constant
let m1 = 1;

// Second spring variables
let S2;
let L2 = 100;
let a2x = 0;
let a2y = 0;
let f2x;
let f2y;

// Second spring constant
let m2 = 1;

// speed of the animation
let physic_divider = 150;

// Color variables
let spring_round_color;
let spring_round_color2;
let spring_line_color;

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
    // Create the canevas
    createCanvas(windowWidth, 700);

    // Globals initialization
    spring_round_color = color(204, 102, 0);
    spring_round_color2 = color(0, 153, 153);
    spring_line_color = color(45, 197, 244);
    Tx = (3 * width / 4) - square_side / 2;
    Ty = height / 2;
}

function computeForces() {
    L1 = Math.sqrt(s1x ** 2 + s1y ** 2);
    L2 = Math.sqrt(s2x ** 2 + s2y ** 2);

    // calulate the legth of the springs and the rest length
    S1 = L1 - R;
    S2 = L2 - R;

    // calculate the acceleration of the second spring
    a1x += -(k / m1) * S1 * (s1x / L1) - (b / m1) * a1x + (k / m1) * S2 * (s2x / L2);
    a1y += -(k / m1) * S1 * (s1y / L1) - (b / m1) * a1y + (k / m1) * S2 * (s2y / L2) + g;

    // calculate the force applied on spring 2
    f1x = a1x * m1;
    f1y = a1y * m1;

    // move the ball according to the force applyed on spring 1
    s1x += f1x / physic_divider;
    s1y += f1y / physic_divider;
    s2x -= f1x / physic_divider;
    s2y -= f1y / physic_divider;

    // since the position of the ball is not the same as the position of the spring, we need recalculate the length of the spring
    L2 = Math.sqrt(s2x ** 2 + s2y ** 2);
    S2 = L2 - R;

    // calculate the acceleration of the second spring
    a2x += -(k / m2) * S2 * (s2x / L2) - (b / m2) * a2x;
    a2y += -(k / m2) * S2 * (s2y / L2) - (b / m2) * a2y + g;

    // calculate the force applied on spring 2
    f2x = a2x * m2;
    f2y = a2y * m2;

    // move the ball according to the force applyed on spring 2
    s2x += f2x / physic_divider;
    s2y += f2y / physic_divider;

    // guard if the ball is out of the canvas
    if (Math.abs(s2x + s1x) > (width / 4) - 2 * square_side || Math.abs(s2y + s1y) > (height / 2) - 2 * square_side) {
        a1x = 0;
        a1y = 0;
        a2x = 0;
        a2y = 0;
    }
}

/* ==================================================== *\
|*                       DRAW 60 Hz                     *|
\* ==================================================== */

function draw() {

    stroke(200);
    fill(200);
    rect(width / 2, 0, width, height);

    strokeWeight(2);
    stroke(0);
    fill(0);

    // Draw a splitter line
    line(width / 2, 0, width / 2, height);

    // Draw the base square
    rect(Tx, Ty, square_side, square_side);

    // Test if the mouse is over one of the springs
    handleMouseOverSprings();

    if (!locked_spring1 && !locked_spring2) {
        computeForces();
    }

    // Vector creation
    let vector_spring_1 = createVector(s1x, s1y);
    let vector_spring_2 = createVector(s2x, s2y);
    let vector_base_square = createVector(Tx + square_side / 2, Ty + square_side / 2);

    // Draw the springs from the vectors
    drawSprings(vector_base_square, vector_spring_1, vector_spring_2);

    // Draw White rectangle where the graph will be

    drawGraph();
}

function drawSprings(vector0, vector1, vector2) {
    // Draw the first spring
    translate(vector0.x, vector0.y);
    stroke(spring_line_color);
    line(0, 0, vector1.x, vector1.y);

    translate(vector1.x, vector1.y);
    stroke(spring_round_color);
    fill(spring_round_color);
    circle(0, 0, 2 * square_side);

    // Draw the second spring

    stroke(spring_line_color);
    line(0, 0, vector2.x, vector2.y);

    translate(vector2.x, vector2.y);
    stroke(spring_round_color2);
    fill(spring_round_color2);
    circle(0, 0, 2 * square_side);

    // Go back to the top left corner of the canevas
    translate(-vector2.x, -vector2.y);
    translate(-vector1.x, -vector1.y);
    translate(-vector0.x, -vector0.y);
}


let oldx;
let oldy;

function drawGraph() {

    stroke(0);
    fill(0);

    line(0, Ty, width / 2, Ty);
    line(width / 4, 0, width / 4, height);

    translate((width / 4), Ty);

    stroke(spring_line_color);
    fill(spring_line_color);
    line(oldx, oldy, s1x + s2x, s1y + s2y);

    oldx = s1x + s2x;
    oldy = s1y + s2y;
}

/* ==================================================== *\
|*                 DRAG AND DROP SPRINGS                *|
\* ==================================================== */

function handleMouseOverSprings() {
    // TODO : Improve over box
    // For now the over box are simple uncentered square

    if (
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
        mouseX > s1x + s2x + Tx - 2 * square_side &&
        mouseX < s1x + s2x + Tx + 2 * square_side &&
        mouseY > s1y + s2y + Ty - 2 * square_side &&
        mouseY < s1y + s2y + Ty + 2 * square_side
    ) {
        over_spring2 = true;
    } else {
        over_spring2 = false;
    }
}

function mousePressed() {
    if (over_spring1) {
        locked_spring1 = true;
    } else {
        locked_spring1 = false;
    }

    if (over_spring2) {
        locked_spring2 = true;
    } else {
        locked_spring2 = false;
    }

    xOffset_spring1 = mouseX - s1x;
    yOffset_spring1 = mouseY - s1y;
    xOffset_spring2 = mouseX - s2x;
    yOffset_spring2 = mouseY - s2y;
}

function mouseDragged() {

    if (locked_spring1) {
        s1x = mouseX - xOffset_spring1;
        s1y = mouseY - yOffset_spring1;


    }

    if (locked_spring2) {
        s2x = mouseX - xOffset_spring2;
        s2y = mouseY - yOffset_spring2;

    }

    a1x = 0;
    a1y = 0;
    a2x = 0;
    a2y = 0;
}

function mouseReleased() {
    locked_spring1 = false;
    locked_spring2 = false;
}