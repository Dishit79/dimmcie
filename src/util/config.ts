import { readFileSync, existsSync } from 'node:fs';
import { parseDocument } from "@bearz/dotenv";



export function getEnvVaribles(): Record<string, any> {

    if (existsSync(".env")) {
        console.log("Using .env file")
        const configFile = readFileSync('.env', 'utf8');

        const config = parseDocument(configFile);
        return config.toObject();   
    } else {

        console.log("Using environment variables")

        const IP = Deno.env.get('IP')
        const PORT = Deno.env.get('PORT')
        const SERVERSHUTDOWNLIMIT = Deno.env.get('SERVERSHUTDOWNTIME')
        const PATHTOWHITELIST = Deno.env.get('PATHTOWHITELIST')

        return {
            IP,
            PORT,
            SERVERSHUTDOWNLIMIT,
            PATHTOWHITELIST,
            
        }
    }
}

export async function sleep(ms:number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}