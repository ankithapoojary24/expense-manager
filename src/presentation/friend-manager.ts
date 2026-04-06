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
    const showFriendForm = () => {
        const friendFormData = {
            name : '',
            email: '',
            phone: ''
        };

        return {
            async getValues(){
                try{
                    if (friendFormData.name === ''){
                        friendFormData.name = await ask('Enter friend name:') || '';
                    }
                    if (friendFormData.email === ''){
                        friendFormData.email = await ask('Enter friend email:') || '';
                    }
                    if (friendFormData.phone === ''){
                        friendFormData.phone = await ask('Enter friend phone:') || '';
                    }
                    const {name, email, phone} = friendFormData;
                    friendsController.addFriend({
                        id: Date.now().toString(),
                        name,
                        email,
                        phone,
                        balance: 0, 
                    });

                }
                catch(error:unknown){
                    if (error instanceof ConflictError) {
                        console.log(error.message);
                        for(let key of error.conflictProperty){
                            friendFormData[key as keyof typeof friendFormData] = '';
                        }
                        await this.getValues();
                    }
                }
            },
        };
    };
    const form = showFriendForm();
    await form.getValues();   
};

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

