function Spiral(context,t_begin,t_end,intervals,C,Tx, xStar, yStar, color, colorStar, start, slope) {
    this.context = context;
    this.t_begin = t_begin;
    this.t_end = t_end;
    this.intervals = intervals;
    this.C = C;
    this.Tx = Tx;
    this.xStar = xStar;
    this.yStar = yStar;
    this.color = color;
    this.colorStar = colorStar;
    this.start = start;
    this.slope = slope;
    this.tParam = 0;
}

// spiral function
var Rstart = 25.0;
var Rslope = 25.0;
var Cspiral = function(t) {
    var R = Rslope * t + Rstart;
    var x = R * Math.cos(2.0 * Math.PI * t);
    var y = R * Math.sin(2.0 * Math.PI * t);
    return [x,y];
}


Spiral.prototype.draw = function() {
    this.context.fillStyle = this.color;
    this.context.strokeStyle = "black";
    this.context.lineWidth =  '1';
    this.drawTrajectory(this.t_begin, this.t_end, this.intervals, this.C, this.Tx, this.color);

    // making star move on spiral 
    var T_axes = mat3.create();
    mat3.fromTranslation(T_axes, [this.xStar, this.yStar]);

    var Tstar_to_spiral = mat3.create();
	mat3.fromTranslation(Tstar_to_spiral, Cspiral(this.tParam));
	var Tstar_to_canvas = mat3.create();
	mat3.multiply(Tstar_to_canvas, T_axes, Tstar_to_spiral);
	this.drawStar(this.colorStar, Tstar_to_canvas);
}

Spiral.prototype.drawStar = function(color, Tx) {
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.strokeStyle = "black";

    this.moveToTx([0, 0 - 10], Tx);

    for (var i = 0; i < 5; ++i) {
        mat3.rotate(Tx, Tx, Math.PI / 5);
        this.lineToTx([0, 0- (10 * 2)], Tx);
        mat3.rotate(Tx, Tx, Math.PI / 5);
        this.lineToTx([0, 0 - 10], Tx);
    }
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
}

Spiral.prototype.drawTrajectory = function(t_begin,t_end,intervals,C,Tx,color) {
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.moveToTx(C(t_begin),Tx);
        for (var i = 1; i <= intervals; i++) {
            var t = ((intervals-i)/intervals) * t_begin + (i/intervals) * t_end;
            this.lineToTx(C(t),Tx);
        }
        this.context.stroke();
}

Spiral.prototype.moveToTx = function (loc, Tx) { 
    var res = vec2.create(); 
    vec2.transformMat3(res,loc,Tx); 
    this.context.moveTo(res[0],res[1]);
}

Spiral.prototype.lineToTx = function (loc,Tx) { 
    var res = vec2.create(); 
    vec2.transformMat3(res,loc,Tx); 
    this.context.lineTo(res[0],res[1]);
}

Spiral.prototype.update = function() {
    this.tParam += 1 * 0.01;
    if (this.tParam >= 7) {
        this.tParam = 0;
    }
}