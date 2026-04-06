import { Database, type Dataset, JsonAdapter } from '../core/storage/db.js';
import type { Friend } from './friend.model.js';
import fs from 'fs';
import path from 'path';

interface AppData extends Dataset {
  friends: Friend[];
}

export class AppDBManager {
  private static sharedInstance: AppDBManager | undefined;
  private db: Database<AppData>;

  private constructor() {
    const filePath = path.resolve('./data/data.json');

    // Ensure file exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({ friends: [] }));

    this.db = new Database<AppData>(filePath, JsonAdapter);
  }

  static getInstance(): AppDBManager {
    if (!this.sharedInstance) {
      this.sharedInstance = new AppDBManager();
    }
    return this.sharedInstance;
  }

  getDB() {
    return this.db;
  }

  async save() {
    await this.db.save();
  }
}