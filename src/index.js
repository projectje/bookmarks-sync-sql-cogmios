"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarksToSqlite = void 0;
const path = require("path");
const fse = require("fs-extra");
const folder_1 = require("../src/folder");
const config_1 = require("../src/config");
const sqljs_wrapper_cogmios_1 = require("sqljs-wrapper-cogmios");
class BookmarksToSqlite {
    constructor(bookmarksjson) {
        let configInstance = new config_1.Config();
        configInstance.readConfig(bookmarksjson);
        this.config = configInstance.config;
    }
    async Run() {
        await this.initDatabase();
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        await instance.open();
        await this.importUrlDir();
        await instance.close();
    }
    async initDatabase() {
        if (this.config.databaselocation) {
            let database_uri = this.config.databaselocation.path;
            let schema_query = await fse.readFile(path.join(__dirname, '/database/schema.sqlite'), 'utf8');
            let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
            instance.setLocation(database_uri);
            let initialized = await instance.init(schema_query);
        }
    }
    async importUrlDir() {
        console.log(this.config);
        if (this.config.dir) {
            for (let i = 0; i < this.config.dir.length; i++) {
                let parseUrl = new folder_1.ParseUrl();
                parseUrl.pathId = this.config.dir[i].id;
                parseUrl.rootLength = (this.config.dir[i].path + this.config.dir[i].root).length;
                let result = await parseUrl.traverse(this.config.dir[i].root);
            }
        }
    }
}
exports.BookmarksToSqlite = BookmarksToSqlite;
//# sourceMappingURL=index.js.map