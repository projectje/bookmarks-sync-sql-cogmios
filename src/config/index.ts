const parseJson = require('parse-json');
import * as fse from 'fs-extra'

/**
 * Parses bookmarks.json
 */
export class Config {

    public config : Object

    /**
     * Just make sure its UTF8 encoded and note UTF8 and BOM
     * @param bookmarksfile
     */
    public readConfig(bookmarksfile) {
        let json = fse.readFileSync(bookmarksfile, 'utf8')
        this.config = JSON.parse(json);
    }


}