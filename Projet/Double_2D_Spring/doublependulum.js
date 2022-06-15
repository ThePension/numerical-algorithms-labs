/**
 * @class DoublePendulum
 */
class DoublePendulum
{
    /**
     * Construct a double pendulum object
     * @param {float} offset Offset from the origin (for the second ball)
     * @param {Color} color Color of the pendulum
     */
    constructor(offset, color)
    {
        // Radius in pixel
        this.r1 = 200;
        this.r2 = 200;

        // Angle (rad)
        this.a1 = 3;
        this.a2 = 3 + offset;

        // Angular velocity
        this.a1_v = 0;
        this.a2_v = 0;

        // Angular acceleration
        this.a1_a = 0;
        this.a2_a = 0;

        // Position of the first ball
        this.x1;
        this.y1;
        
        // Position of the second ball
        this.x2;
        this.y2;

        // Color
        this.color = color;

        // Calculate position of the first mass
        this.x1 = this.r1 * sin(this.a1);
        this.y1 = this.r1 * cos(this.a1);

        // Calculate position of the second mass
        this.x2 = this.x1 + this.r2 * sin(this.a2);
        this.y2 = this.y1 + this.r2 * cos(this.a2);

        this.dragging1 = false; // Is the first ball being dragged ?
        this.dragging2 = false; // Is the second ball being dragged ?

        this.previous_a1 = 0;
        this.previous_a2 = 0;
    }

    /**
     * Display the pendulum
     */
    show()
    {
        stroke(this.color);
        fill(this.color);

        // Draw the first spring
        translate(width / 2, height / 2);
        line(0, 0, this.x1, this.y1);

        // Draw the second spring
        line(this.x1, this.y1, this.x2, this.y2);

        // Draw the first ball
        circle(this.x1, this.y1, 2 * square_side);

        // Draw the second ball
        circle(this.x2, this.y2, 2 * square_side);

        // Go back to the top left corner of the canevas
        resetMatrix();
    }

    /**
     * Update the position of the two balls
     */
    update()
    {
        // If no ball is being dragged
        if (!this.dragging1 && !this.dragging2)
        {
            // Calculate the angular acceleration of the two mass
            this.computeAngularAccelerationForM1();
            this.computeAngularAccelerationForM2();

            // Apply these accelerations to the angular velocity
            this.a1_v += this.a1_a / 15.0;
            this.a2_v += this.a2_a / 15.0;

            // Apply the velocity to the position 
            this.a1 += this.a1_v;
            this.a2 += this.a2_v;
        }
        else
        {
            // If the first ball is being dragger
            if(this.dragging1)
            {
                // Get the relative position of the mouse (from the center of the screen)
                let relativeMouseX = mouseX - width / 2;
                let relativeMouseY = (height / 2) - mouseY;

                // Calculate the angle based on the mouse relative position
                this.a1 = atan2(relativeMouseY, relativeMouseX) + PI/2;

                // Set the velocity of the first ball based the current angle and the previous one
                this.a1_v = this.a1 - this.previous_a1;
            }
            else if(this.dragging2) // If the second ball is being dragged
            {
                // Get the relative position of the mouse (from the position of the first ball)
                let relativeMouseXForM2 = mouseX - (width / 2 + this.x1);
                let relativeMouseYForM2 = (height / 2 + this.y1) - mouseY;
 
                // Calculate the angle based on the mouse relative position
                this.a2 = -atan2(relativeMouseXForM2, relativeMouseYForM2) + PI;

                // Set the velocity of the second ball based on the current angle and the previous one
                this.a2_v = this.a2 - this.previous_a2;

                // Block the angular acceleration of the second ball
                this.a2_a = 0;

                // Block the velocity of the first ball
                this.a1_v = 0;
            }

            // Get the previous angle
            this.previous_a1 = this.a1;
            this.previous_a2 = this.a2;
        }

        // Calculate position of the first mass
        this.x1 = this.r1 * sin(this.a1);
        this.y1 = this.r1 * cos(this.a1);

        // Calculate position of the second mass
        this.x2 = this.x1 + this.r2 * sin(this.a2);
        this.y2 = this.y1 + this.r2 * cos(this.a2);

        // Apply damping
        this.a1_v *= 0.999;
        this.a2_v *= 0.999;
    }

    /**
     * Mouse Pressed event
     */
    pressed()
    {
        // If the mouse is over the first ball
        if (this.overMass1())
        {
            // Start dragging the first ball
            this.dragging1 = true;
        }
        else if(this.overMass2()) // If the mouse is over the second ball
        {
            // Start dragging the second ball
            this.dragging2 = true;
        }
    }

    /**
     * Mouse Released event
     */
    released()
    {
        // Quit dragging
        this.dragging1 = false;
        this.dragging2 = false;
    }

    /**
     * Check if the mouse is over the first ball
     * @returns {bool}
     */
    overMass1()
    {
        let relativeMouseX = mouseX - width / 2;
        let relativeMouseY = mouseY - height / 2;
        // Is mouse over object
        return relativeMouseX > this.x1 - square_side * 2 && relativeMouseX < this.x1 + square_side * 2 && relativeMouseY > this.y1 - square_side * 2 && relativeMouseY < this.y1 + square_side * 2;
    }

    /**
     * Check if the mouse is over the second ball
     * @returns {bool}
     */
    overMass2()
    {
        let relativeMouseX = mouseX - width / 2;
        let relativeMouseY = mouseY - height / 2;
        // Is mouse over object
        return relativeMouseX > this.x2 - square_side * 2 && relativeMouseX < this.x2 + square_side * 2 && relativeMouseY > this.y2 - square_side * 2 && relativeMouseY < this.y2 + square_side * 2;           
    }

    /**
     * Calculate the acceleration of the first ball
     */
    computeAngularAccelerationForM1()
    {
        let num1 = -g * (2 * m1 + m2) * sin(this.a1);
        let num2 = -m2 * g * sin(this.a1 - 2 * this.a2);
        let num3 = -2 * sin(this.a1 - this.a2) * m2;
        let num4 = this.a2_v * this.a2_v * this.r2 + this.a1_v * this.a1_v * this.r1 * cos(this.a1 - this.a2);
        let den = this.r1 * (2 * m1 + m2 - m2 * cos(2 * this.a1 - 2 * this.a2));
        this.a1_a = (num1 + num2 + num3 * num4) / den;
    }

    /**
     * Calculate the acceleration of the second ball
     */
    computeAngularAccelerationForM2()
    {
        let num1 = 2 * sin(this.a1 - this.a2);
        let num2 = (this.a1_v * this.a1_v * this.r1 * (m1 + m2));
        let num3 = g * (m1 + m2) * cos(this.a1);
        let num4 = this.a2_v * this.a2_v * this.r2 * m2 * cos(this.a1 - this.a2);
        let den = this.r2 * (2 * m1 + m2 - m2 * cos(2 * this.a1 - 2 * this.a2));
        this.a2_a = (num1 * (num2 + num3 + num4)) / den;
    }
}