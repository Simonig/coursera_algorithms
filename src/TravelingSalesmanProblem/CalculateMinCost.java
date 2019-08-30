package TravelingSalesmanProblem;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
        String hashCode = "0";
        if (vertexSet != null) {
            Integer[] vertexArr = vertexSet.toArray(new Integer[vertexSet.size()]);
            Arrays.sort(vertexArr);
            hashCode = Arrays.toString(vertexArr);
        }

        int vertexHash = 31 * currentVertex;
        String result = vertexHash + hashCode;
        return result.hashCode();
    }

    public String getKey() {
        String hashCode = "_0";
        if (vertexSet != null) {
            Integer[] vertexArr = vertexSet.toArray(new Integer[vertexSet.size()]);
            Arrays.sort(vertexArr);
            hashCode = Arrays.toString(vertexArr);
        }

        return currentVertex + "_" + hashCode;
    }

    public static Index createIndex(int vertex, Set<Integer> vertexSet) {
        Index i = new Index();
        i.currentVertex = vertex;
        i.vertexSet = vertexSet;
        if (i.vertexSet != null && vertexSet.size() == 0) {
            i.vertexSet = null;
        }
        return i;
    }
}


public class CalculateMinCost {
    private static Double INFINITY = 1000000000.0;

    private static Double getCost(Set<Integer> set, int prevVertex, Map<String, Double> minCostDp) {
        Set<Integer> copySet = new HashSet<>();
        copySet.addAll(set);
        copySet.remove(prevVertex);
        if (copySet.size() == 0) {
            copySet = null;
        }
        Index index = Index.createIndex(prevVertex, copySet);

        Double cost = minCostDp.containsKey(index.getKey()) ? minCostDp.get(index.getKey()) : INFINITY;
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

        Map<String, Double> minCostDP = new HashMap<>();
        for (int v : input) {
            Index index = Index.createIndex(v, null);
            minCostDP.put(index.getKey(), distance[1][v]);
        }

        for (int r = 0; r < n; r++) {
            List<Set<Integer>> sets = Permutations.getCombinations(input, input.length, r);
            System.out.println(r);

            for (Set<Integer> set : sets) {

                for (int currentVertex = 2; currentVertex <= n; currentVertex++) {
                    if (set.contains(currentVertex)) {
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

                    minCostDP.put(index.getKey(), minCost);
                }
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
        System.out.println(minCost.toString());
    }
}
