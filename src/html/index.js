"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleHtml = void 0;
const sqljs_wrapper_cogmios_1 = require("sqljs-wrapper-cogmios");
const fse = require("fs-extra");
class SimpleHtml {
    constructor() { }
    async export(path) {
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        let urls = await instance.getAsObjectArray(`select t5.name as user, t4.name as location, t3.name as root, t2.path, t2.name, t1.url
        from url as t1
        join name as t2 on t2.urlId = t1.id
        join root as t3 on t3.id = t2.rootId
        join location as t4 on t4.id = t2.locationId
        join user as t5 on t5.id = t2.userId
        order by t2.path`, []);
        let output = "<html><head></head><body><ol>";
        for (let i = 0; i < urls.length; i++) {
            output = output + '<li>' + urls[i].root + ":" + urls[i].path + '<a href="' + urls[i].url + '">' + urls[i].name + '</a></li>';
        }
        output = output + '</ol></body></html>';
        await fse.writeFile(path, output);
        return true;
    }
}
exports.SimpleHtml = SimpleHtml;
//# sourceMappingURL=index.js.map