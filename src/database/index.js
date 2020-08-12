"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalDatabase = void 0;
const sqljs_wrapper_cogmios_1 = require("sqljs-wrapper-cogmios");
class InternalDatabase {
    constructor() {
    }
    static getInstance() {
        if (!InternalDatabase.instance) {
            InternalDatabase.instance = new InternalDatabase();
        }
        return InternalDatabase.instance;
    }
    async insertItemUrl(url) {
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        let itemUrl = await instance.getAsObject(`SELECT * from itemUrl where url = ?`, [url]);
        if (Object.keys(itemUrl).length === 0 && itemUrl.constructor === Object) {
            await instance.run(`INSERT into itemUrl (url) VALUES (?)`, [url]);
            itemUrl = await instance.getAsObject(`SELECT * from itemUrl where url = ?;`, [url]);
        }
        return itemUrl.id;
    }
    async insertName(id, pathId, path) {
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        await instance.run("INSERT into itemProperty (itemUrlId, itemKey, itemValue) VALUES (?, ?, ?)", [id, pathId, path]);
    }
}
exports.InternalDatabase = InternalDatabase;
//# sourceMappingURL=index.js.map