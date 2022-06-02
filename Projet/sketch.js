/* ==================================================== *\
|*                       GLOBALS                        *|
\* ==================================================== */

// Spring vectors composant
let spring_1_x = 0;
let spring_1_y = 150;
let spring_2_x = 0;
let spring_2_y = 150;

// Color variable
let spring_round_color;
let spring_line_color;

// Black square variables
let square_side = 20;
let start_x;
let start_y;

/* ==================================================== *\
|*                        SETUP                         *|
\* ==================================================== */

function setup() {
    // Create the canevas
    let canevasHeight = 700;
    createCanvas(windowWidth, canevasHeight);

    // Globals initialization
    spring_round_color = color(204, 102, 0);
    spring_line_color = color(45, 197, 244);
    start_x = (3 * windowWidth / 4) - square_side / 2;
    start_y = canevasHeight / 4;
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
    rect(start_x, start_y, square_side, square_side);

    // Animation test
    //spring_1_x += 0.2;
    //spring_1_y -= 0.5;

    // Vector creation
    let vector_spring_1 = createVector(spring_1_x, spring_1_y);
    let vector_spring_2 = createVector(spring_2_x, spring_2_y);
    let vector_base_square = createVector(start_x + square_side / 2, start_y + square_side / 2);

    // Draw the springs from the vectors
    drawSprings(vector_base_square, vector_spring_1, vector_spring_2);
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
}