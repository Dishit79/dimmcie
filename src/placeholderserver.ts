import mc from 'npm:minecraft-protocol';
import { getEnvVaribles, log } from "./util/config.ts";
import { startServer } from "./util/docker.ts"; 
const ENV = getEnvVaribles()


export class PlaceHolderServer {

    private server: mc.Server | null = null
    public running: boolean = false

    constructor() {

    }
   
    init() {
        this.server = mc.createServer({
            'online-mode': false, // Disable online authentication   
            host: '0.0.0.0',      // Bind to all available network interfaces
            port: ENV.PORT, // Default Minecraft port
            version: false,    // Match supported Minecraft version
            motd: 'Server is asleep zzz... \nJoin server to start',
            favicon: "data:image/png;base64,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",
            maxPlayers: 0,       // Set the maximum number of players
        });

        log('Placeholder Server started.');
        this.running = true

        this.server.on('login', async (client) => {
            const username = client.username;
            console.log(`Player joined: ${username}`);

            if (await checkUsername(username)) {
                // Begin server temination
                this.internalTerminate()
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

    private internalTerminate() {
        if (this.server == null) {
            return
        }
        this.server.close();
        this.running = false
        startServer()
    }

    terminate() {
        if (this.server == null) {
            return
        }
        this.server.close();
        this.running = false
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