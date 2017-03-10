var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function() {};

TopDownGame.Game.prototype = {
    init: function(level) {
        this.level = level;
    },
    create: function() {
            //the map to load is adjusted by passing in the level from menu state
            this.map = this.game.add.tilemap('level'+this.level);

            //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
            this.map.addTilesetImage('basicTiles', 'gameTiles');

            //create layers
            this.backgroundlayer = this.map.createLayer('background');
            this.blockedLayer = this.map.createLayer('blockedlayer');
            //collision on blockedLayer
            this.map.setCollisionBetween(1, 2000, true, 'blockedlayer');
            //makes an array that's easier to write than the objects.objects
            this.mapObjs = this.map.objects.objects;


            //resizes the game world to match the layer dimensions
            this.backgroundlayer.resizeWorld();
            this.setUpPlayer();
            this.setUpDog();
            this.findBunyipSpawn();

            this.home = new Phaser.Rectangle(this.mapObjs[2].x, this.mapObjs[2].y, this.mapObjs[2].width+10, this.mapObjs[2].height+10);

            this.bunyipHasSpawned = false;
            //min 10 secs til bunyip spawns, then 0-5 more
            this.game.time.events.add(Math.random()*5000 + 10000, this.spawnBunyip, this);


        this.game.camera.setPosition(this.player.x, this.player.y);
        //the camera will follow the player in the world
        this.game.camera.follow(this.player);
        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spacebar = this.game.input.keyboard.addKey(32);
        //Prevent arrow and space bar keys from working on the browser. IE scrolling around
        this.game.input.keyboard.addKeyCapture([37, 38, 39, 40, 32]);

        this.playerSpawnSong = this.game.add.audio('playerSpawnSong');
        this.bunyipSpawnSong = this.game.add.audio('bunyipSpawnSong');
        this.bunyipAttackSong = this.game.add.audio('bunyipAttackSong');
        this.game.sound.setDecodedCallback([ this.playerSpawnSong, this.bunyipSpawnSong,
            this.bunyipAttackSong ], this.update, this);

        this.playerSpawnSong.loopFull();

    this.gamepad =  this.game.input.gamepad.start();

    this.game.input.gamepad.start();

    // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
    this.pad1 = this.game.input.gamepad.pad1;
    console.log(this.pad1);
    this.gamePadIsActive = this.game.input.gamepad.active && this.pad1.connected;

    if(this.gamePadIsActive){
        this.game.input.onDown.add(this.dump, this);
        this.leftStickX = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        this.leftStickY = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
    }
},
 dump: function() {
    console.log(this.pad1);
    console.log(this.pad1._axes[0]);
    console.log(this.pad1._rawPad.axes[0]);

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
            this.player.body.velocity.y -= 75;
            this.player.animations.play('up');
            this.player.facing = "up";
        } else if (this.cursors.down.isDown) {
            this.player.body.velocity.y += 75;
            this.player.animations.play('down');
            this.player.facing = "down";
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= 75;
            this.player.animations.play('left');
            this.player.facing = "left";
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += 75;
            this.player.animations.play('right');
            this.player.facing = "right";
        }

        if (this.gamePadIsActive) {
            console.log("active");
            this.leftStickX = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
            this.leftStickY = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);

           if (this.leftStickY<0) {
            this.player.body.velocity.y -= 75;
            this.player.animations.play('up');
                this.player.facing = "up";

            }
            if (this.leftStickY>0){
                this.player.body.velocity.y += 75;
                this.player.animations.play('down');
                this.player.facing = "down";
            }
            if (this.leftStickX<0) {
                this.player.body.velocity.x -= 75;
                this.player.animations.play('left');
                this.player.facing = "left";
            }
            if (this.leftStickX>0) {
                this.player.body.velocity.x += 75;
                this.player.animations.play('right');
                this.player.facing = "right";
            }
            if (this.pad1.justPressed(Phaser.Gamepad.XBOX360_A)){
                this.player.body.velocity.y += this.player.body.velocity.y*1.5;
                this.player.body.velocity.x += this.player.body.velocity.x*1.5;
            }
        }
        if(this.playerHasDog){
            if(this.home.contains(this.player.x, this.player.y)){
                this.levelComplete();
            }
            //Depending on the direction the player is facing, have the dog tail behind
            if(this.player.facing==="left"){
                this.dog.x = this.player.x+15;
            } else {
                this.dog.x = this.player.x-15;
            }
            if(this.player.facing==="down"){
                this.dog.y = this.player.y-25;
            } else {
                this.dog.y = this.player.y+20;
            }
        }
        this.game.physics.arcade.overlap(this.player, this.bunyip, this.gameOver, null, this);
        if(this.bunyipHasSpawned){
            this.bunyipHunting();
        }
    },
    render: function() {
        var debug = this.game.debug;
        //debug.soundInfo(this.bunyipSpawnSong, 20, 32);

    },
    playerGotDog: function(){
        this.dog.scale.setTo(0.5,0.5);
        this.playerHasDog = true;
    },
    levelComplete: function(){
        this.bunyipSpawnSong.fadeOut(500);
        this.bunyipSpawnSong.onFadeComplete.add(function(){
            this.game.stateTransition.to('Menu', true, false, this.level, false);
      }, this);
    },
    spawnBunyip: function(){
        this.bunyip = this.game.add.sprite(this.bunyipSpawnCoords.x, this.bunyipSpawnCoords.y, 'bunyip');
        this.bunyip.animations.add('wiggle', null, 15, true);
        this.bunyip.animations.play('wiggle');
        this.physics.arcade.enableBody(this.bunyip);
        this.bunyip.anchor.setTo(0.5, 0.5);
        //set body slightly smaller so overlap seems fairer
        this.bunyip.body.setSize(26, 26);

        this.bunyip.SPEED = 85; // missile speed pixels/second
        this.bunyip.TURN_RATE = 5;

        this.bunyipHasSpawned = true;

        this.playerSpawnSong.fadeOut();
        this.bunyipSpawnSong.loopFull();
        this.darkness = this.game.add.sprite(0,0, 'darkness');
        this.darkness.alpha = 0.1;
    },
    findBunyipSpawn : function(){
         //get a random bunyip spawn zone from the bunyip spawn map layer
            this.bunyipSpawnArr = this.map.objects.bunyipspawns;
            this.bunyipSpawnZone = this.bunyipSpawnArr[Math.floor(Math.random()*this.bunyipSpawnArr.length)];
            //get random coords from that spawnzone
            this.bunyipSpawnCoords = {
                //Math.random() * (max - min) + min;
                x: Math.floor(Math.random() * this.bunyipSpawnZone.width) + this.bunyipSpawnZone.x,
                y: Math.floor(Math.random() * this.bunyipSpawnZone.height) + this.bunyipSpawnZone.y,
            };
    },
    bunyipHunting: function() {
    // Calculate the angle from the bunyip to the player.x
    // and player.y are the mouse position
    var targetAngle = this.game.math.angleBetween(
        this.bunyip.x, this.bunyip.y,
        this.player.x, this.player.y
    );

    // Gradually (this.TURN_RATE) aim the bunyip towards the target angle
    if (this.bunyip.rotation !== targetAngle) {
        // Calculate difference between the current angle and targetAngle
        var delta = targetAngle - this.bunyip.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        if (delta > 0) {
            // Turn clockwise
            this.bunyip.angle += this.bunyip.TURN_RATE;
        } else {
            // Turn counter-clockwise
            this.bunyip.angle -= this.bunyip.TURN_RATE;
        }

        // Just set angle to target angle if they are close
        if (Math.abs(delta) < this.game.math.degToRad(this.bunyip.TURN_RATE)) {
            this.bunyip.rotation = targetAngle;
        }
    }

    // Calculate velocity vector based on this.rotation and this.SPEED
    this.bunyip.body.velocity.x = Math.cos(this.bunyip.rotation) * this.bunyip.SPEED;
    this.bunyip.body.velocity.y = Math.sin(this.bunyip.rotation) * this.bunyip.SPEED;
    },
    setUpPlayer: function(){
        var playerSpawnCoords = {
                x:this.mapObjs[1].x,
                y:this.mapObjs[1].y
            };

            this.player = this.game.add.sprite(playerSpawnCoords.x, playerSpawnCoords.y, 'player');
            this.player.animations.add('down', [0, 1, 2, 3], 10, false);
            this.player.animations.add('up', [4, 5, 6, 7], 10, false);
            this.player.animations.add('right', [8, 9, 10, 11], 10, false);
            this.player.animations.add('left', [12, 13, 14, 15], 10, false);
            this.player.facing = "down";
            this.player.anchor.setTo(0.5, 0.5);
            this.game.physics.arcade.enable(this.player);
            this.player.body.collideWorldBounds = true;

    },
    setUpDog: function(){
        var dogSpawnCoords = {
                x:this.mapObjs[0].x,
                y:this.mapObjs[0].y
            };
                        //FOR TESTING ONLY
            //dogSpawnCoords.x = this.player.x - 40;
            //dogSpawnCoords.y = this.player.y - 40;

            this.dog = this.game.add.sprite(dogSpawnCoords.x, dogSpawnCoords.y, 'dog');
            this.dog.animations.add('toungue', [0, 1, 2, 3, 4,5,6,7,8,9,10,11,12,13,14,15,16,17], 5, true);
            this.dog.animations.play('toungue');
            this.physics.arcade.enableBody(this.dog);
            this.dog.scale.setTo(0.75,0.75);
            this.playerHasDog = false;
            this.dog.anchor.setTo(0.5, 0.5);
    },
    gameOver: function(){
        //callback to finish fadeout before transition
        this.bunyipSpawnSong.fadeOut(500);
        this.bunyipSpawnSong.onFadeComplete.add(function(){
            this.bunyipAttackSong.play();
            this.game.stateTransition.to('Menu', true, false, this.level, true, this.bunyipAttackSong);
      }, this);
    },
};