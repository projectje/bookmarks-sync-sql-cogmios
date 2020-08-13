import {Database} from "sqljs-wrapper-cogmios/database"
import {InternalDatabase} from "../database"

export class Firefox {

    public id : string
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
            title = title.substring('\\untitled'.length)
        }
        return title
    }

    /**
     * @param places
     */
    async traverse() {
        this.placesDatabase = new Database(this.path)
        await this.placesDatabase.open()
        let result = await this.placesDatabase.getAsObjectArray("select t2.url, t2.id, t1.parent, t1.title from moz_bookmarks AS t1, moz_places AS t2 where t1.fk == t2.id", [])
        for(let i=0; i<result.length; i++) {
            let name = await this.parenturl(result[i].parent, result[i].title)
            let interndatabase = InternalDatabase.getInstance()
            let id = await interndatabase.insertItemUrl(result[i].url)
            await interndatabase.insertName(id, this.id, name)
        }

        return true
    }

}