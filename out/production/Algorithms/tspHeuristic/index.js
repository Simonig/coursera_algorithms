const { initGraph } = require('./Graph');

async function main(filename) {
    const [size, graph] = await initGraph(filename);
    let node = graph.getNode(1);
    let totalCost = 0;
    graph.setVisited(1);
    while(graph.unVisitedNodes.length > 0){
        const [d, cost] = graph.getClosestUnvisited(node.n);
        const destination = graph.getNode(d);
        graph.setVisited(destination.n);
        totalCost += cost;
        node = destination;
    }
    totalCost += graph.getDistance(node.n, 1);
    console.log(totalCost);
}

main('test.txt');
//1203406.5012708856