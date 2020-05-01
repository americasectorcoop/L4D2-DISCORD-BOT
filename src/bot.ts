if (!process.env.PRODUCTION) {
  console.log("debuggind...");
  require("dotenv").config();
}

import { Client } from "discord.js";
import { OnMessage, OnReady } from "./events";

const client: Client = new Client();

client
  .on("ready", OnReady)
  .on("message", OnMessage)
  .login(process.env.DISCORD_TOKEN);
