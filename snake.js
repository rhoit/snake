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


function cleanCell(pos) {
    ctx.clearRect(pos.x*cell+pad, pos.y*cell+pad, cell-pad, cell-pad)
}


function drawCell(pos, fill='#abffab', alpha=0.6) {
    ctx.fillStyle   = fill
    ctx.globalAlpha = alpha
    ctx.fillRect(pos.x*cell+pad, pos.y*cell+pad, cell-pad, cell-pad)
}


function collision(pos0, pos1) {
    return pos0.x == pos1.x && pos0.y == pos1.y
}


function bound(val, lower, upper) {
    if (lower <= val && upper >= val) return true
    drawCell(snake, "yellow") // show collision
    die("wall")
    return false
}


function die(msg) {
    console.log("dead: (%d, %d)", snake.x, snake.y, msg)
    clearInterval(interval)
    interval = null
    dead     = snake

    delete snake
    snake = null
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

        // don't place food on the snake
        for (var i = 1; i < snake.tail.length; i++) {
            if (!collision(snake.tail[i], this)) continue
            console.log("food collide: (%d, %d)", this.x, this.y)
            this.generate()
            break
        }
    }

    this.draw = function() {
        drawCell(this, '#ff0044', 1)
    }
}


function Snake(len, dx=1, dy=0) {
    // in standard game snake start at center
    this.x = cols/2
    this.y = rows/2

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

    this.eat = function(pos) {
        if (!collision(this, pos)) return false
        this.tail.push({ x: this.x, y:this.y })
        return true
    }

    this.update = function () {
        x = this.x + this.dx
        y = this.y + this.dy

        if (bound(x, 0, cols)) this.x = x; else return
        if (bound(y, 0, rows)) this.y = y; else return

        for (var i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i+1]
            if (this.eat(this.tail[i])) {
                if (i == 0) this.tail[0] = this.tail[2]
                this.draw() // show collision
                die("tail bite")
                return
            }
        }
        this.tail[i] = { x: this.x, y: this.y }
    }

    this.draw = function() {
        cleanCell(this.tail[0])
        drawCell(this)
    }

    for (var i = 0; i <= len; i++) {
        this.tail.push({ x: this.x, y: this.y })
    }
}


function userControl(dx, dy) {
    if (interval === null)
        interval = setInterval(gameLoop, delay)
    snake.dir(dx, dy)
}


function pause() {
    if (interval === null) {
        interval = setInterval(gameLoop, delay)
    } else {
        clearInterval(interval)
        interval = null
    }
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
        case 80: pause(); break
    }
}


function gameLoop() {
    snake.update()
    moves++
    try { // if snake dies don't make errors
        view_len.innerHTML   = snake.tail.length - 1
        view_moves.innerHTML = moves
        snake.draw()
        if (snake.eat(food)) {
            food.generate()
            food.draw()
        }
    }
    catch(err) {}
}


function newGame(length=3) {
    ctx.clearRect(0, 0, width, height)
    moves = 0
    snake = new Snake(length)
    food.generate()
    food.draw()
    interval = setInterval(gameLoop, delay)
}
