"use strict";
const app = new PIXI.Application(600, 600);

let gameDiv = document.querySelector("#game");
gameDiv.appendChild(app.view);

//constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

//pre-load the images
PIXI.loader.
add(["images/Grandma.png","images/Bread.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)}).
load(setup);

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
let enemyCap = 5;
let paused = true;

PIXI.loader.load(setup);

function setup() {
    //Setup the stage
    stage = app.stage;

    //Create the start scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    //Create the game scene
    gameScene = new PIXI.Container();
    gameScene.visible = true;
    stage.addChild(gameScene);

    //Create game objects
    grandma = new TestGrandma(50, 50, sceneWidth / 2, sceneHeight / 2);
    gameScene.addChild(grandma);

    //Start the game loop
    app.ticker.add(gameLoop);

    //Listen for the click event
    app.view.onclick = spawnBullet;
}

//Creates the game loop
function gameLoop() {
    //Calculate delta time
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    //Rotate grandma
    grandma.updateRotation();

    //Spawn the enemies
    if (breads.length < 10) {
        let br = new Bread(20, 50, grandma);
        randomPosition(br);
        breads.push(br);
        gameScene.addChild(br);
    }

    //Move the bullets
    for (let b of bullets) {
        b.move(dt);

        if (b.x < -10 || b.x > sceneWidth + 10 || b.y < -10 || b.y > sceneHeight + 10) {
            gameScene.removeChild(b);
            b.isAlive = false;
        }

        //Detects collision with the breads
        for (let br of breads) {
            if (rectsIntersect(br, b)) {
                gameScene.removeChild(br);
                br.isAlive = false;
                gameScene.removeChild(b);
                b.isAlive = false;
            }
        }
    }

    //Move the bread
    for (let b of breads) {
        b.updateRotation(grandma);
        b.updateMovement(b.x, b.y);
        b.move(dt);
        if (rectsIntersect(b, grandma)) {
            gameScene.removeChild(b);
            b.isAlive = false;
        }
    }

    //Update score
    updateScore();

    //clean up dead bullets and bread
    bullets = bullets.filter(b => b.isAlive);
    breads = breads.filter(b => b.isAlive);
}

function spawnBullet(e) {
    let b = new Bullet(5, grandma.x, grandma.y);
    bullets.push(b);
    gameScene.addChild(b);
}

// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a, b) {
    let ab = a.getBounds();
    let bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

//Get a random position for the breads
function randomPosition(bread) {
    let angle = Math.random() * Math.PI * 2;
    let radius = 500;

    bread.x = Math.cos(angle) * radius + grandma.x;
    bread.y = Math.sin(angle) * radius + grandma.y;
}
