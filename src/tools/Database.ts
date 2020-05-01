"use strict";

import mysql from "mysql";

interface iQueryResponse {
  results: any;
  fields: mysql.FieldInfo[] | undefined;
}

export default class Database {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    });
  }

  getConnection(): Promise<mysql.Connection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection(function(err, connection) {
        if (!err) resolve(connection);
        else reject(err);
      });
    });
  }

  private query(
    $sqlcommand = "",
    $params?: Array<any>
  ): Promise<iQueryResponse> {
    return new Promise(async (resolve, reject) => {
      let connection = await this.getConnection();
      connection.query($sqlcommand, $params, function(err, results, fields) {
        let response: iQueryResponse = {
          results,
          fields
        };
        if (!err) resolve(response);
        else reject(err);
      });
    });
  }

  async select(
    $sqlcommand: string,
    $params?: Array<any>
  ): Promise<iQueryResponse> {
    return await this.query($sqlcommand, $params);
  }

  async insert($sqlcommand: string, $params?: Array<any>): Promise<number> {
    try {
      let { results } = await this.query($sqlcommand, $params);
      let { affectedRows } = results;
      return affectedRows;
    } catch (error) {
      console.error(error);
    }
    return -1;
  }

  async update($sqlcommand: string, $params?: Array<any>): Promise<number> {
    try {
      let { results } = await this.query($sqlcommand, $params);
      let { affectedRows } = results;
      return affectedRows;
    } catch (error) {
      console.error(error);
    }
    return -1;
  }
}
