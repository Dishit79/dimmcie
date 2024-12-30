import { readFileSync, existsSync } from 'node:fs';
import { parseDocument } from "@bearz/dotenv";



export function getEnvVaribles(): Record<string, any> {

    if (existsSync(".env")) {
        const configFile = readFileSync('.env', 'utf8');

        const config = parseDocument(configFile);
        return config.toObject();   
    } else {

        const IP = Deno.env.get('IP')
        const PORT = Deno.env.get('PORT')
        const SERVERSHUTDOWNLIMIT = Deno.env.get('SERVERSHUTDOWNLIMIT')
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

export async function sleep(ms:number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function log(message: string, ...args: any[]): void {
    console.log(`[${new Date().toLocaleString()}] ${message}`, ...args);
}
