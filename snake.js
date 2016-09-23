var ctx    = snake_canvas.getContext('2d')
var width  = snake_canvas.width
var height = snake_canvas.height

var cell = 20
var cols = Math.floor(width/cell)
var rows = Math.floor(height/cell)

var space = 2
var food  = []


function bound(val, lower, upper) {
    if (lower > val || upper < val) {
        console.log("dead:", val)
        clearInterval(interval)
        interval = null
        snake = null
    }
    return val
}


function generateFood() {
    ctx.fillStyle = '#ff0044'
    ctx.globalAlpha = 1
    x = Math.floor(Math.random() * cols) * cell
    y = Math.floor(Math.random() * rows) * cell
    ctx.fillRect(x+space, y+space, cell-space, cell-space);
    food = [x, y]
}


function Snake(x, y, len, speedx, speedy) {
    this.x = x
    this.y = y
    this.len = len

    this.tail = 0
    this.body = [ [x, y] ]
    this.tail_image = [x, y]

    this.speedx = speedx
    this.speedy = speedy

    this.speed = function(x, y) {
        this.speedx = x
        this.speedy = y
    }

    this.eat = function(x, y) {
        var d = Math.sqrt(
            Math.pow(this.x - x, 2) +
            Math.pow(this.y - y, 2)
        )
        if (d > 1) return false
        this.len++
        return true
    }

    this.update = function () {
        this.show()
        this.tail_image = [this.x, this.y]
        x = this.x + this.speedx * cell
        y = this.y + this.speedy * cell

        this.x = bound(x, 0, width - cell)
        this.y = bound(y, 0, height - cell)

        this.body[this.tail] = [ this.x, this.y ]
        this.tail++
        if (this.tail > this.len)
            this.tail = 0
    }


    this.show = function() {
        ctx.fillStyle   = '#abffab'
        ctx.globalAlpha = 0.6
        ctx.lineWidth   = 1
        ctx.fillRect(
            this.x+space, this.y+space,
            cell-space, cell-space
        )

        if (this.body.length != this.len) return
        ctx.clearRect(
            this.tail_image[0]+space, this.tail_image[1]+space,
            cell-space, cell-space
        )
    }
}


function keyBinding(event) {
    if (interval === null) {
        ctx.clearRect(0, 0, width, height)
        newGame()
        return
    }

    switch (event.keyCode) {
        case 37: snake.speed(-1, 0); break //LEFT
        case 38: snake.speed(0, -1); break //UP
        case 39: snake.speed(+1, 0); break //RIGHT
        case 40: snake.speed(0, +1); break //DOWN
        // default:
    }
}


function gameLoop() {
    if (snake.eat(food[0], food[1])) generateFood()
    snake.update()
}


function newGame() {
    generateFood()
    snake = new Snake(2*cell, 2*cell, 1, 1, 0)
    interval = setInterval(gameLoop, 100)
}

window.addEventListener('keydown', keyBinding)
