"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firefox = void 0;
const database_1 = require("sqljs-wrapper-cogmios/database");
const database_2 = require("../database");
class Firefox {
    constructor() { }
    async parenturl(parent, title) {
        if (title === null) {
            title = "untitled";
        }
        if (parent && parent !== null) {
            let parentRow = await this.placesDatabase.getAsObject(`SELECT parent, title from moz_bookmarks where id = ?`, [parent]);
            let parentTitle = (parentRow.title && parentRow.title !== null && parentRow.title != '') ? parentRow.title + "\\" + title : "\\untitled\\" + title;
            title = await this.parenturl(parentRow.parent, parentTitle);
        }
        if (title.startsWith('\\untitled')) {
            title = title.substring('\\untitled'.length + 1);
        }
        return title;
    }
    async traverse(userId, locationId, path) {
        try {
            this.placesDatabase = new database_1.Database(path);
            await this.placesDatabase.open();
            let result = await this.placesDatabase.getAsObjectArray("select t2.url, t2.id, t1.parent, t1.title from moz_bookmarks AS t1, moz_places AS t2 where t1.fk == t2.id", []);
            for (let i = 0; i < result.length; i++) {
                let name = await this.parenturl(result[i].parent, result[i].title);
                let interndatabase = database_2.InternalDatabase.getInstance();
                let urlid = await interndatabase.insertUrl(result[i].url);
                let root = name.split('\\')[0];
                let rootId = await interndatabase.insertRoot(root);
                name = name.substr(root.length);
                await interndatabase.insertName(urlid, userId, locationId, rootId, name);
            }
            return true;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
}
exports.Firefox = Firefox;
//# sourceMappingURL=index.js.map