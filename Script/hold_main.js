// Variables qui nous permettront de savoir quand le jeu démarre ou quand il y a un GAME OVER
var GAME_START = false;
var GAME_OVER = false;

// Taille du jeu (mode portrait d'un nexus 5 sans la barre de navigation)
const width = 1920;
const height = 1080;
const saut = 800;
const cheminBird = "Example/img/bird.png";
const cheminBirdData = "Example/data/bird.json";
const cheminBackground = "Example/img/background.png";
const cheminGround = "Example/img/ground.png";

// Phaser
var game = new Phaser.Game(width, height, Phaser.AUTO, 'JamTime');
// On rend le background transparent
game.transparent = true;

var gameState = {};

// On crée un objet "load" à notre objet gameState
gameState.load = function() { };
gameState.main = function() { };

gameState.load.prototype = {
	preload: function() {
		// Méthode qui sera appelée pour charger les ressources
		// Contiendra les ressources à charger (images, sons et JSON)

		// Bout de code qui va permettre au jeu de se redimensionner selon la taille de l'écran
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setShowAll();
		window.addEventListener('resize', function () {
			game.scale.refresh();
		});
		game.scale.refresh();

		/**** SPRITES *****/
		// Personnage
		game.load.atlas('bird', cheminBird, cheminBirdData);
		// background
		game.load.image('background', cheminBackground);
		//ground
		game.load.image('ground', cheminGround);

		game.physics.startSystem(Phaser.Physics.P2JS);  //activate physics
		game.physics.p2.gravity.y = 1200;  //realistic gravity
	},

	create: function() {
		// Est appelée après la méthode "preload" afin d'appeler l'état "main" de notre jeu
		game.state.start('main');
	}
};

// Va contenir le coeur du jeu
gameState.main.prototype = {
	// Méthode qui sera appelée pour initialiser le jeu et y intégrer les différentes ressources
	create: function() {
		//Affichage
		game.scale.setShowAll();
		window.addEventListener('resize', function () {
			game.scale.refresh();
		});
		game.scale.refresh();

		//Background
		this.background = game.add.sprite(0, 0, 'background');
		this.background.width = game.width;
		this.background.height = game.height;

		//Ground
		this.ground = game.add.sprite(0, 0, 'ground');
		this.ground.width = game.width * 2;

		//On active le sol
		game.physics.p2.enable(this.ground);

		this.ground.body.static=true;
		this.ground.body.y = this.background.height - 90;

		// Création de l'oiseau en tant que sprite dans le jeu avec coordonnées x = 200px et y = 0
		this.bird = game.add.sprite(0, 0, 'bird');
		this.bird.width = this.bird.width / 6.5;
		this.bird.height = this.bird.height / 6.5;

		//On active le personnage
		this.bird.enableBody = true;
		this.bird.physicsBodyType = Phaser.Physics.ARCADE;

		// On place le personnage
		this.bird.body.x = 200;
		this.bird.body.y = this.background.height - this.ground.height - this.bird.height;

		// On parametre le personnage
		this.bird.body.setCircle(22);  // collision circle 
		this.bird.body.fixedRotation = true; // do not rotate on collision
		this.bird.body.mass = 4;
		this.bird.body.bounce.y = 0.40;

		// On place le point d'origine au centre de l'oiseau afin qu'on puisse lui affecter une rotation sur lui-même
		this.bird.anchor.setTo(0.5, 0.5);

		//Animation du personnage
		this.tweenFlap = game.add.tween(this.bird);
		this.tweenFlap.to({ y: this.bird.y + 20}, 400, Phaser.Easing.Quadratic.InOut, true, 0, 10000000000, true);

		this.bird.animations.add('fly');
		this.bird.animations.play('fly', 8, true);

		//Evenement du personnage
		game.input.onTap.add(this.jump, this);
	},

	jump: function(){
		// Personnage qui saute
		this.bird.body.moveUp(saut);
	},

	update: function() {
		//this is in the update
		game.physics.collide(this.bird, this.ground, ballHitBallHandler, ballHitBallProcess, this);
		 
		//two custom functions
		function ballHitBallHandler(ball1, ball2) {
			return true;
		}
		function ballHitBallProcess(ball1, ball2) {
			return true;
		}
	}
};

game.state.add('load', gameState.load);
game.state.add('main', gameState.main);
// Il ne reste plus qu'à lancer l'état "load"
game.state.start('load');