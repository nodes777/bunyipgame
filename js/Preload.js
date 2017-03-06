var TopDownGame = TopDownGame || {};

//loading the game assets
TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/basicTiles.png');
    this.load.tilemap('menu', 'assets/tilemaps/menu.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level2', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);

    //this.load.image('player', 'assets/images/guy.png');
    this.load.spritesheet('player', 'assets/images/guyWalk.png', 32, 32);
    this.load.spritesheet('dog', 'assets/images/dog.png', 32, 32);
    this.load.spritesheet('bunyip', 'assets/images/bunyip.png', 32, 32);
  },
  create: function() {
    this.state.start('Game', false, false, 1);
  }
};