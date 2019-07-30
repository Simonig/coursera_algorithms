const readInput = require('../readInput');
const path = require('path');

async function main() {
    const file = path.join(__dirname, 'jobs.txt')
    let number;
    const jobs = new sortedArray((a, b) => {
        if (a.value > b.value || (a.value === b.value && a.weight > b.weight)) {
            return 1;
        } else return -1
    });

    await readInput(file, (line) => {
        if (!number) {
            number = parseInt(line);
        } else {
            let [weight, length] = line.split(' ');
            weight = parseInt(weight);
            length = parseInt(length);
            const item = { weight, length, value: weight - length };
            jobs.insert(item);
        }
    });
    let acc = 0;
    const result = jobs.array.reduce((result, item) => {
        acc += item.length;
        result += item.weight * acc;
        return result;
    }, 0);

    console.log(result);
}

async function main2() {
    const file = path.join(__dirname, 'jobs.txt')
    let number
    const jobs = new sortedArray((a, b) => {
        if (a.value > b.value || (a.value === b.value && a.weight > b.weight)) {
            return 1;
        } else return -1
    });

    await readInput(file, (line) => {
        if (!number) {
            number = parseInt(line);
        } else {
            let [weight, length] = line.split(' ');
            weight = parseInt(weight);
            length = parseInt(length);
            const item = { weight, length, value: weight/length };
            jobs.insert(item);
        }
    });
    let acc = 0;
    const result = jobs.array.reduce((result, item) => {
        acc += item.length;
        result += item.weight * acc;
        return result;
    }, 0);

    console.log({result});
}

class sortedArray {
    constructor(fn) {
        this.array = [];
        this.compare = fn;
    }

    insert(item) {
        let idx;
        for (let i = 0; i < this.array.length; i++) {
            if (this.compare(item, this.array[i]) === 1) {
                idx = i;
                break;
            }
        }

        if (idx === 0) {
            this.array.unshift(item)
        } else if (!idx) {
            this.array.push(item);
        } else {
            this.array.splice(idx, 0, item);
        }
    }

}

main2();
main();

// preg 1 69119377652
// preg 2 67311454237