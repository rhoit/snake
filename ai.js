function toggle_ai() {
    // console.log(algo.value)
    if (ai.innerHTML === "ON") ai.innerHTML = "OFF"
    else {
        ai.innerHTML = "ON"
        // recompute
        console.log("hey");
        aiLoop([ 40,39,38,37,40,39,38,37,40,39,38,37,40,39,38,37,40,39,38,37,40,39,38,37])
    }
}

function aiLoop(path) {
    // path = [ 37, 37, 37, 37, 40, 40, 40, 40, 39, 39, 39 ]
    /*for (var i = 0; i < path.length; i++) {
        console.log("ai:", path[i])
        setTimeout(
            keyBinding({keyCode:path[i]}),
            1000
        )
    }*/

    function anotherLoop() {
        if (path.length==0) {return};
        console.log(path[0]);
        keyBinding({keyCode:path[0]});
        path = path.slice(1,path.length);
        setTimeout(anotherLoop,100)    
    }

    anotherLoop();
}
