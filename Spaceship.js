// sets up the Spaceship prototype object
function Spaceship(context, x, y) {
    this.width = 100;
    this.height = 200;
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.rightShooter = 0;
    this.leftShooter = 0;
    this.context = context;

    this.beginningYPos = y;
}
/* this function draws each part of the spaceship, while performing various context
translations, rotations, and scales */
Spaceship.prototype.draw = function() {

    /* context repeatedly translates in the negative y direction to 
    mimic a spaceship shooting off */
    var Tship_to_canvas = mat3.create();
    mat3.fromTranslation(Tship_to_canvas, [this.x, this.y]);

    // sets the fill and stroke color for the spaceship body, and draws it
    this.context.fillStyle = "#7164b0";
    this.context.strokeStyle = "#7164b0";

    this.drawRocketBody(Tship_to_canvas);

    /* context saves, sets the fill and stroke color for the spaceship flames, 
    draws it, then context restores */
    this.context.fillStyle = "#fcae47";
    this.context.strokeStyle = "#d65b36";
    this.drawFlames(Tship_to_canvas);
   
    /* context saves, sets the fill color for the spaceship head, draws it, then 
    context restores */
    this.context.fillStyle = "#abb2d6";
    this.drawRocketHead(Tship_to_canvas);

    /* context saves, sets the fill color for the spaceship wings, draws the opposite 
    facing wings, then context restores */
    this.context.fillStyle = "#253069";
    mat3.fromTranslation(Tship_to_canvas, [this.x, this.y+this.height]);
    this.drawWing(Tship_to_canvas);
    mat3.fromTranslation(Tship_to_canvas, [this.x + this.width, this.y+this.height]);
    mat3.scale(Tship_to_canvas, Tship_to_canvas, [-1,1]);
    this.drawWing(Tship_to_canvas);

    // /* context saves, sets the fill and stroke colors for the rotating shooter objects, 
    // draws them, then context restores */
    this.context.fillStyle = "#a2e8be";
    this.context.strokeStyle = "#a2e8be";
    this.context.lineWidth = "1";
    var Tshooter_to_canvas = mat3.create();
    mat3.fromTranslation(Tshooter_to_canvas, [this.x-50, this.y + this.height]);
    mat3.rotate(Tshooter_to_canvas, Tshooter_to_canvas, this.rightShooter);
    this.drawShooter(Tshooter_to_canvas);

    // // same as above but rotates the shooter in an opposite direction
    this.context.fillStyle = "#5FB9F1";
    this.context.strokeStyle = "#5FB9F1";
    mat3.fromTranslation(Tshooter_to_canvas, [this.x-50, this.y + this.height]);
    mat3.rotate(Tshooter_to_canvas, Tshooter_to_canvas, -this.leftShooter);
    this.drawShooter(Tshooter_to_canvas);

    // // same as above but rotates the shooter in an opposite direction
    this.context.fillStyle = "#a2e8be";
    this.context.strokeStyle = "#a2e8be";
    mat3.fromTranslation(Tshooter_to_canvas, [this.x + this.width + 50, this.y + this.height]);
    mat3.rotate(Tshooter_to_canvas, Tshooter_to_canvas, -this.rightShooter);
    this.drawShooter(Tshooter_to_canvas);

    // // same as above but rotates the shooter in an opposite direction
    this.context.fillStyle = "#5FB9F1";
    this.context.strokeStyle = "#5FB9F1";
    mat3.fromTranslation(Tshooter_to_canvas, [this.x + this.width + 50, this.y + this.height]);
    mat3.rotate(Tshooter_to_canvas, Tshooter_to_canvas, this.leftShooter);
    this.drawShooter(Tshooter_to_canvas);
}

// The spaceship shooter object is formed by calling drawBlade() twice
Spaceship.prototype.drawShooter = function(Tx) {
    this.drawBlade(Tx);
    mat3.fromTranslation(Tx, [-100, 0]);
    mat3.scale(Tx, Tx, [-1,-1]);
    this.drawBlade(Tx);
}

// draws the individual "blade" of the longer shooter object 
Spaceship.prototype.drawBlade = function(Tx) {
    this.context.beginPath();
    this.moveToTx([0,0], Tx);
    this.lineToTx([-50,-50], Tx);
    this.lineToTx([-55,-45], Tx);
    this.lineToTx([-5,5], Tx);
    this.lineToTx([0,0], Tx);
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
}

// draws the triangle shaped wings attached to the spaceship body
Spaceship.prototype.drawWing = function(Tx) {
    this.context.beginPath();
    this.moveToTx([0,0], Tx);
    this.lineToTx([-50, 0], Tx);
    this.lineToTx([0, -40], Tx);
    this.lineToTx([0, 0], Tx);
    this.context.closePath();
    this.context.fill();
}

// draws the circles on the spaceship body (no purpose other than design)
Spaceship.prototype.drawCircle = function(x, y) {
    this.context.beginPath();
    this.context.arc(this.x + x, this.y + y, 22, 0, 2 * Math.PI);
    this.context.fillStyle = "#c8eef7";
    this.context.lineWidth = 3;
    this.context.strokeStyle = "white";
    this.context.fill();
    this.context.stroke();
}

// draws the body of the spaceship
Spaceship.prototype.drawRocketBody = function(Tx) {
    this.context.beginPath();
    this.moveToTx([0, 0], Tx);
    this.lineToTx([this.width, 0], Tx);
    this.lineToTx([this.width, this.height], Tx);
    this.lineToTx([0, this.height], Tx)
    this.context.closePath();
    this.context.fill();
    this.context.stroke();

    this.drawCircle(50, 50);
    this.drawCircle(50, 135);
 }

// draws the spaceship head
Spaceship.prototype.drawRocketHead = function(Tx) {
    this.context.beginPath();
    this.context.arc(this.x + 50, this.y, this.width * 0.5, Math.PI, 0);
    this.context.closePath();
    this.context.fill();
}

/* draws the spaceships's flames which appear animated by calling Math.random() 
to determine length of the flame on every frame redraw */
Spaceship.prototype.drawFlames = function(Tx) {
    this.context.beginPath();
    this.moveToTx([Tx[2], Tx[5] + this.height], Tx);
    this.lineToTx([Tx[2] + this.width, this.height], Tx);
    this.lineToTx([Tx[2] + this.width * 0.5, this.height + Math.random() * 10 + 60], Tx);
    this.lineToTx([Tx[2], Tx[5] + this.height], Tx);
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
}

Spaceship.prototype.moveToTx = function(loc, Tx) {
    var res = vec2.create();
    vec2.transformMat3(res, loc, Tx);
    this.context.moveTo(res[0], res[1]);
}

Spaceship.prototype.lineToTx = function(loc, Tx) {
    var res = vec2.create();
    vec2.transformMat3(res, loc, Tx);
    this.context.lineTo(res[0], res[1]);
}



/* this function updates the state of the spaceship's y-position and the context's 
rotation angle; it is called before every canvas redraw */
Spaceship.prototype.update = function() {
    this.leftShooter += 0.1;
    this.rightShooter += 0.1;
    this.y -= 3;

    if (this.y <= -200) {
        this.y = this.beginningYPos;
    }
}