package TravelingSalesmanProblem;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Permutations {

    static void combinationUtil(int arr[], int n, int r,
                                int index, int data[], int i, List<int[]> result) {
        if (index == r) {
            int[] set = new int[r];
            for (int j = 0; j < r; j++) {
                set[j] = data[j];
            }
            result.add(set);
            return;
        }

        if (i >= n)
            return;

        data[index] = arr[i];
        combinationUtil(arr, n, r, index + 1,
                data, i + 1, result);

        combinationUtil(arr, n, r, index, data, i + 1, result);
    }

    static List<Set<Integer>> getCombinations(int arr[], int n, int r) {
        // A temporary array to store all combination
        // one by one
        int data[] = new int[r];
        List<int[]> result = new ArrayList<>();
        combinationUtil(arr, n, r, 0, data, 0, result);
        List<Set<Integer>> setList = new ArrayList<>();
        result.forEach(x -> {
                    Set<Integer> set = new HashSet<>();
                    for (int num : x) {
                        set.add(num);
                    }
                    setList.add(set);
                }
        );
        return setList;
    }

    private static class SetSizeComparator implements Comparator<Set<Integer>> {
        @Override
        public int compare(Set<Integer> o1, Set<Integer> o2) {
            return o1.size() - o2.size();
        }
    }


    static public List<Set<Integer>> generateCombination(int n) {
        int input[] = new int[n];
        for (int i = 0; i < input.length; i++) {
            input[i] = i + 1;
        }
        List<Set<Integer>> allSets = new ArrayList<>();
        int result[] = new int[input.length];
        Permutations.generateCombination(input, 0, 0, allSets, result);
        Collections.sort(allSets, new SetSizeComparator());
        return allSets;
    }


    private static void generateCombination(int input[], int start, int pos, List<Set<Integer>> allSets, int result[]) {
        if (pos == input.length) {
            return;
        }
        Set<Integer> set = createSet(result, pos);
        allSets.add(set);
        for (int i = start; i < input.length; i++) {
            result[pos] = input[i];
            generateCombination(input, i + 1, pos + 1, allSets, result);
        }
    }

    private static Set<Integer> createSet(int input[], int pos) {
        if (pos == 0) {
            return new HashSet<>();
        }
        Set<Integer> set = new HashSet<>();
        for (int i = 0; i < pos; i++) {
            set.add(input[i]);
        }
        return set;
    }

    public static void main(String[] args) {
        int arr[] = {10, 20, 30, 40, 50};
        int r = 3;

    }
}

