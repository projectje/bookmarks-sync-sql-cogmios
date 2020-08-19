# bookmarks-sync-sql-cogmios
Imports bookmarks in a sqlite database:

1. one or more directories of URL files
2. one or more chrome profiles
3. one or more firefox profiles

Specify the settings in bookmarks.json and run

`
   await new BookmarksToSqlite('./test/bookmarks.json').Run()
`


