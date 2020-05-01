import iCommand from "../iCommand";
import rcon from "../../tools/Rcon";

const SlayAll: iCommand = async function(message) {
  try {
    message.reply("Killing all");
    let response = await rcon("sm_slay @all");
    message.reply(`everything seems fine\n${response.trim()}`);
  } catch (error) {
    message.reply(`something it's wrong ${error.message}`);
  }
};

export default SlayAll;
