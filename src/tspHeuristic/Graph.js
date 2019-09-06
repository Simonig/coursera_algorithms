const path = require('path');
const readInput = require('../readInput');

class Node {
    constructor(n) {
        this.n = n;
        this.edges = [];
        this.visited = false;
        this.x = null;
        this.y = null;
    }

    add(node, cost) {
        this.edges.push({ node, cost });
    }

    setVisited() {
        this.visited = true
    }

    isVisited() {
        return this.visited;
    }

    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }

}

class Graph {
    constructor(n) {
        this.nodes = new Map();
        this.unVisitedNodes = [];
        for (let i = 1; i <= n; i++) {
            this.nodes.set(i, new Node(i));
            this.unVisitedNodes.push(i);
        }
        this.visited = 0;
    }

    size() {
        return this.nodes.size;
    }

    getNode(n) {
        if (typeof n === 'string') n = parseInt(n);
        return this.nodes.get(n);
    }

    isVisited(n) {
        return this.getNode(n).isVisited();
    }

    setVisited(n) {
        this.visited++;
        const index = this.unVisitedNodes.indexOf(n);
        if (index > -1) {
            this.unVisitedNodes.splice(index, 1);
        }
        this.getNode(n).setVisited();
    }

    nodesToVisit() {
        return this.size() - this.visited;
    }

    addEdge(n, destination, cost) {
        n = parseInt(n);
        if (!this.nodes.has(n)) this.nodes.set(n, new Node(n));
        const current = this.getNode(n);
        current.add(this.getNode(destination), cost);

    }

    getDistance(i, d) {
        const node = this.getNode(i);
        const { x, y } = node;
        const destination = this.getNode(d);
        const { x: z, y: w } = destination;
        return Math.sqrt(Math.pow(x - z, 2) + Math.pow(y - w, 2));
    }

    getClosestUnvisited(i) {
        let minCost = Infinity;
        let lowerCostNode = null;

        for (let d = 0; d < this.unVisitedNodes.length; d++) {
            const nodeNumber = this.unVisitedNodes[d];
            const destination = this.getNode(nodeNumber);
            if (i !== nodeNumber && !destination.isVisited()) {
                const node = this.getNode(i);
                const { x, y } = node;
                const { x: z, y: w } = destination;
                const cost = Math.sqrt(Math.pow(x - z, 2) + Math.pow(y - w, 2));
                if (minCost > cost) {
                    minCost = cost;
                    lowerCostNode = nodeNumber;
                }
            }
        }
        return [lowerCostNode, minCost];
    }
}

function initGraph(filename = 'tsp.txt') {
    return new Promise(async resolve => {
        const file = path.join(__dirname, filename);
        let graph;
        await readInput(file, (line) => {
            if (!graph) {
                const [total] = line.split(" ");
                graph = new Graph(total);
            } else {
                const [n, x, y] = line.split(" ").map(x => parseFloat(x));
                const node = graph.getNode(n);
                node.setCoords(x, y);
            }
        });
        resolve([graph.size(), graph]);
    })
}

initGraph();
module.exports = {
    initGraph,
    Node,
};