import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repository/friends.repository.js";
import { ConflictError } from "../core/errors/conflict.error.js";

export class FriendsController {
  private repository: FriendsRepository;

  constructor() {
    this.repository = FriendsRepository.getInstance();
  }

  checkEmailExists(email: string) {
    return this.repository.findFriendByEmail(email) !== undefined;
  }

  checkPhoneExists(phone: string) {
    return this.repository.findFriendByPhone(phone) !== undefined;
  }

  getFriendById(id: string) {
    return this.repository.findFriendById(id);
  }

addFriend(friend: Friend) {
    const conflicts: string[] = [];

    if (this.getFriendById(friend.id)) conflicts.push("id");
    if (this.checkEmailExists(friend.email)) conflicts.push("email");
    if (this.checkPhoneExists(friend.phone)) conflicts.push("phone");

    if (conflicts.length > 0) {
        throw new ConflictError("Friend has existing fields", conflicts);
    }

    this.repository.addFriend(friend);
}

  searchFriend(query: string) {
    return this.repository.searchFriends(query);
  }

  removeFriend(query: string): Friend[] {
    return this.repository.removeFriends(query);
  }
}