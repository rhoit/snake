var aiActive = false
var aiSearch = new PF.AStarFinder()
var grid     = null

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


function aiOff() {
    aiActive = false
    toggle_ai.checked = aiActive
}


function aiToggle() {
    if (snake === null) {
        newGame()
    }
    clearInterval(interval)
    interval = null
    aiActive = !aiActive
    toggle_ai.checked = aiActive
    if (aiActive) aiLoop()
}


function makeGrid() {
    grid = new PF.Grid(rows+1, cols+1)
    for (var i = 1; i < snake.tail.length - 1; i++) {
        grid.setWalkableAt(snake.tail[i].x, snake.tail[i].y, false)
    }
}


function aiLoop() {
    makeGrid()
    var path = aiSearch.findPath(snake.x, snake.y, food.x, food.y, grid)
    if (path.length == 0) {
        console.log(path)
        return
    }
    var dir  = path2direction(path)

    function anotherLoop() {
        if (dir.length === 0) {
            console.log("new food: (%d, %d)", food.x, food.y)
            return aiLoop()
        }
        if (snake === null) return aiOff()
        if (interval != null) return aiOff()
        if (!aiActive) return aiOff()
        aiControl[dir[0]]()
        gameLoop()
        dir = dir.slice(1, dir.length);
        setTimeout(anotherLoop, delay)
    }
    anotherLoop();
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
    return dir
}
