var GAME_START = false;
var GAME_OVER = false;

const width = 1920;
const height = 1080;
const saut = 750;
const cheminPersonnage = "Example/img/bird.png";
const cheminPersonnageData = "Example/data/bird.json";
const cheminBackground = "Example/img/background.png";
const cheminGround = "Example/img/ground.png";

const taillePersonnage = 150;
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

function preload() {

	game.load.image('background', cheminBackground);
	game.load.image('ground', cheminGround);
	game.load.atlas('personnage', cheminPersonnage, cheminPersonnageData);
	game.load.image('jump', CheminJump);
	game.load.image('basic', CheminBasic);
	game.load.image('hole', CheminHole);
	game.load.image('clock', CheminClock);
}

function create() {

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
    	personnage.width = personnage.width / 6.5;
	personnage.height = personnage.height / 6.5;
	personnage.anchor.setTo(0.5, 0.5);
	personnage.body.mass = 4;
	personnage.body.velocity.x = vitesseGround;
	personnage.body.x = 150;

	//Animation Personnage
	personnage.animations.add('fly');
	personnage.animations.play('fly', 8, true);

	//Cursor 
	cursors = game.input.keyboard.createCursorKeys();
}

function update() {
	//  Collide the player and the stars with the platforms
	game.physics.arcade.collide(personnage, platforms);

	if ((game.input.activePointer.isDown && personnage.body.touching.down) || (cursors.up.isDown && personnage.body.touching.down) )
	{
		personnage.body.velocity.x = 0;
		personnage.body.velocity.y = -saut;
	}

	if(personnage.body.touching.down == true && personnage.body.velocity.y == 0){
		personnage.body.x = 220;
		personnage.body.velocity.x = vitesseGround;
	}

	platforms.forEachAlive(function(segment) {
		segment.body.velocity.x = -vitesseGround;
		segment.body.immovable = true;
		segment.body.rebound = false;
		if(segment.x== -tailleTuile)
		{
			segment.destroy();
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
	platforms = game.add.group();
	platforms.enableBody = true;
	ground = platforms.create(0, game.world.height - tailleGround, 'basic');
	ground.body.immovable = true;
	ground.width = game.width * 2;
	ground.body.velocity.x = -vitesseGround;
	ground.body.rebound = false;
	
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
			platforms.create(platforms.getAt(platforms.length - 1).x, game.world.height - tailleGround - tailleClock - decallageClock, 'clock');
		}
	}
}