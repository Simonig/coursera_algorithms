const { initGraph, Node } = require('./Graph');
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

class IndexMap {
    constructor(){
        this.map = new Map();
    }
    get(key){
        return this.map.get(JSON.stringify(key))
    }

    set(key, value){
        this.map.set(JSON.stringify(key), value)
    }
    remove(key){
        this.map.delete(JSON.stringify(key));
    }
}
class Index{
    constructor(vertex, set){
        this.v = vertex;
        this.s = set;
    }
}
function getCost(set, prevVertex, minCostDp){
    const copySet = set.filter(vertex => vertex !== prevVertex);
    const index = new Index(prevVertex, copySet);
    const cost = minCostDp.get(index);
    return cost;
}

async function main(filename) {
    const [size, distance] = await initGraph(filename);
    const input = new Array(size);
    for (let i = 0; i < input.length; i++) {
        input[i] = i + 1;
    }
    let minCostDp = new IndexMap();
    input.forEach(v => minCostDp.set(new Index(v, []), distance[1][v]));

    for(let r = 1; r < size; r++){
        const sets = getCombinations(input, input.length, r);
        console.log(`sets ${r}/${size} - dpLength = ${minCostDp.map.size}`);
        const newCostDp = new IndexMap();
        for(let set of sets){
            for(let currentVertex = 2; currentVertex <= size; currentVertex++){
                if(set.includes(currentVertex)){
                    continue;
                }
                const index = new Index(currentVertex, set);
                let minCost = Infinity;
                let minPrevVertex = 1;
                for(let prevVertex of set){
                    const distanceCost = distance[prevVertex][currentVertex];
                    const hopCost = getCost(set, prevVertex, minCostDp);
                    const cost = distanceCost +  hopCost;
                    if (cost < minCost) {
                        minCost = cost;
                        minPrevVertex = prevVertex;
                    }
                }
                if(set.length === 0) {
                    minCost = distance[1][currentVertex];
                }

                newCostDp.set(index, minCost);
            }
        }
        minCostDp = newCostDp;
    }
    let minCost = Infinity;
    for(let k = 2; k <= input.length; k++){
        const cost = distance[k][1] + getCost(input, k, minCostDp);
        if(cost < minCost){
            minCost = cost;
        }
    }
    console.log(minCostDp.map);
    console.log(minCost);
}

main('text.txt');