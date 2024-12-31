import mc from 'npm:minecraft-protocol';
import { getEnvVaribles, log } from "./util/config.ts";
import { startServer } from "./util/docker.ts"; 
import { serverHealth } from "./util/minecraft.ts";
const ENV = getEnvVaribles()


export class PlaceHolderServer {

    private server: mc.Server | null = null
    public running: boolean = false
    private endCycle: number = 0
    constructor() {

    }
   
    init() {
        this.server = mc.createServer({
            'online-mode': false, // Disable online authentication   
            host: '0.0.0.0',      // Bind to all available network interfaces
            port: 25567, // Default Minecraft port
            version: false,    // Match supported Minecraft version
            motd: 'Server is asleep zzz... \nJoin server to start',
            maxPlayers: 0,       // Set the maximum number of players
        });

        log('Placeholder Server started.');
        this.running = true

        this.server.on('login', async (client) => {
            const username = client.username;
            console.log(`Player joined: ${username}`);

            if (await checkUsername(username)) {
                // Begin server temination
                this.terminateProcess()
            }
            client.end('You have been kicked from the server.');
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

    private async setServerEndCycle() {
        if (this.server == null) {
            return
        }
        this.server.motd = 'server is waking up'
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
            } else {
                this.endCycle += 1
                if (this.endCycle > 5) {
                    clearTimeout();
                    log('Server terminated due to end cycle limit.');
                    return;                                   
                }
            }
        }, 10000)
    }

}


async function terminateLoop() {

    const health = await serverHealth(ENV.PORT)

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