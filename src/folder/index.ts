import * as path  from 'path'
import * as ini from 'ini'
import util = require('util')
import * as fs from 'fs'
export const readdir = util.promisify(fs.readdir);
import {InternalDatabase} from "../database"

/**
 * Reads a directory of URL files
 */
export class ParseUrl {

  /**
   *
   */
  public constructor() {}

  /**
   *
   * @param dir
   * @param userId
   * @param locationId
   * @param rootLength
   */
  public async traverse(dir: string, userId: number, locationId: number, rootLength: number) {
        //console.log('traversing dir')
        const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
          const res = path.resolve(dir, dirent.name);
          if (dirent.isDirectory()) {
            let fullrelativepath = dir.substr(rootLength);
            let child = dirent.name;
            let relativeroot = fullrelativepath.split(path.sep)[1]
            await this.traverse(res, userId, locationId, rootLength);
            // scan directories for meta files, with a meta file propertise over all urls can be set
            //console.log(fullrelativepath)
            //console.log(child)
            //console.log(relativeroot)
          } else {
            let pathname = `${dir.substr(rootLength)}`
            let termname = `${dirent.name.split('.').slice(0, -1).join('.')}`
            var file = ini.parse(fs.readFileSync(`${dir}${path.sep}${dirent.name}`, 'utf-8'))
            let interndatabase = InternalDatabase.getInstance()
            if (file && file.InternetShortcut && file.InternetShortcut.URL) {
              let urlId = await interndatabase.insertUrl(file.InternetShortcut.URL)
              await interndatabase.insertName(urlId, userId, locationId, 0, pathname, termname)
            }
            // now e.g. reddit
            // a. add as url e.g. https://www.reddit.com/r/sharepoint/
            // b. give name as /reddit/sharepoint
            // c. because there is a name tags/sharepoint to both they are linked
          }
        }
      }

}