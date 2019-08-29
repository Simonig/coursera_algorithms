const path = require('path');
const Heap = require('./Heap');
const readInput = require('../readInput');

class Node {
    constructor(value) {
        this.value = value;
        this.edges = [];
        this.visited = false;
        this.minCost = null;
    }

    addEdge(edge) {
        this.edges.push(edge);
    }

    isVisited() {
        return this.visited;
    }

    setVisited() {
        this.visited = true;
    }

    setMinCost(cost) {
        if (this.minCost === null || this.minCost > cost) {
            this.minCost = cost;
        }
    }
}

class Edge {
    constructor(origin, destination, cost) {
        this.cost = cost;
        this.origin = origin;
        this.destination = destination
    }
}

class Graph {
    constructor(n) {
        this.nodes = new Map();

        this.minCostHeap = [];
        for (let i = 1; i <= n; i++) {
            const node = new Node(i);
            this.nodes.set(i, node);
            if (i > 1) {
                this.minCostHeap.push(node);
            } else {
                node.setMinCost(0);
            }
        }

    }

    size() {
        return this.nodes.size;
    }

    getNode(n) {
        return this.nodes.get(n);
    }

    addEdge(n, edge) {
        const node = this.getNode(n);
        node.addEdge(edge);
    }

    getMinCostNode() {
        this.minCostHeap.sort((a, b) => {
            if (b.minCost === null && a.minCost != null) return -1;
            if (a.minCost === null && b.minCost != null) return 1;
            if (a.minCost === b.minCost) return 0;
            if (a.minCost < b.minCost) return -1;
            else return 1
        });
        const node = this.minCostHeap.shift();
        const cost = node.minCost;
        if(this.minCostHeap.some(x => x.minCostHeap < cost)){
            console.log(node);
        }
        node.edges.forEach(edge => {
            this.getNode(edge.destination).setMinCost(edge.cost);
        });
        return cost;
    }

    visitNode(n) {
        const node = this.getNode(n);
        node.edges.forEach(edge => {
            this.getNode(edge.destination).setMinCost(edge.cost);
        })
    }
}

async function initGraph() {
    const file = path.join(__dirname, 'edges.txt');
    let graph;
    await readInput(file, (line) => {
        if (!graph) {
            let [numberNodes, numberEdges] = line.split(' ').map(x => parseInt(x));
            graph = new Graph(numberNodes);
        } else {
            let [origin, destination, cost] = line.split(' ').map(x => parseInt(x));
            const edge = new Edge(origin, destination, cost);
            const reverseEdge = new Edge(destination, origin, cost);
            graph.addEdge(edge.origin, edge);
            graph.addEdge(reverseEdge.origin, reverseEdge);
        }
    });
    return graph;
}

async function calculateSpanning() {
    const graph = await initGraph();
    const visitedNodes = [graph.getNode(1).minCost];
    graph.visitNode(1);

    while (visitedNodes.length < graph.size()) {
        const cost = graph.getMinCostNode();
        console.log(cost);
        visitedNodes.push(cost);
    }
    console.log(visitedNodes.length);
    console.log(visitedNodes.some(item => item === null));
    console.log(visitedNodes.reduce((r, x) => r + x, 0));
}

calculateSpanning();