import {createElement} from 'lwc';
import myFirstComponent from 'c/myFirstComponent';
import getAccounts from '@salesforce/apex/MyFirstController.getAccounts';
import getCases from '@salesforce/apex/MyFirstController.getCases';
import { CurrentPageReference } from 'lightning/navigation';
import {setImmediate} from 'timers';

const mockAccounts = require('./mockData/accounts.json');
const mockPageData = require('./mockData/currentPageRef.json');
const mockCases = require('./mockData/cases.json');

jest.mock('@salesforce/apex/MyFirstController.getCases', ()=>({
    default: jest.fn()
}), {virtual: true});

jest.mock('@salesforce/apex/MyFirstController.getAccounts', ()=>{
    const {createApexTestWireAdapter} = require('@salesforce/sfdx-lwc-jest');
    return {
        default: createApexTestWireAdapter(jest.fn)
    }
}, {virtual: true});

describe('Demo testing suite', ()=>{
    beforeEach(()=>{
        getCases.mockResolvedValue(mockCases);
        const myFirstElement = createElement('c-my-first-component', {
            is:myFirstComponent
        });
        document.body.appendChild(myFirstElement);
    });

    afterEach(()=>{
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    test('child component test data',()=>{
        const myFirstElement = document.querySelector('c-my-first-component');
        const childComponent = myFirstElement.shadowRoot.querySelector('c-my-child-component');
        const caseArray = Array.from(childComponent.shadowRoot.querySelectorAll('.case-info'));
        const caseNameArray = caseArray.map(div=>div.textContent);
        expect(caseNameArray.length).toBe(5);
        expect(caseNameArray).toEqual(mockCases.map(mockCase=>mockCase.Subject));
    });

    test('Apex method call', ()=>{
        const myFirstElement = document.querySelector('c-my-first-component');
        const caseArray = Array.from(myFirstElement.shadowRoot.querySelectorAll('.case-info'));
        const caseNameArray = caseArray.map(div=>div.textContent);
        expect(caseNameArray.length).toBe(5);
        expect(caseNameArray).toEqual(mockCases.map(mockCase=>mockCase.Subject));
    });

    test('currect page wire', ()=>{
        const myFirstElement = document.querySelector('c-my-first-component');
        const currentPageDiv = myFirstElement.shadowRoot.querySelector('.navigation');
        expect(currentPageDiv.textContent).toEqual("");
        CurrentPageReference.emit(mockPageData);

        return new Promise(setImmediate).then(()=>{
            const currentPageDiv = myFirstElement.shadowRoot.querySelector('.navigation');
            expect(currentPageDiv.textContent).not.toBeNull();
        });
    });

    test('wire apex method test', ()=>{
        const myFirstElement = document.querySelector('c-my-first-component');
        getAccounts.emit(mockAccounts);

        return new Promise(setImmediate).then(()=>{
            const accountArray = Array.from(myFirstElement.shadowRoot.querySelectorAll('.account-info'));
            const accountNameArray = accountArray.map(div=>div.textContent);
            expect(accountArray.length).toBe(5);
            expect(accountNameArray).toEqual(mockAccounts.map(mockAcct=>mockAcct.Name));
        });
    });

    test('Check iterator values', ()=>{
        const myFirstElement = document.querySelector('c-my-first-component');
        const pesonInforElements = myFirstElement.shadowRoot.querySelectorAll('.person-info');
        const pesronElements = Array.from(pesonInforElements);
        const pesronElementTextComntents = pesronElements.map(p=>p.textContent);
        expect(pesronElementTextComntents.length).toBe(3);
        expect(pesronElementTextComntents).toEqual(["Sandip", "Archit", "Swagata"]);
    });

    test('On click new paragraph shown', ()=>{
        const myFirstElement = document.querySelector('c-my-first-component');
        const newParagraph = myFirstElement.shadowRoot.querySelector('.newParagraph');
        expect(newParagraph).toBeNull();

        const buttonElement = myFirstElement.shadowRoot.querySelector('.renderButton');
        buttonElement.dispatchEvent(new CustomEvent('click'))
        return Promise.resolve().then(()=>{
            const newParagraph = myFirstElement.shadowRoot.querySelector('.newParagraph');
            expect(newParagraph.textContent).toBe('I love to learn Salesforce')
        });
    });

    test('paragraph bind variable', ()=>{
        const myFirstElement = document.querySelector('c-my-first-component');
        const paragraphText = myFirstElement.shadowRoot.querySelector('p');
        expect(paragraphText.textContent).toBe('Salesforce is existing 10');
    });
});