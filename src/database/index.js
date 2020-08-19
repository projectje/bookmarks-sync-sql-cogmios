"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalDatabase = void 0;
const sqljs_wrapper_cogmios_1 = require("sqljs-wrapper-cogmios");
const fse = require("fs-extra");
const path = require("path");
class InternalDatabase {
    constructor() {
    }
    async open(databasePath) {
        await this.initDatabase(databasePath);
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        await instance.open();
    }
    async close() {
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        await instance.close();
    }
    async initDatabase(databasePath) {
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        try {
            if (databasePath) {
                let database_uri = databasePath;
                instance.setLocation(database_uri);
                let schema_query = await fse.readFile(path.join(__dirname, 'schema.sqlite'), 'utf8');
                return await instance.init(schema_query);
            }
        }
        catch (error) {
            throw error;
        }
    }
    static getInstance() {
        if (!InternalDatabase.instance) {
            InternalDatabase.instance = new InternalDatabase();
        }
        return InternalDatabase.instance;
    }
    async insertUrl(url) {
        try {
            let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
            await instance.run(`INSERT OR IGNORE INTO Url (url) VALUES (?);`, [url]);
            let urlrecord = await instance.getAsObject(`SELECT * FROM Url WHERE url = ?;`, [url]);
            return urlrecord.id;
        }
        catch (e) {
            console.error(e, url);
            throw e;
        }
    }
    async insertUser(user) {
        try {
            let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
            await instance.run("INSERT OR IGNORE INTO User (name) VALUES (?);", [user]);
            let userRecord = await instance.getAsObject("SELECT * FROM User WHERE name = ?;", [user]);
            return userRecord.id;
        }
        catch (e) {
            console.error(e, user);
            throw e;
        }
    }
    async insertLocation(location) {
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        await instance.run("INSERT OR IGNORE INTO Location (name) VALUES (?);", [location]);
        let locationRecord = await instance.getAsObject("SELECT * FROM Location WHERE name = ?;", [location]);
        return locationRecord.id;
    }
    async insertRoot(root) {
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        await instance.run("INSERT OR IGNORE INTO Root (name) VALUES (?);", [root]);
        let rootRecord = await instance.getAsObject("SELECT * FROM Root WHERE name = ?;", [root]);
        return rootRecord.id;
    }
    async insertName(urlId, userId, locationId, rootId, path, name) {
        try {
            let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
            await instance.run("INSERT into Name (urlId, userId, locationId, rootId, path, name) VALUES (?, ?, ?, ?, ?, ?)", [urlId, userId, locationId, rootId, path, name]);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
}
exports.InternalDatabase = InternalDatabase;
//# sourceMappingURL=index.js.map