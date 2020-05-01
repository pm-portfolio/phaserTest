// The following line makes sure your styles are included in the project. Don't remove this.
import '../styles/main.scss';
// Import any additional modules you want to include below \/


// \/ All of your javascript should go here \/

// create a new scene
let gameScene = new Phaser.Scene('Game');

//Load assets
gameScene.preload = function(){
  this.load.image('background', '/src/assets/background.png');
  this.load.image('player', '/src/assets/testPlayer.png');
  this.load.image('enemy', '/src/assets/dragon.png');
}

// called once after preload end 

gameScene.create = function() {

  // create background sprite
  let bg = this.add.sprite(0,0, 'background');

  // change the origin  to the top-left corner
  // bg.setOrigin(0,0) // position the background at the center

  // get acces to the game configurations 
  let gameW = this.sys.game.config.width; // 640
  let gameH = this.sys.game.config.height; // 360

  bg.setPosition(gameW/2, gameH/2) // position the background in the center of the screen

  //  create a player
  this.player = this.add.sprite(20, 180, 'player');

  // reducing the player sprite 
  this.player.scale = .1;

  // create enemy
  this.enemy = this.add.sprite(500, 180, 'enemy');

  // flip enemy
  this.enemy.flipX = true;


  // create second enemy
  this.enemy1 = this.add.sprite(400, 180, 'enemy');
  this.enemy1.flipX = true;
  this.enemy1.setScale(.5);
  this.enemy1.setAngle(45);
};

// this is called up to 60 times per second
gameScene.update = function() {
  // this.enemy1.x += 1;
  // this.enemy1.angle += 1;
  // if(this.enemy.scale <= 2) {
  //   this.enemy.scale += 0.01;
  // } 

  // check for active input
    if(this.input.activePointer.isDown) {
      this.player.x +=1;
    }


};
// set the configuration
let config = {
 type: Phaser.AUTO,
 width: 640,
 height: 360,
 scene: gameScene
};
// create a new game, pass the configuration
let game = new Phaser.Game(config);

