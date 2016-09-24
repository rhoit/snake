var delay = 100
var cell  = 20
var pad   = 2

var ctx    = snake_canvas.getContext('2d')

var width  = snake_canvas.width
var height = snake_canvas.height
var cols   = Math.floor(width/cell)
var rows   = Math.floor(height/cell)

var interval = null
var moves    = 0

var food = new function() {
    this.x = null
    this.y = null

    this.generate = function(x=null, y=null) {

        this.x = x != null?x:Math.floor(Math.random() * cols) * cell
        this.y = y != null?y:Math.floor(Math.random() * rows) * cell

        // don't place food on the snake
        for (var i = 1; i < snake.len; i++) {
            if (
                eucliDist(
                    snake.tail[i][0], this.x,
                    snake.tail[i][1], this.y
                ) > 1
            ) continue
            this.generate()
            break
        }
    }

    this.draw = function() {
        ctx.fillStyle = '#ff0044'
        ctx.globalAlpha = 1
        ctx.fillRect(
            this.x+pad, this.y+pad,
            cell-pad, cell-pad
        )
    }
}


function eucliDist(x0, x1, y0, y1) {
    return Math.sqrt(Math.pow(x0-x1, 2) + Math.pow(y0-y1, 2))
}


function die(msg) {
    console.log("dead:", msg)
    clearInterval(interval)
    interval = null
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


function bound(val, lower, upper) {
    if (lower > val || upper < val) die("wall")
    return val
}


function Snake(len, dirx, diry) {
    this.x = 0
    this.y = cell

    this.len  = len
    this.tail = [] // first var is after image

    this.dirx = dirx
    this.diry = diry
    this.dir = function(x, y) {
        if (this.dirx == -x || this.diry == -y) return
        this.dirx = x
        this.diry = y
    }

    this.update = function () {
        x = this.x + this.dirx * cell
        y = this.y + this.diry * cell

        this.x = bound(x, 0, width - cell)
        this.y = bound(y, 0, height - cell)

        for (var i = 0; i < this.len; i++) {
            this.tail[i] = this.tail[i+1]
        }
        this.tail[this.len] = [ this.x, this.y ]
    }

    this.eat = function(x, y) {
        if (eucliDist(this.x, x, this.y, y) > 1) return false
        this.len++
        this.tail[this.len] = [this.x, this.y]
        return true
    }

    this.cannibal = function() {
        for (var i = 1; i < this.len; i++) {
            if (this.eat(this.tail[i][0], this.tail[i][1])) {
                die("cannibal")
                break
            }
        }
    }

    this.draw = function() {
        try {
            ctx.clearRect(
                this.tail[0][0]+pad, this.tail[0][1]+pad,
                cell-pad, cell-pad
            )
        }
        catch(err) {
            console.log(this.tail)
            die('program crash')
        }
        ctx.fillStyle   = '#abffab'
        ctx.globalAlpha = 0.6
        ctx.lineWidth   = 1
        ctx.fillRect(
            this.x+pad, this.y+pad,
            cell-pad, cell-pad
        )
    }

    for (var i = 0; i <= len; i++) {
        this.tail[i] = [ this.x, this.y ]
    }
    this.update()
}


function keyBinding(event) {
    if (interval === null) {
        newGame()
        return
    }

    switch (event.keyCode) {
        case 37: snake.dir(-1, 0); break //LEFT
        case 38: snake.dir(0, -1); break //UP
        case 39: snake.dir(+1, 0); break //RIGHT
        case 40: snake.dir(0, +1); break //DOWN
    }
}


function gameLoop() {
    snake.cannibal()
    if (snake.eat(food.x, food.y)) {
        food.generate()
        food.draw()
    }
    snake.draw()
    snake.update()
    moves++
    view_len.innerHTML = snake.len
    view_moves.innerHTML = moves
}


function newGame() {
    ctx.clearRect(0, 0, width, height)
    moves = 0
    snake = new Snake(3, 1, 0)
    food.generate()
    food.draw()
    interval = setInterval(gameLoop, delay)
}
