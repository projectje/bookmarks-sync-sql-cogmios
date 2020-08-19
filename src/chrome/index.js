"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chrome = void 0;
const database_1 = require("../database");
const parseJson = require("parse-json");
const fse = require("fs-extra");
class Chrome {
    constructor() { }
    async parseNode(userId, locationId, rootId, title, node) {
        if (node.type === "url") {
            let interndatabase = database_1.InternalDatabase.getInstance();
            let urlId = await interndatabase.insertUrl(node.url);
            let name = (node.name.trim() != '') ? node.name : "untitled";
            if (title.startsWith('\\')) {
                title = title.substring(1);
            }
            if (title.endsWith('\\')) {
                title = title.substring(0, title.length - 1);
            }
            await interndatabase.insertName(urlId, userId, locationId, rootId, title, name);
            return true;
        }
        else if (node.type === "folder") {
            await this.parseNodes(userId, locationId, rootId, title + "\\" + node.name, node.children);
        }
    }
    async parseNodes(userId, locationId, rootId, title, node) {
        if (Array.isArray(node)) {
            for (const nodeItem of node) {
                let result = await this.parseNode(userId, locationId, rootId, title, nodeItem);
            }
        }
        else {
            let result = await this.parseNode(userId, locationId, rootId, title, node);
        }
        return true;
    }
    async traverse(userId, locationId, path) {
        let json = fse.readFileSync(path, "utf8");
        let chromeJsonBookmarks = JSON.parse(json);
        let interndatabase = database_1.InternalDatabase.getInstance();
        let rootId = await interndatabase.insertRoot("bookmarkbar");
        await this.parseNodes(userId, locationId, rootId, "", chromeJsonBookmarks.roots.bookmark_bar.children);
        rootId = await interndatabase.insertRoot("other");
        await this.parseNodes(userId, locationId, rootId, "", chromeJsonBookmarks.roots.other.children);
        rootId = await interndatabase.insertRoot("synced");
        await this.parseNodes(userId, locationId, rootId, "", chromeJsonBookmarks.roots.synced.children);
        return true;
    }
}
exports.Chrome = Chrome;
//# sourceMappingURL=index.js.map