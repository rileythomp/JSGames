function addMouseListeners() {
    addColorChanges('num-or-dec', '#EDEDEC', '#D4D4D2')
    addColorChanges('gray', '#D4D4D2', '#505050')
    addColorChanges('orange', '#CC7700', '#FF9500')
}

function addColorChanges(class_name, color1, color2) {
    let elements = document.getElementsByClassName(class_name)
    Array.from(elements).forEach(function(el) {
        el.addEventListener('mousedown', function() {
            el.style.backgroundColor = color1;
        })
        el.addEventListener('mouseup', function() {
            el.style.backgroundColor = color2
        })
        el.addEventListener('mouseout', function() {
            el.style.backgroundColor = color2
        })
    })
}

function addButtonListeners(update) {
    let calc_buttons = document.getElementsByClassName('calc-button')
    Array.from(calc_buttons).forEach(function(el) {
        el.addEventListener('click', update)
    })
}

function addNormalSwitch() { 
    document.getElementById('normal').addEventListener('click', function() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(res) {
            if (this.readyState == 4 && this.status == 200) {
                document.body.innerHTML = this.response
                addListeners(addScientificSwitch, update)
            }
        }
        xhttp.open('POST', '/normal', true);
        xhttp.setRequestHeader("Content-type", "application/json"); 
        xhttp.send(JSON.stringify({x: 1}));
    })
}

function addScientificSwitch() {
    document.getElementById('scientific').addEventListener('click', function() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(res) {
            if (this.readyState == 4 && this.status == 200) {
                document.body.innerHTML = this.response
                addListeners(addNormalSwitch, update) // sci_update
            }
        }
        xhttp.open('POST', '/scientific', true);
        xhttp.setRequestHeader("Content-type", "application/json"); 
        xhttp.send(JSON.stringify({x: 1}));
    })
}

function addListeners(addSwitch, update) {
    addMouseListeners()
    addButtonListeners(update)
    addSwitch()
}

function set_ans(ans) {
    document.getElementById('ans').innerHTML = ans
}

function answer() {
    return document.getElementById('ans').innerHTML;
}