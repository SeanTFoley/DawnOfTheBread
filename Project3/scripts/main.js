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
}

//Start the game loop
app.ticker.add(gameLoop);

//Creates the game loop
function gameLoop(){
    //Calculate delta time
    let dt = 1/app.ticker.FPS;
        if(dt > 1/12) dt=1/12;

    //Rotate grandma
    grandma.updateRotation();
}
