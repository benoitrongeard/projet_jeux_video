// Variables qui nous permettront de savoir quand le jeu démarre ou quand il y a un GAME OVER
var GAME_START = false;
var GAME_OVER = false;

// Taille du jeu (mode portrait d'un nexus 5 sans la barre de navigation)
const width = 1775;
const height = 1080;

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
	},

	create: function() {
		// Est appelée après la méthode "preload" afin d'appeler l'état "main" de notre jeu
	}
};

// Va contenir le coeur du jeu
gameState.main.prototype = {
};

gameState.main.prototype = {
	create: function() {
		// Méthode qui sera appelée pour initialiser le jeu et y intégrer les différentes ressources
	},

	update: function() {
		// Boucle principale du jeu (détection de collisions, déplacement du personnage...)
	}
};

game.state.add('load', gameState.load);
game.state.add('main', gameState.main);
// Il ne reste plus qu'à lancer l'état "load"
game.state.start('load');