import * as mc from "@minecraft/minecraftstatuspinger";


// 2 = online healthy
// 1 = online unhealthy
// 0 = offline

export async function serverHealth(host: string, port: number): Promise<number> {
    
   try {
        const server = await mc.lookup(
            {
                host: host,
                port: port

            }
        )
        
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        const data = server.status.players.online
        
        if (data > 0) {
            return 2
        } else {
            return 1
        }
        
    } catch (error) {
        console.log('Error pinging server');
        return 0;
    }
}


// console.log( await serverHealth("10.0.0.140", 25565))