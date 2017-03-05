var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function() {};

TopDownGame.Game.prototype = {
    init: function() {

    },
    create: function() {

            this.map = this.game.add.tilemap('level1');

            //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
            this.map.addTilesetImage('basicTiles', 'gameTiles');

            //create layers
            this.backgroundlayer = this.map.createLayer('background');
            this.blockedLayer = this.map.createLayer('blockedlayer');

            //collision on blockedLayer
            this.map.setCollisionBetween(1, 2000, true, 'blockedlayer');

            //resizes the game world to match the layer dimensions
            this.backgroundlayer.resizeWorld();
            var playerSpawnCoords = {
                x:this.map.objects.objects[1].x,
                y:this.map.objects.objects[1].y
            };
            var dogSpawnCoords = {
                x:this.map.objects.objects[0].x,
                y:this.map.objects.objects[0].y
            };

            //FOR TESTING ONLY
            dogSpawnCoords.x = playerSpawnCoords.x - 40;
            dogSpawnCoords.y = playerSpawnCoords.y - 40;

            this.player = this.game.add.sprite(playerSpawnCoords.x, playerSpawnCoords.y, 'player');
            this.player.animations.add('down', [0, 1, 2, 3], 10, false);
            this.player.animations.add('up', [4, 5, 6, 7], 10, false);
            this.player.animations.add('right', [8, 9, 10, 11], 10, false);
            this.player.animations.add('left', [12, 13, 14, 15], 10, false);
            this.player.facing = "down";

            this.game.physics.arcade.enable(this.player);
            this.player.body.collideWorldBounds = true;

            this.dog = this.game.add.sprite(dogSpawnCoords.x, dogSpawnCoords.y, 'dog');
            this.dog.animations.add('toungue', [0, 1, 2, 3, 4,5,6,7,8,9,10,11,12,13,14,15,16,17], 5, true);
            this.dog.animations.play('toungue');
            this.physics.arcade.enableBody(this.dog);
            this.dog.scale.setTo(0.75,0.75);
            this.playerHasDog = false;


        this.game.camera.setPosition(this.player.x, this.player.y);
        //the camera will follow the player in the world
        this.game.camera.follow(this.player);
        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spacebar = this.game.input.keyboard.addKey(32);
        this.shiftKey = this.game.input.keyboard.addKey(16);
        //Prevent arrow and space bar keys from working on the browser. IE scrolling around
        this.game.input.keyboard.addKeyCapture([37, 38, 39, 40, 32]);


    },
    update: function() {
        //collisions
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        //If player hasn't gotten the dog yet, check for an overlap of those sprites
        if(!this.playerHasDog){
            this.game.physics.arcade.overlap(this.player, this.dog, this.playerGotDog, null, this);
        }

        //player movement
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        if (this.cursors.up.isDown) {
            this.player.body.velocity.y -= 50;
            this.player.animations.play('up');
            this.player.facing = "up";
        } else if (this.cursors.down.isDown) {
            this.player.body.velocity.y += 50;
            this.player.animations.play('down');
            this.player.facing = "down";
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= 50;
            this.player.animations.play('left');
            this.player.facing = "left";
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += 50;
            this.player.animations.play('right');
            this.player.facing = "right";
        }

        if(this.playerHasDog){
            if(this.player.facing==="left"){
                this.dog.x = this.player.x+15;
            } else {
                this.dog.x = this.player.x;
            }
            if(this.player.facing==="down"){
                this.dog.y = this.player.y-10;
            }else{
                this.dog.y = this.player.y+20;
            }
            
        }
    },
    render: function() {

    },
    playerGotDog: function(){
        console.log("touched dog");
        this.dog.scale.setTo(0.5,0.5);
        this.playerHasDog = true;
    }
};