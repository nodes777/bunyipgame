var TopDownGame = TopDownGame || {};
//new Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
TopDownGame.game = new Phaser.Game(window.screen.width, window.screen.height, Phaser.AUTO, 'game');

TopDownGame.game.state.add('Boot', TopDownGame.Boot);
TopDownGame.game.state.add('Preload', TopDownGame.Preload);
TopDownGame.game.state.add('Game', TopDownGame.Game);
TopDownGame.game.state.add('Menu', TopDownGame.Menu);

TopDownGame.game.state.start('Boot');