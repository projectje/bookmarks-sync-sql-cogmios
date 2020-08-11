import {Database} from "sqljs-wrapper-cogmios/database"
import {InternalDatabase} from "../database"

export class Firefox {

    public id : string
    public path : string
    public database: any

    constructor() { }

    /**
     * Retrieves the full title including path
     * @param parent
     * @param title
     */
    async parenturl(parent: Number, title: string) {
        if (title === null) { title = "untitled"}
        if (parent && parent !== null) {
            let parentRow = await this.database.getAsObject(`SELECT parent, title from moz_bookmarks where id = ?`, [parent]);
            let parentTitle = (parentRow.title && parentRow.title !== null && parentRow.title != '') ? parentRow.title + "\\" + title : "\\untitled\\" + title
            title = await this.parenturl(parentRow.parent, parentTitle)
        }
        return title
    }

    async traverse(places: string) {
        this.database = new Database(places)
        await this.database.open()
        let result = await this.database.getAsObjectArray("select t2.url, t2.id, t1.parent, t1.title from moz_bookmarks AS t1, moz_places AS t2 where t1.fk == t2.id", [])
        await result.forEach( async (row) => {
            let name = await this.parenturl(row.parent, row.title)

            let interndatabase = new InternalDatabase()
            let id = await interndatabase.insertItemUrl(row.url)
            await interndatabase.insertName(id, this.id, name) // todo for some reason does not work
        })
    }

}