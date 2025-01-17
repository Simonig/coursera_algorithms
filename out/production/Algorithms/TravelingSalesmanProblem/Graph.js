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
        this.visited = !this.visited;
    }

    isVisited() {
        return this.visited;
    }

    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }

    getEdge(node) {
        let edge;
        this.edges.forEach(current => {
            if (current.node.n === node.n) {
                edge = current;
            }
        });

        return edge;
    }
}

class Graph {
    constructor(n) {
        this.nodes = new Map();
        for (let i = 1; i <= n; i++) {
            this.nodes.set(i, new Node(i))
        }
        this.visited = 0;
    }

    resetVisited() {
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
        if (this.isVisited(n)) {
            this.visited++;
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
}

function initGraph(filename = 'tsp.txt') {
    return new Promise(async resolve => {
        const file = path.join(__dirname, filename);
        let graph;
        let totalEdges;
        let count = 1;
        await readInput(file, (line) => {
            if (!graph) {
                const [total, edges] = line.split(" ");
                graph = new Graph(total);
                totalEdges = edges
            } else {
                const [x, y] = line.split(" ").map(x => parseFloat(x));
                const node = graph.getNode(count);
                node.setCoords(x, y);
                count++;
            }

        });
        const distanceMatrix = new Array(graph.size() + 1).fill(null).map(x => new Array(graph.size() + 1).fill(Infinity));

        for (let i = 1; i <= graph.size(); i++) {
            for (let d = 1; d <= graph.size(); d++) {
                if (i !== d) {
                    const node = graph.getNode(i);
                    const { x, y } = node;
                    const destination = graph.getNode(d);
                    const { x: z, y: w } = destination;
                    const cost = Math.sqrt(Math.pow(x-z, 2) + Math.pow(y - w, 2));
                    distanceMatrix[i][d] = cost;
                    node.add(destination, cost)
                } else {
                    distanceMatrix[i][d] = 0;
                }
            }
        }

        resolve([graph.size(), distanceMatrix]);
    })
}
initGraph();
module.exports = {
    initGraph,
    Node,
};