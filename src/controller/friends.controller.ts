import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repository/friends.repository.js";
import { ConflictError } from "../core/errors/conflict.error.js";

import type { PageOptions } from "../core/pagination/pagination.types.js";
import type { ReturnModel } from "../core/pagination/return-type.js";

export class FriendsController {
  private repository: FriendsRepository;

  constructor() {
    this.repository = FriendsRepository.getInstance();
  }

  private normalizeEmail(email: string) {
    if (!email) return "";
    return email.trim().toLowerCase();
  }

  private normalizePhone(phone: string) {
    if (!phone) return ""; 
    return phone.replace(/\D/g, "");
  }

  checkEmailExists(email: string, excludeId?: string) {
    return this.repository
      .getAllFriends()
      .some(
        (f) =>
          f.id !== excludeId &&
          this.normalizeEmail(f.email || "") === this.normalizeEmail(email)
      );
  }

  checkPhoneExists(phone: string, excludeId?: string) {
    return this.repository
      .getAllFriends()
      .some(
        (f) =>
          f.id !== excludeId &&
          this.normalizePhone(f.phone || "") === this.normalizePhone(phone)
      );
  }

  getFriendById(id: string) {
    return this.repository.findFriendById(id);
  }

  // Add Friend
  addFriend(friend: Friend) {
    const conflicts: string[] = [];

    if (this.getFriendById(friend.id)) conflicts.push("id");
    if (this.checkEmailExists(friend.email)) conflicts.push("email");
    if (this.checkPhoneExists(friend.phone)) conflicts.push("phone");

    if (conflicts.length > 0) {
      throw new ConflictError("Friend has existing fields", conflicts);
    }

    this.repository.addFriend(friend);

    return {
      success: true,
      data: friend,
      message: "Friend added successfully",
    };
  }

  // Search with pagination
  searchFriend(
    query: string,
    pageOptions: PageOptions = { offset: 0, limit: 10 }
  ): ReturnModel<{ friends: Friend[]; total: number }> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return { success: false, message: "Search query cannot be empty" };
    }

    const result = this.repository.searchFriends(trimmedQuery, pageOptions);

    return {
      success: true,
      data: { friends: result.data, total: result.total },
      ...(result.total === 0 && { message: "No friends found" }),
    };
  }

  // Update Friend
  async updateFriend(id: string, updatedData: Partial<Friend>) {
    const existing = this.getFriendById(id);
    if (!existing) {
      return { success: false, message: "Friend not found" };
    }

    if (
      updatedData.email &&
      this.normalizeEmail(updatedData.email) !==
        this.normalizeEmail(existing.email) &&
      this.checkEmailExists(updatedData.email, id)
    ) {
      return { success: false, message: "Email already exists" };
    }

    if (
      updatedData.phone &&
      this.normalizePhone(updatedData.phone) !==
        this.normalizePhone(existing.phone) &&
      this.checkPhoneExists(updatedData.phone, id)
    ) {
      return { success: false, message: "Phone already exists" };
    }

    const updated: Friend = {
      id: existing.id,
      name: updatedData.name ?? existing.name,
      email: updatedData.email ?? existing.email,
      phone: updatedData.phone ?? existing.phone,
      balance: updatedData.balance ?? existing.balance,
    };

    const success = await this.repository.updateFriend(id, updated);

    return success
      ? { success: true, data: updated, message: "Friend updated successfully" }
      : { success: false, message: "Update failed" };
  }

  //Delete Friend
  async deleteFriend(id: string) {
    const existing = this.getFriendById(id);
    if (!existing) {
      return { success: false, message: "Friend not found" };
    }

    const success = await this.repository.deleteFriend(id);

    return success
      ? { success: true, message: "Friend deleted successfully" }
      : { success: false, message: "Deletion failed" };
  }
}