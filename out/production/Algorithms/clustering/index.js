const path = require('path');
const readInput = require('../readInput');

class UnionFind {
    constructor(n) {
        this.nodes = new Array(n + 1).fill(null);
        this.clusters = n;
    }

    getParent(x) {
        if (this.nodes[x] === null) return null;
        if (this.nodes[x] === x) {
            return x;
        } else {
            return this.getParent(this.nodes[x])
        }
    }

    getClustersCount() {
        return this.clusters;
    }

    getRank(x, rank = 0) {
        if (this.nodes[x] === null) return null;
        if (this.nodes[x] === x) {
            return rank;
        } else {
            return this.getParent(this.nodes[x], rank + 1)
        }
    }

    addEdge({ origin, destination }) {
        //IF they both are already part of the same cluster return false;
        if (this.getParent(origin) != null && this.getParent(destination) != null && this.getParent(origin) === this.getParent(destination)) {
            return false;

            //IF both are not part of any cluster make one parent of the other
        } else if (this.getParent(origin) === null && this.getParent(destination) === null) {
            this.nodes[origin] = origin;
            this.nodes[destination] = origin;
            //IF one is part of a cluster and the other is not add it to that cluster;
        } else if (this.getParent(origin) === null && this.getParent(destination) != null) {
            this.nodes[origin] = destination;
        } else if (this.getParent(destination) === null && this.getParent(origin) != null) {
            this.nodes[destination] = origin;
        } else if (this.getParent(origin) != null && this.getParent(destination) != null && this.getParent(destination) !== this.getParent(origin)) {
            if (this.getRank(origin) > this.getRank(destination)) {
                const parent = this.getParent(destination);
                this.nodes[parent] = this.getParent(origin);
            } else {
                const parent = this.getParent(origin);
                this.nodes[parent] = this.getParent(destination);
            }

        }
        this.clusters--;
        return true;
    }
}

class Node {
    constructor(value) {
        this.value = value;
        this.edges = [];
        this.visited = false;
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
        for (let i = 1; i <= 500; i++) {
            this.nodes.set(i, new Node(i));
        }

        this.edges = [];
        this.clusters = new UnionFind(n);
        this.nodesToVisit = n;
    }

    size() {
        return this.nodes.size;
    }

    getNodesToVisit() {
        return this.nodesToVisit;
    }

    getClusterCount() {
        return this.clusters.getClustersCount();
    }

    getNode(n) {
        return this.nodes.get(n);
    }

    addEdge(edge) {
        this.edges.push(edge)
    };

    sortEdges() {
        this.edges.sort((a, b) => a.cost - b.cost);
    }

    getLowerEdge() {
        return this.edges.shift()
    }

    addEdgeToCluster(edge) {
        if (this.clusters.addEdge(edge)) {
            if (!this.getNode(edge.origin).isVisited()) {
                this.nodesToVisit--;
                this.getNode(edge.origin).setVisited();
            }

            if (!this.getNode(edge.destination).isVisited()) {
                this.nodesToVisit--;
                this.getNode(edge.destination).setVisited();
            }

            return true;
        }

        return false;
    }
}

async function initGraph() {
    const file = path.join(__dirname, 'test.txt');
    let graph;
    await readInput(file, (line) => {
        if (!graph) {
            let [numberNodes, numberEdges] = line.split(' ').map(x => parseInt(x));
            graph = new Graph(numberNodes);
        } else {
            let [origin, destination, cost] = line.split(' ').map(x => parseInt(x));
            const edge = new Edge(origin, destination, cost);
            graph.addEdge(edge);

        }
    });
    console.log('finish adding...');
    graph.sortEdges();
    console.log('finish sorting...');
    return graph;
}

async function calculateClusters(k) {
    const graph = await initGraph();
    let lastEdge = null;
    console.log('init clustering...');
    while (graph.getClusterCount() >= k) {
        const edge = graph.getLowerEdge();
        graph.addEdgeToCluster(edge);
        lastEdge = edge;
    }
    console.log('finish clustering...');
    console.log(graph.getNodesToVisit());
    console.log(graph.getClusterCount());
    console.log(lastEdge);
    console.log(graph.getLowerEdge());
}

calculateClusters(4);