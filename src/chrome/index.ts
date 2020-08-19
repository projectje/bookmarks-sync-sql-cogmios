import { InternalDatabase } from "../database";
const parseJson = require("parse-json");
import * as fse from "fs-extra";
import { isArray } from "util";

export class Chrome {
  public user: string
  public namespace: string
  public path: string

  /**
   * constructor
   */
  constructor() {}

  /**
   *
   * @param userId number
   * @param locationId number
   * @param rootId number
   * @param title string
   * @param node any
   */
  async parseNode(userId: number, locationId: number, rootId: number, title: string, node: any) : Promise<boolean> {
    //if (title === null || title === '') { title = "untitled"}
    //if (title.startsWith('untitled')) {
    //  title = title.substring('untitled'.length+1)
    //}
    if (node.type === "url") {
      let interndatabase = InternalDatabase.getInstance();
      let urlId = await interndatabase.insertUrl(node.url);
      let name =  (node.name.trim() != '') ? node.name : "untitled"
      await interndatabase.insertName(urlId, userId, locationId, rootId, title + "\\" + name);
      return true
    } else if (node.type === "folder") {
      await this.parseNodes(userId, locationId, rootId, title + "\\" + node.name, node.children);
    }
  }

  /**
   * Handles either node (toplevel) or array of nodes (further down)
   * @param title
   * @param node
   */
  async parseNodes(userId: number, locationId: number, rootId: number, title: string, node: any) : Promise<boolean> {
    if (Array.isArray(node)) {
      for(const nodeItem of node) {
        let result = await this.parseNode(userId, locationId, rootId, title, nodeItem);
      }
    } else {
      let result = await this.parseNode(userId, locationId, rootId, title, node);
    }
    return true
  }

  /**
   * Traverse chrome json bookmark file
   */
  async traverse(userId: number, locationId: number, path: string) : Promise<boolean> {
    let json = fse.readFileSync(path, "utf8");
    let chromeJsonBookmarks = JSON.parse(json);

    // handle the roots, these have external and internal names
    let interndatabase = InternalDatabase.getInstance()
    let rootId = await interndatabase.insertRoot("bookmarkbar")
    await this.parseNodes(userId, locationId, rootId, "", chromeJsonBookmarks.roots.bookmark_bar.children)
    rootId = await interndatabase.insertRoot("other")
    await this.parseNodes(userId, locationId, rootId, "", chromeJsonBookmarks.roots.other.children)
    rootId = await interndatabase.insertRoot("synced")
    await this.parseNodes(userId, locationId, rootId, "", chromeJsonBookmarks.roots.synced.children)

    return true;
  }
}
