const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -10,
    velocity: 0,
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function setup() {
    document.addEventListener('keydown', jump);
    canvas.addEventListener('touchstart', jump);
    setInterval(addPipe, 1500);
    resizeCanvas();
    requestAnimationFrame(gameLoop);
}

function jump() {
    if (!gameOver) {
        bird.velocity += bird.lift;
    } else {
        resetGame();
    }
}

function addPipe() {
    const pipeHeight = Math.random() * (canvas.height - 100) + 20;
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: canvas.height - pipeHeight - 100,
        scored: false,
    });
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    frame = 0;
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height || bird.y < 0) {
        gameOver = true;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        if (pipes[i].x + 50 < bird.x && !pipes[i].scored) {
            score++;
            pipes[i].scored = true;
        }

        if (
            bird.x < pipes[i].x + 50 &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].top || bird.y + bird.height > canvas.height - pipes[i].bottom)
        ) {
            gameOver = true;
        }

        if (pipes[i].x + 50 < 0) {
            pipes.splice(i, 1);
        }
    }
}

function draw() {
    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 50, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 50, pipe.bottom);
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Draw game over message
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
        ctx.fillText('Tap to restart', canvas.width / 8, canvas.height / 2 + 30);
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
setup();
