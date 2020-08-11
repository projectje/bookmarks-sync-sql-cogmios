
import * as path from 'path'
import * as fse from 'fs-extra'
import {ParseUrl} from '../src/folder'
import {Firefox} from '../src/firefox'
import {Config} from '../src/config'
import {DatabaseCore} from "sqljs-wrapper-cogmios"

export class BookmarksToSqlite {

    private config

    /**
     * Execution is determined by bookmarks.json
     */
    public constructor(bookmarksjson: string) {
        let configInstance = new Config()
        configInstance.readConfig(bookmarksjson)
        this.config = configInstance.config
    }

    public async Run() {
        await this.initDatabase()
        let instance = DatabaseCore.getInstance()
        await instance.open()
        await this.importUrlDir()
        //await this.importFirefox()
        await instance.close()
    }

    /**
     * Inits a new database
     */
    private async initDatabase() {
        if (this.config.databaselocation) {
            let database_uri = this.config.databaselocation.path
            let schema_query = await fse.readFile(path.join(__dirname, '/database/schema.sqlite'), 'utf8')
            let instance = DatabaseCore.getInstance()
            instance.setLocation(database_uri);
            let initialized = await instance.init(schema_query);
        }
    }

    /**
     * If specified imports a folder
     */
    private async importUrlDir() {
        console.log(this.config)
        if (this.config.dir) {
            for(let i=0; i<this.config.dir.length; i++) {
                let parseUrl = new ParseUrl()
                parseUrl.pathId = this.config.dir[i].id
                parseUrl.rootLength = (this.config.dir[i].path + this.config.dir[i].root).length
                await parseUrl.traverse(this.config.dir[i].root)
            }
        }
    }

    // if specified import firefox bookmarks from defined profiles
    private async importFirefox() {
        console.log(this.config)
        if (this.config.firefox) {
            for(let i=0; i<this.config.firefox.length; i++) {
                let firefox = new Firefox()
                firefox.id = this.config.firefox[i].id
                firefox.path = this.config.firefox[i].path
                console.log(firefox.path)
                await firefox.traverse(firefox.path)
            }
        }
    }

}
