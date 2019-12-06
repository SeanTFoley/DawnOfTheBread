"use strict";
const app = new PIXI.Application(600,600);

let gameDiv = document.querySelector("#game");
gameDiv.appendChild(app.view);

//constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

//game variables
let startScene;
let gameScene, grandma, scoreLabel;
let gameOverScene;

let zombies = [];
let bullets = [];
let score = 0;
let paused = true;
