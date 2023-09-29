@isTest
public class SampleApexTest {

    @isTest 
    static void textGetMessage(){
        String message = sampleApex.getMessage('Sandip dear');
        //Test 18
        System.assertEquals('Hello dear Sandip', message, 'getMessage method failed');
    }
}