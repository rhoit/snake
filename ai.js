function toggle_ai() {
    // console.log(algo.value)
    if (ai.innerHTML === "ON") ai.innerHTML = "OFF"
    else {
        ai.innerHTML = "ON"
        // recompute
        aiLoop()
    }
}

function aiLoop() {
    path = [ 37, 37, 37, 37, 40, 40, 40, 40, 39, 39, 39 ]
    for (var i = 0; i < path.length; i++) {
        console.log("ai:", path[i])
        setTimeout(
            keyBinding({keyCode:path[i]}),
            1000
        )
    }
}
