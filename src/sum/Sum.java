package sum;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

public class Sum {
    private Map<Long, Integer> numbers = new HashMap();

    private void addNumber(long num){
        if(!this.numbers.containsKey(num)) {
            this.numbers.put(num, 0);
        }
        this.numbers.put(num, this.numbers.get(num) + 1);
    }

    private void readTextFile(){
        Path path = Paths.get("./input.txt");
        try (Stream<String> lines = Files.lines(path)) {
            lines.forEach((line) -> {
                System.out.println(line);
                this.addNumber(Long.parseLong(line));
            });
        } catch (IOException ex) {

            System.out.println("Error reading file");
            System.out.println(ex);
        }
    }

    private boolean calculateSum(int target){
        for (Map.Entry<Long, Integer> item : this.numbers.entrySet()) {
            if(this.numbers.containsKey(target - item.getKey())){
                if(item.getKey() == target - item.getKey()){
                    if(item.getValue() > 1){
                        return true;
                    }
                } else return true;
            }
        }
        return false;
    }

    public static void main(String[] args){
        Sum sum = new Sum();
        sum.readTextFile();
        int result = 0;
        for(int i = -10000; i <= 10000; i++){
            if(sum.calculateSum(i)){
                result++;
            }
        }
        System.out.print(result);
    }
}


