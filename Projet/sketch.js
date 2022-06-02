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
    start_x = (3 * width / 4) - square_side / 2;
    start_y = height / 4;
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

    // Test if the mouse is over one of the springs
    handleMouseOverSprings();

    // Animation test
    //spring_1_x += 0.2;
    //spring_1_y -= 0.5;

    // Vector creation
    let vector_spring_1 = createVector(spring_1_x, spring_1_y);
    let vector_spring_2 = createVector(spring_2_x, spring_2_y);
    let vector_base_square = createVector(start_x + square_side / 2, start_y + square_side / 2);

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
        mouseX > spring_1_x + start_x - 2 * square_side &&
        mouseX < spring_1_x + start_x + 2 * square_side &&
        mouseY > spring_1_y + start_y - 2 * square_side &&
        mouseY < spring_1_y + start_y + 2 * square_side
    ) {
        over_spring1 = true;
    } else {
        over_spring1 = false;
    }

    if (
        mouseX > spring_1_x + spring_2_x + start_x - 2 * square_side &&
        mouseX < spring_1_x + spring_2_x + start_x + 2 * square_side &&
        mouseY > spring_1_y + spring_2_y + start_y - 2 * square_side &&
        mouseY < spring_1_y + spring_2_y + start_y + 2 * square_side
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

    xOffset_spring1 = mouseX - spring_1_x;
    yOffset_spring1 = mouseY - spring_1_y;
    xOffset_spring2 = mouseX - spring_2_x;
    yOffset_spring2 = mouseY - spring_2_y;
}

function mouseDragged() {
    if (locked_spring1) {
        spring_1_x = mouseX - xOffset_spring1;
        spring_1_y = mouseY - yOffset_spring1;
    }

    if (locked_spring2) {
        spring_2_x = mouseX - xOffset_spring2;
        spring_2_y = mouseY - yOffset_spring2;
    }
}

function mouseReleased() {
    locked_spring1 = false;
    locked_spring2 = false;
}