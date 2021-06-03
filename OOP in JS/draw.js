class Projectile {
    constructor(color, number, speedX, speedY, radius, startingX, startingY, damage, manaCost, bouncy, homing, explosive) {
        this.color = color;
        //Debugging Variable
        this.number = number;
        this.speedx = speedX;
        this.speedy = speedY;
        this.radius = radius;
        this.x = startingX;
        this.y = startingY;
        this.damage = damage;
        this.cost = manaCost;

        this.bouncy = bouncy;
        this.homing = homing;
        this.explosive = explosive;
    }
    drawBubble() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    update() {
        // Movement
        this.movement();
        // Redraw
        this.drawBubble();
    }

    movement() {
        this.x -= this.speedx;
        this.y -= this.speedy;
    }

    offScreenCheck() {
        if ((this.y + this.radius) <= 0 || this.y - this.radius >= canvas.height || this.x + this.radius <= 0 || this.x - this.radius >= canvas.width) {
            return true;
        } else {
            return false;
        }
    }

    collisionCheck(rx, ry, rw, rh) {
        let testX = this.x;
        let testY = this.y;

        if (this.x < rx) {
            testX = rx // if the x co-ord of circle is less than that of rect, use the x variable of rect for distance test, this is the left wall.
        } else if (this.x > rx + rw) {
            testX = rx + rw; // right edge, this is if circle x is on the right of square
        }
        // New If statement for Y co-ords
        if (this.y < ry) {
            testY = ry; // top edge
        } else if (this.y > ry + rh) {
            testY = ry + rh; // bottom edge

        }
        // get distance from closest edge using the testX and testY variables
        let distX = this.x - testX;
        let distY = this.y - testY;
        let distance = Math.sqrt((distX * distX) + (distY * distY));

        // if the distance is less than the radius, collision!
        if (distance <= this.radius) {
            return true;
        }
        return false;

    }
}

class Block {
    constructor(color, x, y, width, height, numb, speed) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.numb = Math.round(numb);
        this.speed = speed;
        this.directionSelector = Math.random()
        this.heartx = this.x;
        this.hearty = this.y;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.heartx = this.x + (this.width / 2);
        this.hearty = this.y + (this.height / 2);
        // Redraw so it wont vanish
        this.draw();
        this.text();

        this.movement();
        this.offScreenCheck();
    }
    text() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(this.numb, this.heartx - 16, this.hearty);
    }

    offScreenCheck() {
        if (this.directionSelector <= 0.5) {
            if ((this.x) <= 0) {
                //If the left edge is off screen, make it go right
                this.directionSelector = 1;
            }
        } else {
            if ((this.x + this.width) >= canvas.width) {
                //If right edge is off screen, make it go left
                this.directionSelector = 0;
            }
        }
    }
    movement() {
        if (this.directionSelector <= 0.5) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }
    }
}

class Explosion {
    constructor(explosionColor,x,y,expansionVelocity, explosionDamage){
        this.color = explosionColor;
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.cycles = 0;

        this.speed = expansionVelocity;
        this.damage = explosionDamage;
    }

    expand() {
        this.radius += this.speed;
    }

    drawBubble() {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "orange";
        ctx.stroke();
    }

    update() {
        // Movement
        this.expand();
        // Redraw
        this.drawBubble();
    }

    collisionCheck(rx, ry, rw, rh) {
        let testX = this.x;
        let testY = this.y;
        if (this.x < rx) {
            testX = rx 
        } else if (this.x > rx + rw) {
            testX = rx + rw; 
        }
       
        if (this.y < ry) {
            testY = ry;
        } else if (this.y > ry + rh) {
            testY = ry + rh; 

        }
        let distX = this.x - testX;
        let distY = this.y - testY;
        let distance = Math.sqrt((distX * distX) + (distY * distY));
        if (distance <= this.radius) {
            return true;
        }
    }
}