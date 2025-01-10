import mc from 'npm:minecraft-protocol';
import { getEnvVaribles, log, getFavicon } from "./util/config.ts";
import { startServer } from "./util/docker.ts"; 
import { serverHealth } from "./util/minecraft.ts";
const ENV = getEnvVaribles()

const sleepFav = getFavicon("sleep")
const wakingFav = getFavicon("waking")

export class PlaceHolderServer {

    private server: mc.Server | null = null
    public running: boolean = false
    private endCycle: number = 0
    private startJavaServer: boolean = false
    constructor() {

    }
   
    init() {
        this.server = mc.createServer({
            'online-mode': false, // Disable online authentication   
            host: '0.0.0.0',      // Bind to all available network interfaces
            port: 25567, // Minecraft port
            version: false,    // Match supported Minecraft version
            motd: '\u00A7cServer is asleep... \u00A7r\nJoin server to start.',
            favicon: sleepFav,
            maxPlayers: 0,       // Set the maximum number of players
        });

        log('Placeholder Server started.');
        this.running = true

        this.server.on('login', async (client) => {
            const username = client.username;
            console.log(`Player joined: ${username}`);

            if (this.startJavaServer) {
                client.end('The server is already starting!')
            }

            if (await checkUsername(username)) {
                // Begin server temination
                this.terminateProcess()
                this.startJavaServer = true
                client.end("The server is now starting!")
            }
            client.end('You don\'t have permission to start this server.');
        });

        this.server.on('error', (error) => {
            console.error('An error occurred:', error);
        });

        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        this.server.on('close', () => {
            console.log('Server has been closed.');
        });
    }

    private setServerEndCycle() {
        if (this.server == null) {
            return
        }
        this.server.motd = '\u00A73Server is waking up!! :D\u00A7r\nPlease wait couple seconds...'
        this.server.favicon = wakingFav
    }
    private terminateProcess() {
        if (this.server == null) {
            return
        }

        startServer()
        this.setServerEndCycle()
        
        setTimeout(async () => {
            const tmp = await terminateLoop()

            if (tmp) {
                this.server?.close()
                this.running = false
                this.startJavaServer = false
            } else {
                this.endCycle += 1
                if (this.endCycle > 5) {
                    clearTimeout();
                    this.running = false
                    this.startJavaServer = false
                    log('Server terminated due to end cycle limit.');
                    return;                                   
                }
            }
        }, 300000)
    }

}


async function terminateLoop() {

    const health = await serverHealth()

    if (health != 0) {
        return false
    } else {
        return true
    }
}


async function getWhitelist(): Promise<string[]> {
    const decoder = new TextDecoder('utf-8');
    try {
        const data = await Deno.readFile(ENV.PATHTOWHITELIST);
        const jsonData = JSON.parse(decoder.decode(data));
        return jsonData.map((entry: { name: string }) => entry.name);
    } catch (error) {
        console.error('Error reading whitelist:', error);
        return [];
    }
}

async function checkUsername(username: string): Promise<boolean> {
    const whitelist = await getWhitelist();
    return whitelist.includes(username);
}