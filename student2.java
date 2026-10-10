import java.util.Scanner;
public class student2 {
    public static void main(String[]args)
    {
        Scanner sc= new Scanner(System.in);
        System.out.print("Enter student name: ");
        String name = sc.nextLine();
        System.out.print("Enter student age: ");
        int age = sc.nextInt();
        System.out.println("Student Name: " + name);
        System.out.println("Student Age: " + age);
    }

}
