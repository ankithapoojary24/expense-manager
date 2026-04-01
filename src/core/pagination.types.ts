import type {Friend} from '../models/friend.model.js';

export interface PageOptions { offset: number; limit: number; }
export interface PageResult<T> {
    data: T[];
    total:number;
}