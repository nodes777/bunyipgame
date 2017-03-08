var TopDownGame = TopDownGame || {};

//loading the game assets
TopDownGame.Menu = function(){};

TopDownGame.Menu.prototype = {
  init: function(level, lost, song){
    this.nextLevel = level;
    this.maxLevel = 4;
    this.playerLostGame = lost;
    this.song = song;
  },
  preload: function() {

  },
  create: function() {
    if(this.playerLostGame){
      this.nextLevel = 1;
    }else{
      this.nextLevel++;
    }
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
        if(this.playerLostGame){
        this.song.fadeOut(500);
        this.song.onFadeComplete.add(function(){
             this.game.stateTransition.to('Game', true, false, this.nextLevel);
        }, this);
      } else {
        this.game.stateTransition.to('Game', true, false, this.nextLevel);
      }
    }
    if(this.enter.isDown){
      if(this.playerLostGame){
        this.song.fadeOut(500);
        this.song.onFadeComplete.add(function(){
             this.game.stateTransition.to('Game', true, false, this.nextLevel);
        }, this);
      } else {
        this.game.stateTransition.to('Game', true, false, this.nextLevel);
      }
    }
  },
  setLevelText: function(hour) {
    var words;
    if(this.nextLevel<this.maxLevel){
       words = "Keep Going? \n Enter or Spacebar";
      } else {
        words = "You've reached the end";
      }
      if(this.nextLevel===1){
        words = "Find your dog and bring him back home before the Bunyip gets ya! \n Enter or Spacebar";
      }
      if(this.playerLostGame){
        words = "YoU gOt CaUgHt By ThE BuNYip. \n ReTRy FRom ThE BeGinNinG?";
      }
        this.style = {
            font: "24px Gabriella",
            fill: "#ffffff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 300
        };

        text = this.game.add.text(this.game.camera.width/2, this.game.camera.height/2, words, this.style);
        text.anchor.set(0.5,0.5);
        text.fixedToCamera = true;
    },
};