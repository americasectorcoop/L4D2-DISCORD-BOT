import srcdsRcon from "srcds-rcon";

const rcon_client = srcdsRcon({
  address: process.env.RCON_IP,
  password: process.env.RCON_PASSWORD
});

export default async function(command: string): Promise<any> {
  await rcon_client.connect();
  const response = await rcon_client.command(command);
  rcon_client.disconnect();
  return response;
}
