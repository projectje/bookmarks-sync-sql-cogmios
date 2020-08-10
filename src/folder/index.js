"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseUrl = exports.readdir = void 0;
const path = require("path");
const ini = require("ini");
const util = require("util");
const fs = require("fs");
const sqljs_wrapper_cogmios_1 = require("sqljs-wrapper-cogmios");
exports.readdir = util.promisify(fs.readdir);
class ParseUrl {
    constructor() { }
    async traverse(dir) {
        const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
            const res = path.resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                let fullrelativepath = dir.substr(this.rootLength);
                let child = dirent.name;
                let relativeroot = fullrelativepath.split(path.sep)[1];
                await this.traverse(res);
            }
            else {
                let fullname = `${dir}${path.sep}${dirent.name}`;
                var file = ini.parse(fs.readFileSync(fullname, 'utf-8'));
                const url = file.InternetShortcut.URL;
                let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
                let itemUrl = await instance.getAsObject(`SELECT * from itemUrl where url = ?`, [url]);
                if (Object.keys(itemUrl).length === 0 && itemUrl.constructor === Object) {
                    await instance.run(`INSERT into itemUrl (url) VALUES (?)`, [url]);
                    itemUrl = await instance.getAsObject(`SELECT * from itemUrl where url = ?;`, [url]);
                }
                let id = itemUrl.id;
                let fullrelativepath = `${dir.substr(this.rootLength)}${path.sep}${dirent.name.split('.').slice(0, -1).join('.')}`;
                console.log(id);
                console.log(fullrelativepath);
                await instance.run("INSERT into itemProperty (itemUrlId, itemKey, itemValue) VALUES (?, ?, ?)", [id, this.pathId, fullrelativepath]);
            }
        }
    }
}
exports.ParseUrl = ParseUrl;
//# sourceMappingURL=index.js.map