

// constants
var COLS=26, ROWS=26;
var MIN_OFFSET = 7;
var SCALE = 20;
var SPEED = 5;


var current_snake;

var reset_food;

var EMPTY=0, SNAKE_P = 1, SNAKE_G =2, SNAKE_C = 3, SNAKE_R = 4;

var NUM_FRUIT=6;

var TYPES_OF_WASTE = 4;

var BANANA = 10 , APPLE = 11, BONE = 12, 
	HAMBURGER = 14, TEA_BAG = 15,
	WATERMELON = 16;
var compost_items = [BANANA, APPLE, BONE, 
					HAMBURGER, TEA_BAG,
					WATERMELON];
var GARBAGE_BAG = 17;
var garbage_items = [GARBAGE_BAG];

var PAPER = 18;
var paper_items = [PAPER];

var hit_food;


var BOTTLE = 19, COLA = 20, CUP = 21, LIGHTBULB = 22;		
var recycle_items = [BOTTLE, COLA, CUP, LIGHTBULB];

var all_items = [];

var paper_images = [], garbage_images = [], recycle_images = [], compost_images = [], snake_images = [];

var LEFT=0, UP=1, RIGHT=2, DOWN=3;

var SPRITE_WIDTH = 31, SPRITE_HEIGHT = 28;

//keycodes
var KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN = 40, KEY_SPACE=32, KEY_C=67, KEY_R=82, KEY_P=80, KEY_G=71;


var canvas, ctx, keystate, frames, score, is_game_over = false, eaten = false;



var grid = {
	width: null,
	height: null,
	_grid: null,

	init: function(d, c, r){
		this.width = c;
		this.height = r;
		this._grid = [];

		for (var x=0; x < c; x++){
			this._grid.push([]);
			for (var y=0; y < r; y++){
				this._grid[x].push(d);
			}
		}
	},
	set: function(val, x, y){
		this._grid[x][y] = val;
	},
	get: function(x, y){
		return this._grid[x][y];
	}
};

var snake = {
	direction: null,
	last: null,
	_queue: null,

	init: function(d, x, y){
		this.direction = d;

		this._queue = [];
		this.insert(x, y);
	},
	insert: function(x, y){
		this._queue.unshift({x: x, y:y});
		this.last = this._queue[0];
	},
	remove: function(){
		return this._queue.pop();
	}
}

function populate_all_items_array(){
	for (var i=0; i < compost_items.length; i++)
		all_items.push(compost_items[i]);

	for (i=0; i < garbage_items.length; i++)
		all_items.push(garbage_items[i]);

	for (i=0; i < recycle_items.length; i++)
		all_items.push(recycle_items[i]);

	for (i=0; i < paper_items.length; i++)
		all_items.push(paper_items[i]);

}
function setFood(){
	var cells = [];
	for (var x=0; x < grid.width; x++){
		for (var y=0; y < grid.height; y++){
			if (grid.get(x,y) === EMPTY) {
				cells.push({x:x, y:y})
			}
		}
	}
	var random_index;
	var randpos;

	for (var n = 0; n < NUM_FRUIT; n++) {
		random_index = Math.floor(Math.random()*cells.length);
		randpos = cells[random_index];
		if (n < TYPES_OF_WASTE){
			switch(n){
				case 0:
					var random_num = Math.floor(Math.random()*paper_items.length);
					grid.set(paper_items[random_num], randpos.x, randpos.y);
					break;
				case 1:
					var random_num = Math.floor(Math.random()*recycle_items.length);
					grid.set(recycle_items[random_num], randpos.x, randpos.y);
					break;
				case 2:
					var random_num = Math.floor(Math.random()*garbage_items.length);
					grid.set(garbage_items[random_num], randpos.x, randpos.y);
					break;
				case 3:
					var random_num = Math.floor(Math.random()*compost_items.length);
					grid.set(compost_items[random_num], randpos.x, randpos.y);
					break;
			}
		}
		else{
			rand_ix = Math.floor(Math.random()*(all_items.length - 1));
			grid.set(all_items[rand_ix], randpos.x, randpos.y);
		}
	}


	

}

function load_images(){
	// --------------COMPOST
	banana_image = new Image();
	banana_image.src = "images/compost/banana.png";
	compost_images.push(banana_image);

	apple_image = new Image();
	apple_image.src = "images/compost/apple.png";
	compost_images.push(apple_image);

	hamburger_image = new Image();
	hamburger_image.src = "images/compost/hamburger.png";
	compost_images.push(hamburger_image);

	bone_image = new Image();
	bone_image.src = "images/compost/bone.png";
	compost_images.push(bone_image);

	teabag_image = new Image();
	teabag_image.src = "images/compost/tea-bag.jpg";
	compost_images.push(teabag_image);

	watermelon_image = new Image();
	watermelon_image.src = "images/compost/watermelon.png";
	compost_images.push(watermelon_image);




	// --------------GARBAGE
	garbage_bag_image = new Image();
	garbage_bag_image.src = "images/garbage/garbage_bag.png";
	garbage_images.push(garbage_bag_image);

	// --------------RECYCLE
	bottle_image = new Image();
	bottle_image.src = "images/recycle/bottle.png";
	recycle_images.push(bottle_image);

	cola_image = new Image();
	cola_image.src = "images/recycle/cola.png";
	recycle_images.push(cola_image);

	redcup_image = new Image();
	redcup_image.src = "images/recycle/cup.png";
	recycle_images.push(redcup_image);

	lightbulb_image = new Image();
	lightbulb_image.src = "images/recycle/lightbulb.png";
	recycle_images.push(lightbulb_image);



	// --------------PAPER

	paper_image = new Image();
	paper_image.src = "images/paper/paper.png";
	paper_images.push(paper_image);



	// --------------- SNAKES
	garbage_snake_image = new Image();
	garbage_snake_image.src = "images/snakes/garbage_sheet.png";

	recycle_snake_image = new Image();
	recycle_snake_image.src = "images/snakes/recycle_sheet.png";

	paper_snake_image = new Image();
	paper_snake_image.src = "images/snakes/paper_sheet.png";

	compost_snake_image = new Image();
	compost_snake_image.src = "images/snakes/compost_sheet.png";


}


function main(snake_number){
	hide = document.getElementById("snakeSelection");
	hide.style.visibility = 'hidden';

	show = document.getElementById("item");
	show.style.visibility = 'visible';
	canvas = document.createElement("canvas");
	canvas.id = "gameBoard";
	canvas.width = COLS*SCALE;
	canvas.height = ROWS*SCALE;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	current_snake = snake_number;
	populate_all_items_array();
	start_game();

	
}

function start_game(){
	load_images();
	ctx.font = "13px Times";
	frames = 0;
	keystate = {};
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];

	});


	init();
	loop();
}
function out_of_bounds(sp) {
	return (sp.x <= MIN_OFFSET || sp.x >= COLS - MIN_OFFSET 
			|| sp.y <= MIN_OFFSET || sp.y >= ROWS - MIN_OFFSET);
}
function init(){
	grid.init(EMPTY, COLS, ROWS);

	score = 0;
	var sp = {dir: Math.floor(Math.random()*4),
				x: Math.floor(Math.random()*COLS), 
				y: Math.floor(Math.random()*ROWS)};

	if (out_of_bounds(sp)) {
		sp.x = sp.y = 10;
	}

	snake.init(sp.dir, sp.x, sp.y);

	switch(current_snake){
		case SNAKE_P:
			grid.set(SNAKE_P, sp.x, sp.y);
			break;
		case SNAKE_G:
			grid.set(SNAKE_G, sp.x, sp.y);
			break;
		case SNAKE_C:
			grid.set(SNAKE_C, sp.x, sp.y);
			break;
		case SNAKE_R:
			grid.set(SNAKE_R, sp.x, sp.y);
			break;
	}
	setFood();
}

function loop(){
	update();
	draw();

	window.requestAnimationFrame(loop, canvas);
}
function update(){
	frames++;

	if (keystate[KEY_LEFT] && snake.direction!== RIGHT) snake.direction = LEFT;
	else if (keystate[KEY_UP] && snake.direction!==  DOWN) snake.direction = UP;
	else if (keystate[KEY_DOWN] && snake.direction!== UP ) snake.direction = DOWN;
	else if (keystate[KEY_RIGHT] && snake.direction!== LEFT) snake.direction = RIGHT;
	
	if (keystate[KEY_SPACE]) is_game_over = false;
	
	else if (keystate[KEY_R]) {
		is_game_over = false;
		current_snake = 4;
	}
	else if (keystate[KEY_C]) {
		is_game_over = false;
		current_snake = 3;
	}
	else if (keystate[KEY_P]) {
		is_game_over = false;
		current_snake = 1;
	}
	else if (keystate[KEY_G]) {
		is_game_over = false;
		current_snake = 2;
	}

	if(score === 5) SPEED = 4;
	if(score === 10) SPEED = 3;
	if(score === 15) SPEED = 2;
	if(score === 20) SPEED = 1;


	if (frames%SPEED ===0) {
		var nx = snake.last.x;
		var ny = snake.last.y;

		switch (snake.direction){
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}

		if (0 > nx || nx > grid.width -  1 ||
			0 > ny || ny > grid.height - 1 || 
			grid.get(nx, ny) === current_snake) {
				is_game_over = true;
				return init();
		}
		if (equals_to_food(nx, ny)) {
		// console.log("before equals to food");
			is_game_over = true;
			switch(current_snake){
				case SNAKE_P:
					for (var i=0; i<paper_items.length; i++){
						if (grid.get(nx, ny) === paper_items[i]){
							is_game_over = false;
							break;
						}
					}
					break;
				case SNAKE_R:
					for (var i=0; i<recycle_items.length; i++){
						if (grid.get(nx, ny) === recycle_items[i]){
							is_game_over = false;
							break;
						}
					}
					break;
				case SNAKE_G:
					for (var i=0; i<garbage_items.length; i++){
						if (grid.get(nx, ny) === garbage_items[i]){

							is_game_over = false;
							break;
						}
					}
					break;
				case SNAKE_C:
					for (var i=0; i<compost_items.length; i++){
						if (grid.get(nx, ny) === compost_items[i]){
							is_game_over = false;
							break;
						}
					}
					break;
			}
			if (is_game_over){
				return init();
			}
			else {
				var tail = {x:nx, y:ny};
				score++;
				reset();
				setFood();
			}
		} else {
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
			eaten = false;
			tail.x = nx;
			tail.y = ny;
		}

		switch(current_snake){
			case SNAKE_P:
				grid.set(SNAKE_P, tail.x, tail.y);
				break;
			case SNAKE_G:
				grid.set(SNAKE_G, tail.x, tail.y);
				break;
			case SNAKE_C:
				grid.set(SNAKE_C, tail.x, tail.y);
				break;
			case SNAKE_R:
				grid.set(SNAKE_R, tail.x, tail.y);
				break;
	}
		snake.insert(tail.x, tail.y);
	}
}

function equals_to_food(x,y){
	for (var i = 0; i < all_items.length; i++){
		if (grid.get(x,y) === all_items[i]){
			console.log(all_items[i]);
			return true;
			
		}

	}
	return false;
}

function reset(){
	for (var x=0; x < grid.width; x++){
		for (var y=0; y < grid.height; y++){
			if (equals_to_food(x,y)) {
				grid.set(EMPTY, x,y);
			}
		}
	}
}
function draw(){
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;
	if (!is_game_over){					// brown

		for (var x=0; x < grid.width; x++){
			for (var y=0; y < grid.height; y++){
				switch(grid.get(x,y)) {
					case EMPTY:
						ctx.fillStyle = "#fff";
						ctx.fillRect(x*tw, y*th, tw, th);
						break;
					case SNAKE_P:
						draw_snake_p(x,y, tw, th);
						break;
					case SNAKE_G:
					// black
						draw_snake_g(x,y, tw, th);
						break;
					case SNAKE_C:
					// green
						draw_snake_c(x,y, tw, th);
						break;
					case SNAKE_R:
					// blue
						draw_snake_r(x,y, tw, th);
						break;
					case BANANA:
						ctx.drawImage(banana_image, x*tw, y*th, tw, th);
						break;
					case APPLE:
						ctx.drawImage(apple_image, x*tw, y*th, tw, th);
						break;
					case HAMBURGER:
						ctx.drawImage(hamburger_image, x*tw, y*th, tw, th);
						break;
					case BONE:
						ctx.drawImage(bone_image, x*tw, y*th, tw, th);
						break;
					case TEA_BAG:
						ctx.drawImage(teabag_image, x*tw, y*th, tw, th);
						break;
					case WATERMELON:
						ctx.drawImage(watermelon_image, x*tw, y*th, tw, th);
						break;

					case BOTTLE:
						ctx.drawImage(bottle_image, x*tw, y*th, tw, th);
						break;
					case COLA:
						ctx.drawImage(cola_image, x*tw, y*th, tw, th);
						break;
					case LIGHTBULB:
						ctx.drawImage(lightbulb_image, x*tw, y*th, tw, th);
						break;
					case PAPER:
						ctx.drawImage(paper_image, x*tw, y*th, tw, th);
						break;
					case CUP:
						ctx.drawImage(redcup_image, x*tw, y*th, tw, th);
						break;
					case GARBAGE_BAG:
						ctx.drawImage(garbage_bag_image, x*tw, y*th, tw, th);
						break;
				}
			}
			ctx.fillStyle = "#000";
			ctx.fillText("SCORE: " + score, 10, canvas.height - 10);
		}
	} else if (is_game_over){
		ctx.font = "normal normal lighter 15px Courier New";
		ctx.fillStyle = "#000";
		var game_over_string = "GAME OVER";
		var repeat = ", press spacebar to try again";
		ctx.fillText(game_over_string + repeat, canvas.width / 2 - game_over_string.length*18, canvas.height /2 );
		SPEED = 5;
	}
}


function draw_snake_r(x, y, tw, th){
	switch(snake.direction){
		case LEFT:
			ctx.drawImage(recycle_snake_image, 2*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case RIGHT:
			ctx.drawImage(recycle_snake_image, 0, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case UP:
			ctx.drawImage(recycle_snake_image, 3*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case DOWN:
			ctx.drawImage(recycle_snake_image, 1*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT,x*tw, y*th, tw, th);
			break;
	}
}
function draw_snake_c(x, y, tw, th){
	switch(snake.direction){
		case LEFT:
			ctx.drawImage(compost_snake_image, 3*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case RIGHT:
			ctx.drawImage(compost_snake_image, 0, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case UP:
			ctx.drawImage(compost_snake_image, 2*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case DOWN:
			ctx.drawImage(compost_snake_image, 1*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT,x*tw, y*th, tw, th);
			break;
	}
}

function draw_snake_g(x, y, tw, th){
	switch(snake.direction){
		case LEFT:
			ctx.drawImage(garbage_snake_image, 2*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case RIGHT:
			ctx.drawImage(garbage_snake_image, 0, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case UP:
			ctx.drawImage(garbage_snake_image, 3*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case DOWN:
			ctx.drawImage(garbage_snake_image, 1*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT,x*tw, y*th, tw, th);
			break;
	}
}
function draw_snake_p(x, y, tw, th){
	switch(snake.direction){
		case LEFT:
			ctx.drawImage(paper_snake_image, 2*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case RIGHT:
			ctx.drawImage(paper_snake_image, 0, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case UP:
			ctx.drawImage(paper_snake_image, 3*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT, x*tw, y*th, tw, th);
			break;
		case DOWN:
			ctx.drawImage(paper_snake_image, 1*SPRITE_WIDTH, 0, SPRITE_WIDTH, SPRITE_HEIGHT,x*tw, y*th, tw, th);
			break;
	}
}
 
