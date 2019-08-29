const readInput = require('../readInput');
const path = require('path');


class Node {
    constructor(n) {
        this.n = n;
        this.edges = []
    }
    add(edge) {
        this.edges.push(edge);
    }
}

class Graph {
    constructor(edges = []) {
        this.nodes = new Map();
        this.reverseNodes = new Map()
        edges.forEach(element => {
            this.addEdge(element);
        });
    }

    addEdge(current, dest) {
        if (!this.nodes.has(current)) this.nodes.set(current, new Node(current))
        if (!this.nodes.has(dest)) this.nodes.set(dest, new Node(dest));
        if (!this.reverseNodes.has(current)) this.reverseNodes.set(current, new Node(current))
        if (!this.reverseNodes.has(dest)) this.reverseNodes.set(dest, new Node(dest));

        this.nodes.get(current).add(this.nodes.get(dest));
        this.reverseNodes.get(dest).add(this.reverseNodes.get(current));
    }
}



async function computSccs() {
    const graph = new Graph();
    const file = path.join(__dirname, 'sccInput.txt');
    await readInput(file, (line) => {
        const [origin, dest] = line.split(' ');
        graph.addEdge(origin, dest);

    })
    console.log('finish reading')
    const order = doDpsReverse(graph);
    console.log('FINISH ORDER')
    doOrderedDps(graph, order);


};

function doDpsReverse(graph) {
    let order = []
    const visited = {}
    const inArray = {};
    console.log('start order', graph.reverseNodes.size);
    graph.reverseNodes.forEach(node => {
        if(!visited[node.n]){
            order = new Set([...order, ...orderNodes(node, visited, inArray)])
            console.log('finish order from', node.n)
        }
    });

    console.log('finish order', order.size)

    return [...order];
}
function orderNodes(node, visited, inArray) {
    let order = new Set()
    if (!visited[node.n]) {
        let nodes = [node];
        inArray[node.n] = true;
        order.add(node.n)
        let i = 0;
        let current = nodes[i];

        while (current) {
            if (nodes.length > 875714) {
                console.log('limit reached');
                process.exit(1);
            }
            if (!visited[current.n]) {
                visited[current.n] = true;
                current.edges.forEach(n => {
                    if (!inArray[n.n]) {
                        inArray[n.n] = true;
                        nodes.push(n);
                        order.add(n.n)
                    }
                })
            }
            i++
            current = nodes[i];
        }
    }

    return [...order].reverse();
}

function doOrderedDps(graph, order) {
    const groupByLeader = {}
    const leaders = [];
    for (let i = order.length - 1; i > 0; i--) {
        const node = graph.nodes.get(order[i])
        let currentMark = markLeader(node, i + 1);

        if (leaders.length < 5) {
            leaders.push(parseInt(currentMark));
            leaders.sort()
        } else if (leaders[0] < currentMark) {
            leaders[0] = parseInt(currentMark);
            leaders.sort()
        }

        groupByLeader[i + 1] = currentMark
    }

    console.log({leaders});
}

function markLeader(node, leader, count = 0) {
    if (node && !node.visited) {
        node.visited = true;
        node.edges.forEach(n => {
            count = count + markLeader(n, leader, count);
        })
        count++
        node.leader = leader;
    }
    return count;
}

function visitNodes(node, order, visited) {
    if (node && !visited[node.n]) {
        visited[node.n] = true;
        node.edges.forEach(n => {
            if (!visited[n.n]) visitNodes(n, order, visited);
        });
        order.push(node.n);
    }
}

computSccs();