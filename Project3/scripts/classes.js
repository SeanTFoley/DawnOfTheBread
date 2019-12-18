
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

class TestGrandma extends PIXI.Sprite{
    constructor(width,height,x=0,y=0,direction=0,color=0xFF0000){
        super(PIXI.loader.resources["images/Grandma.png"].texture);
        this.pivot.set(this.width/2,this.height/2);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.rotation = 0;
    }

    //Updates the rotation based on the mouse position
    updateRotation(){
        //Grabs the two positions
        let p1 = {
            x: this.x + 5,
            y: this.y
        }
        let p2 = app.renderer.plugins.interaction.mouse.global;

        //Find the angle
        let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        angle += (90 * (Math.PI/180));
        this.rotation = angle;
    }
}

class Bullet extends PIXI.Graphics{
    constructor(radius,x=0,y=0,direction=0,color=0x000000){
        super();
        this.beginFill(color);
        this.drawCircle(x,y,radius);
        this.endFill();
        this.pivot.set(x,y);
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.direction = direction;

        //Variables
        this.mouseDir = app.renderer.plugins.interaction.mouse.global;
        this.speed = 400;
        this.isAlive = true;

        //Normalize the distance
        this.xDir = x - this.mouseDir.x;
        this.yDir = y - this.mouseDir.y;
        let magnitude = Math.sqrt(this.xDir*this.xDir + this.yDir*this.yDir);

        this.xDir /= magnitude;
        this.yDir /= magnitude;
        Object.seal(this);
    }

    move(dt=1/60){
        this.x -= this.xDir * this.speed * dt;
        this.y -= this.yDir * this.speed * dt;
    }
}

class Bread extends PIXI.Sprite{
    constructor(width,height,grandma,lives,x=0,y=0,direction=0,color=0x0000FF){
        super(PIXI.loader.resources["images/Bread.png"].texture);
        this.pivot.set(this.width/2,this.height/2);
        this.lives = lives;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.grandma = grandma;
        this.direction = direction;
        this.rotation = 0;

        //Variables
        this.lives = 3;
        this.speed = 20;
        this.isAlive = true;

        this.updateMovement(x,y);
        Object.seal(this);
    }

    move(dt=1/60){
        this.x -= this.xDir * this.speed * dt;
        this.y -= this.yDir * this.speed * dt;
    }

    updateMovement(x,y){
        //Normalize the distance
        this.xDir = x - this.grandma.x;
        this.yDir = y - this.grandma.y;
        let magnitude = Math.sqrt(this.xDir*this.xDir + this.yDir*this.yDir);

        this.xDir /= magnitude;
        this.yDir /= magnitude;
    }

    updateRotation(grandma){
        //Update rotation
        let p1 = {
            x: this.x + 5,
            y: this.y
        }
        let p2 = {
            x: grandma.x,
            y: grandma.y
        }

        let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        this.rotation = angle;
    }

    updateLives(){
        if(this.lives==2){
            this.tint = 0xFFFF00;
            //this.color=0xFF00FF;
            //this.FillColor(this.color,this.x,this.y,this.width,this.height);
        }
        else if(this.lives==1){
            this.tint = 0xFF0000;
            //this.color=0xFF0000;
           // this.FillColor(this.color,this.x,this.y,this.width,this.height);
        }
    }

    FillColor(color,x,y,width,height){
        this.beginFill(color);
        this.drawRect(x-width/2,y-height/2,width,height);
        this.endFill();
    }
}