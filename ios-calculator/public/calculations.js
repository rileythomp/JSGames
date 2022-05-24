let left_num = '';
let right_num = '';
let on_left_num = true;
let cur_op = ''
let ans = 0

let nums = {
    'zero': '0',
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9' 
}

let ops = {
    'add': '+',
    'subtract': '-',
    'multiply': '×',
    'divide': '÷'
}

addListeners(addScientificSwitch, update)

function sci_calculate() {
    id = this.id
}

function sci_update() {

}

function update() {
    id = this.id

    if (id in nums) {
        if (answer() == 0 && id == 'zero') {
            return;
        }
        if (on_left_num) {
            if (left_num == '-0') {
                left_num = left_num.slice(0, -1);
            }
            left_num += nums[id];
        } else {
            if (left_num == '-0') {
                left_num = left_num.slice(0, -1);
            }
            right_num += nums[id];
        }
    } 

    else if (id in ops) {
        // if (answer() == 'Error') {
        //     cur_op = 'bad'
        //     return
        // }
        // if (left_num != '' && right_num != '') {
        //     calculate()
        // }
        // cur_op = ops[id];
        // if (on_left_num) {
        //     on_left_num = false;
        // } else {
        //     on_left_num = true;
        // }
    }

    else if (id == 'equals') {
        if (division_by_zero() || cur_op == 'bad') {
            set_ans('Error')
            return
        }
        calculate()
        if (on_left_num) {
            on_left_num = false;
        } else {
            on_left_num = true;
        }
        return
    }

    // else if (id == 'percent') {
    //     if (on_left_num) {
    //         cur_num = Number(left_num)
    //         left_num = (cur_num/100).toString();
    //     } else {
    //         cur_num = Number(right_num)
    //         right_num = (cur_num/100).toString();
    //     }
    // }

    // else if (id == 'decimal') {
    //     if (on_left_num) {
    //         if (left_num == '' ) {
    //             left_num = '0';
    //         }
    //         left_num += '.';
    //     } else {
    //         if (right_num == '' ) {
    //             right_num = '0';
    //         }
    //         right_num += '.';
    //     }
    // }
    // else if (id == 'negate') {
    //     if (on_left_num) {
    //         let cur_num = Number(left_num);
    //         if (left_num == '' ) {
    //             left_num = '0';
    //         }
    //         if (cur_num >= 0) {
    //             left_num = `-${cur_num}`;
    //         }
    //         else {
    //             left_num = `${-1 * tmp_num}`
    //         }
    //     } else {
    //         let cur_num = Number(right_num);
    //         if (right_num == '' ) {
    //             right_num = '0';
    //         }
    //         if (cur_num >= 0) {
    //             right_num = `-${cur_num}`;
    //         }
    //         else {
    //             right_num = `${-1 * tmp_num}`
    //         }
    //     }
    // }
    // else if (id == 'clear') {
    //     left_num = '';
    //     right_num = '';
    //     on_left_num = true;
    //     cur_op = ''
    //     ans = 0
    // }

    if (on_left_num) {
        set_ans(left_num || 0);
    } else if (right_num != '') {
        set_ans(right_num || 0)
    }
}

function division_by_zero() {
    return right_num == '0' && cur_op == '÷'
}

function calculate() {
    if (!left_num) { left_num = document.getElementById('ans').innerHTML }
    calc_string = `${left_num} ${cur_op} ${right_num || left_num}`
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            ans = JSON.parse(xhttp.responseText).ans;
            set_ans(ans) ;
        }
    }
    xhttp.open('POST', '/calculate', true);
    xhttp.setRequestHeader("Content-type", "application/json"); 
    xhttp.send(JSON.stringify({calc_string}));
}