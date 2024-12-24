import  MinecraftServerListPing  from "npm:minecraft-status";


export async function serverHealth(host: string, port: number): Promise<boolean> {
    
   try {
        const server = await MinecraftServerListPing.ping(4, host, port, 3000)
        return server.players.online > 0
        
    } catch (error) {
        console.error('Error pinging server:', error);
        return false;
    }
}