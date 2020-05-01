import { Message } from "discord.js";

type iCommand = (message: Message, args: string[]) => any;

export default iCommand;
