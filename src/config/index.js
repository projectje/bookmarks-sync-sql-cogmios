"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const parseJson = require('parse-json');
const fse = require("fs-extra");
class Config {
    readConfig(bookmarksfile) {
        let json = fse.readFileSync(bookmarksfile, 'utf8');
        this.config = JSON.parse(json);
    }
}
exports.Config = Config;
//# sourceMappingURL=index.js.map