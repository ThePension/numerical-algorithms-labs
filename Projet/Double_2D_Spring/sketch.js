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

// Number of pendulums
let pendulums_number = 5;

// Gravity value
let g = 9.81;

// Mass of the first ball
let m1 = 10;

// Mass of the second ball
let m2 = 10;

// Array that will contain the double pendulums
pendulums = [];

// Size of a ball
let square_side = 20;

/* ==================================================== *\
|*                        SETUP                         *|
\* ==================================================== */

function setup()
{
    // Create the pendulums, and add them the array
    for(let i = 0; i < pendulums_number; i++)
    {
        pendulums.push(new DoublePendulum(i / 100000, color(map(i, 0, pendulums_number, 0, 255), map(i, 0, pendulums_number, 0, 255), map(i, 0, pendulums_number, 0, 255))));
    }

    // Create the canevas
    let canvas = createCanvas(windowWidth, windowHeight - 50);
    canvas.parent('sketch');

    // Set the framerate to 60
    frameRate(60);
}

/* ==================================================== *\
|*                       DRAW 60 Hz                     *|
\* ==================================================== */

function draw()
{
    // Draw the background
    background(130, 130, 250);
    strokeWeight(2);
    stroke(0);
    fill(0);

    // Update and Show all pendulums in the array
    for(let i = 0; i < pendulums.length; i++)
    {
        pendulums[i].update();
        pendulums[i].show();
    }
}

/**
 * Mouse Pressed event
 */
function mousePressed() 
{
    // For all pendulums
    for(let i = 0; i < pendulums.length; i++)
    {
        // Call the corresponding function (pressed)
        pendulums[i].pressed();
    }
}

/**
 * Mouse Released event
 */
function mouseReleased() 
{
    // For all pendulums
    for(let i = 0; i < pendulums.length; i++)
    {
        // Call the corresponding function (released)
        pendulums[i].released();
    }
}