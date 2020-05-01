declare namespace NodeJS {
  export interface ProcessEnv {
    PRODUCTION: string;
    DISCORD_TOKEN: string;
    RCON_IP: string;
    RCON_DNS: string;
    RCON_PORT: string;
    RCON_PASSWORD: string;
    DISCORD_PLAYER_ROLE_ID: string;
    WEBSITE_DNS: string;
    DATABASE_NAME: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
  }
}
