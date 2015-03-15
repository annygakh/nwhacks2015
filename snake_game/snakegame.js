// constants
var COLS=26, ROWS=26;
var MIN_OFFSET = 7;
var SCALE = 20;


var current_snake;

var EMPTY=0, SNAKE_P = 1, SNAKE_G =2, SNAKE_C = 3, SNAKE_R = 4;

var NUM_FRUIT=6;

var TYPES_OF_WASTE = 4;

var PAPER=10, GARBAGE=11, RECYCLE=12, COMPOST=13, array_fruit = [PAPER, GARBAGE, RECYCLE, COMPOST];

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
		if (n < array_fruit.length){
			grid.set(array_fruit[n], randpos.x, randpos.y);
		}
		else{
			rand_ix = Math.floor(Math.random()*(TYPES_OF_WASTE-1));
			grid.set(array_fruit[rand_ix], randpos.x, randpos.y);
		}
	}

}
// Game objects
// Sprites


function choose_sprite_to_draw(fruit){
	switch(fruit){
		case PAPER:
			// var i = Math.floor(Math.random*paper_images.length);
			return 0;			
		case GARBAGE:
			// var i = Math.floor(Math.random*garbage_images.length);
			return 0;
		case RECYCLE:
			// var i = Math.floor(Math.random*recycle_images.length);
			return 0;
		case COMPOST:
			// var i = Math.floor(Math.random*compost_images.length);
			return 0;

	}

}

function load_images(){
	// Images
	var banana_leaf_image = new Image();
	banana_leaf_image.src = "images/compost/banana_leaf.png";
	compost_images.push(banana_leaf_image);

	var gum_image = new Image();
	gum_image.src = "images/garbage/gum.png";
	garbage_images.push(gum_image);

	var bottle_image = new Image();
	bottle_image.src = "images/recycle/bottle.png";
	recycle_images.push(bottle_image);

	var newspaper_image = new Image();
	newspaper_image.src = "images/paper/newspaper.png";
	paper_images.push(newspaper_image);

	// Snakes
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

	// document.addEventListener("keypress", function(evt))

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

	if (frames%5 ===0) {
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

		// snakes eat all kinds of fruit for now
		if (equals_to_food(nx, ny)) {
			switch(current_snake){
				case SNAKE_P:
					if (grid.get(nx,ny) !== PAPER){
						is_game_over = true;
						return init();
					}
					break;
				case SNAKE_R:
					if (grid.get(nx,ny) !== RECYCLE){
						is_game_over = true;
						return init();
					}
					break;
				case SNAKE_G:
					if (grid.get(nx,ny) !== GARBAGE){
						is_game_over = true;
						return init();
					}
					break;
				case SNAKE_C:
					if (grid.get(nx,ny) !== COMPOST){
						is_game_over = true;
						return init();
					}
					break;
			}
			var tail = {x:nx, y:ny};
			score++;
			reset();
			setFood();
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
	return (grid.get(x, y) === PAPER || grid.get(x, y) === GARBAGE || grid.get(x, y) === COMPOST || grid.get(x, y) === RECYCLE);
}

function reset(){
	for (var x=0; x < grid.width; x++){
		for (var y=0; y < grid.height; y++){
			if (equals_to_food(x,y)){
				grid.set(EMPTY, x,y);
			}
		}
	}
}
function draw(){
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;
	if (!is_game_over){
		for (var x=0; x < grid.width; x++){
			for (var y=0; y < grid.height; y++){
				switch(grid.get(x,y)) {
					case EMPTY:
						ctx.fillStyle = "#fff";
						ctx.fillRect(x*tw, y*th, tw, th);
						break;
					case SNAKE_P:
					// brown
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
						break;
					case SNAKE_G:
					// black
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
						break;
					case SNAKE_C:
					// green
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
						break;
					case SNAKE_R:
					// blue
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
						break;
					case PAPER:
						var index_of_sprite_to_draw = choose_sprite_to_draw(PAPER);
						var image = paper_images[index_of_sprite_to_draw];
						ctx.drawImage(image, x*tw, y*th, tw, th);
						break;
					case GARBAGE:
						var index_of_sprite_to_draw = choose_sprite_to_draw(GARBAGE);
						var image = garbage_images[index_of_sprite_to_draw];
						ctx.drawImage(image, x*tw, y*th, tw, th);
						break;
					case RECYCLE:
						var index_of_sprite_to_draw = choose_sprite_to_draw(RECYCLE);
						var image = recycle_images[index_of_sprite_to_draw];
						ctx.drawImage(image, x*tw, y*th, tw, th);
						break;
					case COMPOST:
						var index_of_sprite_to_draw = choose_sprite_to_draw(COMPOST);
						var image = compost_images[index_of_sprite_to_draw];
						ctx.drawImage(image, x*tw, y*th, tw, th);
						break;
				}
			}
			ctx.fillStyle = "#000";
			ctx.fillText("SCORE: " + score, 10, canvas.height - 10);
		}
	} else if (is_game_over){
		ctx.font = "20px Times";
		ctx.fillStyle = "#000";
		var game_over_string = "GAME OVER";
		var repeat = ", press spacebar to try again";
		ctx.fillText(game_over_string + repeat, canvas.width / 2 - game_over_string.length*18, canvas.height /2 );
	}
}
