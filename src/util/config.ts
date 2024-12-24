import { readFileSync } from 'fs';
import { env } from 'os';
import { parse, stringify } from "jsr:@std/yaml";

class Config{
    ip: string;
    port: number;
    serverShutdownLimit: number;
    pathToWhitelist: string;
    constructor(){
        const configFile = readFileSync('./dimmice.yml', 'utf8');
        const config = parse(configFile);
        this.ip = config.IP || Deno.env.get('IP') || '127.0.0.1';
        this.port = config.Port || parseInt(Deno.env.get('PORT') || '', 10) || 25565;
        this.serverShutdownLimit = config.ServerShutdownLimit || parseInt(Deno.env.get('SERVERSHUTDOWNTIME') || '', 10) || 1800000;
        this.pathToWhitelist = config.PathToWhitelist || Deno.env.get('PATHTOWHITELIST') || './whitelist.json';
    }
}
