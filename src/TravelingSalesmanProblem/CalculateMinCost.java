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

    public static void main(String[] args) {
        Double[][] distance = DistanceMatrix.initDistanceMatrix();
        int n = distance.length - 1;
        int[] input = new int[n - 1];
        for (int i = 0; i < n - 1; i++) {
            input[i] = i + 2;
        }
        int size = (int) Math.pow(2, n + 1);
        Double[][] prevRow = new Double[n + 1][size + 1];

        for (int v : input) {
            //Index index = Index.createIndex(v, null);
            prevRow[v][1] = distance[1][v];
            prevRow[v][0] = distance[1][v];
            //minCostDP.put(index.getKey(), distance[1][v]);
        }

        for(int i = 1; i < n; i++) {
            prevRow[1][1<<i] = distance[1][i];
        }

        for (int r = 1; r < n - 1; r++) {
            List<Integer> sets = Permutations.getCombinations(input, input.length, r);
            System.out.println(r);
            Double[][] currentRow = new Double[n + 1][size + 1];

            for (int set : sets) {
                for (int currentVertex = 2; currentVertex <= n; currentVertex++) {
                    int num = set >> (currentVertex - 1);
                    if ((num & 1) == 1) {
                        continue;
                    }
                    //Index index = Index.createIndex(currentVertex, set);
                    Double minCost = INFINITY;
                    int pos = 1;
                    for (int i = 1; i <= set; i <<= 1) {
                        int bit = set & i;
                        if (bit == i) {
                            int prevVertex = pos;
                            int prevSet = set & ~i;
                            double cost = distance[prevVertex][currentVertex] + prevRow[prevVertex][prevSet];//+ getCost(set, prevVertex, minCostDP);
                            if (cost < minCost) {
                                minCost = cost;
                            }

                        }
                        pos++;
                    }
                    if (set == 0) {
                        minCost = distance[1][currentVertex];
                    }
                    currentRow[currentVertex][set] = minCost;

                    //minCostDP.put(index.getKey(), minCost);
                }
            }
            prevRow = currentRow.clone();
        }


        Double minCost = INFINITY;
        int set = Permutations.getCombinations(input, input.length, input.length).get(0);

        int v = 2;
        for (int k = 2; k <= set; k <<= 1) {
            int bit = set & k;
            if (bit == k) {
                int prevSet = set & ~k;
                Double cost = distance[v][1] + prevRow[v][prevSet];
                if (cost < minCost) {
                    minCost = cost;
                }
                v++;
            }
        }
        System.out.println(minCost.toString());
    }
}
