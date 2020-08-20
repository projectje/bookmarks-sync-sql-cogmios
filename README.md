# bookmarks-sync-sql-cogmios
Imports bookmarks in a sqlite database:

1. one or more directories of URL files
2. one or more chrome profiles
3. one or more firefox profiles

Exports to:

1. A simple Html page

Specify the settings in bookmarks.json and run

`
   await new BookmarksToSqlite('./test/bookmarks.json').Run()
`
