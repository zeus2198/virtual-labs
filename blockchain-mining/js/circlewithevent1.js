var mycircle=function(canvas,x,y)
{
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.x = x;
    this.y = y;
    this.r = 25;
    this.mycolor = 'red';

    this.x1 = [];
    this.y1 = [];
    
}

mycircle.prototype.draw = function ()
{
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2*Math.PI, true);
    context.fillStyle = this.mycolor
    context.fill();
    context.strokeStyle = "black";
    context.lineWidth = 3
    context.stroke();

}
mycircle.prototype.setconnection=function(x,y)
{
    this.x1.push({x:x});
    this.y1.push({ y: y });
    //alert(this.x1.length);
	this.connect=1;
}
mycircle.prototype.drawline=function()
{
    for (var i = 0; i < this.x1.length;i++)
    {
        
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x1[i].x, this.y1[i].y);
        this.context.strokeStyle = "black"
        this.context.lineWidth = 3;
        this.context.stroke();
    }
}
