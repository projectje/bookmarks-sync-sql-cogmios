import {BookmarksToSqlite} from '../src'

async function test() {
    new BookmarksToSqlite('./test/bookmarks.json').Run()
}

test();