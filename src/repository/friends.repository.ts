import type { Friend } from "../models/friend.model.js";
import type { PageOptions } from "../core/pagination/pagination.types.js";
import { AppDBManager } from "../models/db-manager.js";

export class FriendsRepository {
  private static instance: FriendsRepository | null = null;
  private dbManager = AppDBManager.getInstance();

  private constructor() {}

  static getInstance() {
    if (!FriendsRepository.instance) {
      FriendsRepository.instance = new FriendsRepository();
    }
    return FriendsRepository.instance;
  }

  private get friends(): Friend[] {
    return this.dbManager.getDB().table("friends") as Friend[];
  }

  async addFriend(friend: Friend) {
    if (this.friends.find(f => f.id === friend.id)) {
      console.log('Friend already exists:', friend.id);
      return;
    }

    this.friends.push(friend);
    await this.dbManager.save();
    console.log('Friend added:', friend);
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

  getAllFriends(): Friend[] {
    return this.friends;
  }

  searchFriends(query: string, pageOptions?: PageOptions) {
    const lowerQuery = query.toLowerCase();

    const offset = pageOptions?.offset ?? 0;
    const limit = pageOptions?.limit ?? 10;

    const filtered = this.friends.filter(friend =>
      (friend.name?.toLowerCase().includes(lowerQuery) || false) ||
      (friend.email?.toLowerCase().includes(lowerQuery) || false) ||
      (friend.phone?.includes(lowerQuery) || false)
    );

    return {
      total: filtered.length,
      data: filtered.slice(offset, offset + limit),
    };
  }

  async updateFriend(id: string, updated: Partial<Friend>): Promise<boolean> {
    const index = this.friends.findIndex(f => f.id === id);
    if (index === -1) return false;

    this.friends[index] = {
      ...this.friends[index],
      ...updated,
    } as Friend;

    await this.dbManager.save();
    return true;
  }

  async deleteFriend(id: string): Promise<boolean> {
    const index = this.friends.findIndex(f => f.id === id);
    if (index === -1) return false;

    this.friends.splice(index, 1);
    await this.dbManager.save();
    return true;
  }
}