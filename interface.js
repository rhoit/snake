var gctx  = canvas_grid.getContext('2d')

function drawGridToggle(element) {
    if (! element.checked) {
        gctx.clearRect(0, 0, width, height)
        return
    }

    gctx.lineWidth   = 1
    gctx.strokeStyle = '#444444'

    for ( var i=0; i <= cols + 1; i++) {
        gctx.beginPath();
        gctx.moveTo(i*cell+1, 0);
        gctx.lineTo(i*cell+1, height);
        gctx.stroke();
    }
    for ( var i=0; i <= rows + 1; i++) {
        gctx.beginPath();
        gctx.moveTo(0, i*cell+1);
        gctx.lineTo(width, i*cell+1);
        gctx.stroke();
    }
}

function delayChange(element) {
    delay = element.value
    if (interval != null) {
        clearInterval(interval)
        interval = setInterval(gameLoop, delay)
    }
}
