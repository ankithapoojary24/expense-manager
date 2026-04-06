import type { Friend } from "../models/friend.model.js";
import { AppDBManager } from "../models/db-manager.js";

interface PageOptions {
  offset?: number;
  limit?: number;
}

export class FriendsRepository {
  private static instance: FriendsRepository;
  private friends: Friend[] = [];
  private dbManager = AppDBManager.getInstance();

  static getInstance() {
    if (!FriendsRepository.instance) {
      FriendsRepository.instance = new FriendsRepository();
    }
    return FriendsRepository.instance;
  }

  private constructor() {
    const db = this.dbManager.getDB();
    this.friends = db.table("friends") as Friend[];
  }

  addFriend(friend: Friend) {
    this.friends.push(friend);
    this.dbManager.save();
    console.log('Friend added to repository', friend);
  }

  findFriendByEmail(email: string) {
    return this.friends.find(friend => friend.email === email);
  }

  findFriendByPhone(phone: string) {
    return this.friends.find(friend => friend.phone === phone);
  }

  findFriendById(id: string) {
    return this.friends.find(friend => friend.id === id);
  }

  searchFriends(query: string, pageOptions?: PageOptions) {
    const lowerQuery = query.toLowerCase();
    return this.friends
      .filter(friend =>
        friend.name.toLowerCase().includes(lowerQuery) ||
        friend.email.toLowerCase().includes(lowerQuery) ||
        friend.phone.toLowerCase().includes(lowerQuery)
      )
      .slice(
        pageOptions?.offset || 0,
        (pageOptions?.offset || 0) + (pageOptions?.limit || 10)
      );
  }

  removeFriends(query: string): Friend[] {
    const matches = this.searchFriends(query, { offset: 0, limit: this.friends.length });
    if (matches.length === 0) return [];
    this.friends = this.friends.filter(f => !matches.includes(f));
    const db = this.dbManager.getDB();
    const table = db.table("friends") as Friend[];
    table.length = 0;
    table.push(...this.friends);
    this.dbManager.save();
    console.log('Removed friends matching query:', query);
    return matches;
  }
}