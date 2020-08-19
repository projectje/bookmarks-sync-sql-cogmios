"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseUrl = exports.readdir = void 0;
const path = require("path");
const ini = require("ini");
const util = require("util");
const fs = require("fs");
exports.readdir = util.promisify(fs.readdir);
const database_1 = require("../database");
class ParseUrl {
    constructor() { }
    async traverse(dir, userId, locationId, rootLength) {
        const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
            const res = path.resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                let fullrelativepath = dir.substr(rootLength);
                let child = dirent.name;
                let relativeroot = fullrelativepath.split(path.sep)[1];
                await this.traverse(res, userId, locationId, rootLength);
            }
            else {
                let fullname = `${dir}${path.sep}${dirent.name}`;
                let name = `${dir.substr(rootLength)}${path.sep}${dirent.name.split('.').slice(0, -1).join('.')}`;
                var file = ini.parse(fs.readFileSync(fullname, 'utf-8'));
                let interndatabase = database_1.InternalDatabase.getInstance();
                if (file && file.InternetShortcut && file.InternetShortcut.URL) {
                    let urlId = await interndatabase.insertUrl(file.InternetShortcut.URL);
                    await interndatabase.insertName(urlId, userId, locationId, 0, name);
                }
            }
        }
    }
}
exports.ParseUrl = ParseUrl;
//# sourceMappingURL=index.js.map