"use strict";

require('./lib/prototypes');

const config = require('./config');
const Discord = require('discord.js');
const database = require('./lib/mysql.class');
const ssh = require('./lib/ssh.class');
const srcdsRcon = require('srcds-rcon');
const translate = require('google-translate-api');
const Gamedig = require('gamedig');
const bot = new Discord.Client();

const SERVER_LINK = `steam://connect/${config.rcon.dns}:${config.rcon.port}`;
const SERVER_WEBSITE = `https://americasectorcoop.org/`;

const rcon = srcdsRcon({
	address: config.rcon.ip,
	password: config.rcon.pwd
});

var serverInfo = new Object();

/**
 * Al estar la aplicacion lista
 */
bot.on("ready", () => {
	console.log('Ready bot');
	bot.user.setActivity('Left 4 Dead 2', {
		url: "https://americasectorcoop.org",
		type: "STREAMING"
	});
});

/**
 * Al obtener un nuevo mensaje dentro del servidor
 */
bot.on("message", (message) => {
	try {
		if (!message.author.equals(bot.user)) {
			let full_msg = message.content;
			// Verificando si en configuración existe el comando
			if (config.discord.messages.command.prefix.includes(full_msg.charAt(0))) {
				if(config.discord.messages.command.prefixSilent.includes(full_msg.charAt(0))) {
					message.delete();
				}
				let args = full_msg.substring(1).split(" ");
				let command = args[0].toLowerCase();
				args.shift();
				let params = args.join(' ');
				params = params.replaceAll([`\”`], '"');
				switch (command) {
					case 'ip': {
						message.reply(`you can try connecting from console with the next command:\n\nconnect ${config.rcon.dns}:${config.rcon.port}\n\nOr click here to connect => ${SERVER_LINK}`);
						break;
					}
					case 'website': { // all channel
						message.reply('https://americasectorcoop.org');
						break;
					}
					case 'vip': { //all channel
						message.reply('Visit: http://vip.americasectorcoop.org');
						break;
					}
					case 'players': { // #bot-spam only
						serverStatus(message);
						break;
					}
					case 'activity': {  // #admins only
						message.reply('Aleexx its working on this');
						break;
					}
					case 'help': { //all channel
						comand_list(message);
						break;
					}
					case 'en': { //all channel
						if (params === '') {
							message.reply(`please define on the first argument text to be translated`);
							return;
						}
						let content = full_msg.replace('!' + command, '');
						googleTranslate(message, 'en', content);
						break;
					}
					case 'es': { //all channel
						if (params === '') {
							message.reply(`please define on the first argument text to be translated`);
							return;
						}
						let content = full_msg.replace('!' + command, '');
						googleTranslate(message, 'es', content);
						break;
					}
					case 'translate': { // #admins only
						message.reply(`please use \`\`!en\`\` `);
						break;
					}
					case 'translate_es': { // #admins only
						message.reply(`please use \`\`!es\`\` `);
						break;
					}
					case 'spas': { // #admins only
						discordRcon(message, `sm_spas`);
						break;
					}
					case 'next': { // #admins only
						discordRcon(message, `help sm_kick`);
						break;
					}
					case 'restart': { // #admins only
						restartServer(message);
						break;
					}
					case 'slayall': { // #admins only
						discordRcon(message, `sm_slay @all`);
						break;
					}
					case 'kick': { // #admins only
						if (params === '') {
							message.reply(`please define on the first argument the player`);
							return;
						}
						discordRcon(message, `sm_kick ${params}`);
						break;
					}
					case 'votemap': { // #admins only
						if (params === '') {
							message.reply(`please define on the first argument the map name`);
							return;
						}
						discordRcon(message, `sm_votemap ${params}`);
						break;
					}
					case 'test': {
						if(message.member.id == config.discord.owner_id) {
							try {

								
								

								message.reply(steam_id);
								message.reply(password);
							} catch (error) {
								message.reply('error' + error.toString());
							}
							// if() {
								// message.member.addRole(config.discord.groups.players);
							// } else {
								// message.reply(message.member.roles.map(role => {
								// 	return role;
								// }))
							// }
							
						} else {
							message.reply('no apto para pendejos')
						}
						break;
					}
					case 'changemap': { // #admins only
						if (params === '') {
							message.reply(`please define on the first argument the map name`);
							return;
						}
						discordRcon(message, `sm_map ${params}`);
						break;
					}
					case 'ban': { // #admins only
						if (params === '') {
							message.reply(`please define on the first argument the player`);
							return;
						}
						console.log('banned', params);
						message.reply('parametros => ' + params);
						discordRcon(message, `sm_ban ${params}`);
						break;
					}
					case 'register': { // all chanel
						let steam_id = (args[0] || '').replaceAll(['\"', "\'", "\”"], "");
						let password = (args[1] || '').replaceAll(['\"', "\'", "\”"], "");
						if(steam_id) {
							if(password) {
								message.delete();
								rewardWithPoints(message, steam_id, password, message.author.id);
							} else {
								message.reply('please define your password, join to server and use command ``!register``.\n\n[REGISTER] ``!register <steam-id> <password>``\n\nNote: don\'t use < > for define the parameters');
							}
						} else {
							message.reply('please define your steam id and your password, for get your password join to server and use command ``!register``.\n\n[REGISTER] ``!register <steam-id> <password>``.\n\nNote: don\'t use < > for define the parameters');
						}
						break;
					}
					case 'monitor': {
						if (message.member.hasPermission("KICK_MEMBERS") && message.channel.id == config.discord.channels.bot_spam_admin || message.author.id == config.id_god) {
							monitorServer(message);
						} else {
							message.reply(`sorry you don't have access to this command`);
						}
						break;
					}
					case 'realrestart': {
						if (message.member.hasPermission("KICK_MEMBERS") && message.channel.id == config.discord.channels.bot_spam_admin || message.author.id == config.id_god) {
							realRestartServer(message);
						} else {
							message.reply(`sorry you don't have access to this command`);
						}
						break;
					}
					case 'update':{
						if (message.member.hasPermission("KICK_MEMBERS") && message.channel.id == config.discord.channels.bot_spam_admin || message.author.id == config.id_god) {
							updateServer(message);
						} else {
							message.reply(`sorry you don't have access to this command`);
						}
						break;
					}
					case 'dev': {
						if (message.member.roles.find("name", "leader") || message.member.roles.find("name", "dev")) {
							if (params !== '') {
								commandRcon(params).then(response => {
									if (response !== '') {
										if (response.length < 1800) {
											message.reply(`\`\`\`${response}\`\`\``);
										} else {
											message.reply(`output its really big for show in Discord`);
										}
									} else {
										message.reply('successfully sent. The server answered empty.')
									}
								}).catch(error => handleError(error, message));
							} else {
								message.reply(`define an argument`);
							}
						} else {
							message.reply(`just leaders and devs can use this command`);
						}
						break;
					}
					default: {
						message.reply('Invalid command, please use ``!help``');
						break;
					}
				}
			}
		}
	} catch (error) {
		console.error(error);
	}
});

const monitorServer = async function(message = {}) {
	try {
		await ssh.exec('./l4d2server monitor', function(data) {
			data = data.toString();
			if(data !== '') {
				message.channel.send(data);
			}
		});
		ssh.close();
		message.reply('[monitor] finish');
	} catch (error) {
		message.reply('[monitor] error');
		handleError(error, message);		
	}
}


const updateServer = function(message = {}) {
	message.reply('are you sure you want to restart the server? Write ``yes`` to confirm.').then(() => {
		message.channel.awaitMessages(response => response.author.id == message.author.id && response.content == 'yes', {
			max: 1,
			time: 10000,
			errors: ['time'],
		}).then(async (collected) => {
			function onmessage(data) {
				data = data.toString();
				if(data !== '') {
					message.channel.send(data);
				}
			}
			message.reply(`server waiting for update, we are going to try to stop the service:`);
			await ssh.exec('./l4d2server stop', onmessage);
			message.reply('the service has been trying to stopped correctly. Now we wil try update the server:');
			await ssh.exec('./l4d2server update', onmessage);
			message.reply('we have finished trying to update the service. We will try to initialize the service:');
			await ssh.exec('./l4d2server start', onmessage);
			message.reply('the service was initialized. Check if everything seems fine...');
			ssh.close();
		}).catch((error) => {
			message.reply('the server update was canceled.');
			handleError(error, message);
		});
	});
}

const handleError = function(error, message) {
	if(typeof error == 'object') {
		for(let key in error) {
			message.reply('[ERROR] ' + error[key]);
		}
	} else if(typeof error == 'string') {
		message.reply('[ERROR] ' + error);
	}
}


/**
 * Metodo para traducir con Google Traslate
 * @param {*} message 
 * @param {*} lang 
 * @param {*} content 
 */
const googleTranslate = function (message = {}, lang, content) {
	try {
		translate(content, { to: lang }).then(res => {
			let translated_content = res.text;
			let embed = new Discord.RichEmbed()
				.setColor(0x45818E)
				.setAuthor(message.author.username.capitalize(), urlProfilePicture(message.author.id, message.author.avatar))
				.setDescription(translated_content)
				.setFooter("Message traslated with Botsito and Google Translate", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/2000px-Google_Translate_logo.svg.png")
				.setTimestamp()
			message.channel.send(embed);
			if(!config.discord.messages.command.prefixSilent.includes(message.content.charAt(0))) {
				message.delete();
			}
		}).catch(err => {
			console.error(err);
			handleError(error, message);
		});
	} catch (error) {
		console.error(error);
		handleError(error, message);
	}
}

const urlProfilePicture = function(id_client = 0, id_picture = 0, size = 128) {
	return `https://cdn.discordapp.com/avatars/${id_client}/${id_picture}.png?size=${size}`;
}

/**
 * Metodo para reiniciar el servidor
 * @param {*} message 
 */
const restartServer = function (message = {}) {
	message.reply('are you sure you want to simulte a restart for the server? Write ``yes`` to confirm.').then(() => {
		message.channel.awaitMessages(response => response.author.id == message.author.id && response.content == 'yes', {
			max: 1,
			time: 10000,
			errors: ['time'],
		}).then((collected) => {
			discordRcon(message, `sm_restart`);
			message.reply(`Server restarted!`);
		}).catch((e) => {
			message.reply('the server restart was canceled.');
			handleError(error, message);
		});
	});
}

/**
 * Metodo para reiniciar el servidor
 * @param {*} message 
 */
const realRestartServer = function (message = {}) {
	message.reply('are you sure you want to real restart the server? Write ``yes`` to confirm.').then(() => {
		message.channel.awaitMessages(response => response.author.id == message.author.id && response.content == 'yes', {
			max: 1,
			time: 10000,
			errors: ['time'],
		}).then(async(collected) => {
			await ssh.exec('./l4d2server restart', function (data) {
				data = data.toString();
				if(data !== '') {
					message.channel.send(data);
				}
			});
			message.reply('the service was initialized. Check if everything seems fine...');
			ssh.close();
		}).catch((e) => {
			message.reply('the server real restart was canceled.');
			handleError(error, message);
		});
	});
}

/**
 * Metodo para enviar un comando al servidor a traves de discord
 * @param {*} message 
 * @param {*} command 
 */
const discordRcon = function (message, command) {
	if (message.member.hasPermission("KICK_MEMBERS") && message.channel.id == config.discord.channels.bot_spam_admin || message.author.id == config.id_god) {
		commandRcon(command)
			.then(output => message.reply(`\`\`\`${output}\`\`\``))
			.catch(error => {
				message.reply(`Error from command rcon => ${command}`);
				handleError(error, message);
			});
	} else if (message.member.hasPermission("KICK_MEMBERS")) {
		message.reply(`please use #admin-bot-spam`);
	} else {
		message.reply(`sorry you don't have access to this command`);
	}
}

/**
 * Metodo para enviar un comando al servidor
 * @param {*} command 
 */
const commandRcon = async function (command) {
	return new Promise((resolve, reject) => {
		rcon.connect().then(() => {
			rcon.command(command).then(response => {
				rcon.disconnect();
				resolve(response);
			}).catch(function (e) {
				rcon.disconnect();
				reject(e);
			});
		}).catch(e => reject(e));
	});
}

/**
 * Comand list helper
 * @param {Object} message
 */
// use on all chanel?
const comand_list = function (message = {}) {
	var admin_text = '';
	var user_trext = "**User commands**\n" +
		"\`\`\`asciidoc\n" +
		"= User comands =\n" +
		"!players                     :: Display online players.\n" +
		"!map                         :: Display current map.\n" +
		"!en <your message>           :: Translates your message into English\n" +
		"!es <your message>           :: Translates your message into Spanish\n" +
		"!ip                          :: Display server IP\n" +
		"!website                     :: Display server website\n" +
		"!vip                         :: Get VIP status\n" +
		"!register <Steam ID>         :: Get 1000 points bonus!\`\`\` \n";

	if (message.channel.id == config.discord.channels.bot_spam_admin) {
		admin_text = "\n**Admin commands**\n" +
			"\`\`\`asciidoc\n" +
			"= Admin comands =\n" +
			"!changemap <map name>        :: Change server map.\n" +
			"!kick <player name> <reason> :: Kick player.\n" +
			"!votemap <map name>          :: Start vote map.\n" +
			"!slayall                     :: Slay all players.\n" +
			"!ban <player name> <time>    :: Ban player.\n" +
			"!activity                    :: Display last staff activity on server.\n" +
			"!restart                     :: Fake festart for server.\n" +
			"!realrestart                 :: Real restart for server. Use in case of many problems.\n" +
			"!update                      :: Update server when there exist a new version.\n" +
			"!spas                        :: Gives spas to all players\`\`\` \n";
	}
	message.reply(user_trext + admin_text);
}

/**
 * Metodo para imprimir los jugadores en linea
 * @param {Object} message
 */
const serverStatus = async function (message = {}) {
	try {
		if (message.channel.id == config.discord.channels.bot_spam) {
			let embed = new Discord.RichEmbed().setColor(0x45818E);
			let lastTime = isNaN(serverInfo.lastTime) ? 0 : serverInfo.lastTime + 180000;
			let timeMax = +new Date();
			let updating = timeMax > lastTime;
			if (updating || !Array.isArray(serverInfo.playersOnline)) {
				await startQuery(updating);
			}
			embed.addField(`${serverInfo.players.length}/${serverInfo.maxplayers} players connected playing on ${serverInfo.map}`, `:arrow_right: **[JOIN NOW](${SERVER_WEBSITE}join-server)**`, false);
			serverInfo.players.forEach(player => {
				embed.addField(player.name, secondsToTime(player.time), true);
			});
			embed.setDescription(`**${serverInfo.name}**\n\n`);
			embed.setThumbnail(`${SERVER_WEBSITE}server/map/${serverInfo.map}.jpg`);
			message.channel.send(embed);
		} else {
			message.reply(`please use #bot-spam channel!`);
		}
	} catch (e) {
		console.log(e);
	}
}

/**
 * Metodo para ordenas jugadores por tiempo
 * Method for sort player by time
 * @param {array of objects} players
 */
function sortPlayersByTime(players = []) {
	return new Promise(resolve => {
		if (Array.isArray(players)) {
			let i = 0, j = 0, temp = new Array();
			let length = players.length;
			for (i = 1; i < length; i++) {
				for (j = 0; j < length - i; j++) {
					if (players[j].time < players[j + 1].time) {
						temp = players[j];
						players[j] = players[j + 1];
						players[j + 1] = temp;
					}
				}
			}
		}
		resolve(players);
	});
}


/**
 * Funcion para premiar con puntos a un jugador
 * @param {Object} message
 * @param {String} steamid
 * @param {String} discordid
 */
const rewardWithPoints = async function (message, steamid, password, discordid) {
	steamid = steamid.replaceAll(['<', '>'], '');
	let response = await database.query('SELECT name, discord_password FROM players WHERE steamid LIKE ?;', [steamid]);
	if(response.results.length) {
		let player_steam = response.results[0];
		if(player_steam.discord_password == password) {
			response = await database.query('SELECT name FROM players WHERE discordid = ?;', [discordid]);
			let player_discord = response.results[0];
			if(response.results.length == 0) {
				response = await database.query('SELECT name FROM players WHERE steamid LIKE ? AND discordid IS NULL;', [steamid])
				if(response.results.length) {
					if(await database.update('UPDATE players SET discordid = ?, points = points + 3000 WHERE steamid LIKE ? AND discordid IS NULL;', [discordid, steamid]) >= 1) {
						const role = message.guild.roles.find('name', 'players');
						message.member.addRole(role);
						message.reply(`welcome to our discord server, you are reward with 3000 points`);
					} else {
						message.reply('can\'t update your profile, please report to Aleexxx')
					}
				} else {
					message.reply(`you are already registered.`);
				}
			} else {
				message.reply(`you are already registered as ${player_discord.name}.`);
			}
		} else {
			message.reply('the password that you set is not valid.\n Join to server and use command !register for get your real password.');
		}
	} else {
		message.reply(`the steamid [${steamid}] don't exist.`);
	}
};

/**
 * Metodo para convertir el tiempo a entero
 * Method for conver time to int
 * @param {string} time
 */
const secondsToTime = function (time) {
	time = Math.round(time);
	var hours = Math.floor(time / 3600);
	var minutes = Math.floor((time % 3600) / 60);
	var seconds = time % 60;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	return hours + ":" + minutes + ":" + seconds;  // 2:41:30
}

function startQuery(forced = false) {
	try {
		Gamedig.query({
			type: 'left4dead2',
			host: 'l4d.io'
		}).then(async state => {
			serverInfo = state;
			serverInfo.players = await sortPlayersByTime(serverInfo.players);
			await updatePlayersToDB();
			if (forced == false) {
				setTimeout(startQuery, 120000);
			}
		}).catch((error) => {
			setTimeout(startQuery, 120000);
		});
	} catch (error) {
		setTimeout(startQuery, 120000);
	}
}

const updatePlayersToDB = async function () {
	return new Promise(async(resolve, reject) => {
		let response = await database.insert(`INSERT INTO online (server_info, date_time) VALUES (?, CURRENT_TIMESTAMP);`, [JSON.stringify(serverInfo)])
		console.log('players updated')
		serverInfo.lastTime = +new Date()
		resolve(response)
	});
}


// const updateStripperFiles = async function(message) {
// 	message.reply('starting to copy all the strippers files')
// 	const ncp = require('ncp').ncp;
// 	let source = '/home/l4d2/serverfiles/left4dead2/addons/stripper/maps'
// 	let destination = '/home/production/serverfiles/left4dead2/addons/stripper/maps'
// 	ncp.limit = 16;
// 	ncp(source, destination, function (err) {
// 		if (err) {
// 			message.reply(`error copying the strippers files`)
// 		} else {
// 			message.reply(`finished copying all the strippers files successfully`)
// 		}
// 	});
// }


bot.login(config.discord.token);

startQuery();