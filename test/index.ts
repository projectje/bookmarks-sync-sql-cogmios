import {BookmarksToSqlite} from '../src'

async function test() {
    await new BookmarksToSqlite('./test/bookmarks.json').Run()
}

test();