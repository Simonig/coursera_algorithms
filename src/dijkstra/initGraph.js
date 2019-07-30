const path = require('path');
const readInput = require('../readInput');

class Node {
    constructor(n) {
        this.n = n;
        this.edges = [];
        this.visited = false;
    }

    add(node, cost) {
        this.edges.push({node, cost});
    }

    setVisited() {
        this.visited = true;
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

    constructor(edges = []) {
        this.nodes = new Map();
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

    addEdges(n, destinations) {
        n = parseInt(n);
        if (!this.nodes.has(n)) this.nodes.set(n, new Node(n));
        const current = this.getNode(n);
        destinations.forEach((dest, i) => {
            if (dest) {
                const [edge, cost] = dest.split(',').map(str => parseInt(str));
                if (!this.nodes.has(edge)) this.nodes.set(edge, new Node(edge));

                current.add(this.getNode(edge), cost);
            }
        });
    }
}

function addEdges(graph) {
    return new Promise(async resolve => {
        const file = path.join(__dirname, 'sum.input.txt');
        await readInput(file, (line) => {
            const [node, ...edges] = line.split("\t");
            graph.addEdges(node, edges);
        });

        resolve();
    })
}

module.exports = async function main() {
    const graph = new Graph();
    await addEdges(graph);
    return graph;
};