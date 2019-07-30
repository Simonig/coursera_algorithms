const readLine = require('../readInput');
const path = require('path');


let numbers = new Map();

async function getNumbers(){
    const file = path.join(__dirname, 'input.txt');
    await readLine(file, (line) => {
        const num = parseInt(line);
        if(!numbers.has(num)) numbers.set(num, 0);
        numbers.set(num, numbers.get(num) + 1);
    });
}


function calculate2Sum(target){
    for(let [num, q] of numbers){
        if(numbers.has(target - num)){
            if(num === target - num){
                if(q > 1){
                    return true
                }
            } else return true;
        }
    }
    return false;
}

async function calc(){
    await getNumbers();
    console.log(numbers.length);
    let result = 0;

    for(let i = -10000; i <= 10000; i++){
        if(calculate2Sum(i)){
            result++;
            console.log({result});
        }
    }
    console.log(result);
}

calc();
