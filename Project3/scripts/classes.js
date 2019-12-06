"use strict";
class GameObject extends PIXI.Sprite{
    constructor(width,height,x=0,y=0,direction=0){
        //super(PIXI.loader.resources[].texture);
        this.bounds = bounds;
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
}

class Grandma extends GameObject{
    constructor(x,y,width,height,direction,color=0xFF0000){
        //Load sprite
        super(width,height,x,y,direction);
        this.beginFill(color);
        let graphics = new PIXI.Graphics();
        graphics.drawRect(x, y, width, height);
        this.endFill();
        this.ancor.set(.5,.5)
        this.scale.set(0.1);
    }
}