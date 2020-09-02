var PLAY = 1;
var END = 0;
var gameState = PLAY;
var index=0;
var dog, dog_running, dog_collided;
var invisibleGround
var birdGroup, birdImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart;
var SoundClassifier
localStorage["HighestScore"] = 0;

var bg,bg_img
function preload()
{
		const options = { probabilityThreshold: 0.95};
		SoundClassifier= ml5.soundClassifier('SpeechCommands18w', options);
		
		bg_img=loadImage("2371.jpg")
		dog_air= loadImage("running.png");
		dog_running =   loadImage("dogDown.png");
		dog_collided = loadAnimation("Happy.png");

		bird1 = loadImage("bird4.png");
		bird2 = loadImage("bird1.png");
		bird3 = loadImage("bird3.png");
		
		obstacle1 = loadImage("car1.png");
		obstacle2 = loadImage("obstacle2.png");
		obstacle3 = loadImage("obstacle3.png");
		obstacle4 = loadImage("obstacle4.png");
		obstacle5 = loadImage("obstacle5.png");
		obstacle6 = loadImage("obstacle6.png");

		gameOverImg = loadImage("gameOver.png");
		restartImg = loadImage("restart.jpg");
  
  
}

function setup() {
		SoundClassifier.classify(gotWord);

		createCanvas(displayWidth-20,displayHeight-200);
	
		dog= createSprite(50,580,20,50);
		dog.addImage(dog_running);
		dog.scale = 0.1
		dog.shapeColor="red";
		
		gameOver = createSprite(700,50);
		gameOver.addImage(gameOverImg);
		restart = createSprite(550,160);
		restart.addImage(restartImg);
		restart.scale=0.01
		
		gameOver.scale = 0.5;
		gameOver.visible = false;
		restart.visible = false;
		
		invisibleGround = createSprite(200,660,1800,10);
		invisibleGround.visible = false;
		
		birdGroup = new Group();
		obstaclesGroup = new Group();
		
		score = 0;
}


function draw() {
		rectMode(CENTER);
		background(bg_img);
		
		textSize(25);
		textFont("Georgia");
		textStyle(BOLD);
		text("Score: "+ score, 200,50);
		if(dog.y<=480)
		{
			dog.velocityY=0
		}
		if(dog.y>=450&&dog.y<570){
			dog.addImage(dog_air)
		}
		if (dog.y>575){
			dog.addImage(dog_running)
		}
		if (gameState===PLAY){
		score = score + Math.round(getFrameRate()/60);
		dog.velocityY = dog.velocityY + 0.5
		
		dog.collide(invisibleGround);
		spawnbird();
		spawnObstacles();
		}
		
		if(obstaclesGroup.isTouching(dog)){
		gameState = END;
			}
		
		else if (gameState === END) {
			gameOver.visible = true;
			restart.visible = true;
			dog.velocityX=0
			dog.velocityY = 0;
			
			obstaclesGroup.setVelocityXEach(0);
			birdGroup.setVelocityXEach(0);
			
			//change the trex animation
			//dog.changeImage("collided",dog_collided)
			obstaclesGroup.setLifetimeEach(-3);
			birdGroup.setLifetimeEach(-3);
		}

			if(birdGroup.isTouching(dog)){
				gameState = END;
			}
		
		else if (gameState === END) {
			gameOver.visible = true;
			restart.visible = true;
			dog.velocityX=0
			dog.velocityY = 0;
			dog.positionX=50
			dog.positionY=550
			obstaclesGroup.setVelocityXEach(0);
			birdGroup.setVelocityXEach(0);
			
			//change the trex animation
			dog.changeImage(dog_collided)
			obstaclesGroup.setLifetimeEach(-3);
			birdGroup.setLifetimeEach(-3);
			
		}
			if(mousePressedOver(restart)) {
				reset();
				}
			drawSprites();
		
}
function spawnbird() {
	if(frameCount % 100 === 0) {
		var bird = createSprite(1900,500,10,40);
		
		bird.velocityX = -(6 + 4*score/100);
		bird.debug = false;
		bird.y = Math.round(random(450,500));
		bird.setCollider("rectangle", 200, 200, 200, 200);
		
		
		var rand = Math.round(random(1,3));
		switch(rand) {
		  case 1: bird.addImage(bird1);
				  break;
		  case 2: bird.addImage(bird2);
				  break;
		  case 3: bird.addImage(bird3);
				  break;
		  default: break;
		}
		
		         
		bird.scale = 0.05;
		bird.getSpeed(100)
		bird.lifetime = 400;
		birdGroup.add(bird);
		
	  }
	
  }
  
  function spawnObstacles() {
	if(frameCount % 80 === 0) {
	  var obstacle = createSprite(1200,620,10,40);
	  
	  obstacle.velocityX = -(6 + 4*score/100);
	  obstacle.debug = false;
	  obstacle.setCollider("rectangle", 200, 200, 200, 200);
	  
	  var rand = Math.round(random(1,6));
	  switch(rand) {
		case 1: obstacle.addImage(obstacle1);
				break;
		case 2: obstacle.addImage(obstacle2);
				break;
		case 3: obstacle.addImage(obstacle3);
				break;
		case 4: obstacle.addImage(obstacle4);
				break;
		case 5: obstacle.addImage(obstacle5);
				break;
		case 6: obstacle.addImage(obstacle6);
				break;
		default: break;
	  }  
	  obstacle.scale = 0.1;
	  obstacle.lifetime = 400;
	  obstaclesGroup.add(obstacle);
	}
  }
  
  function reset(){
	gameState = PLAY;
	gameOver.visible = false;
	restart.visible = false;
	
	obstaclesGroup.destroyEach();
	birdGroup.destroyEach();
	dog.changeAnimation("running",dog_running);
	
	if(localStorage["HighestScore"]<score){
	  localStorage["HighestScore"] = score;
	}
	
	score = 0;
  }
  

  function gotWord(error, results) {
	if (error) {
		console.error(error);
	}
	console.log(results);
	if(results[0].label=='up')
	{
	dog.velocityY=-12
	}
	else if (results[0].label!='up'){
		dog.velocityY=0
	}
  }


