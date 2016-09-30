var gctx = canvas_grid.getContext('2d')

function isTail(pos) {
    for (var i = 1; i < snake.tail.length; i++) {
        if (!collision(snake.tail[i], pos)) continue
        return true
    }
    return false
}


function cursorGridPos(event) {
    var rect = canvas_grid.getBoundingClientRect();
    mx = event.clientX - rect.left
    my = event.clientY - rect.top
    x  = Math.floor(mx/cell)
    y  = Math.floor(my/cell)
    return { x: x, y: y }
}

function drawGridToggle(element) {
    if (! element.checked) {
        gctx.clearRect(0, 0, width, height)
        return
    }

    gctx.lineWidth   = 1
    gctx.strokeStyle = '#444444'

    for (var i=0; i <= cols + 1; i++) {
        gctx.beginPath();
        gctx.moveTo(i*cell+1, 0);
        gctx.lineTo(i*cell+1, height);
        gctx.stroke();
    }
    for (var i=0; i <= rows + 1; i++) {
        gctx.beginPath();
        gctx.moveTo(0, i*cell+1);
        gctx.lineTo(width, i*cell+1);
        gctx.stroke();
    }

    canvas_grid.addEventListener('mousemove', function(event) {
        pos = cursorGridPos(event)
        canvas_grid.title = 'Grid: (' + pos.x + ', ' + pos.y + ')'
    }, false);

    canvas_grid.addEventListener('mousedown', function(event) {
        pos = cursorGridPos(event)
        console.log(
            "(%d, %d)", pos.x, pos.y,
            "\nisWakable:", grid.isWalkableAt(pos.x, pos.y),
            "\nisTail:", isTail(pos),
            "\nisFood:", collision(food, pos),
            "\nisHead:", collision(snake, pos)
        )
    }, false);

}


function delayChange(element) {
    delay = element.value
    if (interval != null) {
        clearInterval(interval)
        interval = setInterval(gameLoop, delay)
    }
}
