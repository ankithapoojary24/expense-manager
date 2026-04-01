import type {Friend} from '../models/friend.model';

export interface PageOptions { offset: number; limit: number; }
export interface PageResult<T> {
    data: T[];
    total:number;
