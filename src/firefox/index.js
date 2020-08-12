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
            title = title.substring('\\untitled'.length);
        }
        return title;
    }
    async traverse() {
        this.placesDatabase = new database_1.Database(this.path);
        await this.placesDatabase.open();
        let result = await this.placesDatabase.getAsObjectArray("select t2.url, t2.id, t1.parent, t1.title from moz_bookmarks AS t1, moz_places AS t2 where t1.fk == t2.id", []);
        for (let i = 0; i < result.length; i++) {
            let name = await this.parenturl(result[i].parent, result[i].title);
            let interndatabase = database_2.InternalDatabase.getInstance();
            let id = await interndatabase.insertItemUrl(result[i].url);
            await interndatabase.insertName(id, this.id, name);
        }
        return true;
    }
}
exports.Firefox = Firefox;
//# sourceMappingURL=index.js.map