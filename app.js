const controllerSelect = document.getElementById("control-selector")
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const amountToMove = 10
let controlType = "k"

let gameOn = false;

const canvasWidth = 600;
const canvasHeight = 600;

const ballSpeed = 1;
let gameLoop = null;

const ballData = {x: canvasWidth/2, y: canvasHeight/2, radius: 5, velX: 1, velY: 0.5}
const player1Data = { x: 12, y: 12, width: 10, height: 100, keyUp: "ArrowUp", keyDown: "ArrowDown", score: 0, highScore: 0 }

const updateStorage = () => {
    localStorage.setItem("controlType", controlType);
    localStorage.setItem("highScore", player1Data.highScore)
}

const setControlType = (type, set, inverse) => {
    if ((!inverse && type === "k") || (inverse && (type === "m"))) {
        controlType = "m"
        controllerSelect.innerHTML = "Mouse"
        if (set) updateStorage();
    } else {
        controlType = "k"
        controllerSelect.innerHTML = "Keyboard"
        if (set) updateStorage();
    }
}

const readStorage = () => {
    const control = localStorage.getItem("controlType");
    const highScore = localStorage.getItem("highScore");
    setControlType(control, false, true)
    player1Data.highScore = parseInt(highScore) || 0
}

const roundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.stroke();
}

const getRandomNum = (min, max) => {
    return Math.random() * (max - min) + min;
  }

const randomBallSpeed = (maxTotal) => {
    let randNum = getRandomNum(0.5, 1)
    let randX = randNum;
    let randY = maxTotal - randNum;
    let negative = getRandomNum(-1, 1)
    if (negative < 0) randY *= -1
    return [randX, randY]
}

const clearCanvas = () => ctx.clearRect(0, 0, canvasWidth, canvasHeight)

const clamp = (min, max, val) => {
    if (val < min) return min;
    else if (val > max) return max;
    return val;
}

controllerSelect.addEventListener("click", () => {
    setControlType(controlType, true);
})

document.addEventListener("keydown", (key) => {
    const keyPressed = key.key;
    if (controlType === "k") {
        if (keyPressed === player1Data.keyUp) {
            key.preventDefault()
            player1Data.y = clamp(0, canvasHeight - player1Data.height, player1Data.y - amountToMove)
        } else if (keyPressed === player1Data.keyDown) {
            key.preventDefault()
            player1Data.y = clamp(0, canvasHeight - player1Data.height, player1Data.y + amountToMove)
        }
    }

})

canvas.onmousemove = (event) => {
    if (controlType === "m") {
        var rect = event.target.getBoundingClientRect();
        var y = event.clientY - rect.top - (player1Data.height / 2);
        player1Data.y = clamp(0, canvasHeight - player1Data.height, y)
    }
}

readStorage()

const drawText = (text, x, y, fontSize) => {
    ctx.font = `${fontSize}px Montserrat`;
    ctx.textAlign = "center"
    ctx.fillText(text, x, y);
}

const rectIntersect = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}

const checkCollisions = (object1, object2) => {
    if (rectIntersect(object1.x, object1.y, object1.radius, object1.radius, player1Data.x + player1Data.width / 2, player1Data.y, player1Data.width, player1Data.height)) {
        object1.velX *= -1;
        object1.velX += 0.1
        object1.velY += 0.1
        player1Data.score += 1
        if (player1Data.score > player1Data.highScore) {
            player1Data.highScore = player1Data.score
            document.cookie = updateStorage();
        }
    }
}

const physics = () => {
    if (ballData.x + ballData.radius > canvasWidth || ballData.x - ballData.radius < 0) ballData.velX *= -1
    if (ballData.y + ballData.radius > canvasHeight || ballData.y - ballData.radius < 0) ballData.velY *= -1

    if (ballData.x - ballData.radius < 0) {
        clearInterval(gameLoop)
        drawText("Game Over", 300, 300, 48)
        drawText("Click to play again", 300, 340, 15)
        gameOn = false
    }

    checkCollisions(ballData, player1Data);

    ballData.x += ballData.velX
    ballData.y += ballData.velY
}

const drawScore = () => {
    drawText(`Score: ${player1Data.score}`, 60, 30, 15)
    drawText(`High-score: ${player1Data.highScore}`, 150, 30, 15)
    
}

const draw = () => {
    roundedRect(ctx, player1Data.x, player1Data.y, player1Data.width, player1Data.height, 5)
    ctx.beginPath()
    ctx.ellipse(ballData.x, ballData.y, ballData.radius, ballData.radius, Math.PI / 4, 0, 2 * Math.PI)
    ctx.stroke()
    drawScore();
}

canvas.onclick = () => {
    if (!gameOn) {
        gameOn = true
        const randomSpeeds = randomBallSpeed(1.5)
    ballData.x = canvasWidth/2
    ballData.y = canvasHeight/2
    ballData.velX = randomSpeeds[0]
    ballData.velY = randomSpeeds[1]

    player1Data.score = 0

    gameLoop = setInterval(() => {
        clearCanvas()
    
        physics();
        draw();
    }, 1)
    }
    
}

drawText("Click to start playing!", 300, 300, 48)
