const { initGraph, Node } = require('./Graph');
const { promisify } = require('util');

const v8 = require('v8');
const totalHeapSize = v8.getHeapStatistics().total_available_size;
const totalHeapSizeGb = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2);
console.log('totalHeapSizeGb: ', totalHeapSizeGb);




function getCombinations(arr, n, r) {
    const data = new Array(r);
    const sets = [];
    combinationUtil(arr, n, r, 0, data, 0, sets);
    return sets;
}

function combinationUtil(arr, n, r, index, data, i, sets) {
    if (index === r) {
        const set = [];
        for (let j = 0; j < r; j++) {
            set.push(data[j])
        }
        sets.push(set);
        return;
    }
    if (i >= n) {
        return;
    }
    data[index] = arr[i];
    combinationUtil(arr, n, r, index + 1, data, i + 1, sets);
    combinationUtil(arr, n, r, index, data, i + 1, sets);
}

/*class IndexMap {
    constructor() {
        this.map = new Map();
    }

    async get(key) {
        return await JSON.stringify(key)
    }

    async set(key, value) {
        await JSON.stringify(key), value
    }
}*/

class Index {
    constructor(vertex, set) {
        this.v = vertex;
        this.s = set;
    }
}

async function getCost(set, prevVertex, minCostDp) {
    const copySet = set.filter(vertex => vertex !== prevVertex);
    const index = new Index(prevVertex, copySet);
    const cost = await minCostDp.get(index);
    return parseFloat(cost);
}

async function main(filename) {
    const [size, graph] = await initGraph(filename);
    console.log(graph.size());
}

main('tsp.txt');
