import { numberValidator } from '../core/validators/number.validator.js';
import type {Choice} from './interaction-manager.js';
import {openInterractionManager} from './interaction-manager.js';
import {Friend} from '../models/friend.model.js';
import {FriendsController} from '../controller/friends.controller.js';
import { ConflictError } from '../core/errors/conflict.error.js';

const options : Choice[] = [
    { label: 'Add Friend', value: '1' },
    { label: 'Search Friend', value: '2' },
    { label: 'Update Friend', value: '3' },
    { label: 'Remove Friend', value: '4' },
    { label: 'Exit', value: '5' },
]

const {ask, choose, close} = openInterractionManager();

const friendsController = new FriendsController();

const addFriend = async () => {
    const name = await ask('Enter friend name:');
    const email = await ask('Enter friend email:');
    const phone = await ask('Enter friend phone:');
    const address = await ask('Enter friend address:');
    const openingBalance = await ask(
        'Enter opening balance (positive for amount you are owed, negative for amount you owe):', 
        { defaultAnswer: '0', validator: numberValidator }
    );
    if (friendsController.checkemailExists(email!)) {
        console.log(`Email ${email} already exists.`);
        return;
    }
    if (friendsController.checkPhoneExists(phone!)) {
        console.log(`Phone ${phone} already exists.`);
        return;
    }

    const friend: Friend = {
        id: Date.now().toString(),
        name: name!,
        email: email!,
        phone: phone!,
        address: address!,
        balance: Number(openingBalance)
    };
    try {
        await friendsController.addFriend(friend);
        console.log(`Friend added: ${name}, ${email}, ${phone}`);
    } catch (error) {
        if (error instanceof ConflictError) {
            console.log(`Conflict: ${error.message}`);
        } else {
            console.error('An unexpected error occurred.');
        }
    }
}

const searchFriend = async () => {
    const query = await ask('Enter name to search:');
    const results: Friend[] = friendsController.searchFriend(query!);
    if (results.length === 0) {
        console.log('No friends found.');
        return;
    }
    console.log('Found friends:');
    results.forEach(f => {
        console.log(`${f.name} | ${f.email} | ${f.phone} | Balance: ${f.balance}`);
    });
}

const removeFriend = async () => {
    const query = await ask('Enter name to remove:');
    const removed = friendsController.removeFriend(query!);
    if (!removed || removed.length === 0) {
        console.log('No matching friends found to remove.');
        return;
    }
    console.log('Removed friends:');
    removed.forEach(f => {
        console.log(`${f.name} | ${f.email} | ${f.phone} | Balance: ${f.balance}`);
    });
}

export const manageFriends = async () => {
    while(true){
        const choice = await choose('What do you want to do?', options,false);
        switch(choice!.value){
            case '1':
                console.log('Adding friend...');
                await addFriend();    
                break;
            case '2':
                console.log('Searching friend...');   
                await searchFriend();              
                break;
            case '3':
                console.log('Updating friend...');
                break;
            case '4':
                console.log('Removing friend...');
                await removeFriend();
                break;  
            case '5':
                console.log('Exiting...');
                close();
                return;
        }
    }
} 

