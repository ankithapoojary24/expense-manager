import { Row } from "../core/storage/db.js";

export interface Friend extends Row{
    id: string;
    name: string;
    email: string;
    phone: string;
    balance: number; //+ve means friend owes you, -ve means you owe friend
}