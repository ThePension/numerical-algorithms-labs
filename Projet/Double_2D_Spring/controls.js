function graph_clear() {
    resetMatrix();
    stroke(255);
    fill(255);
    rect(0, 0, width, height);
}

function simulation_reset() {
    a1 = [0, 0];
    a2 = [0, 0];

    v1 = [0, 0];
    v2 = [0, 0];

    s1 = [0, 100];
    s2 = [-70, 90];

    oldx = null;
    oldy = null;

    graph_clear();
}

function simulation_pause() {
    ispaused = !ispaused;
    sumulation_pause.innerHTML = ispaused ? 'unpause' : 'pause';
}

function simulation_gravity() {
    g = +(gravity_input.value);
    gravity_value.value = parseFloat(gravity_input.value).toFixed(2).padStart(5, '0');
}

function simulation_damping() {
    b = +(damping_input.value);
    damping_value.value = parseFloat(damping_input.value).toFixed(2).padStart(3, '0')
}

function springs_rest_length() {
    if (+(rest_length_input.value) < 1) {
        rest_length_input.value = 1;
    }

    R = +(rest_length_input.value);
}

function springs_constant() {
    if (+(spring_constant_input.value) < 1) {
        spring_constant_input.value = 1;
    }

    k = +(spring_constant_input.value);
}

function springs_mass1() {
    if (+(mass1_input.value) < 1) {
        mass1_input.value = 1;
    }

    m1 = +(mass1_input.value);
}

function springs_mass2() {
    if (+(mass2_input.value) < 1) {

        mass2_input.value = 1;
    }

    m2 = +(mass2_input.value);
}