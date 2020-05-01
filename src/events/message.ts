import { prefix } from "../config.json";
import { Message } from "discord.js";
import CommandList from "../commands";
import parser from "discord-command-parser";

export default function(message: Message) {
  try {
    const parsed = parser.parse(message, prefix);
    if (parsed.success) {
      if (parsed.command in CommandList.public) {
        CommandList.public[parsed.command](message, parsed.arguments);
      } else if (parsed.command in CommandList.private) {
        if (CommandList.hasAccess(message)) {
          CommandList.private[parsed.command](message, parsed.arguments);
        } else {
          message.reply(`you don't have access to ${parsed.command}`);
        }
      } else {
        message.reply(`the command \`${parsed.command}\` doesn't exist`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
