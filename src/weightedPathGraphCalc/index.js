const path = require('path');
const readInput = require('../readInput');


async function initPathGraph(filename) {
    const file = path.join(__dirname, filename);
    let total;
    const array = [];
    await readInput(file, (line) => {
        if (!total) {
            total = parseInt(line);
        } else {
            array.push(parseInt(line));
        }
    });
    return array;
}

const cache = {};
const binarySet = {};

function calcMaxWeight(array){
    if(cache.hasOwnProperty(array.length)){
        return cache[array.length];
    }
    const cacheKey = array.length;
    let result = 0;

    if(array.length === 1){
        result = array[0];
    } else if(array.length === 2){
        result = Math.max(...array);
    } else {
        const currentElement = array.pop();
        const firstMax = calcMaxWeight(array);
        array.pop();
        result = Math.max(
            firstMax,
            currentElement + calcMaxWeight(array)
        )
    }
    cache[cacheKey] = result;
    return result;
}

function calcMaxWeightLoop(array){
    for(let i = 1; i <= array.length; i++){
        calcMaxWeight(array.slice(0, i))
    }

    return calcMaxWeight(array);
}

async function main(filename){
    const pathGraph = await initPathGraph('input.txt');
    const maxWeight = calcMaxWeightLoop(pathGraph);
    const path = getPath(pathGraph);

    getBinary(path,1, 2, 3, 4, 17, 117, 517, 997)
}

function getPath(pathGraph){
    let result = {};
    let i = pathGraph.length;
    cache[0] = 0;
    const array = [0, ...pathGraph];

    while(i > 1){
        if(cache[i - 1] >= cache[i - 2] + array[i]){
            i--;
        } else {
            result[i] = 1;
            i -= 2;
        }
    }
    if(!result[2]){
        result[1] = 1;
    }
    return result;
}
function getBinary(path, ...indexes){
    for(let index of indexes){
        if(path[index] === 1){
            console.log(1);
        } else {
            console.log(0)
        }
    }
}

main();

/*
1
0
1
0
0
1
1
0
*/