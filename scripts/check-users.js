const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(process.cwd(), "dev.db");
console.log("Reading DB from:", dbPath);

try {
    const db = new Database(dbPath, { readonly: true });
    const users = db.prepare("SELECT * FROM User").all();
    console.log("Total users found:", users.length);
    users.forEach(u => console.log(`${u.email} - Role: ${u.role}`));
    db.close();
} catch (err) {
    console.error("Error:", err);
}
