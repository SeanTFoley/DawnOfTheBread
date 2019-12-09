"use strict";
const app = new PIXI.Application(600,600);

let gameDiv = document.querySelector("#game");
gameDiv.appendChild(app.view);

//constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let stage;

//game variables
let startScene;
let gameScene, scoreLabel;
let gameOverScene;

let grandma;
let breads = [];
let bullets = [];
let gumDrops = [];
let score = 0;
let paused = true;

PIXI.loader.load(setup);

function setup(){
    //Setup the stage
    stage = app.stage;

    //Create the game scene
gameScene = new PIXI.Container();
gameScene.visible = true;
stage.addChild(gameScene);

//Create game objects
grandma = new TestGrandma(50, 50,sceneWidth/2, sceneHeight/2);
gameScene.addChild(grandma);

//Start the game loop
app.ticker.add(gameLoop);

//Listen for the click event
app.view.onclick = spawnBullet;

//Spawn the enemy
let br = new Bread(20, 50, grandma, 500, 100);
breads.push(br);
gameScene.addChild(br);
}

//Creates the game loop
function gameLoop(){
    //Calculate delta time
    let dt = 1/app.ticker.FPS;
        if(dt > 1/12) dt=1/12;

    //Rotate grandma
    grandma.updateRotation();

    //Move the bullets
    for(let b of bullets){
        b.move(dt);

        if(b.x<-10 || b.x>sceneWidth+10 || b.y<-10 || b.y>sceneHeight+10){
            gameScene.removeChild(b);
            b.isAlive = false;
        }

        //Detects collision with the breads
        for(let br of breads){
            if(rectsIntersect(br, b)){
                gameScene.removeChild(br);
                br.isAlive = false;
                gameScene.removeChild(b);
                b.isAlive = false;
            }
        }
    }

    //Move the bread
    for(let b of breads){
        //b.move(dt);
        if(rectsIntersect(b, grandma)){
            gameScene.removeChild(b);
            b.isAlive = false;
        }
    }
    //clean up dead bullets and bread
    bullets = bullets.filter(b=>b.isAlive);
    breads = breads.filter(b=>b.isAlive);
}

function spawnBullet(e){
    let b = new Bullet(5, grandma.x, grandma.y);
    bullets.push(b);
    gameScene.addChild(b);
}

// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a,b){
    let ab = a.getBounds();
    let bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

