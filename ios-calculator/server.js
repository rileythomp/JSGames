const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.post('/calculate', function(req, res) {
    expr = req.body.calc_string.split(' ');
    left = Number(expr[0]);
    op = expr[1];
    right = Number(expr[2]);
    let ans;

    switch (op) {
        case '+':
            ans = left + right;
            break;
        case '-':
            ans = left - right;
            break;
        case '×':
            ans = left * right;
            break;
        case '÷':
            ans = left / right;
            break;
    }

    if (ans%1) {
        tmp = ans.toString()
        ans = Number(tmp.substring(0, 9))
    }

    res.send({ans});
})

app.post('/scientific', function(req, res) {
    res.sendFile(__dirname + '/public/scientific.html')
})

app.post('/normal', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})