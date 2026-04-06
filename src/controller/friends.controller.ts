import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repository/friends.repository.js";
import { ConflictError } from "../core/errors/conflict.error.js";
//need abstract class that does most of the things in nature,dont come up with heirarchy
export class FriendsController {
    private repository: FriendsRepository;
    constructor() {
        this.repository = FriendsRepository.getInstance();
    }
    checkemailExists(email: string){
        return this.repository.findFriendByEmail(email) !== undefined;
    }
    checkPhoneExists(phone: string){
        return this.repository.findFriendByPhone(phone) !== undefined;
    }
    getFriendbyId(id: string){
        return this.repository.findFriendById(id);
    }
    addFriend(friend: Friend) {
        if (this.getFriendbyId(friend.id)) {
            throw new ConflictError("Friend with this ID already exists", "id");
        }

        console.log('Adding friend to database...', friend);
        this.repository.addFriend(friend);
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