
    public class NewThread extends Thread{
    public NewThread(String n)
       {
        super(n);
        }
        public void run(){
            int a=10,b=20;
            int sum=a+b;
            System.out.println("sum="+sum);
        }
        public static void main(String[]args){
            NewThread t1=new NewThread("Sum Thread");
            System.out.println("thread name is:"+t1.getName());
            System.out.println("thread ID is:"+t1.getId());
            System.out.println("thread priority is:"+t1.getPriority());
            t1.start();
        }
}

