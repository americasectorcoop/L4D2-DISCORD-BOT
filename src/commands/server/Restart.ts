import iCommand from "../iCommand";
import rcon from "../../tools/Rcon";

const restart: iCommand = async function(message) {
  try {
    message.reply("Trying to restart server");
    let response = await rcon("sm_restart");
    message.reply(`everything seems fine\n${response.trim()}`);
  } catch (error) {
    message.reply(`something it's wrong ${error.message}`);
  }
};

export default restart;
