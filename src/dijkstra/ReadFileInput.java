package dijkstra;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

public class ReadFileInput {
    public void readFile(String filename, LineHandlerInt lineHandler){
        Path path = Paths.get(filename);
        try (Stream<String> lines = Files.lines(path)) {
            lines.forEach(line -> lineHandler.handleLine(line));
        } catch (IOException ex) {
            System.out.println("Error reading file");
            System.out.println(ex);
        }
    }
}
