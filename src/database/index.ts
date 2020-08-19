
import {DatabaseCore} from "sqljs-wrapper-cogmios"
import { TextDecoder } from "util"
import * as fse from 'fs-extra'
import * as path from 'path'

export class InternalDatabase {

    // static intance field singleton
    private static instance: InternalDatabase

    // constructor with private access modifier
    private constructor() {
    }

    /**
     * Open database
     * @param databasePath
     */
    async open(databasePath: string) {
        await this.initDatabase(databasePath)
        let instance = DatabaseCore.getInstance()
        await instance.open()
    }

    /**
     * Closes a database connection
     */
    async close() {
        let instance = DatabaseCore.getInstance()
        await instance.close()
    }

    /**
     * Inits a new database
     */
    private async initDatabase(databasePath: string) : Promise<boolean> {
        let instance = DatabaseCore.getInstance()
        try {
            if (databasePath) {
                let database_uri = databasePath
                instance.setLocation(database_uri)
                let schema_query = await fse.readFile(path.join(__dirname, 'schema.sqlite'), 'utf8')
                return await instance.init(schema_query)
            }
        } catch (error) {
            throw error
        }
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
    async insertUrl(url: string): Promise<number> {
        try {
            let instance = DatabaseCore.getInstance()
            await instance.run(`INSERT OR IGNORE INTO Url (url) VALUES (?);`,[url] )
            let urlrecord = await instance.getAsObject(`SELECT * FROM Url WHERE url = ?;`, [url])
            return urlrecord.id
        }
        catch (e) {
            console.error(e, url)
            throw e
        }
    }

    /**
     * Inserts user in database
     * @param user Name of current user
     */
    async insertUser(user: string) : Promise<number> {
        try {
            let instance = DatabaseCore.getInstance()
            await instance.run("INSERT OR IGNORE INTO User (name) VALUES (?);", [user])
            let userRecord = await instance.getAsObject("SELECT * FROM User WHERE name = ?;", [user])
            return userRecord.id
        }
        catch (e) {
            console.error(e, user)
            throw e
        }
    }

    /**
     * Inserts a location
     * @param location string e.g. firefox.01 for a specific firefox profile
     */
    async insertLocation(location: string) : Promise<number> {
        let instance = DatabaseCore.getInstance()
        await instance.run("INSERT OR IGNORE INTO Location (name) VALUES (?);", [location])
        let locationRecord = await instance.getAsObject("SELECT * FROM Location WHERE name = ?;", [location])
        return locationRecord.id
    }

    /**
     * Inserts a root
     * @param root string the unique set of top level names indicating the taxonomy
     */
    async insertRoot(root: string) : Promise<number> {
        let instance = DatabaseCore.getInstance()
        await instance.run("INSERT OR IGNORE INTO Root (name) VALUES (?);", [root])
        let rootRecord = await instance.getAsObject("SELECT * FROM Root WHERE name = ?;", [root])
        return rootRecord.id
    }

    /**
     * inserts a name
     * @param id
     * @param pathId
     * @param path
     */
    async insertName(urlId: number, userId: number, locationId: number, rootId: number, path: string, name: string)
    {
        try {
            let instance = DatabaseCore.getInstance()
            await instance.run("INSERT into Name (urlId, userId, locationId, rootId, path, name) VALUES (?, ?, ?, ?, ?, ?)", [urlId, userId, locationId, rootId, path, name])
        }
        catch (e) {
            console.error(e)
            throw e
        }
    }

}