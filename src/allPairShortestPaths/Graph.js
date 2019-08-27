const path = require('path');
const readInput = require('../readInput');

class Node {
    constructor(n) {
        this.n = n;
        this.edges = [];
        this.visited = false;
        this.p = null;
    }

    add(node, cost) {
        this.edges.push({node, cost});
    }

    setVisited() {
        this.visited = !this.visited;
    }

    isVisited() {
        return this.visited;
    }

    getEdge(node){
        let edge;
        this.edges.forEach(current => {
            if(current.node.n === node.n) {
                edge = current;
            }
        });

        return edge;
    }
}

class Graph {
    constructor(n) {
        this.nodes = new Map();
        for(let i = 1; i <= n; i++){
            this.nodes.set(i, new Node(i))
        }
        this.visited = 0;
    }
    resetVisited(){
        this.visited = 0;
    }

    size(){
        return this.nodes.size;
    }

    getNode(n){
        if(typeof n === 'string') n = parseInt(n);
        return this.nodes.get(n);
    }

    isVisited(n){
        return this.getNode(n).isVisited();
    }

    setVisited(n){
        if(this.isVisited(n)){
            this.visited++;
        }
        this.getNode(n).setVisited();
    }

    nodesToVisit(){
        return this.size() - this.visited;
    }

    addEdge(n, destination, cost) {
        n = parseInt(n);
        if (!this.nodes.has(n)) this.nodes.set(n, new Node(n));
        const current = this.getNode(n);
        current.add(this.getNode(destination), cost);

    }
}

function initGraph(filename =  'g1.txt') {
    return new Promise(async resolve => {
        const file = path.join(__dirname, filename);
        let graph;
        let totalEdges;
        await readInput(file, (line) => {
            if(!graph){
                const [total, edges] = line.split(" ");
                graph = new Graph(total);
                totalEdges = edges
            } else {
                const [node, destination, cost] = line.split(" ").map(x => parseInt(x));
                graph.addEdge(node, destination, cost);
            }

        });
        resolve([graph, totalEdges]);
    })
}

module.exports = {
    initGraph,
    Node,
};