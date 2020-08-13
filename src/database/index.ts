
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

    /**
     * insert a url
     * @param url
     */
    async insertItemUrl(url: string): Promise<number> {
        let instance = DatabaseCore.getInstance()
        let itemUrl = await instance.getAsObject(`SELECT * from itemUrl where url = ?`, [url])
        if (itemUrl.id) {
            return itemUrl.id
        } else {
            await instance.run(`INSERT into itemUrl (url) VALUES (?)`,[url] )
            itemUrl = await instance.getAsObject(`SELECT * from itemUrl where url = ?;`, [url])
            return itemUrl.id
        }
    }

    /**
     * inserts a name
     * @param id
     * @param pathId
     * @param path
     */
    async insertName(id: number, pathId: string, path: string)
    {
        let instance = DatabaseCore.getInstance()
        await instance.run("INSERT into itemProperty (itemUrlId, itemKey, itemValue) VALUES (?, ?, ?)", [id, pathId ,path])
    }

}