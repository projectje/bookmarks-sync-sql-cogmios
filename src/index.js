"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarksToSqlite = void 0;
const config_1 = require("../src/config");
const database_1 = require("../src/database");
const folder_1 = require("../src/folder");
const firefox_1 = require("../src/firefox");
const chrome_1 = require("./chrome");
const html_1 = require("./html");
class BookmarksToSqlite {
    constructor(bookmarksjson) {
        let configInstance = new config_1.Config();
        configInstance.readConfig(bookmarksjson);
        this.config = configInstance.config;
    }
    async Run() {
        try {
            let interndatabase = database_1.InternalDatabase.getInstance();
            await interndatabase.open(this.config.databaselocation.path);
            let userId = await interndatabase.insertUser(this.config.user);
            await this.importUrlDir(userId);
            await this.importFirefox(userId);
            await this.importChrome(userId);
            await this.exportSimpleHtml();
            await interndatabase.close();
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    async importUrlDir(userId) {
        try {
            if (this.config.import.dir) {
                let importdir = this.config.import.dir;
                for (let i = 0; i < importdir.length; i++) {
                    let parseUrl = new folder_1.ParseUrl();
                    let interndatabase = database_1.InternalDatabase.getInstance();
                    let locationId = await interndatabase.insertLocation(importdir[i].location);
                    await parseUrl.traverse(importdir[i].root, userId, locationId, (importdir[i].path + importdir[i].root).length);
                }
            }
            return true;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    async importFirefox(userId) {
        if (this.config.import.firefox) {
            let importfirefox = this.config.import.firefox;
            for (let i = 0; i < importfirefox.length; i++) {
                let interndatabase = database_1.InternalDatabase.getInstance();
                let locationId = await interndatabase.insertLocation(importfirefox[i].location);
                await new firefox_1.Firefox().traverse(userId, locationId, importfirefox[i].path);
            }
        }
        return true;
    }
    async importChrome(userId) {
        if (this.config.import.chrome) {
            let importchrome = this.config.import.chrome;
            for (let i = 0; i < importchrome.length; i++) {
                let interndatabase = database_1.InternalDatabase.getInstance();
                let locationId = await interndatabase.insertLocation(importchrome[i].location);
                await new chrome_1.Chrome().traverse(userId, locationId, importchrome[i].path);
            }
        }
        return true;
    }
    async exportSimpleHtml() {
        if (this.config.export && this.config.export.html) {
            let exporthtml = this.config.export.html;
            for (let i = 0; i < exporthtml.length; i++) {
                await new html_1.SimpleHtml().export(this.config.export.html[i].path);
            }
        }
        return true;
    }
}
exports.BookmarksToSqlite = BookmarksToSqlite;
//# sourceMappingURL=index.js.map