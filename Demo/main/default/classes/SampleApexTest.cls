@isTest
public class SampleApexTest {

    @isTest 
    static void textGetMessage(){
        String message = sampleApex.getMessage('Sandip dear');

        System.assertEquals('Hello dear Sandip', message, 'getMessage method failed');
    }
}