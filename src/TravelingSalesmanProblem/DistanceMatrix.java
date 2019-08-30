package TravelingSalesmanProblem;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

class DistanceMatrix {
    public static Double[][] initDistanceMatrix(){
        Path path = Paths.get("./src/TravelingSalesmanProblem/tsp.txt");
        List<Point> points = new ArrayList<Point>();


        try (Stream<String> lines = Files.lines(path)) {
            lines.forEach((line) -> {
                System.out.println(line);
                String[] coords = line.split(" ");
                if(points.size() == 0) {
                    points.add(null);
                } else {
                    Point p = new Point(Double.parseDouble(coords[0]), Double.parseDouble(coords[1]));
                    points.add(p);
                }
            });
        } catch (IOException ex) {

            System.out.println("Error reading file");
            System.out.println(ex);
        }
        Set<Integer> set = new HashSet<>();
        for(int i=1; i < points.size(); i++) {
            set.add(i);
        }
        int total = points.size() - 1;

        Double[][] distance = new Double[total + 1][total + 1];

        for(int i=1; i <= total; i++) {
            for(int d=1; d <= total; d++) {
                if(d == i){
                    distance[i][d] = 0.0;
                } else {
                    distance[i][d] = points.get(i).getDistance(points.get(d));
                }
            }
        }
        return distance;
    }
}
