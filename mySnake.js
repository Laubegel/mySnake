var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

var grid = 16;
var oddApple = {
	x: grid * 4,
	y: grid * 4,
	state: 0,
	ate: false,
	have: false,
};
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
var highScore = 0;
var apple = {
	x: 320,
	y: 320
};
var oddSquare = document.getElementById('square');

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
	if (oddApple.have === true) {
		oddSquare.style.visibility = 'visible';
	} else {
		oddSquare.style.visibility = 'hidden';
	}

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

	// Draw Odd apple
	if (Math.floor(Date.now() / 1000) % 12 === 0 && oddApple.have === false) {
		oddApple.state = 1;
	}
	if (oddApple.state === 1) {
		ctx.fillStyle = '#5588FF';
		ctx.fillRect(oddApple.x, oddApple.y, grid-1, grid-1);
	}

	// Draw snake
	if (oddApple.ate === true) {
		ctx.fillStyle = '#99FF99';
	} else {
	ctx.fillStyle = '#00FD00';
	}
	snake.cells.forEach(function(cell, index) {
		ctx.fillRect(cell.x, cell.y, grid-1, grid-1);

		
		// Snake ate apple
		if (cell.x === apple.x && cell.y === apple.y) {
			snake.maxCells++;
			score++;
			if (score >= highScore) {
				highScore = score;
			}
			apple.x = getRandomInt(0, 25) * grid;
			apple.y = getRandomInt(0, 25) * grid;
		}
		// Snake ate odd apple
		if (cell.x === oddApple.x && cell.y === oddApple.y) {
			oddApple.state = 0;
			oddApple.x = getRandomInt(0, 25) * grid;
			oddApple.y = getRandomInt(0, 25) * grid;
			oddApple.have = true;
		}

		// Check collision with self
		if (oddApple.ate === false) {
			for (var i = index + 1; i < snake.cells.length; i++) {
				if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
					oddApple.have === false;
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
		}
	document.getElementById('score').textContent = 'Apples: ' + score;
	document.getElementById('highscore').textContent = 'High Score: ' + highScore;
	});
	ctx.fillStyle = '#00DD00';
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
	if (e.key === 'x' && oddApple.have === true) {
		oddApple.have = false;
		oddApple.ate = true;
		setTimeout(function() {
			oddApple.ate = false;
		}, 3*1000);
	}
	if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
	e.preventDefault();
	}
});
requestAnimationFrame(loop);
