"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleHtml = void 0;
const sqljs_wrapper_cogmios_1 = require("sqljs-wrapper-cogmios");
const fse = require("fs-extra");
class SimpleHtml {
    constructor() { }
    async export(path) {
        let instance = sqljs_wrapper_cogmios_1.DatabaseCore.getInstance();
        let urls = await instance.getAsObjectArray(`select t5.name as user, t4.name as location, t3.name as root, t2.path, t2.name, t1.url, t1.id
        from url as t1
        join name as t2 on t2.urlId = t1.id
        left join root as t3 on t3.id = t2.rootId
        join location as t4 on t4.id = t2.locationId
        join user as t5 on t5.id = t2.userId
        order by t2.path`, []);
        let output = `<html><head><base target="_blank"></head><body>`;
        let old_title = 'start';
        let open = false;
        for (let i = 0; i < urls.length; i++) {
            if (old_title != urls[i].path) {
                if (open === true) {
                    output = output + "</ol>";
                }
                output = output + "<h2>" + urls[i].path + "</h2><ol>";
                open = true;
                old_title = urls[i].path;
            }
            output = output + '<li><a href="' + urls[i].url + '">' + urls[i].url + '</a>';
            const subquery = `
            select t5.name as user, t4.name as location, t3.name as root, t2.path, t2.name
            from name as t2
            left join root as t3 on t3.id = t2.rootId
            left join location as t4 on t4.id = t2.locationId
            left join user as t5 on t5.id = t2.userId
            where t2.urlId = ?
            `;
            let names = await instance.getAsObjectArray(subquery, [urls[i].id]);
            output = output + '<ul>';
            for (let j = 0; j < names.length; j++) {
                output = output + '<li>' + names[j].user + '::' + names[j].location + '::' + names[j].root + '::' + names[j].path + '</li>';
            }
            output = output + '</ul></li>';
        }
        if (open === true) {
            output = output + "</ol>";
        }
        output = output + '</body></html>';
        await fse.writeFile(path, output);
        return true;
    }
}
exports.SimpleHtml = SimpleHtml;
//# sourceMappingURL=index.js.map