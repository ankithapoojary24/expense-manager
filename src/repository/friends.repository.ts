import type { Friend } from "../models/friend.model.js";

interface PageOptions {
    offset?: number;
    limit?: number;
}

export class FriendsRepository {
    private static instance: FriendsRepository;
    private friends: Friend[] = [];
    static getInstance() {
        if (!FriendsRepository.instance) {
            FriendsRepository.instance = new FriendsRepository();
        }
        return FriendsRepository.instance;
    }
    private constructor() {};
    
    addFriend(friend: Friend) {
        this.friends.push(friend);
        console.log('Friend added to repository', friend);
    }
    findFriendByEmail(email: string) {
        return this.friends.find(friend => friend.email === email);
    }
    findFriendByPhone(phone: string) {
        return this.friends.find(friend => friend.phone === phone);
    }
    searchFriends(query: string,pageOptions?: PageOptions) {
        const lowerQuery = query.toLowerCase();
        return this.friends.filter(friend => 
            friend.name.toLowerCase().includes(lowerQuery) ||
            friend.email.toLowerCase().includes(lowerQuery) ||
            friend.phone.toLowerCase().includes(lowerQuery)
        ).slice((pageOptions?.offset || 0), (pageOptions?.offset || 0) + (pageOptions?.limit || 10));
    }
    removeFriends(query: string): Friend[] {
    const repo = FriendsRepository.getInstance();
    if (!repo) return [];
    const matches = this.searchFriends(query, { offset: 0, limit: this.friends.length });
    if (matches.length === 0) return [];
    this.friends = this.friends.filter(f => !matches.includes(f));
    console.log('Removed friends matching query:', query);
    return matches;
    }
}
