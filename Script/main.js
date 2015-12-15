var GAME_START = false;
var GAME_OVER = false;

const width = 1920;
const height = 1080;
const saut = 750;
const cheminPersonnage = "Images/runMan.png";
const cheminPersonnageData = "Data/runMan.json";
const cheminBackground = "Example/img/background.png";
const cheminGround = "Example/img/ground.png";

const taillePersonnage = 130;
const tailleGround = 193;

const vitesseGround = 250;

const CheminJump = 'Images/saut.jpg';
const CheminBasic = 'Images/normal.jpg';
const CheminHole = 'Images/trou.jpg';
const CheminCrutch = 'Images/accroupissement.jpg';
const CheminClock = 'Images/clock.jpg';
const tailleTuile = 200;

const tailleClock = 75;
const decallageClock = 25;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'JamTime', { preload: preload, create: create, update: update });

var score = 0;
var scoreText;
var timer;
var timerText;

function preload() {

	game.load.image('background', cheminBackground);
	game.load.atlas('personnage', cheminPersonnage, cheminPersonnageData);
	game.load.image('jump', CheminJump);
	game.load.image('basic', CheminBasic);
	game.load.image('ground', CheminBasic);
	game.load.image('hole', CheminHole);
	game.load.image('clock', CheminClock);
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
	personnage = game.add.sprite(150, background.height - tailleGround - taillePersonnage, 'personnage');
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
	personnage.animations.play('run', 20, true);

	//Cursor 
	cursors = game.input.keyboard.createCursorKeys();

	//Score
	scoreText = game.add.text(16, 16, 'score: 0 m', { fontSize: '32px', fill: '#000' });
}

function update() {
	game.physics.arcade.collide(personnage, platforms, checkCollision);
	game.physics.arcade.overlap(personnage, clocks, GetClock, null, this);

	if(personnage.body.touching.down == true && personnage.body.velocity.y == 0){
		personnage.animations.play('run', 20, true);
		personnage.body.x = 220;
		personnage.body.velocity.x = vitesseGround;
	}

	platforms.forEach(function(segment) {
		segment.body.velocity.x = -vitesseGround;
		segment.body.immovable = true;
		segment.body.rebound = false;
		if((segment.body.x + tailleTuile < 0) && segment.key != 'ground') {
			killSegment(segment);
		}
	}, this);

	clocks.forEach(function(clock) {
		clock.body.velocity.x = -vitesseGround;
		clock.body.immovable = true;
		clock.body.rebound = true;
		if(clock.body.x== -tailleTuile) {
			killClocks(clock);
		}
	});

	if(platforms.getAt(platforms.length - 1).x <= game.world.width){
		addSegment();
	}

	// Si le centre du sol sort à gauche de l'écran
	if(ground.body.x + ground.width / 2 <= 0) {
		ground.body.x = 0;
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
	if(randClockAppear < 0.8) {
		randClockDisplay = parseInt(Math.random()*(randBasic+1) - 0.1);
	}
	for(i=0; i <= randBasic; i++) {
		platforms.create(platforms.getAt(platforms.length - 1).x + tailleTuile, game.world.height - tailleGround, 'basic');
		if(randClockDisplay==i) {
			clocks.create(platforms.getAt(platforms.length - 1).x+tailleTuile/2-tailleClock/2, game.world.height - tailleGround - tailleClock - decallageClock, 'clock');
		}
	}
}

function GetClock(personnage,clock) {
	clock.kill();
	clocks.remove(clock);
	clock = null;
}

function killSegment(segment) {
	platforms.remove(segment);
	segment.kill();
	score += 10;
	scoreText.text = 'Score: ' + score + ' m';
	segment = null;
}

function killClocks(clock) {
	clock.kill();
	clocks.remove(clock);
	clock = null;
}

function die() {
	GAME_OVER = true;
}

function checkCollision(personnage, object)
{
	if (object.key != 'basic') {
		die();
	}
	else {
		if ((game.input.activePointer.isDown && personnage.body.touching.down) || (cursors.up.isDown && personnage.body.touching.down) ) {
			personnage.animations.play('jump', 5, true);
			personnage.body.velocity.x = 0;
			personnage.body.velocity.y = -saut;
		}
	}
	return object.key;
}