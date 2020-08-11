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
            let parentRow = await this.database.getAsObject(`SELECT parent, title from moz_bookmarks where id = ?`, [parent]);
            let parentTitle = (parentRow.title && parentRow.title !== null && parentRow.title != '') ? parentRow.title + "\\" + title : "\\untitled\\" + title;
            title = await this.parenturl(parentRow.parent, parentTitle);
        }
        return title;
    }
    async traverse(places) {
        this.database = new database_1.Database(places);
        await this.database.open();
        let result = await this.database.getAsObjectArray("select t2.url, t2.id, t1.parent, t1.title from moz_bookmarks AS t1, moz_places AS t2 where t1.fk == t2.id", []);
        await result.forEach(async (row) => {
            let name = await this.parenturl(row.parent, row.title);
            let interndatabase = new database_2.InternalDatabase();
            let id = await interndatabase.insertItemUrl(row.url);
            await interndatabase.insertName(id, this.id, name);
        });
    }
}
exports.Firefox = Firefox;
//# sourceMappingURL=index.js.map