var aiControl = {
    "left" : function () { snake.dir(-1, 0); },
    "up"   : function () { snake.dir(0, -1); },
    "right": function () { snake.dir(+1, 0); },
    "down" : function () { snake.dir(0, +1); },
}

function eucliDist(x0, x1, y0, y1) {
    return Math.sqrt(Math.pow(x0-x1, 2) + Math.pow(y0-y1, 2))
}


function manhatDist(x0, x1, y0, y1) {
    return Math.abs(x0-x1) + Math.abs(y0-y1)
}


function toggle_ai() {
    // console.log(ai_type.value)
    // if (ai.innerHTML === "ON") ai.innerHTML = "OFF"
    // else {    // ai.innerHTML = "ON"
    if (snake === null) {
        newGame()
    }

    clearInterval(interval)
    interval = null
    aiLoop(new PF.AStarFinder())
}


function aiLoop(algo) {
    var grid = new PF.Grid(rows, cols)
    for (var i = 1; i < snake.tail.length - 1; i++) {
        grid.setWalkableAt(snake.tail[i].x, snake.tail[i].y, false)
    }

    var path = algo.findPath(snake.x, snake.y, food.x, food.y, grid)
    var dir  = path2direction(path)

    function anotherLoop() {
        if (dir.length === 0) {
            console.log("new food: (%d, %d)", food.x, food.y)
            return aiLoop(new PF.AStarFinder())
        }
        if (snake === null) return
        if (interval != null) return
        aiControl[dir[0]]()
        gameLoop()
        dir = dir.slice(1, dir.length);
        setTimeout(anotherLoop, delay)
    }
    anotherLoop();
    // TODO wait till moves are complete and repeat
}


function path2direction(path) {
    var dir = []
    var x0 = path[0][0]
    var y0 = path[0][1]
    var x1 = 0;
    var y1 = 0

    for (var i=1; i < path.length; i++) {
        x1 = path[i][0]; y1 = path[i][1]
        if (x0 == x1) {
            if      (y0 == y1) console.log("idel")
            else if (y0 < y1) dir.push("down")
            else dir.push("up")
        }
        else if (y0 == y1) {
            if (x0 < x1) dir.push("right")
            else dir.push("left")
        }
        console.log("(%d, %d) → (%d, %d): %s", x0, y0, x1, y1, dir[i-1])
        x0 = x1; y0 = y1
    }
    // console.log(dir.length, path.length)
    // dir.push(dir[dir.length-1])
    return dir
}
