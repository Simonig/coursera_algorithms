const { initGraph, Node } = require('./Graph');

function calculateDistances(graph, source, firstV = 1){
    let negativeCycle = null;
    const distances = new Array(graph.size() + 1).fill(Infinity);
    distances[source] = 0;
    for (let i = 1; i <= graph.size(); i++) {
        for (let v = firstV; v <= graph.size(); v++) {
            if (distances[v] < Infinity) {
                const node = graph.getNode(v);
                for (let edge of node.edges) {
                    const dest = edge.node.n;
                    distances[dest] = Math.min(distances[dest], distances[node.n] + edge.cost);
                }
            }
        }
    }
    if (negativeCycle === null) {
        negativeCycle = false;

        for (let v = firstV; v < graph.size(); v++) {
            if (distances[v] < Infinity) {
                const node = graph.getNode(v);
                for (let edge of node.edges) {
                    const dest = edge.node.n;
                    if (distances[dest] > distances[node.n] + edge.cost) {
                        negativeCycle = true;
                    }
                }
            }
        }
        console.log({ negativeCycle });
    }

    return [negativeCycle, distances];
}

async function main(filename) {
    const [graph, count] = await initGraph(filename);
    const total = new Array(graph.size() + 1);
    let min = Infinity;

    for(let i = 1; i <= graph.size(); i ++){
        const [negativeCycle, distances] = calculateDistances(graph, 0, 0);
    }

    console.log({negativeCycle});
    console.log({ graph });

}


main('test.txt');//Negative Cycle

module.exports = calculateDistances;
/*

main('g1.txt');//Negative Cycle
main('g2.txt');//Negative Cycle
main('g3.txt');// min vertex -19
*/

