var GAME_START = false;
var GAME_OVER = false;
var GAME_OVER_MENU = false;

const width = 1920;
const height = 1080;
const saut = 500;
const cheminPersonnage = "Images/runMan.png";
const cheminPersonnageData = "Data/runMan.json";
const cheminBackground = "Images/background.jpg";
const cheminGround = "Example/img/ground.png";

const taillePersonnage = 130;
const tailleGround = 193;

const vitesseGround = 500;

const CheminJump = 'Images/saut.jpg';
const CheminBasic = 'Images/normal.jpg';
const CheminHole = 'Images/trou.jpg';
const CheminCrutch = 'Images/accroupissement.jpg';
const CheminClock = 'Images/clock.png';
const tailleTuile = 200;

const tailleClock = 75;
const decallageClock = 175;

const vitessePersonnageRun = 20;
const vitessePersonnageJump = 5;

const popHorloge = 1;
const valHorloge = 5+2;

var timerSeconde = 30;
var timerMinute = 00;

var score = 0;
var scoreText;

var max = 0;
var front_emitter;
var mid_emitter;
var back_emitter;
var update_interval = 4 * 60;
var i = 0;

var scoreFont = "60px Arial";

function preload() {

	game.load.image('background', cheminBackground);
	game.load.atlas('personnage', cheminPersonnage, cheminPersonnageData);
	game.load.image('jump', CheminJump);
	game.load.image('basic', CheminBasic);
	game.load.image('ground', CheminBasic);
	game.load.image('hole', CheminHole);
	game.load.image('clock', CheminClock);
	//Polisse desyrel, bitmapFont
	game.load.bitmapFont('desyrel', 'Fonts/desyrel.png', 'Fonts/desyrel.xml');

	//Flocon
	game.load.spritesheet('snowflakes', 'Images/snowflakes.png', 17, 17);
    	//game.load.spritesheet('snowflakes_large', 'Images/snowflakes_large.png', 64, 64);

    	//Son
    	game.load.audio('course', 'Sons/course.mp3');
    	game.load.audio('sautSound', 'Sons/saut.mp3');
    	game.load.audio('trouSound', 'Sons/trou.mp3');
    	game.load.audio('picSound', 'Sons/pics.mp3');
    	game.load.audio('horlogeSound', 'Sons/horloge.mp3');
    	game.load.audio('gameOverSound', 'Sons/gameOver.mp3');
}

function create() {
	//game.add.plugin(Phaser.Plugin.Debug);

	//  We're going to be using physics, so enable the Arcade Physics system
    	game.physics.startSystem(Phaser.Physics.ARCADE);

    	//Affichage
    	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;

	game.scale.setShowAll();
	window.addEventListener('resize', function () {
		game.scale.refresh();
	});
	game.scale.refresh();

	//Background
	background = game.add.sprite(0, 0, 'background');
	background.width = game.width;
	background.height = game.height;

	//Ground
	constructGround();

	//Personnage
	personnage = game.add.sprite(150, game.world.height - tailleGround - taillePersonnage, 'personnage');
	game.physics.arcade.enable(personnage);
    	personnage.body.gravity.y = 1200;
    	personnage.body.collideWorldBounds = true;
    	personnage.width = personnage.width / 2;
	personnage.height = personnage.height / 2;
	personnage.anchor.setTo(0.5, 0.5);
	personnage.body.mass = 4;
	personnage.body.velocity.x = vitesseGround;
	personnage.body.x = 150;

	//Animation Personnage
	personnage.animations.add('jump', [0,1,2,3,4,5,6,7]);
	personnage.animations.add('run', [8,9,11,12,13,14]);
	personnage.animations.play('run', vitessePersonnageRun, true);

	//Sons
	course = game.add.audio('course', 0.1, true);
	sautSound = game.add.audio('sautSound', 0.1, false);
	picSound = game.add.audio('picSound', 0.1, false);
	trouSound = game.add.audio('trouSound', 0.1, false);
	horlogeSound = game.add.audio('horlogeSound', 0.1, false);
	gameOverSound = game.add.audio('gameOverSound', 0.1, false);

	course.play();

	//Cursor 
	cursors = game.input.keyboard.createCursorKeys();

	//Score
	scoreText = game.add.text(25, 0, '0 m', {font: scoreFont, fill: "#ffffff", stroke: "#535353", strokeThickness: 15}); 

	//Timer 
	timerEvent = this.time.events.loop(Phaser.Timer.SECOND, updateTimer);
	if(timerMinute < 10) {
		timerMinute = '0'+timerMinute;
	}
	if(timerSeconde < 10) {
		timerSeconde = '0'+timerSeconde;
	}
	timerText = this.add.text(game.world.width - 250, 0, timerMinute+':'+timerSeconde, {font: scoreFont, fill: "#ffffff", stroke: "#535353", strokeThickness: 15}); 
	scoreLabelTween = game.add.tween(timerText.scale).to({ x: 1.2, y: 1.3}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);

	//Flocon
	back_emitter = game.add.emitter(game.world.centerX, -32, 600);
	back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
	back_emitter.maxParticleScale = 0.6;
	back_emitter.minParticleScale = 0.2;
	back_emitter.setYSpeed(20, 100);
	back_emitter.gravity = 0;
	back_emitter.width = game.world.width * 1.5;
	back_emitter.minRotation = 0;
	back_emitter.maxRotation = 40;

	mid_emitter = game.add.emitter(game.world.centerX, -32, 250);
	mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
	mid_emitter.maxParticleScale = 1.2;
	mid_emitter.minParticleScale = 0.8;
	mid_emitter.setYSpeed(50, 150);
	mid_emitter.gravity = 0;
	mid_emitter.width = game.world.width * 1.5;
	mid_emitter.minRotation = 0;
	mid_emitter.maxRotation = 40;

	// front_emitter = game.add.emitter(game.world.centerX, -32, 50);
	// front_emitter.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
	// front_emitter.maxParticleScale = 1;
	// front_emitter.minParticleScale = 0.5;
	// front_emitter.setYSpeed(100, 200);
	// front_emitter.gravity = 0;
	// front_emitter.width = game.world.width * 1.5;
	// front_emitter.minRotation = 0;
	// front_emitter.maxRotation = 40;

	changeWindDirection();

	back_emitter.start(false, 14000, 20);
	mid_emitter.start(false, 12000, 40);
	// front_emitter.start(false, 6000, 1000);
}

function update() {

	game.physics.arcade.collide(personnage, platforms, GoodCollide, checkCollision);
	game.physics.arcade.overlap(personnage, clocks, GetClock, null, this);

	if(personnage.body.touching.down == true && personnage.body.velocity.y == 0){
		personnage.animations.play('run', vitessePersonnageRun, true);
		personnage.body.x = 220;
		personnage.body.velocity.x = vitesseGround;
		if(!course.isPlaying){
			sautSound.stop();
			course.play();
		}
	}

	platforms.forEach(function(segment) {
		if(!GAME_OVER){
			segment.body.velocity.x = -vitesseGround;
			segment.body.immovable = true;
			segment.body.rebound = false;
			if((segment.body.x + tailleTuile < 0) && segment.key != 'ground') {
				killSegment(segment);
			}
		}
		else {
			segment.body.velocity.x = 0;
		}
	}, this);

	clocks.forEach(function(clock) {
		if(!GAME_OVER){
			clock.body.velocity.x = -vitesseGround;
			clock.body.immovable = true;
			clock.body.rebound = true;
			clock.body.rotate = true;
			if(clock.body.x== -tailleTuile) {
				killClocks(clock);
			}
		}
		else {
			clock.body.velocity.x = 0;
		}
	});

	if(platforms.getAt(platforms.length - 1).x <= game.world.width){
		addSegment();
	}

	// Si le centre du sol sort à gauche de l'écran
	if(ground.body.x + ground.width / 2 <= 0) {
		ground.body.x = 0;
	}

	//Flocon
	i++;

	if (i === update_interval)
	{
		changeWindDirection();
		update_interval = Math.floor(Math.random() * 20) * 60;
		i = 0;
	}

	if(GAME_OVER){
		personnage.animations.stop('run');
		personnage.animations.stop('jump');
		if(course.isPlaying){
			course.stop();
		}
		if(sautSound.isPlaying){
			sautSound.stop();
		}

		if(!trouSound.isPlaying && !picSound.isPlaying){
			trouSound.stop();
			picSound.stop();
			if(!gameOverSound.isPlaying && !GAME_OVER_MENU){
				gameOverSound.play();
				GAME_OVER_MENU = true;
			}
		}
	}
}

function constructGround() {
	grounds = game.add.group();
	grounds.enableBody = true;
	ground = grounds.create(0, game.world.height - tailleGround, 'ground');
	ground.body.immovable = true;
	ground.width = game.width * 2;
	ground.body.velocity.x = -vitesseGround;
	ground.body.rebound = false;
	platforms = game.add.group();
	platforms.enableBody = true;
	clocks= game.add.group();
	clocks.enableBody = true;
	
	for(var i = 0; i < game.width/2; i=i+tailleTuile) {
		platforms.create(i, game.world.height -tailleGround, 'basic');
	}

	while(platforms.getAt(platforms.length - 1).x < game.width) {
		addSegment();
	}
}

function addSegment() {
	var obstacle = ['jump', 'hole'];
	var randClockAppear = Math.random()*3;
	var randObst=parseInt(Math.random()*obstacle.length);
	var randClockDisplay;
	platforms.create(platforms.getAt(platforms.length - 1).x+tailleTuile, game.world.height - tailleGround, obstacle[randObst]);
	var randBasic=parseInt(Math.random()*3);
	if(randClockAppear <= popHorloge) {
		randClockDisplay = parseInt(Math.random()*(randBasic+1) - 0.1);
	}
	for(var i=0; i <= randBasic; i++) {
		platforms.create(platforms.getAt(platforms.length - 1).x + tailleTuile, game.world.height - tailleGround, 'basic');
		if(randClockDisplay==i) {
			clock = clocks.create(platforms.getAt(platforms.length - 1).x+tailleTuile/2-tailleClock/2, game.world.height - tailleGround - tailleClock - decallageClock, 'clock');
			clock.width = clock.width*1.5;
			clock.height = clock.height*1.5;
		}
	}
}

function GetClock(personnage,clock) {
	horlogeSound.play();
	clock.kill();
	clocks.remove(clock);
	clock = null;
	addTimer(valHorloge);
}

function killSegment(segment) {
	platforms.remove(segment);
	segment.kill();
	score += 10;
	scoreText.text = score + ' m';
	segment = null;
}

function killClocks(clock) {
	clock.kill();
	clocks.remove(clock);
	clock = null;
}

function die() {
	GAME_OVER = true;
	personnage.animations.stop('run');
	personnage.animations.stop('jump');
	back_emitter.kill();
	mid_emitter.kill();
}

function checkCollision(personnage, object) {
	if (object.key != 'basic') {
		switch(object.key)
		{
			case 'jump':
			//personnage.animations.play('die', 20, true);
			course.stop();
			if(!picSound.isPlaying && !GAME_OVER){
				picSound.play();
			}
			personnage.body.velocity.x = 0;
			die();
			break;
			case 'hole':
			course.stop();
			if(!trouSound.isPlaying && !GAME_OVER){
				trouSound.play();
			}
			personnage.body.velocity.x = 75;
			personnage.body.collideWorldBounds = false;
			die();
			return false;
			break;
		}
		die();
	}
	else{
		return true;
	}
}

function updateTimer() {
	if(timerSeconde == 0 && timerMinute == 0) {
		die();
	}

	if(GAME_OVER == false){
		if(timerSeconde > 0){
			timerSeconde -= 1;
		}
		else {
			timerSeconde = 59;
			timerMinute -= 1;
		}

		if(timerSeconde < 10){
			timerSeconde = '0'+timerSeconde;
		}
		timerText.text = timerMinute+':'+timerSeconde;
	}
}

function addTimer(timeAdd) {
	timerSeconde = parseInt(timerSeconde);

	var scoreAnimation = game.add.text(personnage.body.x, personnage.body.y, '+' + 5, {font: "80px Arial", fill: "#ffffff", stroke: "#535353", strokeThickness: 15}); 
	scoreAnimation.anchor.setTo(0.5, 0);

	var scoreTween = game.add.tween(scoreAnimation).to({x: game.world.width - 250, y: 0}, 350, Phaser.Easing.Exponential.In, true);
	scoreTween.onComplete.add(function(){
		scoreAnimation.destroy();
		scoreLabelTween.start();
		if(timerSeconde + timeAdd > 59){
			timerSeconde = (timerSeconde + timeAdd) % 60;
			timerMinute = parseInt(timerMinute) + 1;
		}
		else {
			timerSeconde += timeAdd;
		}
		updateTimer();
	}, game);
}


function changeWindDirection() {

	var multi = Math.floor((max + 200) / 4),
	frag = (Math.floor(Math.random() * 100) - multi);
	max = max + frag;

	if (max > 200) {
		max = 150;
	}
	if (max < -200) {
		max = -150;
	}

	setXSpeed(back_emitter, max);
	setXSpeed(mid_emitter, max);
	// setXSpeed(front_emitter, max);

}

function setXSpeed(emitter, max) {

	emitter.setXSpeed(max - 20, max);
	emitter.forEachAlive(setParticleXSpeed, this, max);

}

function setParticleXSpeed(particle, max) {

	particle.body.velocity.x = max - Math.floor(Math.random() * 30);

}

function GoodCollide(personnage,object) {
	if (object.key == 'basic') {
		if ((game.input.activePointer.isDown && personnage.body.touching.down && !GAME_OVER) || (cursors.up.isDown && personnage.body.touching.down && !GAME_OVER) ) {
				course.stop();
				sautSound.play();
				personnage.animations.play('jump', 5, true);
				personnage.body.velocity.x = 0;
				personnage.body.velocity.y = -saut;
		}
	}
}
