/**
 *
 * @author Kelechi 
 */
public class Numbers {
    // Returns all prime numbers in a given range
    public static void main(String[]args){
        getPrimes(1,100);
    }
    
    public static void getPrimes(int x, int y){
        for (int i = x; i <= y; i++){
            boolean isPrime = true;
            for (int j = 2; j< i; j++){
                if (i%j == 0){
                    isPrime = false;
                }
            }
           if (isPrime){
               System.out.print(i+ " ");
           }
        }
    }
}
