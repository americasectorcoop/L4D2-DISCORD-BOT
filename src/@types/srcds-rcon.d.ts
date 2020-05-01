declare module "srcds-rcon" {
  type iConfig = {
    address: string;
    password: string;
  };

  type iClient = {
    connect: () => Promise<any>;
    command: (command: string) => Promise<any>;
    disconnect: () => Promise<any>;
  };

  export default function(config: iConfig): iClient;
}
