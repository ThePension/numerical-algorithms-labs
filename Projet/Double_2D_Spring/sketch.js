/* ==================================================== *\
|*                       GLOBALS                        *|
\* ==================================================== */

// Spring vectors composant
let s1x = 0;
let s2x = 0;
let s1y = 100;
let s2y = 100;

// Global system constant
let square_side = 20;
let Tx;
let Ty;
let R = 100;
let b = 0;
let k = 5;
let g = 9.81;

// First spring variables
let theta1 = 0;
let S1;
let L1 = 100;
let u1;
let v1;
let a1;
let F1;

// First spring constant
let m1 = 1;

// Second spring variables
let theta2 = 0;
let S2;
let L2 = 100;
let u2;
let v2;
let a2;
let F2;

// Second spring constant
let m2 = 1;

// Color variables
let spring_round_color;
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
    spring_line_color = color(45, 197, 244);
    Tx = (3 * width / 4) - square_side / 2;
    Ty = height / 4;
}

/* ==================================================== *\
|*                       DRAW 60 Hz                     *|
\* ==================================================== */

function draw() {
    background(200);
    strokeWeight(2);
    stroke(0);
    fill(0);

    // Draw a splitter line
    line(width / 2, 0, width / 2, height);

    // Draw the base square
    rect(Tx, Ty, square_side, square_side);

    // Test if the mouse is over one of the springs
    handleMouseOverSprings();

    // Animation test
    //theta1 += 0.1;
    //theta2 += 0.1;

    let s1x = Math.sin(theta1) * L1;
    let s2x = Math.sin(theta2) * L2;
    let s1y = Math.cos(theta1) * L1;
    let s2y = Math.cos(theta2) * L2;

    // Vector creation
    let vector_spring_1 = createVector(s1x, s1y);
    let vector_spring_2 = createVector(s2x, s2y);
    let vector_base_square = createVector(Tx + square_side / 2, Ty + square_side / 2);

    // Draw the springs from the vectors
    drawSprings(vector_base_square, vector_spring_1, vector_spring_2);

    // Draw White rectangle where the graph will be
    stroke(255);
    fill(255);
    rect(0, 0, (width / 2) - 2, height);
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
    stroke(spring_round_color);
    fill(spring_round_color);
    circle(0, 0, 2 * square_side);

    // Go back to the top left corner of the canevas
    translate(-vector2.x, -vector2.y);
    translate(-vector1.x, -vector1.y);
    translate(-vector0.x, -vector0.y);
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
        L1 = Math.sqrt(Math.pow(s1x, 2) + Math.pow(s1y, 2));
        if (s1y > 0) {
            theta1 = Math.asin(s1x / L1);
        } else {
            theta1 = Math.acos(s1x / L1) + Math.PI / 2;
        }
    }

    if (locked_spring2) {
        s2x = mouseX - xOffset_spring2;
        s2y = mouseY - yOffset_spring2;
        L2 = Math.sqrt(Math.pow(s2x, 2) + Math.pow(s2y, 2));
        if (s2y > 0) {
            theta2 = Math.asin(s2x / L2);
        } else {
            theta2 = Math.acos(s2x / L2) + Math.PI / 2;
        }
    }
}

function mouseReleased() {
    locked_spring1 = false;
    locked_spring2 = false;
}