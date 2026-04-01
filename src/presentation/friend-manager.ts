import numberValidator = require('../core/validators/number.validator');
import type {Choice} from './interraction-manager';
import type {openInterractionManager} from './interraction-manager';

const options : Choice[] = [
    { label: 'Add Friend', value: '1' },
    { label: 'Search Friend', value: '2' },
    { label: 'Update Friend', value: '3' },
    { label: 'Remove Friend', value: '4' },
    { label: 'Exit', value: '5' },
]

const {ask, choose, close} = openInterractionManager();

const addFriend = async () => {
    const name = await ask('Enter friend name:');
    const email = await ask('Enter friend email:');
    const phone = await ask('Enter friend phone:');
    const openingBalance = await ask('Enter opening balance(positive for amount you are owed, negative for amount you owe):', { defaultAnswer: '0',
        validator: numberValidator
    });
    const friend = {
        id: Date.now().toString(),
        name: name!,
        email: email!,
        phone: phone!,
        balance: Number(openingBalance)
    };
    console.log(`Friend added: ${name}, ${email}, ${phone}`);
}

export const manageFriends = async () => {
    while(true){
        const choice = await choose('What do you want to do?', options,false);
        // if(!choice){
        //     console.log('Invalid choice. Please try again.');
        //     continue;
        // }
        switch(choice!.value){
            case '1':
                console.log('Adding friend...');    
                break;
            case '2':
                console.log('Searching friend...');                 
                break;
            case '3':
                console.log('Updating friend...');
                break;
            case '4':
                console.log('Removing friend...');
                break;  
            case '5':
                console.log('Exiting...');
                close();
                return;
        }
    }
}
run();
