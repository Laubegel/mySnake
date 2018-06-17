var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

var ii = 0;
var grid = 16;
var snake = {
	x: 160,
	y: 160,
	dx: grid,
	dy: 0,
	cells: [],
	maxCells: 4
};
var count = 0;
var score = 0;
var apple = {
	x: 320,
	y: 320
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Game loop
function loop() {
	requestAnimationFrame(loop);
	if (score >= 5) {
		if (++count < 2.5) {
			return;
		}
	} else {
		if (++count < 4) {
			return;
		}
	}
	count = 0;
	ctx.clearRect(0, 0, cvs.width, cvs.height);

	snake.x += snake.dx;
	snake.y += snake.dy;

	// Wrap snake's position on edge of screen
	if (snake.x < 0) {
		snake.x = cvs.width - grid;
	}
	else if (snake.x >= cvs.width) {
		snake.x = 0;
	}

	if (snake.y < 0) {
		snake.y = cvs.height - grid;
	}
	else if (snake.y >= cvs.height) {
		snake.y = 0;
	}

	// Head of the snake, track the snake
	snake.cells.unshift({x: snake.x, y: snake.y});
	
	// Removing past cells
	if (snake.cells.length > snake.maxCells) {
		snake.cells.pop();
	}
	
	// Draw apple
	ctx.fillStyle = '#FF0000';
	ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

	// Draw snake
	ctx.fillStyle = '#00FF00';
	snake.cells.forEach(function(cell, index) {
		ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
		
		// Snake ate apple
		if (cell.x === apple.x && cell.y === apple.y) {
			snake.maxCells++;
			score++;
			apple.x = getRandomInt(0, 25) * grid;
			apple.y = getRandomInt(0, 25) * grid;
		}
		// Check collision with self
		for (var i = index + 1; i < snake.cells.length; i++) {
			if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
				snake.x = 160;
				snake.y = 160;
				snake.cells = [];
				snake.maxCells = 4;
				snake.dx = grid;
				snake.dy = 0;
				apple.x = getRandomInt(0, 25) * grid;
				apple.y = getRandomInt(0, 25) * grid;
				score = 0;
			}
		}
	document.getElementById("score").textContent = "Points: " + score;
	});
	ctx.fillStyle = "#00DD00";
	ctx.fillRect(snake.cells[0].x, snake.cells[0].y, grid-1, grid-1);
}

document.addEventListener('keydown', function(e) {
	if (e.key === 'ArrowLeft' && snake.dx === 0) {
		snake.dx =  -grid;
		snake.dy = 0;
	}
	else if (e.key === 'ArrowRight' && snake.dx === 0) {
		snake.dx = grid;
		snake.dy = 0;
	}
	else if (e.key === 'ArrowUp' && snake.dy === 0) {
		snake.dx = 0;
		snake.dy = -grid;
	}
	else if (e.key === 'ArrowDown' && snake.dy === 0) {
		snake.dx = 0;
		snake.dy = grid;
	}
});
requestAnimationFrame(loop);
