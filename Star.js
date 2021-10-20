// sets up the Star prototype object 
function Star(context,x,y,r,points,inset,color) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.r = r;
    this.points = points;
    this.inset = inset;
    this.color = color;
}

Star.prototype.moveToTx = function(loc, Tx) {
    var res = vec2.create();
    vec2.transformMat3(res, loc, Tx);
    this.context.moveTo(res[0], res[1]);
}

Star.prototype.lineToTx = function(loc, Tx) {
    var res = vec2.create();
    vec2.transformMat3(res, loc, Tx);
    this.context.lineTo(res[0], res[1]);
}

// this function sets the fill and stroke color, based on a Star object's properties
Star.prototype.draw = function() {
    this.context.fillStyle = this.color;
    this.context.strokeStyle = "black";
    this.context.lineWidth =  '1';
    this.drawStar();
}

// draws the star
Star.prototype.drawStar = function() {
    this.context.beginPath();

    var Tstar_to_canvas = mat3.create();
    mat3.fromTranslation(Tstar_to_canvas, [this.x, this.y]);
    this.moveToTx([0, 0 - this.r], Tstar_to_canvas);

    for (var i = 0; i < this.points; ++i) {
        mat3.rotate(Tstar_to_canvas, Tstar_to_canvas, Math.PI / this.points)
        this.lineToTx([0, 0- (this.r * this.inset)], Tstar_to_canvas);
        mat3.rotate(Tstar_to_canvas, Tstar_to_canvas, Math.PI / this.points)
        this.lineToTx([0, 0 - this.r], Tstar_to_canvas);
    }
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
}