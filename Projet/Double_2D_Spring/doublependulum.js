class DoublePendulum
{
    constructor(dec, color)
    {
        this.r1 = 200;
        this.r2 = 200;
        this.a1 = 3;
        this.a2 = 3 + dec;
        this.a1_v = 0;
        this.a2_v = 0;
        this.a1_a = 0;
        this.a2_a = 0;

        this.x1;
        this.y1;
        
        this.x2;
        this.y2;

        this.color = color;

        this.square_side = 20;

        this.x1 = this.r1 * sin(this.a1);
        this.y1 = this.r1 * cos(this.a1);

        this.x2 = this.x1 + this.r2 * sin(this.a2);
        this.y2 = this.y1 + this.r2 * cos(this.a2);

        this.isMoving = false;

        this.dragging1 = false; // Is the object being dragged?
        this.dragging2 = false;

        this.offsetA1 = 0;
        this.offsetA2 = 0;

        this.prevOffsetA1 = 0;
        this.prevOffsetA2 = 0;
    }

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
        circle(this.x1, this.y1, 2 * this.square_side);

        // Draw the second ball
        circle(this.x2, this.y2, 2 * this.square_side);

        // Go back to the top left corner of the canevas
        resetMatrix();
    }

    update()
    {
        if (!this.dragging1 && !this.dragging2)
        {
            this.computeAngularAccelerationForM1();
            this.computeAngularAccelerationForM2();

            this.a1_v += this.a1_a / 15.0;
            this.a2_v += this.a2_a / 15.0;

            this.a1 += this.a1_v;
            this.a2 += this.a2_v;
        }
        else
        {
            if(this.dragging1)
            {
                let relativeMouseX = mouseX - width / 2;
                let relativeMouseY = (height / 2) - mouseY;

                this.offsetA1 = atan2(relativeMouseY, relativeMouseX) + PI/2;

                this.a1 = this.offsetA1;
                this.a1_v = this.offsetA1 - this.prevOffsetA1;
            }
            else if(this.dragging2)
            {
                let relativeMouseXForM2 = mouseX - (width / 2 + this.x1);
                let relativeMouseYForM2 = (height / 2 + this.y1) - mouseY;

                this.offsetA2 = -atan2(relativeMouseXForM2, relativeMouseYForM2) + PI;
                this.a2 = this.offsetA2;

                this.a2_v = this.offsetA2 - this.prevOffsetA2;

                this.a2_a = 0;
                this.a1_v = 0;
            }

            // Get the previous angle
            this.prevOffsetA1 = this.offsetA1;
            this.prevOffsetA2 = this.offsetA2;
        }

        // Update position of the first mass
        this.x1 = this.r1 * sin(this.a1);
        this.y1 = this.r1 * cos(this.a1);

        // Update position of the second mass
        this.x2 = this.x1 + this.r2 * sin(this.a2);
        this.y2 = this.y1 + this.r2 * cos(this.a2);

        // Apply damping
        this.a1_v *= 0.999;
        this.a2_v *= 0.999;
    }

    pressed()
    {
        if (this.overMass1())
        {
            this.dragging1 = true;
        }
        else if(this.overMass2())
        {
            this.dragging2 = true;
        }
    }

    released()
    {
        // Quit dragging
        this.dragging1 = false;
        this.dragging2 = false;
    }

    overMass1()
    {
        let relativeMouseX = mouseX - width / 2;
        let relativeMouseY = mouseY - height / 2;
        // Is mouse over object
        return relativeMouseX > this.x1 - this.square_side * 2 && relativeMouseX < this.x1 + this.square_side * 2 && relativeMouseY > this.y1 - this.square_side * 2 && relativeMouseY < this.y1 + this.square_side * 2;
    }

    overMass2()
    {
        let relativeMouseX = mouseX - width / 2;
        let relativeMouseY = mouseY - height / 2;
        // Is mouse over object
        return relativeMouseX > this.x2 - this.square_side * 2 && relativeMouseX < this.x2 + this.square_side * 2 && relativeMouseY > this.y2 - this.square_side * 2 && relativeMouseY < this.y2 + this.square_side * 2;           
    }

    computeAngularAccelerationForM1()
    {
        let num1 = -g * (2 * m1 + m2) * sin(this.a1);
        let num2 = -m2 * g * sin(this.a1 - 2 * this.a2);
        let num3 = -2 * sin(this.a1 - this.a2) * m2;
        let num4 = this.a2_v * this.a2_v * this.r2 + this.a1_v * this.a1_v * this.r1 * cos(this.a1 - this.a2);
        let den = this.r1 * (2 * m1 + m2 - m2 * cos(2 * this.a1 - 2 * this.a2));
        this.a1_a = (num1 + num2 + num3 * num4) / den;
    }

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