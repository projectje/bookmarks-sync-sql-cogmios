import {Config} from '../src/config'
import {InternalDatabase} from "../src/database"
import {ParseUrl} from '../src/folder'
import {Firefox} from '../src/firefox'
import {Chrome} from './chrome'
import {SimpleHtml} from './html'

export class BookmarksToSqlite {

    private config: any

    /**
     * Constructor reads config file
     */
    public constructor(bookmarksjson: string) {
        let configInstance = new Config()
        configInstance.readConfig(bookmarksjson)
        this.config = configInstance.config
    }

    /**
     * Run imports the indicated sources for specified user
     */
    public async Run() {
        try
        {
            let interndatabase = InternalDatabase.getInstance()
            await interndatabase.open(this.config.databaselocation.path)
            let userId = await interndatabase.insertUser(this.config.user)
            await this.importUrlDir(userId)
            await this.importFirefox(userId)
            await this.importChrome(userId)
            await this.exportSimpleHtml()
            await interndatabase.close()
        }
        catch (e)
        {
            console.error(e)
            throw e
        }
    }

    /**
     * If specified imports a folder
     */
    private async importUrlDir(userId: number) : Promise<boolean> {
        try
        {
            if (this.config.import.dir) {
                let importdir = this.config.import.dir
                for(let i=0; i<importdir.length; i++) {
                    let parseUrl = new ParseUrl()
                    let interndatabase = InternalDatabase.getInstance()
                    let locationId = await interndatabase.insertLocation(importdir[i].location)
                    await parseUrl.traverse(importdir[i].root, userId, locationId, (importdir[i].path + importdir[i].root).length)
                }
            }
            return true
        }
        catch (e)
        {
            console.error(e)
            throw e
        }
    }

    /**
     * if specified imports one or more Firefox profile bookmarks
     */
    private async importFirefox(userId: number) : Promise<boolean> {
        if (this.config.import.firefox) {
            let importfirefox = this.config.import.firefox
            for(let i=0; i<importfirefox.length; i++) {
                let interndatabase = InternalDatabase.getInstance()
                let locationId = await interndatabase.insertLocation(importfirefox[i].location)
                await new Firefox().traverse(userId, locationId, importfirefox[i].path)
            }
        }
        return true
    }

    /**
     * if specified Imports one or more Chrome bookmarks
     */
    private async importChrome(userId: number) : Promise<boolean> {
        if (this.config.import.chrome) {
            let importchrome = this.config.import.chrome
            for(let i=0; i<importchrome.length; i++) {
                let interndatabase = InternalDatabase.getInstance()
                let locationId = await interndatabase.insertLocation(importchrome[i].location)
                await new Chrome().traverse(userId, locationId, importchrome[i].path)
            }
        }
        return true
    }

    private async exportSimpleHtml() : Promise<boolean> {
        if (this.config.export && this.config.export.html) {
            let exporthtml = this.config.export.html
            for(let i=0; i<exporthtml.length; i++) {
                await new SimpleHtml().export(this.config.export.html[i].path)
            }
        }
        return true
   }

}
