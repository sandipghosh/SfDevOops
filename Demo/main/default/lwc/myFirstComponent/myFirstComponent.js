import { LightningElement, wire } from 'lwc';
import getAcconts from '@salesforce/apex/MyFirstController.getAccounts';
import getCases from '@salesforce/apex/MyFirstController.getCases';
import { CurrentPageReference } from 'lightning/navigation';

export default class MyFirstComponent extends LightningElement {
    myNote = 'Salesforce is existing';

    @wire(CurrentPageReference)
    currentPage;

    @wire(getAcconts) 
    accounts;

    cases;
    error;

    
    showNewParagraph = false;
    collections = [
        {id:1, firstName: "Sandip", lastName: "Ghosh"},
        {id:2, firstName: "Archit", lastName: "Das"},
        {id:3, firstName: "Swagata", lastName: "Sen"},
    ];

    renderNewParagraph(){
        this.showNewParagraph = true;
    }

    getCaseData(){
        getCases()
            .then(response=>{
                this.cases = response;
            })
            .catch(error=>{
                this.error = error;
            });
    }

    connectedCallback(){
        this.getCaseData();
    }
}