var SKEY = 83;
var BKEY = 66;
var UPARROW = 38;
var DOWNARROW = 40;
var LEFTARROW = 37;
var RIGHTARROW = 39;
var sizeBodyPart = 10;

var snake;
var board;
var interval;
var food;
var score = 0;

$(document).ready(
	function(){
		$('body').keydown(keyPressedHandler);
	});

function keyPressedHandler(e){

	var key = e.keyCode;
	switch (key){
		case SKEY:
			startGame();
			break;
		case BKEY:
			stopGame();
			break;
		case UPARROW:
			var bodyParts = snake.getBodyParts();
			if (bodyParts[0].direction == "bottom"){
				snake.inverseDirection();
			}
			bodyParts[0].direction = "top";
			break;
		case DOWNARROW:
			var bodyParts = snake.getBodyParts();
			if (bodyParts[0].direction == "top"){
				snake.inverseDirection();
			}
			bodyParts[0].direction = "bottom";
			break;
		case LEFTARROW:
			var bodyParts = snake.getBodyParts();
			if (bodyParts[0].direction == "right"){
				snake.inverseDirection();
			}
			bodyParts[0].direction = "left";
			break;
		case RIGHTARROW:
			var bodyParts = snake.getBodyParts();
			if (bodyParts[0].direction == "left"){
				snake.inverseDirection();
			}
			bodyParts[0].direction = "right";
			break;
	}
}

function startGame(){
	score = 0;
	$('#pts').text(score);
	removeSnake();
	removeFood();
	clearInterval(interval);
	$('#gameover').css('visibility','hidden');
	board = new Board();
	snake = new Snake(0, 0);
	drawSnake();
	board.generateFood();
	interval = setInterval(move, 200);
}

function stopGame(){
	removeSnake();
	removeFood();
	clearInterval(interval);
	$('#gameover').css('visibility','visible');
}

function move(){
	removeSnake();
	var bodyParts = snake.getBodyParts();

	for (var i = bodyParts.length-1 ; i > 0 ; i--){
		bodyParts[i].xPos = bodyParts[i-1].xPos;
		bodyParts[i].yPos = bodyParts[i-1].yPos;
	}
	
	if (bodyParts[0].direction == "right"){
		bodyParts[0].xPos += sizeBodyPart;
	}
	else if (bodyParts[0].direction == "left"){
		bodyParts[0].xPos -= sizeBodyPart;
	}
	else if (bodyParts[0].direction == "top"){
		bodyParts[0].yPos -= sizeBodyPart;
	}
	else if (bodyParts[0].direction == "bottom"){
		bodyParts[0].yPos += sizeBodyPart;
	}
	
	if (!board.crashHandler()){
		drawSnake();
	}
	board.foodHandler();

}

function drawSnake(){
	var bodyParts = snake.getBodyParts();

	for (var i = 0 ; i < bodyParts.length ; i++){
		board.drawBody(bodyParts[i].xPos, bodyParts[i].yPos);
	}
}

function removeSnake(){
	$('.bodypart').remove();
}

function removeFood(){
	$('.food').remove();
}

function Board(){

	this.drawBody = function (xpos, ypos) {
		var $element = $('<div/>').addClass("bodypart");
		$element.css('top',ypos+'px').css('left',xpos+'px');
		$('#board').append($element);
	};

	this.crashHandler = function(){
		if (snake.getHead().xPos >= 500 || snake.getHead().yPos >= 500 || snake.getHead().xPos < 0 || snake.getHead().yPos < 0){
			stopGame();
			$('#gameover').css('visibility', 'visible');
			return true;
		}
		var bodyParts = snake.getBodyParts();
		var head = snake.getHead();
		if (bodyParts.length >= 4){
			for (var i = 4 ; i < bodyParts.length ; i++){
				if (head.xPos == bodyParts[i].xPos && head.yPos == bodyParts[i].yPos){
					stopGame();
					$('#gameover').css('visibility', 'visible');
					return true;
				}
			}
		}
		
		return false;
	}

	this.generateFood = function(){
		var $element = $('<div/>').addClass("food");
		var randomTop = 10*Math.floor(Math.random()*49);
		var randomLeft = 10*Math.floor(Math.random()*49);
		food = new Food(randomLeft, randomTop);
		$element.css('top', randomTop +'px').css('left', randomLeft+'px');
		$('#board').append($element); 
	}

	this.foodHandler = function(){
		if (snake.getHead().xPos == food.xPos && snake.getHead().yPos == food.yPos){
			score += 1;
			removeFood();
			this.generateFood();
			$('#pts').text(score);
			snake.addTail();
		}
	}
}

function Food(xpos, ypos){
	this.xPos=xpos;
	this.yPos=ypos;
}

function BodyPart(xpos,ypos,direction) {
	this.xPos=xpos;
	this.yPos=ypos;
	this.direction=direction;;
};

function Snake(xpos, ypos){
	var bodyParts = [new BodyPart(xpos, ypos, "right")];

	this.getBodyParts = function(){
		return bodyParts;
	}

	this.getHead = function(){
		return bodyParts[0];
	}

	this.getTail = function(){
		return bodyParts[bodyParts.length-1];
	}

	this.addTail = function(){
		var tail = this.getTail();
		if (tail.direction == 'top'){
			bodyParts.push(new BodyPart(tail.xPos, tail.yPos += sizeBodyPart, tail.direction));
			board.drawBody(tail.xPos, tail.yPos -= sizeBodyPart);
		}
		else if (tail.direction == 'bottom'){
			bodyParts.push(new BodyPart(tail.xPos, tail.yPos -= sizeBodyPart, tail.direction));
			board.drawBody(tail.xPos, tail.yPos += sizeBodyPart);
		}
		else if (tail.direction == 'right'){
			bodyParts.push(new BodyPart(tail.xPos += sizeBodyPart, tail.yPos, tail.direction));
			board.drawBody(tail.xPos -= sizeBodyPart, tail.yPos);
		} 
		else if (tail.direction == 'left'){
			bodyParts.push(new BodyPart(tail.xPos -= sizeBodyPart, tail.yPos, tail.direction));
			board.drawBody(tail.xPos += sizeBodyPart, tail.yPos);
		}
	}

	this.inverseDirection = function(){
		var bodyParts = this.getBodyParts();
		for (var i = 0 ; i < Math.floor(bodyParts.length/2) ; i++){
			var temp = bodyParts[i];
			bodyParts[i] = bodyParts[bodyParts.length-(i+1)];
			bodyParts[bodyParts.length-(i+1)] = temp;
		}
	}
}