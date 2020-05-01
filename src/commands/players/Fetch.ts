import gamedig, { QueryResult } from "gamedig";
import iCommand from "../iCommand";
import { MessageEmbed } from "discord.js";
import secondsToTime from "../../tools/SecondsToTime";

let g_last_time: number = 0;
let g_server_info: QueryResult | null;

const maps: ObjectOfStrings = {
  c1: "Dead Center",
  c2: "Dark Carnival",
  c3: "Swamp Fever",
  c4: "Hard Rain",
  c5: "The Parish",
  c6: "The Passing",
  c7: "The Sacrifice",
  c8: "No Mercy",
  c9: "Crash Course",
  c10: "Death Toll",
  c11: "Dead Air",
  c12: "Dead Air",
  c13: "Dead Center"
};

const Fetch: iCommand = async function(message, args) {
  try {
    let state = g_server_info;
    const diff_time = (+new Date() - g_last_time) / 1000;

    if (state === null || diff_time > 120) {
      message.reply("fetching player list, please wait");
      state = await gamedig.query({
        type: "left4dead2",
        host: process.env.RCON_IP
      });
      g_last_time = +new Date();
      g_server_info = state;
    }

    let embed = new MessageEmbed().setColor(0x45818e);
    let map_name = getMapName(state.map);
    embed.addField(
      `${state.players.length}/${state.maxplayers} players playing in ${map_name}`,
      `:arrow_right: **[JOIN NOW](${process.env.RCON_DNS}join-server)**`,
      false
    );
    state.players.forEach(buffer => {
      // PATCH: no existe la propieda type definida en los declare
      let player: AnyObject = buffer;
      let { name: playername, time = 0 } = player;
      if (playername && time) {
        embed.addField(playername, secondsToTime(time), true);
      }
    });
    embed.setDescription(`**${state.name}**\n\n`);
    let url_image = `https://${process.env.WEBSITE_DNS}/server/map/${state.map}.jpg`;
    embed.setThumbnail(url_image);
    message.channel.send(embed);
  } catch (error) {
    message.reply(error.message);
  }
};

const getMapName = function(map_name: string): string {
  for (let map in maps) {
    if (map_name.startsWith(map)) {
      let level = map_name.split("_")[1];
      return `${maps[map]}[${level}]`;
    }
  }
  return "undefined";
};

export default Fetch;
