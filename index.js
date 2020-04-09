const inquirer = require('inquirer');
const pack = require('ndarray-pack')
const det = require('ndarray-determinant')
const polynomial = require('everpolate').polynomial
const prompt = require('prompt');

var Handler = {};
const listQuestions = ['Interpolacao Linear', 'Interpolacao Quadratica', 'Lagrange', 'Newton']

Handler._0 = function () {
    console.log(`Formula:
                  (y1 - y0)
    P(x) =  y0  +  ------ * (x - x0)
                  (x1 - x0)`)

    prompt.start();
    prompt.get(['x', 'x0', 'x1', 'y0', 'y1'], function (err, result) {
        if (err) { return onErr(err); }
        let x = result.x
        let x0 = result.x0
        let x1 = result.x1
        let y0 = result.y0
        let y1 = result.y1
        let divis = ((y1 - y0) / (x1 - x0))
        let final = parseFloat(y0) + (divis * ((x - x0).toFixed(2)))
        console.log(`RESULTADO: ${final}`)
    });
    function onErr(err) {
        console.log(err);
        return 1;
    }
}

Handler._1 = function () {
    console.log(`Formula:
        P(x) = a0 + a1*x0 + a2*x0**2`)

    prompt.start();
    prompt.get(['x', 'x1', 'x2', 'x3', 'y1', 'y2', 'y3'], function (err, result) {
        if (err) { return onErr(err); }
        let x = result.x
        let x1 = result.x1
        let x2 = result.x2
        let x3 = result.x3
        let y1 = result.y1
        let y2 = result.y2
        let y3 = result.y3

        let detGeral = (det(pack(
            [[1, x1, x1 ** 2],
            [1, x2, x2 ** 2],
            [1, x3, x3 ** 2]]
        ))).toFixed(0)

        let detA = (det(pack(
            [[1, x1, y1],
            [1, x2, y2],
            [1, x3, y3]]
        ))).toFixed(0)

        let detB = (det(pack(
            [[1, y1, x1 ** 2],
            [1, y2, x2 ** 2],
            [1, y3, x3 ** 2]]
        ))).toFixed(0)

        let detC = (det(pack(
            [[y1, x1, x1 ** 2],
            [y2, x2, x2 ** 2],
            [y3, x3, x3 ** 2]]
        ))).toFixed(0)

        let a = detA / detGeral
        let b = detB / detGeral
        let c = detC / detGeral

        let final = ((a * x ** 2) + (b * x) + (c)).toFixed(2)

        console.log(`RESULTADO: ${final}`)
    });
    function onErr(err) {
        console.log(err);
        return 1;
    }
}

Handler._2 = function () {
    console.log(`Formula:
            (x−x2)(x−x3)...(x−xN)
    P(x) =  --------------------- * y1 + ...
            (x1−x2)(x1−x3)...(x1−xN)
        
        Inserir xs e ys separados por virgula`)

    prompt.start();
    prompt.get(['x', 'xs', 'ys'], function (err, result) {
        if (err) { return onErr(err); }
        let x = String(result.x).split(',')
        let xs = String(result.xs).split(',')
        let ys = String(result.ys).split(',')

        let final = polynomial(x, xs, ys)

        console.log(`RESULTADO: ${final}`)
    });
    function onErr(err) {
        console.log(err);
        return 1;
    }
}

function doMethod(index) {
    Handler[`_${(index == 3) ? 2 : index}`]();
}

(function () {
    var questions = [
        {
            type: "list",
            name: "method",
            message: "Escolha um metodo:",
            choices: listQuestions
        }
    ]

    inquirer.prompt(questions).then(answers => {
        var itemInQuestion = (answers['method']);
        let index = listQuestions.indexOf(itemInQuestion);
        doMethod(index);
    })
})()