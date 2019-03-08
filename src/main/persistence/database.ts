import * as Realm from 'realm';

export default class Database {
  private conn;
  constructor() {

  }

  connect() {
    this.conn = new Realm();
  }
}