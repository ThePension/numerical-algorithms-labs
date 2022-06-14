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
        let num1 = -g * (2 * m1 + m2) * sin(this.a1);
        let num2 = -m2 * g * sin(this.a1 - 2 * this.a2);
        let num3 = -2 * sin(this.a1 - this.a2) * m2;
        let num4 = this.a2_v * this.a2_v * this.r2 + this.a1_v * this.a1_v * this.r1 * cos(this.a1 - this.a2);
        let den = this.r1 * (2 * m1 + m2 - m2 * cos(2 * this.a1 - 2 * this.a2));
        this.a1_a = (num1 + num2 + num3 * num4) / den;

        num1 = 2 * sin(this.a1 - this.a2);
        num2 = (this.a1_v * this.a1_v * this.r1 * (m1 + m2));
        num3 = g * (m1 + m2) * cos(this.a1);
        num4 = this.a2_v * this.a2_v * this.r2 * m2 * cos(this.a1 - this.a2);
        den = this.r2 * (2 * m1 + m2 - m2 * cos(2 * this.a1 - 2 * this.a2));
        this.a2_a = (num1 * (num2 + num3 + num4)) / den;

        this.a1_v += this.a1_a / 15.0;
        this.a2_v += this.a2_a / 15.0;

        this.a1 += this.a1_v;
        this.a2 += this.a2_v;

        this.x1 = this.r1 * sin(this.a1);
        this.y1 = this.r1 * cos(this.a1);

        this.x2 = this.x1 + this.r2 * sin(this.a2);
        this.y2 = this.y1 + this.r2 * cos(this.a2);
    }
}