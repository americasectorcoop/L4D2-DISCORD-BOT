import Database from "../../tools/Database";
import iCommand from "../iCommand";

const Register: iCommand = async function (message, args) {
  try {
    message.delete();
    const [steamid = "", password = ""] = args;
    const discordid = message.author.id;
    if (!steamid || !password) {
      return message.reply(
        `please define \`steam_id\` and \`password\`\n\nexample: \`>register STEAM_1:0:79793428 123456\``
      );
    }

    message.reply("fetching data");

    let db = new Database();

    let { results } = await db.select(
      `SELECT
        name, steamid, discordid, discord_password
       FROM
        players
       WHERE
        steamid LIKE ? or
        discordid LIKE ?;`,
      [steamid, discordid]
    );

    if (!Array.isArray(results)) return;

    if (!results.length) {
      return message.reply(`the steamid [${steamid}] don't exist.`);
    }

    if (message.guild === null) return message.reply("guild is null");
    if (message.member === null) return message.reply("member is null");

    const role = await message.guild.roles.fetch(
      process.env.DISCORD_PLAYER_ROLE_ID
    );

    if (role === null) return message.reply("role is null");

    if (
      !results.some(
        (e) => e.discord_password == password && e.steamid == steamid
      )
    ) {
      return message.reply(`you're steam id or password are wrong`);
    }

    for (let item of results) {
      if (item.discordid == discordid) {
        message.member.roles.add(role);
        return message.reply(`you're already registered as ${item.name}`);
      }
    }

    let updated = await db.update(
      "UPDATE players SET discordid = ?, points = points + 3000 WHERE steamid LIKE ? AND (discordid IS NULL or discordid = '');",
      [discordid, steamid]
    );

    if (updated > -1) {
      message.member.roles.add(role);
      return message.reply("welcome to our discord server");
    }
    return message.reply("can't registered you're user, please contact alex");
  } catch (error) {
    console.error(error);
  }
};

export default Register;
