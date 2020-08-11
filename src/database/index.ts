
import {DatabaseCore} from "sqljs-wrapper-cogmios"

export class InternalDatabase {

    public constructor() {}

    async insertItemUrl(url) {
        let instance = DatabaseCore.getInstance()
        let itemUrl = await instance.getAsObject(`SELECT * from itemUrl where url = ?`, [url]);
        if (Object.keys(itemUrl).length === 0 && itemUrl.constructor === Object) {
            await instance.run(`INSERT into itemUrl (url) VALUES (?)`,[url] );
            itemUrl = await instance.getAsObject(`SELECT * from itemUrl where url = ?;`, [url]);
        }
        return itemUrl.id
    }

    async insertName(id: number, pathId: string, path: string)
    {
        let instance = DatabaseCore.getInstance()
        console.log(id)
        console.log(pathId)
        console.log(path)
        // somehow it does not get inserted (or not written)
        await instance.run("INSERT into itemProperty (itemUrlId, itemKey, itemValue) VALUES (?, ?, ?)", [id, pathId ,path])
    }

}