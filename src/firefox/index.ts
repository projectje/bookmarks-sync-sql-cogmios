import {Database} from "sqljs-wrapper-cogmios/database"
import {InternalDatabase} from "../database"

export class Firefox {

    public user: string
    public namespace: string
    public path : string
    public placesDatabase: any

    constructor() { }

    /**
     * Retrieves the full title including path
     * @param parent
     * @param title
     */
    async parenturl(parent: Number, title: string) {
        if (title === null) { title = "untitled"}
        if (parent && parent !== null) {
            let parentRow = await this.placesDatabase.getAsObject(`SELECT parent, title from moz_bookmarks where id = ?`, [parent]);
            let parentTitle = (parentRow.title && parentRow.title !== null && parentRow.title != '') ? parentRow.title + "\\" + title : "\\untitled\\" + title
            title = await this.parenturl(parentRow.parent, parentTitle)
        }
        if (title.startsWith('\\untitled')) {
            title = title.substring('\\untitled'.length+1)
        }
        if (title.startsWith('\\')) {
            title = title.substring(1)
        }
        if (title.endsWith('\\')) {
            title = title.substring(0,title.length - 1)
        }
        return title
    }

    /**
     * @param places
     */
    async traverse(userId: number, locationId: number, path: string) : Promise<boolean> {
        try {
            this.placesDatabase = new Database(path)
            await this.placesDatabase.open()
            let result = await this.placesDatabase.getAsObjectArray("select t2.url, t2.id, t1.parent, t1.title from moz_bookmarks AS t1, moz_places AS t2 where t1.fk == t2.id", [])
            for(let i=0; i<result.length; i++) {
                let name = await this.parenturl(result[i].parent, '')
                let interndatabase = InternalDatabase.getInstance()
                let urlid = await interndatabase.insertUrl(result[i].url)
                // todo: first item is the root for firefox
                let root = name.split('\\')[0]
                let rootId = await interndatabase.insertRoot(root)
                name = name.substr(root.length + 1)
                await interndatabase.insertName(urlid, userId, locationId, rootId, name, result[i].title)
            }
            return true
        }
        catch (e) {
            console.error(e)
            throw e
        }
    }

}