/**
 * Update the number of pendulums based on the input
 */
function simulation_pendulum_number()
{
    pendulum_number_value.value = parseFloat(pendulum_number_input.value).toFixed(2).padStart(5, '0');
    pendulums_number = pendulum_number_value.value;
    simulation_reset();
}

/**
 * Reset the simulation
 */
function simulation_reset() {
    // Clear the array of pendulums
    pendulums = [];

    for(let i = 0; i < pendulums_number; i++)
    {
        pendulums.push(new DoublePendulum(i / 100000, color(map(i, 0, pendulums_number, 0, 255), map(i, 0, pendulums_number, 0, 255), map(i, 0, pendulums_number, 0, 255))));
    }
}

/**
 * Update the gravity value based on the input
 */
function simulation_gravity() {
    g = +(gravity_input.value);
    gravity_value.value = parseFloat(gravity_input.value).toFixed(2).padStart(5, '0');
}

/**
 * Update the mass of the first ball based on the input
 */
function mass1() {
    if (+(mass1_input.value) < 1) {
        mass1_input.value = 1;
    }

    m1 = +(mass1_input.value);
}

/**
 * Update the mass of the second ball based on the input
 */
function mass2() {
    if (+(mass2_input.value) < 1) {

        mass2_input.value = 1;
    }

    m2 = +(mass2_input.value);
}