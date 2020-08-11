import * as path  from 'path'
import * as ini from 'ini'
import util = require('util')
import * as fs from 'fs'
import {DatabaseCore} from "sqljs-wrapper-cogmios"
export const readdir = util.promisify(fs.readdir);
import {InternalDatabase} from "../database"

/**
 * Reads a directory of URL files
 */
export class ParseUrl {

  public rootLength: number
  public pathId: string

  public constructor() {}

  public async traverse(dir: string) {
        //console.log('traversing dir')
        const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
          const res = path.resolve(dir, dirent.name);
          if (dirent.isDirectory()) {
            let fullrelativepath = dir.substr(this.rootLength);
            let child = dirent.name;
            let relativeroot = fullrelativepath.split(path.sep)[1]
            await this.traverse(res);
            // scan directories for meta files, with a meta file propertise over all urls can be set
            //console.log(fullrelativepath)
            //console.log(child)
            //console.log(relativeroot)
          } else {
            let fullname = `${dir}${path.sep}${dirent.name}`
            let name = `${dir.substr(this.rootLength)}${path.sep}${dirent.name.split('.').slice(0, -1).join('.')}`;

            var file = ini.parse(fs.readFileSync(fullname, 'utf-8'))
            let interndatabase = new InternalDatabase()
            let id = await interndatabase.insertItemUrl(file.InternetShortcut.URL)
            await interndatabase.insertName(id, this.pathId, name)
          }
        }
      }

}