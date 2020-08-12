
import {DatabaseCore} from "sqljs-wrapper-cogmios"

export class InternalDatabase {

    // static intance field singleton
    private static instance: InternalDatabase

    // constructor with private access modifier
    private constructor() {
    }

    /**
     * Get instance
     */
    static getInstance(): InternalDatabase {
        if (!InternalDatabase.instance) {
            InternalDatabase.instance = new InternalDatabase();
        }
        return InternalDatabase.instance;
    }

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
        await instance.run("INSERT into itemProperty (itemUrlId, itemKey, itemValue) VALUES (?, ?, ?)", [id, pathId ,path])
    }

}