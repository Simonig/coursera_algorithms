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
    constructor(value, cost, sum) {
        this.value = value;
        this.edges = [];
        this.cost = cost;
        this.sum = sum;
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
        this.edges = [];
        this.clusters = new UnionFind(n);
        this.nodesToVisit = n;
    }

    addNode(node, n) {
        this.nodes.set(n, node);
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
    const file = path.join(__dirname, 'big.txt');
    let graph;
    let count = 1;
    await readInput(file, (line) => {
        if (!graph) {
            let [numberNodes, numberEdges] = line.split(' ').map(x => parseInt(x));
            graph = new Graph(numberNodes);
        } else {
            let binary = line.split(' ').map(x => parseInt(x));
            const sum = binary.reduce((res, x) => res + x, 0);
            const node = new Node(count, parseInt(binary.join(''), 2), sum);
            graph.addNode(node, count);
            count++;
        }
    });
    console.log('finish adding...');
    console.log(graph.size());
    return graph;
}

function getDistance(a, b) {
    let diff = a.cost ^ b.cost;
    let count = 0;
    while(diff){
        count += diff & 1;
        diff >>= 1;
    }
    return count;

/*    let distance = 0;
    for (let i = 0; i < a.cost.length; i++) {
        if (a.cost[i] === b.cost[i]) continue;
        distance++;
    }
    return distance;*/
}

async function calculateClusters(d) {
    const graph = await initGraph();
    const nodeOrder = Array.from(graph.nodes.values()).sort((a, b) => a.sum - b.sum);
    console.log(nodeOrder);

    console.log('init clustering...');
    console.log('graph size: ', graph.size());
    for (let i = 0; i < nodeOrder.length; i++) {
        const nodeA = nodeOrder[i];
        for (let j = i + 1; j < nodeOrder.length; j++) {
            const nodeB =  nodeOrder[j];
            if(nodeB.sum - nodeA.sum > 2) {
                break;
            }

            const distance = getDistance(nodeA, nodeB);
            if(distance < d){
                graph.addEdgeToCluster({origin: nodeA.value, destination: nodeB.value, cost: distance})
            }
        }

    }

    console.log('finish clustering...');
    console.log(graph.getClusterCount());
}

calculateClusters(3);