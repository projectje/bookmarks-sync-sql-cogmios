"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chrome = void 0;
const database_1 = require("../database");
const parseJson = require("parse-json");
const fse = require("fs-extra");
class Chrome {
    constructor() { }
    async parseNode(title, node) {
        if (title === null || title === '') {
            title = "untitled";
        }
        if (node.type === "url") {
            let interndatabase = database_1.InternalDatabase.getInstance();
            let id = await interndatabase.insertItemUrl(node.url);
            let name = (node.name.trim() != '') ? node.name : "untitled";
            await interndatabase.insertName(id, this.id, title + "\\" + name);
            return true;
        }
        else if (node.type === "folder") {
            await this.parseNodes(title + "\\" + node.name, node.children);
        }
    }
    async parseNodes(title, node) {
        if (Array.isArray(node)) {
            for (const nodeItem of node) {
                let result = await this.parseNode(title, nodeItem);
            }
        }
        else {
            let result = await this.parseNode(title, node);
        }
    }
    async traverse() {
        let json = fse.readFileSync(this.path, "utf8");
        let chromeJsonBookmarks = JSON.parse(json);
        if (chromeJsonBookmarks.roots.bookmark_bar) {
            await this.parseNodes("/bookmarkbar/", chromeJsonBookmarks.roots.bookmark_bar);
        }
        if (chromeJsonBookmarks.roots.other) {
            await this.parseNodes("/other/", chromeJsonBookmarks.roots.other);
        }
        if (chromeJsonBookmarks.roots.synced) {
            await this.parseNodes("/synced/", chromeJsonBookmarks.roots.synced);
        }
        return true;
    }
}
exports.Chrome = Chrome;
//# sourceMappingURL=index.js.map