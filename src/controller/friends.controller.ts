import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repository/friends.repository.js";

export class FriendsController {
    checkEmailExists(email: string){
        return false;
    }
    checkPhoneExists(phone: string){
        return false;
    }
    addFriend(friend:Friend){
        if(!FriendsRepository.getInstance()){
            return {success:false}
        }
        console.log('Adding friend to database...',friend)
        FriendsRepository.getInstance().addFriend(friend);
    }
    searchFriend(query: string) {
    if (!FriendsRepository.getInstance()) {
        return [];
    }
    console.log('Searching friends for query:', query);
    return FriendsRepository.getInstance().searchFriends(query);
    }
    removeFriend(query: string): Friend[] {
    const repo = FriendsRepository.getInstance();
    if (!repo) return [];
    return repo.removeFriends(query); 
}
}