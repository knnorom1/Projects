/**
 *
 * @author Kelechi 
 */

// Count alphabets present in a string and outputs the count for each alphabet
public class CountAlphabets {
    public static void main(String[] args){
        final String input = "aaaabbbbbccccddffeeaa";
        int counter = 1; 
        StringBuffer sb = new StringBuffer();
        
        for (int i = 0; i < input.length(); i++){
            // At the last alphabet, get count and break out of the loop.
            if (input.length() == i + 1){
                sb.append(input.charAt(i)).append(counter);
                break;
            }
            // Add 1 to count if the next alphabet is the same as current one
            if ((input.charAt(i)) == (input.charAt(i+1))){
                counter++;
            }else{
                sb.append(input.charAt(i)).append(counter);
                counter = 1;
            }
        }
        System.out.println("Alphabet Count is: " + sb);
    }  
}
