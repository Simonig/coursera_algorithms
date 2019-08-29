package TravelingSalesmanProblem;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringJoiner;

class Point {
    private double x;
    private double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    double getX() {
        return this.x;
    }

    double getY() {
        return this.y;
    }

    public double getDistance(Point destination) {
        return Math.sqrt(Math.pow(this.x - destination.getX(), 2) + Math.pow(this.y - destination.getY(), 2));
    }
}


class Index {
    int currentVertex;
    Set<Integer> vertexSet;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Index index = (Index) o;

        if (currentVertex != index.currentVertex) return false;
        return vertexSet == null ? index.vertexSet == null : vertexSet.equals(index.vertexSet);
    }

    @Override
    public int hashCode() {
        int result = currentVertex;
        result = 31 * result + (vertexSet != null ? vertexSet.hashCode() : 0);
        return result;
    }

    public static Index createIndex(int vertex, Set<Integer> vertexSet) {
        Index i = new Index();
        i.currentVertex = vertex;
        i.vertexSet = vertexSet;
        if(i.vertexSet != null && vertexSet.size() == 0){
            i.vertexSet = null;
        }
        return i;
    }
}


public class CalculateMinCost {
    private static Double INFINITY = 1000000000.0;

    private static Double getCost(Set<Integer> set, int prevVertex, Map<Index, Double> minCostDp) {
        Set<Integer> copySet = new HashSet<>();
        copySet.addAll(set);
        copySet.remove(prevVertex);
        if (copySet.size() == 0) {
            copySet = null;
        }
        Index index = Index.createIndex(prevVertex, copySet);
        if(minCostDp.size() == 16 && prevVertex == 1){
            minCostDp.get(index);
            minCostDp.get(index);
        }
        Double cost = minCostDp.get(index);
        if (copySet != null) {
            copySet.add(prevVertex);
        }
        return cost;
    }

    public static void main(String[] args) {
        Double[][] distance = DistanceMatrix.initDistanceMatrix();
        int n = distance.length - 1;
        int[] input = new int[n];
        for (int i = 0; i < n; i++) {
            input[i] = i + 1;
        }

        Map<Index, Double> minCostDP = new HashMap<>();
        for (int v : input) {
            Index index = Index.createIndex(v, null);
            Index index2 = Index.createIndex(v, null);
            index.equals(index2);
            minCostDP.put(index, distance[1][v]);
        }

        List<Set<Integer>> sets = Permutations.generateCombination(distance.length - 1);

        for (Set<Integer> set : sets) {
            for (int currentVertex = 2; currentVertex <= n; currentVertex++) {
                if (Arrays.asList(set).contains(currentVertex)) {
                    continue;
                }
                Index index = Index.createIndex(currentVertex, set);
                Double minCost = INFINITY;
                for (int prevVertex : set) {
                    double cost = distance[prevVertex][currentVertex] + getCost(set, prevVertex, minCostDP);
                    if (cost < minCost) {
                        minCost = cost;
                    }
                }
                if (set.size() == 0) {
                    minCost = distance[1][currentVertex];
                }

                minCostDP.put(index, minCost);
            }
        }


        Double minCost = INFINITY;
        Set<Integer> set = new HashSet<>();
        for (int i = 1; i < input.length; i++) {
            set.add(i);
        }
        for (int k = 2; k <= input.length; k++) {
            Double cost = distance[k][1] + getCost(set, k, minCostDP);
            if (cost < minCost) {
                minCost = cost;
            }
        }
        System.out.println(minCost);
    }
}
