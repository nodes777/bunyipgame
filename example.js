var MyGame = (function() {
    var MyGame = function(width, height) {
        this.game = new Phaser.Game(width, height, Phaser.CANVAS, '', {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        });
         this.settings = {
            tileSize: 32,
            buildingWidth: 256,
            buildingHeight: 512,
            buildingOffsetY: 73,
            buildingSpread: 11,
            playerVelocity: 90
        };
        this.keys = {};
    };
    MyGame.prototype = {
        preload: function() {
            this.game.load.image('building', 'assets/building.png');
             this.game.load.spritesheet('player', 'assets/player.png', 27, 40);
        },
        create: function() { // Set up keyboard controls
            this.keys.left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.keys.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            this.keys.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.keys.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            // Create sprites
            this.createBuildings();
            this.createPlayer();
        },
        update: function() {
            this.updatePlayer();
        },
        render: function() {
            this.game.debug.renderPhysicsBody(this.player.body);
            this.buildings.forEach(function(building) {
                this.game.debug.renderPhysicsBody(building.body);
            }, this);
        },
        createBuildings: function() {
            this.buildings = this.game.add.group();
             for (var y = -this.settings.buildingHeight; y < this.game.world.height; y += this.settings.buildingOffsetY) {
                for (var x = -this.settings.buildingWidth; x < this.game.world.width; x += this.settings.buildingWidth + this.settings.buildingSpread) {
                    var building = this.buildings.create(x, y, 'building');
building.body.setPolygon(-(this.settings.buildingSpread + 64), this.settings.buildingOffsetY, -(this.settings.buildingSpread + 64), 32, -this.settings.buildingSpread, 0, 64, 0, 0, 32, 0, this.settings.buildingOffsetY);
building.body.immovable = true;
                }
            }
        },
        createPlayer: function() {
            this.player = this.game.add.sprite(this.game.world.centerX - 128, this.game.world.height - (this.settings.tileSize * 3), 'player'); 
            this.player.body.setRectangle(15, 8, 6, 32);
        },
        updatePlayer: function() {
            // buildings collision
            this.game.physics.collide(this.player, this.buildings);
            // reset velocity
            this.player.body.velocity.x = 0 ;
            this.player.body.velocity.y = 0;
            // movement
            if (this.keys.left.isDown) {
                this.player.body.velocity.x = -this.settings.playerVelocity;
            } else if (this.keys.right.isDown) {
                this.player.body.velocity.x = this.settings.playerVelocity;
            }
            if (this.keys.up.isDown) {
                this.player.body.velocity.y = -this.settings.playerVelocity;
            } else if (this.keys.down.isDown) {
                this.player.body.velocity.y = this.settings.playerVelocity;
            }
        }
    };
    return MyGame;
}());
 var myGame = new MyGame(512, 448);
 window.addEventListener('load', myGame);