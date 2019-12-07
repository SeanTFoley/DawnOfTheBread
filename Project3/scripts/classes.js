
class GameObject extends PIXI.Sprite{
    constructor(width,height,direction=0,x=0,y=0){
        //super(PIXI.loader.resources[].texture);
        super();
        //this.bounds = bounds;
        this.x = x;
        this.y = y;
        //this.direction = direction;
    }
}

class Grandma extends GameObject{
    constructor(x,y,width,height,direction,color=0xFF0000){
        //Load sprite
        super(width,height,x,y,direction);
        let graphics = new PIXI.Graphics();
        graphics.beginFill(color);      
        graphics.drawRect(x, y, width, height);
        graphics.endFill();
        this.anchor.set(.5,.5)
        this.scale.set(0.1);
    }
}

class TestGrandma extends PIXI.Graphics{
    constructor(width,height,x=0,y=0,direction=45,color=0xFF0000){
        super();
        this.beginFill(color);
        this.drawRect(x - width/2,y - height/2,width,height);
        this.endFill();
        this.pivot.set(x,y);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.rotation = 3.14159/4;
    }
}