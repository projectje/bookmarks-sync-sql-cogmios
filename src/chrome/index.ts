import { InternalDatabase } from "../database";
const parseJson = require("parse-json");
import * as fse from "fs-extra";
import { isArray } from "util";

export class Chrome {
  public id: string;
  public path: string;

  constructor() {}

  /**
   *
   * @param title
   * @param node
   */
  async parseNode(title: string, node: any) {
    if (title === null || title === '') { title = "untitled"}
    if (node.type === "url") {
      let interndatabase = InternalDatabase.getInstance();
      let id = await interndatabase.insertItemUrl(node.url);
      let name =  (node.name.trim() != '') ? node.name : "untitled"
      await interndatabase.insertName(id, this.id, title + "\\" + name);
      return true
    } else if (node.type === "folder") {
      await this.parseNodes(title + "\\" + node.name, node.children);
    }
  }

  /**
   * Parse one node in the json bookmark file
   * @param title
   * @param node
   */
  async parseNodes(title: string, node: any) {
    if (Array.isArray(node)) {
      for(const nodeItem of node) {
        let result = await this.parseNode(title, nodeItem);
      }
    } else {
      let result = await this.parseNode(title, node);
    }
  }

  /**
   * Traverse chrome json bookmark file
   */
  async traverse() {
    let json = fse.readFileSync(this.path, "utf8");
    let chromeJsonBookmarks = JSON.parse(json);
    if (chromeJsonBookmarks.roots.bookmark_bar) {await this.parseNodes("/bookmarkbar/", chromeJsonBookmarks.roots.bookmark_bar)}
    if (chromeJsonBookmarks.roots.other) {await this.parseNodes("/other/", chromeJsonBookmarks.roots.other)}
    if (chromeJsonBookmarks.roots.synced) {await this.parseNodes("/synced/", chromeJsonBookmarks.roots.synced)}
    return true;
  }
}
