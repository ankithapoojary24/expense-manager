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
    if (this.getFriendById(friend.id)) {
      throw new ConflictError("Friend with this ID already exists", "id");
    }

    if (this.checkEmailExists(friend.email)) {
      throw new ConflictError("Email already exists", "email");
    }

    if (this.checkPhoneExists(friend.phone)) {
      throw new ConflictError("Phone already exists", "phone");
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