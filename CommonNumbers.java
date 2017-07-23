/**
 *
 * @author Kelechi 
 */

import java.util.*;

// Compares two strings and outputs a string made up of common characters in the input strings
public class CommonNumbers {
    public static void main(String[] args){
        //Sample input
        final String input1 = "2,5,5,5,6";
        final String input2 = "2,2,3,5,6,7";
       
        //Separate strings and add to an Arraylist
        StringTokenizer tokens1 = new StringTokenizer(input1, ",");
        StringTokenizer tokens2 = new StringTokenizer(input2, ",");
        ArrayList<String> string1 = new ArrayList<>();
        ArrayList<String> string2 = new ArrayList<>();
        HashSet<String> set = new HashSet<>();
        
        while(tokens1.hasMoreElements()){
            String token = tokens1.nextToken();
            string1.add(token);
        }
        
        while(tokens2.hasMoreElements()){
            String token = tokens2.nextToken();
            string2.add(token);
        }
        
        // Compare the Arraylists for common numbers and add to a Hashset to prevent duplicates
        if (string2.size() > string1.size()){
            for (int i = 0; i < string2.size(); i++){
                if (string1.contains(string2.get(i))){
                    set.add(string2.get(i));
                }
            }
        }else{
            for (int i = 0; i < string1.size(); i++){
                if (string2.contains(string1.get(i))){
                    set.add(string1.get(i));
                }
            }
        }
        // Output common numbers
        System.out.println(set.toString());
    }
}
