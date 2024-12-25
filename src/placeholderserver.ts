import mc from 'npm:minecraft-protocol';
import { getEnvVaribles } from "./util/config.ts";
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
            motd: 'Join to Start Server',
            maxPlayers: 0,       // Set the maximum number of players
        });

        console.log('Server started.');
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