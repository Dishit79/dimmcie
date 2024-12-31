import { readFileSync, existsSync } from 'node:fs';
import { parseDocument } from "@bearz/dotenv";



export function getEnvVaribles(): Record<string, any> {

    if (existsSync(".env")) {
        const configFile = readFileSync('.env', 'utf8');

        // log('Loading environment variables from .env file...');

        const config = parseDocument(configFile);
        return config.toObject();   
    } else {

        // log('Loading environment variables from environment variables...');
        
        const IP = Deno.env.get('IP')
        const PORT = Number(Deno.env.get('PORT'));
        const SERVERSHUTDOWNLIMIT = Number(Deno.env.get('SERVERSHUTDOWNLIMIT'));
        const PATHTOWHITELIST = Deno.env.get('PATHTOWHITELIST')
        const CONTAINERNAME = Deno.env.get('CONTAINERNAME')
        const CRON = Deno.env.get('CRON')

        return {
            IP,
            PORT,
            SERVERSHUTDOWNLIMIT,
            PATHTOWHITELIST,
            CONTAINERNAME,
            CRON,
           
        }
    }
}
export function log(message: string, ...args: any[]): void {
    console.log(`[${new Date().toLocaleString()}] ${message}`, ...args);
}

export function getFavicon(file : string) {
    const favicon = readFileSync(`./util/img/${file}.txt`, 'utf8')
    return favicon
}