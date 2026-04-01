class FriendsRepository {
    static instance;
    friends = [];
    static getInstance() {
        if (!FriendsRepository.instance) {
            FriendsRepository.instance = new FriendsRepository();
        }
        return FriendsRepository.instance;
    }
    constructor() { }
    ;
    addFriend(friend) {
        this.friends.push(friend);
        console.log('Friend added to repository', friend);
    }
    findFriendByEmail(email) {
        return this.friends.find(friend => friend.email === email);
    }
    findFriendByPhone(phone) {
        return this.friends.find(friend => friend.phone === phone);
    }
    searchFriends(query, pageOptions) {
        const lowerQuery = query.toLowerCase();
        return this.friends.filter(friend => friend.name.toLowerCase().includes(lowerQuery) ||
            friend.email.toLowerCase().includes(lowerQuery) ||
            friend.phone.toLowerCase().includes(lowerQuery)).slice((pageOptions?.offset || 0), (pageOptions?.offset || 0) + (pageOptions?.limit || 10));
    }
}
export {};
//# sourceMappingURL=friends.repository.js.map