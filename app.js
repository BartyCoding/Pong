const controllerSelect = document.getElementById("control-selector")
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const amountToMove = 10
let controlType = "k"

const canvasWidth = 600;
const canvasHeight = 600;

const player1Data = { x: 12, y: 12, width: 10, height: 100, keyUp: "ArrowUp", keyDown: "ArrowDown" }

const setControlType = (type, set) => {
    if (type === "k") {
        controlType = "m"
        controllerSelect.innerHTML = "Mouse"
        if (set) document.cookie = "controlType=m"
    } else {
        controlType = "k"
        controllerSelect.innerHTML = "Keyboard"
        if (set) document.cookie = "controlType=k"
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const readCookie = () => {
    setTimeout(() => {
        setControlType(getCookie("controlType"), false)
    }, 1000)
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

readCookie()

setInterval(() => {
    clearCanvas()

    roundedRect(ctx, player1Data.x, player1Data.y, player1Data.width, player1Data.height, 5)
}, 1)