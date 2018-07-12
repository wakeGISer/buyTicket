 
 /**
  * author: wuerchang
  * @param {精灵的name} name 
  * @param {精灵的绘制器*} painter 
  * @param {精灵的行为*} behaviors 
  */
 const Sprite = function (name, painter, behaviors) {
    if (name !== undefined)      this.name = name;
    if (painter !== undefined)   this.painter = painter;
    if (behaviors !== undefined) this.behaviors = behaviors;
 
    return this;
 };
 
 Sprite.prototype = {
    left: 0,
    top: 0,
    width: 10,
    height: 10,
     velocityX: 0,
     velocityY: 0,
    visible: true,
    animating: false,
    painter: undefined, // object with paint(sprite, context)
    behaviors: [], // objects with execute(sprite, context, time)
 
     paint: function (context) {
      if (this.painter !== undefined && this.visible) {
         this.painter.paint(this, context);
      }
     },
 
    update: function (context, time) {
       for (var i = this.behaviors.length; i > 0; --i) {
          this.behaviors[i-1].execute(this, context, time);
       }
    }
 };

 function drawGrid(color, stepx, stepy) {
    context.save()
 
    context.shadowColor = undefined;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
 
    context.strokeStyle = color;
    context.fillStyle = '#ffffff';
    context.lineWidth = 0.5;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
 
    for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, context.canvas.height);
      context.stroke();
    }
 
    for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
    }
 
    context.restore();
}
 