"use strict";

const config = require('./../config');
const mysql = require('mysql');

class MySQL {
	constructor() {
		this.pool = mysql.createPool(config.mysql);
	}

	async query($sqlcommand = '', $params = []) {
		return new Promise((resolve, reject) => {
			this.pool.getConnection(function (err, connection) {
				if (!err) {
					connection.query($sqlcommand, $params, function (err, results, fields) {
						let response = {
							error: err,
							results,
							fields
						}
						if (!err) {
							resolve(response);
						} else {
							reject(response);
						}
						connection.release();
					});
				} else {
					reject(err);
				}
			});
		});
	}

	async insert($sqlcommand = '', $params = []) {
		try {
			let response = await this.query($sqlcommand, $params);
			let affectRows = response.results.affectedRows;
			if(affectRows == 0) {
				return 0;
			}
			return 1;
		} catch (error) {
			
		}
		return -1;
	}

	async update($sqlcommand = '', $params = []) {
		try {
			let response = await this.query($sqlcommand, $params);
			let affectRows = response.results.affectedRows;
			if(affectRows == 0) {
				return 0;
			}
			return 1;
		} catch (error) {
			
		}
		return -1;
	}
}

module.exports = new MySQL();