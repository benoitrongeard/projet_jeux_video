// Variables qui nous permettront de savoir quand le jeu démarre ou quand il y a un GAME OVER
var GAME_START = false;
var GAME_OVER = false;
// Taille du jeu (mode portrait d'un nexus 5 sans la barre de navigation)
const width = 1775;
const height = 1080;
const tailleTuile = 50;
const saut =800;
const CheminJump = 'Images/saut.jpg';
const CheminBasic = 'Images/normal.jpg';
const CheminHole = 'Images/trou.jpg';
const CheminCrutch = 'Images/accroupissement.jpg';
const CheminClock = 'Images/clock.jpg';

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
		this.game.load.atlasJSONHash('test', 'Images/test.png', 'Data/test.json');

		// Bout de code qui va permettre au jeu de se redimensionner selon la taille de l'écran
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setShowAll();
		window.addEventListener('resize', function () {
			game.scale.refresh();
		});
		game.scale.refresh();
		//
		game.load.image('background', 'Images/fond.jpg');
		game.load.image('jump', CheminJump);
		game.load.image('basic', CheminBasic);
		game.load.image('hole', CheminHole);
		game.load.image('crutch', CheminCrutch);
		game.load.image('clock', CheminClock);

	},

	create: function() {
		// Est appelée après la méthode "preload" afin d'appeler l'état "main" de notre jeu
				game.state.start('main');
	}
};

// Va contenir le coeur du jeu
gameState.main.prototype = {
};

gameState.main.prototype = {
	create: function() {
		// Méthode qui sera appelée pour initialiser le jeu et y intégrer les différentes ressources

		//--- BACKGROUND
		this.background = game.add.sprite(0, 0, 'background');
		this.background.width = game.width;
		this.background.height = game.height;

		//--- PERSONNAGE
		this.test = this.game.add.sprite(50, game.height-150, 'test');
		this.test.width=this.test.width/1.7;
		this.test.height=this.test.height/1.7;
		this.test.y= this.test.y-this.test.height;

		//--- ANIMATION
		this.test.animations.add('walk');
		this.test.animations.play('walk', 10, true);

		this.constructGround();

	},

	update: function() {
		// Boucle principale du jeu (détection de collisions, déplacement du personnage...)
		this.ground.forEachAlive(function(segment)
		{
			segment.x-=5;
			if(segment.x==-tailleTuile)
			{
				segment.destroy();
			}
		});
		if(this.ground.getAt(this.ground.length - 1).x<=game.width)
		{
			this.addSegment();
		}
	},

	addSegment: function() {
		var obstacle = ['jump', 'hole','crutch'];
		var randClockAppear = Math.random()*3;
		var randObst=parseInt(Math.random()*3);
		var randClockDisplay;
			this.ground.create(this.ground.getAt(this.ground.length - 1).x+tailleTuile, game.height-150, obstacle[randObst]);
			var randBasic=parseInt(Math.random()*3);
			if(randClockAppear<0.8)
			{
				randClockDisplay=parseInt(Math.random()*(randBasic+1)-0.1);
			}
			for(i=0; i<=randBasic; i++)
			{
				this.ground.create(this.ground.getAt(this.ground.length - 1).x+tailleTuile, game.height-150, 'basic');
				if(randClockDisplay==i)
				{
					this.ground.create(this.ground.getAt(this.ground.length - 1).x, game.height-225, 'clock');
				}
			}
	},

	constructGround: function() {

		this.ground = game.add.group();

		//this.ground.setAll('scale', {x: ratio, y: ratio});

		for(var i = 0; i < game.width/2; i=i+tailleTuile) {
			this.ground.create(i, game.height-150, 'basic');
		}

		while(this.ground.getAt(this.ground.length - 1).x<game.width)
		{
			this.addSegment();
		}
	},

};

game.state.add('load', gameState.load);
game.state.add('main', gameState.main);
// Il ne reste plus qu'à lancer l'état "load"
game.state.start('load');