package dijkstra;

import java.util.List;

public class Node {
    private int n;
    private List<Node> edges;
    private Boolean visited = false;

    void add(Node edge) {
        this.edges.add(edge);
    }
    public void setVisited(){
        this.visited = true;
    }
    public Boolean getVisited(){
        return this.visited;
    }

    public Node(int n){
        this.n = n;
    }
}