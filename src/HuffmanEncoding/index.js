const path = require('path');
const readInput = require('../readInput');

class Node {
    constructor(left, right){
        this.left = left;
        this.right = right;
    }

    getVal(){
        return this.left.getVal() + this.right.getVal();
    }
}

class Char {
    constructor(index, val){
        this.index = index;
        this.val = val;
    }
    getVal(){
        return this.val;
    }
}

async function initAlphabet(filename) {
    const file = path.join(__dirname, filename);
    let total;
    let count = 1;
    const alphabet = new Alphabet();
    await readInput(file, (line) => {
        if (!total) {
            total = parseInt(line);
        } else {
            alphabet.addLetter(count, parseInt(line));
            count++;
        }
    });
    alphabet.createOrder();
    return alphabet
}

class Alphabet {
    constructor(size) {
        this.size = size;
        this.alphabet = new Map();
        this.order = [];
    }

    addLetter(key, val) {
        this.alphabet.set(key, val);
    }

    createOrder() {
        this.order = Array.from(this.alphabet).sort((a, b) => a[1] - b[1]).map(([key, val]) => new Char(key, val));
    }

    orderCount(){
        return this.order.length;
    }

    mergeLowers(){
        const right = this.order.shift();
        const left = this.order.shift();
        const subtree = new Node(left, right);
/*        const index = this.order.findIndex((item) => {
           return item.getVal() > subtree.getVal();
        });
        this.order.splice(index, 0, subtree);*/
        this.order.push(subtree);
        this.order.sort((a, b) => a.getVal() - b.getVal());
        return subtree;
    }
}

async function calculateCodes(){
    const alphabet = await initAlphabet('input.txt');
    let root;
    while (alphabet.orderCount() > 1){
        root = alphabet.mergeLowers();
    }
    console.log(countDepth(root))
}

function countDepth(root){
    let nodes = [root];
    let count = 0;
    root.depth = 0;
    let current;
    let maxDepth = 1;
    let minDepth;
    while(nodes.length){
        current = nodes.shift();
        count = current.depth;
        if(current.left){
            current.left.depth = count + 1;
            current.right.depth = count + 1;
            nodes = [current.left, current.right, ...nodes];
        } else {
            if(!minDepth || count < minDepth){
                minDepth = count;
            }
            if(count > maxDepth){
                maxDepth = current.depth;
            }
        }
    }
    return [minDepth, maxDepth];
}
// result minCodes = 9, maxCodes = 19
calculateCodes();
