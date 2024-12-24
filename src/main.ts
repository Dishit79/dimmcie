import { time } from "console";
import { serverHealth } from "./minecraft.ts";

const IP = '127.0.0.1';
const PORT = 25565;
const SERVERSHUTDOWNLIMIT = 1800000

let lastCase:number = 999

async function main() {

    const serverStat =  await serverHealth(IP, PORT)

    if (serverStat) {
        return
    }

    if (lastCase == 999) {
        lastCase = Date.now()
    }

    if (Date.now() - lastCase > SERVERSHUTDOWNLIMIT) {

    
    
}