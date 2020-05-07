// The following line makes sure your styles are included in the project. Don't remove this.
import '../styles/main.scss';
// Import any additional modules you want to include below \/
import backgroundPng from '../images/background.png';
import testPlayer from '../images/testPlayer.png';
import enemy from '../images/dragon.png';
import goal from '../images/treasure.png';

// \/ All of your javascript should go here \/

// create a new scene
let gameScene = new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function () {
  // player speed
  this.playerSpeed = 2.5;

  // enemy speed
  this.enemyMinSpeed = 1;
  this.enemyMaxSpeed = 4;

  // boundaries
  this.enemyMinY = 80;
  this.enemyMaxY = 280;

  // we are not terminating 
  this.isTerminating = false;
}

//Load assets
gameScene.preload = function () {
  this.load.image('background', backgroundPng);
  this.load.image('player', testPlayer);
  this.load.image('enemy', enemy);
  this.load.image('goal', goal);
}

// called once after preload end 

gameScene.create = function () {

  // create background sprite
  let bg = this.add.sprite(0, 0, 'background');
  // change the origin  to the top-left corner
  // bg.setOrigin(0,0) // position the background at the center
  
  // get access to the game configurations 
  let gameW = this.sys.game.config.width; // 640
  let gameH = this.sys.game.config.height; // 360

  bg.setPosition(gameW / 2, gameH / 2) // position the background in the center of the screen

  //  create a player
  this.player = this.add.sprite(20, this.game.config.height / 1.5, 'player');

  // scale down the player sprite 
  this.player.scale = .9;

  // goal 
  this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 1.4, 'goal');
  this.goal.scale = .5; // scale down

  // enemy group
  this.enemies = this.add.group({
    key: 'enemy',
    repeat: 5,
    setXY: {
      x: 100,
      y: 100,
      stepX: 75,
      stepY: 20
    }
  });

  // Setting scale to all group elements
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.9, -0.9)
  // set flipX and speed 
  Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
    // flip enemy
    enemy.flipX = true;
    // set speed 
    let dir = Math.random() < 0.5 ? 1 : -1;
    // get a random number between the max and min enemy speed
    let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
    enemy.speed = dir * speed;
  }, this);
  // get enemy speed
  // change direction randomly

  // create second enemy
  // this.enemy1 = this.add.sprite(400, 180, 'enemy');
  // this.enemy1.flipX = true;
  // this.enemy1.setScale(.5);
  // this.enemy1.setAngle(45);
};

// this is called up to 60 times per second
gameScene.update = function () {

  // don't execute if we are terminating 
  if (this.isTerminating) return;

  // check for active input
  if (this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed;
  }
  // treasure overlapping check 
  let playerRect = this.player.getBounds(); // player borders
  let treasureRect = this.goal.getBounds(); // treasure borders  
  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    console.log("Reach Goal")
    // restart the Scene
    return this.gameOver();
  }
  // get enemies 
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;
  for (let i = 0; i < numEnemies; i++) {

    // enemy movement
    enemies[i].y += enemies[i].speed;

    // check that enemy haven't passed min or max Y
    let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
    let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;
    // If we pass the upper or lower limit reverse;
    if (conditionUp || conditionDown) {
      enemies[i].speed *= -1;

      // check enemy overlap


    }

    let enemyRect = enemies[i].getBounds(); // enemy borders  

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
      console.log("Game Over")

      // restart the Scene
      return this.gameOver();
    }
  }
};

gameScene.gameOver = function () {
  // initiate game over sequence
  this.isTerminating = true;
  // shake camera
  this.cameras.main.shake(500);
  // listen for event completion
  this.cameras.main.on('camerashakecomplete', function (camera, effect) {
    this.cameras.main.fade(500)
  }, this)

  this.cameras.main.on('camerafadeoutcomplete', function () {
    // restart scene
    this.scene.restart();
  }, this)
}
// set the configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);