var delay = 100
var cell  = 20
var pad   = 2

var ctx    = canvas_snake.getContext('2d')

var width  = canvas_snake.width
var height = canvas_snake.height
var cols   = Math.floor(width/cell) - 1
var rows   = Math.floor(height/cell) - 1

var dead     = null // place dead snake
var snake    = null
var interval = null
var moves    = 0


function drawCell(x, y, fill='#abffab', alpha=0.6) {
    ctx.fillStyle   = fill
    ctx.globalAlpha = alpha
    ctx.fillRect(x*cell+pad, y*cell+pad, cell-pad, cell-pad)
}


function collision(x0, x1, y0, y1) {
    if ( x0 == x1 && y0 == y1) return false
    return true
}


function bound(val, lower, upper) {
    if (lower <= val && upper >= val) return val
    drawCell(snake.x, snake.y, "yellow") // show collision
    die("wall")
}


function die(msg) {
    console.log("dead: (%d, %d)", snake.x, snake.y, msg)
    clearInterval(interval)
    interval = null
    dead     = snake
    snake    = null
    banner("GAME OVER")
}


function banner(msg0, msg1="press any key ...") {
    ctx.globalAlpha = 0.8
    ctx.font = "35px serif"
    ctx.textAlign = "center"
    ctx.fillStyle = 'white'
    ctx.fillText(msg0, width/2, height/2 - 15)
    ctx.font = "25px serif"
    ctx.fillText(msg1, width/2, height/2 + 15)
}


var food = new function() {
    this.x = null
    this.y = null

    this.generate = function(x=null, y=null) {
        this.x = x != null?x:Math.floor(Math.random() * cols)
        this.y = y != null?y:Math.floor(Math.random() * rows)

        // don't erase the tail-end if food is there
        if (
            collision(
                snake.tail[0][0], this.x,
                snake.tail[0][1], this.y
            )
        ) snake.tail[0] = []

        // don't place food on the snake
        for (var i = 1; i < snake.len; i++) {
            if (
                collision(
                    snake.tail[i][0], this.x,
                    snake.tail[i][1], this.y
                )
            ) continue
            this.generate()
            break
        }
    }

    this.draw = function() {
        drawCell(this.x, this.y, '#ff0044', 1)
    }
}


function Snake(len, dx=1, dy=0) {
    this.x = 0
    this.y = 1

    // first var is the after image
    // last  var is the head
    this.tail = []

    this.dx = dx
    this.dy = dy
    this.dir = function(x, y) {
        if (this.dx == -x || this.dy == -y) return
        this.dx = x
        this.dy = y
    }

    this.eat = function(x, y) {
        if (collision(this.x, x, this.y, y)) return false
        this.tail.push([ this.x, this.y ])
        return true
    }

    this.update = function () {
        x = this.x + this.dx
        y = this.y + this.dy

        this.x = bound(x, 0, cols)
        this.y = bound(y, 0, rows)
        for (var i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i+1]
            if (this.eat(this.tail[i][0], this.tail[i][1])) {
                if (i == 0) this.tail[0] = this.tail[2]
                this.draw() // show collision
                die("tail bite")
                return
            }
        }
        this.tail[i] = [ this.x, this.y ]
    }

    this.draw = function() {
        ctx.clearRect(
            this.tail[0][0]*cell+pad, this.tail[0][1]*cell+pad,
            cell-pad, cell-pad
        )
        drawCell(this.x, this.y)
    }

    for (var i = 0; i <= len; i++) {
        this.tail.push([ this.x, this.y ])
    }
}


function userControl(dx, dy) {
    if (interval === null)
        interval = setInterval(gameLoop, delay)
    snake.dir(dx, dy)
}


function keyBinding(event) {
    if (snake === null) {
        newGame()
        return
    }

    switch (event.keyCode) {
        case 37: userControl(-1, 0); break // LEFT
        case 38: userControl(0, -1); break // UP
        case 39: userControl(+1, 0); break // RIGHT
        case 40: userControl(0, +1); break // DOWN
        case 80: // 'p' pause toggle
            if (interval === null) {
                interval = setInterval(gameLoop, delay)
            } else {
                clearInterval(interval)
                interval = null
            }
            break
    }
}


function gameLoop() {
    snake.update()
    moves++
    view_len.innerHTML   = snake.tail.length - 1
    view_moves.innerHTML = moves
    snake.draw()
    if (snake.eat(food.x, food.y)) {
        food.generate()
        food.draw()
    }
}


function newGame() {
    ctx.clearRect(0, 0, width, height)
    moves = 0
    snake = new Snake(3)
    food.generate()
    food.draw()
    interval = setInterval(gameLoop, delay)
}
