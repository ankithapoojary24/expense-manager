import { Database, JsonStorageAdapter } from '../core/storage/db.js';
import type { Friend } from './friend.model.js';
import fs from 'fs';
import path from 'path';

interface AppData {
  friends: Friend[];
}

export class AppDBManager {
  private static sharedInstance: AppDBManager | undefined;
  private db: Database<AppData>;

  private constructor() {
    const filePath = path.join(process.cwd(), 'data', 'data.json');

    // Ensure file exists
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({ friends: [] }));

    this.db = new Database<AppData>(filePath, new JsonStorageAdapter<AppData>());
  }

  static getInstance(): AppDBManager {
    if (!this.sharedInstance) {
      this.sharedInstance = new AppDBManager();
    }
    return this.sharedInstance;
  }

  getDB(): Database<AppData>  {
    return this.db;
  }

  async save() {
    await this.db.save();
  }
}