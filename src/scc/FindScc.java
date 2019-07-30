package scc;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Collections;
import java.util.stream.Stream;
import java.io.IOException;

class Node {
    int n;
    List<Node> edges;
    Boolean visited = false;

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

class Graph {
    Map<Integer, Node> nodes;
    Map<Integer, Node> reverseNodes;
    Map<Integer, Boolean> reverseNodesVisited;
    Map<Integer, Integer> groupByLeader;
    List<Integer> leaders = new ArrayList<Integer>();
    List<Integer> order = new ArrayList<Integer>();

    public Graph () {
        this.nodes = new HashMap<Integer, Node>();
        this.reverseNodes = new HashMap<Integer, Node>();
        this.reverseNodesVisited = new HashMap<Integer, Boolean>();

    }
    public List<Integer> getLeaders(){
        return this.leaders;
    }

    public void addEdge(int current, int dest) {

        if (!this.nodes.containsKey(current)){
            this.nodes.put(current, new Node(current));
        }
        if (!this.nodes.containsKey(dest)) {
            this.nodes.put(dest, new Node(dest));
        }

        if (!this.reverseNodes.containsKey(current)){
            this.reverseNodes.put(current, new Node(current));
        }
        if (!this.reverseNodes.containsKey(dest)) {
            this.reverseNodes.put(dest, new Node(dest));
        }

        this.nodes.get(current).add(this.nodes.get(dest));
        this.reverseNodes.get(dest).add(this.reverseNodes.get(current));
    }

    public void readTextFile(){
        Path path = Paths.get("./sccShortInput.txt");
        try (Stream<String> lines = Files.lines(path)) {
            lines.forEach((line) -> {
                System.out.println(line);
                String[] result = line.split(" ");
                int origin = Integer.parseInt(result[0]);
                int destination = Integer.parseInt(result[1]);
                this.addEdge(origin, destination);
            });
        } catch (IOException ex) {

            System.out.println("Error reading file"); 
            System.out.println(ex); 
        }
    }

    public void doDpsReverse(){
        this.reverseNodes.forEach((k, v) -> {
            visitNode(v);
        });
    }

    public void visitNode(Node node){
        if(this.reverseNodesVisited.get(node.n) != true){
            this.reverseNodesVisited.put(node.n, true);

            for (int i = 0; i < node.edges.size(); i++) {
                visitNode(node.edges.get(i));
            }
   
            this.order.add(node.n);
        }
    }

    public void doOrderedDps(){
        for(int i = this.order.size() - 1; i > 0; i--){
            Node node = this.nodes.get(order.get(i));
            int currentMark = markLeader(node, i + 1, 0);

            if (this.leaders.size() < 5) {
                leaders.add(currentMark);
                Collections.sort(this.leaders);
            } else if (this.leaders.get(0) < currentMark) {
                this.leaders.set(0,currentMark);
                Collections.sort(this.leaders);
            }

        }
    }

    public int markLeader(Node node, int leader, int count){
        int newCount = count;
        if(node.getVisited() != true){
            node.setVisited();
            for(Node n: node.edges){
                newCount = newCount + markLeader(n, leader, newCount);
            }

            newCount++;
        }

        return count;
    }
    
}

class FindScc {
    public static void main (String[] args){
        Graph graph = new Graph();
        graph.readTextFile();
        graph.doDpsReverse();
        graph.doOrderedDps();
        List<Integer> leaders = graph.getLeaders();
        System.out.print("getting leaders");
        
        for (int x : leaders) { 
            System.out.print(x); 
        } 

    }

}
