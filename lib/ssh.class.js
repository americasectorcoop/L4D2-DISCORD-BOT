"use strict";

require('./prototypes');

let config = require('./../config');

class Shell {

	constructor() {
		this.connection = null;
		this.promiseConnection = null;
	}

	async connect() {
		return new Promise((resolve, reject) => {
			try {
				this.connection = new (require('ssh2').Client)();
				this.connection.on('ready', () => {
					resolve(true);
				}).on('error', function(err) {
					reject(err);
				}).connect(config.ssh);
			} catch(error) {
				reject(error);
			}
		})
	}

	async getConnection() {
		if(this.connection == null) {
			await this.connect();
		}
		return true;
	}

	async exec(command, onResponse) {
		return new Promise(async(resolve, reject) => {
			try {
				if(await this.getConnection()) {
					this.connection.exec(command, async(error, stream) => {
						if(!error) {
							let tpl = new Array();
							stream.on('close', function(code, signal) {
								resolve(tpl.join(''));
							}).on('data', async (data) => {
								data = await this.encode_utf8(data.toString());
								if(typeof onResponse == 'function') {
									onResponse(data);
								}
							}).stderr.on('data', async (data) => {
								data = await this.encode_utf8(data.toString());
								if(typeof onResponse == 'function') {
									onResponse(data);
								}
							});
						} else {
							reject(error);
						}
					})
				} else {
					throw new Error('Por favor inicie la conexion');
				}
			} catch (error) {
				// console.log(error)
				reject(error)
			}
		})
	}

	async close() {
		try {
			if(this.connection !== null && this.connection !== undefined) {
				await this.connection.end();
				this.connection = null;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async encode_utf8(s) {
		return '~ ' + s.replaceAll([
			'[K',
			'[36m',
			'[32m',
			'[36m',
			'[0m',
			'[31m',
			'[33m'
		], '');
	}
}

module.exports = new Shell();