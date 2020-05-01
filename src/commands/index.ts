import iCommand from "./iCommand";
import { PlayersSlayAll, PlayerRegister, PlayerFetch } from "./players";
import { ServerRestart } from "./server";
import { Message } from "discord.js";

type iCommandList = {
  public: { [key: string]: iCommand };
  private: { [key: string]: iCommand };
  hasAccess: (message: Message) => boolean;
};

const CommandList: iCommandList = {
  public: {
    ping: (message) => message.reply("yay"),
    register: PlayerRegister,
    online: PlayerFetch,
    players: PlayerFetch,
  },
  private: {
    slayall: PlayersSlayAll,
    restart: ServerRestart,
  },
  hasAccess: (message: Message): boolean => {
    if (message.member !== null) {
      return message.member.hasPermission("KICK_MEMBERS");
    }

    return false;
  },
};

export default CommandList;
