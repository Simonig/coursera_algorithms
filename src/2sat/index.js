const path = require('path');
const readInput = require('../readInput');

class Clauses {
    constructor(n) {
        this.n = n;
        this.adj = new Array((n+1) * 2).fill(null).map(x => []);
        this.adjInv = new Array((n+1) * 2).fill(null).map(x => []);
        this.visited = new Array((n+1) * 2);
        this.visitedInv = new Array((n+1) * 2);
        this.s = [];
        this.scc = [];
        this.counter = 1;
    }

    addEdge(a, b) {
        this.adj[a].push(b);
    }

    addEdgeInv(a, b) {
        this.adjInv[b].push(a);
    }

    dfsFirst(u) {
        if (this.visited[u])
            return;
        this.visited[u] = 1;
        this.adj[u].forEach(x => this.dfsFirst(x));
        this.s.push(u);
    }
    dfsSecond(u){
        if (this.visitedInv[u])
            return;
        this.visitedInv[u] = 1;
        this.adjInv[u].forEach(x => this.dfsSecond(x));
        this.scc[u] = this.counter;
    }

}

function initClauses(filename = '2sat1.txt') {
    return new Promise(async resolve => {
        const file = path.join(__dirname, filename);
        let clauses;
        let n;
        await readInput(file, (line) => {
            if (!clauses) {
                n = parseInt(line);
                console.log(n);
                clauses = new Clauses(n);
            } else {
                const [a, b] = line.split(" ").map(x => parseInt(x));
                if (a > 0 && b > 0) {
                    clauses.addEdge(a + n, b);
                    clauses.addEdgeInv(a + n, b);
                    clauses.addEdge(b + n, a);
                    clauses.addEdgeInv(b + n, a);
                } else if (a  > 0 && b < 0) {
                    clauses.addEdge(a + n, n - b);
                    clauses.addEdgeInv(a + n, n - b);
                    clauses.addEdge(-b, a);
                    clauses.addEdgeInv(-b, a);
                } else if (a < 0 && b > 0) {
                    clauses.addEdge(-a, b);
                    clauses.addEdgeInv(-a, b);
                    clauses.addEdge(b + n, n - a);
                    clauses.addEdgeInv(b + n, n - a);
                } else {
                    clauses.addEdge(-a, n - b);
                    clauses.addEdgeInv(-a, n - b);
                    clauses.addEdge(-b, n - a);
                    clauses.addEdgeInv(-b, n - a);
                }
            }
        });
        resolve(clauses)
    })
}

async function checkIsSatisfy(filename) {
    const clauses = await initClauses(filename);
    for(let i = 1; i <= clauses.n*2; i++){
        if(!clauses.visited[i]){
            clauses.dfsFirst(i);
        }
    }
    while(clauses.s.length > 0){
        const n = clauses.s.pop();
        if(!clauses.visitedInv[n]){
            clauses.dfsSecond(n);
            clauses.counter++;
        }
    }
    for(let i = 1; i <= clauses.n; i++){
        if(clauses.scc[i] === clauses.scc[i + clauses.n]){
            console.log(`${filename} Given expression CAN'T be satisfied`);
            console.log(clauses.scc[i], clauses.scc[i+clauses.n]);
            return
        }
    }

    console.log(`${filename} Given expression can be satisfied`);

}

checkIsSatisfy('test.txt');
checkIsSatisfy('2sat1.txt');
checkIsSatisfy('2sat2.txt');
checkIsSatisfy('2sat3.txt');
checkIsSatisfy('2sat4.txt');
checkIsSatisfy('2sat5.txt');
checkIsSatisfy('2sat6.txt');
