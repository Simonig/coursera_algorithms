const fs = require('fs');
const readline = require('readline');
const stream = require('stream');


module.exports = async function readInput(fileName, handleLine) {
    return new Promise((resolve, reject) => {
        const instream = fs.createReadStream(fileName);
        const outstream = new stream();
        const rl = readline.createInterface(instream, outstream);

        rl.on('line', function readLine(line) {
            handleLine(line)
        });
        rl.on('close', () => resolve())
    })
};


function readInputSync(fileName) {
    return fs.readFileSync(fileName, 'utf8')
}

function parseInputTextToArray(text) {
    const lines = text.split('\n');
    return lines.map(line => {
        const arr = line.split(' ');
        return [parseInt(arr[0]), parseInt(arr[1])]
    })
}

function parseFileTextInputToArray(fileName) {
    const text = readInputSync(fileName);
    return parseInputTextToArray(text);
}

function parseInputToGraph(fileName) {
    const array = parseFileTextInputToArray(fileName);
    return array.reduce((result, [origin, dest]) => {
        if (!result[origin]) result[origin] = [];
        if (!result[dest]) result[dest] = [];
        result[dest].push(origin);
        return result;
    }, {})
}