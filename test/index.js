"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
async function test() {
    await new src_1.BookmarksToSqlite('./test/bookmarks.json').Run();
}
test();
//# sourceMappingURL=index.js.map