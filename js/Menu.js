var TopDownGame = TopDownGame || {};

//loading the game assets
TopDownGame.Menu = function(){};

TopDownGame.Menu.prototype = {
  init: function(level){
    this.nextLevel = level;
  },
  preload: function() {

  },
  create: function() {
   console.log("menu");
   this.nextLevel++;
   this.map = this.game.add.tilemap('menu');
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('basicTiles', 'gameTiles');

    //create layers
    this.backgroundlayer = this.map.createLayer('background');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();
    this.setLevelText();

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spacebar = this.game.input.keyboard.addKey(32);
    this.enter = this.game.input.keyboard.addKey(13);
  },
  update: function() {
    if(this.spacebar.isDown){
      console.log(this.nextLevel);
      this.game.stateTransition.to('Game', false, false, this.nextLevel);
    }
    if(this.enter.isDown){
      this.game.stateTransition.to('Game', false, false, this.nextLevel);
    }
  },
  setLevelText: function(hour) {
        words = "Keep Going?";

        this.style = {
            font: "24px Arial",
            fill: "white",
            wordWrap: false,
            wordWrapWidth: 100,
        };

        text = this.game.add.text(this.game.camera.width/2, this.game.camera.height/2, words, this.style);
        text.anchor.set(0.5,0.5);
        text.fixedToCamera = true;
    },
};