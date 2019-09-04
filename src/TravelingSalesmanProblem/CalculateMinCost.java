package TravelingSalesmanProblem;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

class PairInteger{
    private int first;
    private int second;

    public PairInteger(int first, int second) {
        this.first = first;
        this.second = second;
    }

    @Override
    public int hashCode() {
        return 31 * first + second;
    }

    @Override
    public boolean equals(Object other) {
        if (other instanceof PairInteger) {
            PairInteger otherPair = (PairInteger) other;
            return this.first == otherPair.first && this.second == otherPair.second;
        }
        return false;
    }

    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

public class CalculateMinCost {
    private static Double INFINITY = 1000000000.0;

    public static int intPow(int a, int b) {
        int res = 1;
        while (b > 0) {
            if ((b & 1) == 1) {
                res *= a;
            }
            b >>= 1;
            a *= a;
        }
        return res;
    }

    public static int getEntriesNum(int cities) {
        return cities * intPow(2, (cities - 1));
    }

    public static void main(String[] args) {
        Double[][] distance = DistanceMatrix.initDistanceMatrix();
        int n = distance.length - 1;
        int[] input = new int[n - 1];
        for (int i = 0; i < n - 1; i++) {
            input[i] = i + 2;
        }
        int size = (int) Math.pow(2, n);
        Map<PairInteger, Double> prev_row = new HashMap<>(getEntriesNum(n - 1) + 1);

        for (int v : input) {
            //Index index = Index.createIndex(v, null);

            prev_row.put(new PairInteger(v, 1), distance[1][v]);
            prev_row.put(new PairInteger(v, 0), distance[1][v]);
            //minCostDP.put(index.getKey(), distance[1][v]);
        }


        for (int r = 1; r < n - 1; r++) {
            List<Integer> sets = Permutations.getCombinations(input, input.length, r);
            System.out.println(r);
            System.out.println(sets.size());
            Map<PairInteger, Double> current_row = new HashMap<>(getEntriesNum(n - 1) + 1);


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
                            double cost = distance[prevVertex][currentVertex] + prev_row.get(new PairInteger(prevVertex, prevSet));//+ getCost(set, prevVertex, minCostDP);
                            if (cost < minCost) {
                                minCost = cost;
                            }

                        }
                        pos++;
                    }
                    if (set == 0) {
                        minCost = distance[1][currentVertex];
                    }
                    current_row.put(new PairInteger(currentVertex, set), minCost);

                    //minCostDP.put(index.getKey(), minCost);
                }
            }
            prev_row = current_row;
        }


        Double minCost = INFINITY;
        int set = Permutations.getCombinations(input, input.length, input.length).get(0);

        int v = 2;
        for (int k = 2; k <= set; k <<= 1) {
            int bit = set & k;
            if (bit == k) {
                int prevSet = set & ~k;
                Double cost = distance[v][1] + prev_row.get(new PairInteger(v, prevSet));
                if (cost < minCost) {
                    minCost = cost;
                }
                v++;
            }
        }
        System.out.println(minCost.toString());
    }
}
