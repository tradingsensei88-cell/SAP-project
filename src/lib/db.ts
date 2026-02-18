import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    credits: number;
}

export const db = {
    getUsers: (): User[] => {
        if (!fs.existsSync(DB_PATH)) return [];
        const data = fs.readFileSync(DB_PATH, "utf-8");
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    },

    addUser: (user: User) => {
        const users = db.getUsers();
        users.push(user);
        fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
        return user;
    },

    findUserByEmail: (email: string) => {
        const users = db.getUsers();
        return users.find((u) => u.email === email);
    }
};
