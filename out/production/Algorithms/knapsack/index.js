const path = require('path');
const readInput = require('../readInput');


async function initArray(filename) {
    const file = path.join(__dirname, filename);
    let knapsackSize;
    let n;
    const array = [{ value: 0, weight: 0 }];
    await readInput(file, (line) => {
        if (!knapsackSize) {
            [knapsackSize, n] = line.split(' ').map(x => parseInt(x));
        } else {
            const [value, weight] = line.split(' ').map(x => parseInt(x));
            array.push({ value, weight });
        }
    });
    return [knapsackSize, array];
}

async function main(filename) {
    const [weight, items] = await initArray(filename);
    const row = new Array(weight + 1).fill(0);

    for (let j = 1; j < items.length; j++) {
        const item = items[j];

        for (let w = weight; w >= 0; w--) {
            const prevRowVal = row[w];
            let maxValWithCurrentItem = 0;

            if(w >= item.weight){
                maxValWithCurrentItem = item.value;
                const remainingWeight = w - item.weight;
                maxValWithCurrentItem += row[remainingWeight]
            }
            row[w] = Math.max(maxValWithCurrentItem, prevRowVal);
        }
    }

    console.log(row[weight])
}

main('input.txt');
//2493893
main('input_big.txt');
//4243395