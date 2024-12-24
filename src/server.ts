import mc from 'npm:minecraft-protocol';

const PATHTOWHITELIST = "/home/nawaf/Documents/GitHub/dimmcie/minecraft/data/whitelist.json"


export class PlaceHolderServer {

    private server: mc.Server;

    constructor() {
        this.server = mc.createServer({
            'online-mode': false, // Disable online authentication   
            host: '0.0.0.0',      // Bind to all available network interfaces
            port: 25565,          // Default Minecraft port
            version: false,    // Match supported Minecraft version
            motd: 'Join to Start Server',
            maxPlayers: 0,       // Set the maximum number of players
        });

        console.log('Server started.');

        this.server.on('login', async (client) => {
            const username = client.username;
            console.log(`Player joined: ${username}`);

            if (await checkUsername(username)) {
                // Begin server temination
            }
            client.end('You have been kicked from the server.');
        });

        this.server.on('error', (error) => {
            console.error('An error occurred:', error);
        });

        // @ts-ignore
        this.server.on('close', () => {
            console.log('Server has been closed.');
        });
    }


    terminate() {
        this.server.close();
    }
   
}




async function getWhitelist(): Promise<string[]> {
    const decoder = new TextDecoder('utf-8');
    try {
        const data = await Deno.readFile(PATHTOWHITELIST);
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