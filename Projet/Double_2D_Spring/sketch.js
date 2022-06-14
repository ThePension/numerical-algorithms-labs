/*
* Context : Mathématiques Spécifiques II
* Date : 15.06.2022
* Authors : Aubert Nicolas, Gostelli Lucas, Jeannin Vincent, Vuilliomenet Théo
* Description : Double pendulum simulation
* Mainly based on : https://www.myphysicslab.com/pendulum/double-pendulum-en.html
*/

/* ==================================================== *\
|*                       GLOBALS                        *|
\* ==================================================== */

pendulums_number = 5;
g = 9.81;
m1 = 10;
m2 = 10;

pendulums = [];

let square_side = 20;

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
        pendulums.push(new DoublePendulum(i / 100000, color(map(i, 0, pendulums_number, 0, 255), map(i, 0, pendulums_number, 0, 255), map(i, 0, pendulums_number, 0, 255))));
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

    for(let i = 0; i < pendulums.length; i++)
    {
        pendulums[i].update();
        pendulums[i].show();
    }
}