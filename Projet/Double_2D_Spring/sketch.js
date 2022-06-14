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
let s1 = new Float64Array([0, 100]);
let s2 = new Float64Array([-70, 90]);

// Global system constant
let square_side = 20;
let Tx;
let Ty;
let R = 50;
let b = 0;
let k = 5;
let g = 9.81;

// First spring variables
let S1;
let L1 = 100;
let a1 = new Float64Array([0, 0]);
let v1 = new Float64Array([0, 0]);

// First spring constant
let m1 = 1;

// Second spring variables
let S2;
let L2 = 100;
let a2 = new Float64Array([0, 0]);
let v2 = new Float64Array([0, 0]);


// Second spring constant
let m2 = 1;

// simlation settings
let delta_time = 1 / 6;
let ispaused = false;

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
    let canvas = createCanvas(windowWidth, windowHeight - 50);
    canvas.parent('sketch');
    frameRate(60);

    // Globals initialization
    spring_round_color = color(204, 102, 0);
    spring_round_color2 = color(0, 153, 153);
    spring_line_color = color(45, 197, 244);
    Tx = (3 * width / 4) - square_side / 2;
    Ty = height / 2;
}

/* ==================================================== *\
|*                    FORCE COMPUTE                     *|
\* ==================================================== */

function computeForces() {
    L1 = Math.sqrt(s1[0] ** 2 + s1[1] ** 2);
    L2 = Math.sqrt(s2[0] ** 2 + s2[1] ** 2);

    // calulate the legth of the springs and the rest length
    S1 = L1 - R;
    S2 = L2 - R;

    // calculate the acceleration of the second spring
    a1[0] = (-k * S1 * (s1[0] / L1) - b * v1[0] + k * S2 * (s2[0] / L2)) / m1;
    a1[1] = (-k * S1 * (s1[1] / L1) - b * v1[1] + k * S2 * (s2[1] / L2)) / m1;

    // calculate the velocity applied on spring 1
    v1[0] += 0.5 * a1[0] * delta_time ** 2;
    v1[1] += 0.5 * a1[1] * delta_time ** 2;

    // move the ball according to the force applyed on spring 1 since spring 2 is relative position to spring 1 we negate the value
    const dtsx = v1[0] * delta_time;
    const dtsy = (v1[1]+m1*g) * delta_time ;
    s1[0] += dtsx;
    s1[1] += dtsy;
    s2[0] -= dtsx;
    s2[1] -= dtsy;

    // calculate the acceleration of the second spring
    a2[0] = (-k * S2 * (s2[0] / L2) - b * v2[0]) / m2;
    a2[1] = (-k * S2 * (s2[1] / L2) - b * v2[1]) / m2;

    // calculate the velocity of the ball after a delta time
    v2[0] += 0.5 * a2[0] * delta_time ** 2;
    v2[1] += 0.5 * a2[1] * delta_time ** 2;

    // move the ball according to the force applyed on spring 2
    s2[0] += v2[0] * delta_time;
    s2[1] += (v2[1]+m1*g) * delta_time;

    // guard if the ball is out of the canvas
    if (Math.abs(s2[0] + s1[0]) > (width / 4) - 2 * square_side) {
        v1 = [0, 0];
        a1 = [0, 0];

        v2 = [0, 0];
        a2 = [0, 0];

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

    if (!ispaused && !locked_spring1 && !locked_spring2) {
        computeForces();
    }

    // Vector creation
    let vector_spring_1 = createVector(s1[0], s1[1]);
    let vector_spring_2 = createVector(s2[0], s2[1]);
    let vector_base_square = createVector(Tx + square_side / 2, Ty + square_side / 2);

    // Draw the springs from the vectors
    drawSprings(vector_base_square, vector_spring_1, vector_spring_2);

    // Draw White rectangle where the graph will be
    if (!ispaused) {
        drawGraph();
    }

}

function drawSprings(vector0, vector1, vector2) {
    // Draw the first spring
    translate(vector0.x, vector0.y);
    stroke(spring_line_color);
    line(0, 0, vector1.x, vector1.y);

    // Draw the second spring
    translate(vector1.x, vector1.y);
    stroke(spring_line_color);
    line(0, 0, vector2.x, vector2.y);

    // Draw the first ball
    stroke(spring_round_color);
    fill(spring_round_color);
    circle(0, 0, 2 * square_side);

    // Draw the second ball
    translate(vector2.x, vector2.y);
    stroke(spring_round_color2);
    fill(spring_round_color2);
    circle(0, 0, 2 * square_side);

    // Go back to the top left corner of the canevas
    resetMatrix();
}

// remeber the old position to help draw the graph
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

    if (oldx != null && oldy != null) {
        line(oldx, oldy, s1[0] + s2[0], s1[1] + s2[1]);
    }

    oldx = s1[0] + s2[0];
    oldy = s1[1] + s2[1];

    resetMatrix();
}

/* ==================================================== *\
|*                 DRAG AND DROP SPRINGS                *|
\* ==================================================== */

function handleMouseOverSprings() {
    // TODO : Improve over box
    // For now the over box are simple uncentered square

    if (
        mouseX > s1[0] + Tx - 2 * square_side &&
        mouseX < s1[0] + Tx + 2 * square_side &&
        mouseY > s1[1] + Ty - 2 * square_side &&
        mouseY < s1[1] + Ty + 2 * square_side
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
    }
}

function mousePressed() {
    if (over_spring1) {
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
    }
}

function mouseDragged() {
    if (locked_spring1) {
        s1[0] = mouseX - xOffset_spring1;
        s1[1] = mouseY - yOffset_spring1;
    }

    if (locked_spring2) {
        s2[0] = mouseX - xOffset_spring2;
        s2[1] = mouseY - yOffset_spring2;
    }

    if (locked_spring1 || locked_spring2) {
        a1 = [0, 0];
        a2 = [0, 0];
    }
}

function mouseReleased() {
    locked_spring1 = false;
    locked_spring2 = false;
}