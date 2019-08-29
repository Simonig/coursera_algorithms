class ComputedRoutes {
    constructor(graph) {
        this.edges = new Map();
        this.routes = new Map();
        for (let i = 1; i <= graph.size(); i++) {
            this.routes.set(i, { cost: null, route: null });
        }
    }

    deleteEdge(n) {
        if (this.edges.has(n)) {
            this.edges.delete(n);
        }
    };

    getEdge(n) {
        return this.edges.get(n);
    }

    getRoute(n) {
        if (typeof n === 'string') n = parseInt(n);
        return this.routes.get(n);
    }

    getCost(n) {
        return this.getRoute(n).cost;
    }

    getEdgeCost(n) {
        return this.edges.has(n) ? this.edges.get(n).cost : null;
    }

    setRoute(n, newRoute) {
        this.routes.set(n, newRoute);
    }

    isRouteComputed(n) {
        return this.getRoute(n).cost != null
    }

    addEdges(node) {
        node.edges.forEach(edge => {
            if (this.isRouteComputed(edge.node.n)) {
                const currentCost = this.getCost(node.n);
                this.setNewCost(edge.node, currentCost + edge.cost);
            } else {
                this.addEdge(node.n, edge)
            }
        });
    };

    addEdge(n, edge) {
        let currentCost = this.getEdgeCost(edge.node.n);
        const cost = this.getCost(n) + edge.cost;
        if (currentCost === null || cost < currentCost) {
            this.edges.set(edge.node.n, { cost, origin: n });
        }
    }


    addRoute(origin, destination) {
        let cost;
        if (origin === 0) {
            cost = 0;
        } else {
            const { cost: newCost } = this.getEdge(destination.n);
            cost = newCost;
            this.deleteEdge(destination.n);
        }

        this.setNewCost(destination, cost);
        this.addEdges(destination);
    }

    setNewCost(node, cost) {
        const route = this.getRoute(node.n);
        if (route.cost === null || route.cost > cost) {
            route.cost = cost;
            this.setRoute(node.n, route);
        }
    }


    getLowerCostEdge() {
        let lower = null;
        let key = null;
        let o = null;

        this.edges.forEach(({ cost, origin }, n) => {
            if (lower === null || cost < lower) {
                lower = cost;
                key = n;
                o = origin;
            }
        });
        return { edge: key, origin: o };
    }
}

function main(graph, origin, visited = true) {
    let currentNode = graph.getNode(origin);
    const computedRoutes = new ComputedRoutes(graph);
    computedRoutes.addRoute(origin, currentNode);
    currentNode.setVisited();

    while (graph.nodesToVisit() > 0 && computedRoutes.edges.size > 0) {
        const { edge, origin } = computedRoutes.getLowerCostEdge();
        const nextNode = graph.getNode(edge);

        if (!nextNode.isVisited() === visited) {
            nextNode.setVisited();
            computedRoutes.addRoute(origin, nextNode);
            currentNode = nextNode;
        } else {
            process.exit(1)
        }
    }
    graph.resetVisited();

    return computedRoutes;
}
module.exports = main;
