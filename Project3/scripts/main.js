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
let gameOverScene, finalScore;

let grandma;
let breads = [];
let bullets = [];
let gumDrops = [];
let score = 0;
let enemyCap = 5;
let paused = true;

function setup() {
    //Setup the stage
    stage = app.stage;

    //Create the start scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    //Create the game scene
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    //Create the labels for each scene
    createLabelsandButtons();
    //Create game objects
    grandma = new TestGrandma(50, 50,sceneWidth/2, sceneHeight/2);
    gameScene.addChild(grandma);

    //Start the game loop
    app.ticker.add(gameLoop);

    //Listen for the click event
    app.view.onclick = spawnBullet;
}

//Creates the game loop
function gameLoop() {
    if(gameScene.visible){
         //Calculate delta time
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    //Rotate grandma
    grandma.updateRotation();

    //Spawn the enemies
    if(breads.length < enemyCap){
        let br = new Bread(20, 50, grandma,3);
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
        for(let br of breads){
            if(rectsIntersect(br, b)){

                if(br.lives == 1){
                    gameScene.removeChild(br);
                    br.isAlive = false;
                    score++;
                }
                else{
                    br.lives--;
                    br.updateLives();
                }   
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
        if(rectsIntersect(b, grandma)){
            endGame();
        }
    }

    //Update score
    updateScore();

    //clean up dead bullets and bread
    bullets = bullets.filter(b=>b.isAlive);
    breads = breads.filter(b=>b.isAlive);

    //Update enemy cap
    if(score > enemyCap){
        enemyCap += 5;
    }
    }
   
}

//Creates all of the UI elements
function createLabelsandButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0x000000,
        fontsize: 100,
        fontFamily: "Futura"
    });

    //Set up start scene
    let background = new PIXI.Sprite.fromImage('images/TitleBackground.png');
    background.anchor.x = 0;
    background.anchor.y = 0;
    background.x = 0;
    background.y = 0;
    startScene.addChild(background);

    let title = new PIXI.Sprite.fromImage('images/title.png');
    title.anchor.x = title.width/2;
    title.anchor.y = title.height/2;
    title.x = sceneWidth/2;
    title.y = sceneHeight/2 + 40;
    title.width = 500;
    title.height = 300;
    startScene.addChild(title);

    //Start button
    let startButton = new PIXI.Text("Play");
    startButton.style = buttonStyle;
    startButton.x = sceneWidth/2 - startButton.width/2;
    startButton.y = sceneHeight - 90;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup",startGame);
    startButton.on('pointerover',e=>e.target.alpha = 0.7);
    startButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    //Set up game scene
    let gameBackground = new PIXI.Sprite.fromImage('images/GameBackground.png');
    gameBackground.anchor.x = 0;
    gameBackground.anchor.y = 0;
    gameBackground.x = 0;
    gameBackground.y = 0;
    gameScene.addChild(gameBackground);

    let textStyle = new PIXI.TextStyle({
        fill:0xFFFFFF,
        fontSize: 18,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 4
    });

    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);

    //Set up game over scene
    let endBackground = new PIXI.Sprite.fromImage('images/TitleBackground.png');
    endBackground.anchor.x = 0;
    endBackground.anchor.y = 0;
    endBackground.x = 0;
    endBackground.y = 0;
    gameOverScene.addChild(endBackground);

    let gameOver = new PIXI.Sprite.fromImage(`images/GameOverText.png`);
    gameOver.anchor.x = 0;
    gameOver.anchor.y = 0;
    gameOver.x = 0;
    gameOver.y = sceneHeight/2 - 100;
    gameOver.width = 800;
    gameOver.height = 200;
    gameOverScene.addChild(gameOver);

    finalScore = new PIXI.Text();
    finalScore.style = buttonStyle;
    finalScore.x = sceneWidth/2 - 50;
    finalScore.y = sceneHeight/2 + 150;
    gameOverScene.addChild(finalScore);

    let backButton = new PIXI.Text("Back to Main Menu");
    backButton.style = buttonStyle;
    backButton.x = sceneWidth/2 - backButton.width/2;
    backButton.y = sceneHeight - 100;
    backButton.interactive = true;
    backButton.buttonMode = true;
    backButton.on("pointerup",backToMain);
    backButton.on('pointerover',e=>e.target.alpha = 0.7);
    backButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(backButton);
}

//Function handling menu logic

//Starts the game
function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
}

//Ends the game
function endGame(){
    startScene.visible = false;
    gameOverScene.visible = true;
    gameScene.visible = false;
    for(let b of breads){
        gameScene.removeChild(b);
        b.isAlive = false;
    }
    breads = [];
}

//Goes back to the main menu
function backToMain(){
    startScene.visible = true;
    gameOverScene.visible = false;
    gameScene.visible = false;
}

//Updates the the score UI
function updateScore(){
    scoreLabel.text = `Score ${score}`;
    finalScore.text = `Score ${score}`;
}

//Spawns bullets when fired
function spawnBullet(e){
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
