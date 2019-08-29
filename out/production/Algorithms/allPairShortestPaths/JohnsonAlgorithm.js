const { initGraph, Node } = require('./Graph');
const bellmanFord = require('./BellmanFordAlg');
const dijkstra = require('./Dijkstras');

async function main(filename) {
    const [graph, count] = await initGraph(filename);
    const total = new Array(graph.size() + 1);
    let min = Infinity;

    const sourceNode = new Node(0);

    for(let i = 1; i <= graph.size(); i++){
        sourceNode.add(graph.getNode(i), 0);
    }

    graph.nodes.set(0, sourceNode);

    const [negativeCycle, distances] = bellmanFord(graph, 0, 0);

    for(let i = 1; i < graph.size(); i++){
        const node = graph.getNode(i);
        node.p = distances[i];
        node.edges.forEach((edge => {
            edge.cost = edge.cost + distances[node.n] - distances[edge.node.n];
            console.log(edge.cost);
        }))
    }
    let visited = true;
    const results = new Array(graph.size() + 1);
    for(let i = 1; i <= graph.size(); i++){
        const computedRoutes  = dijkstra(graph, i, visited);
        visited = !visited;
        results[i] = computedRoutes;
    }

    //console.log(graph.getNode(1),graph.getNode(2),graph.getNode(3),);
    console.log({ results });
}


main('test.txt');//Negative Cycle