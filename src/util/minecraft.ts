import * as mc from "@minecraft/minecraftstatuspinger";
import { log } from "./config.ts";


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
        if (server.status.players.max == 0 && server.status.players.online == 0) {
            return 0
        }
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        const data = server.status.players.online
        // console.log(server)
        if (data > 0) {
            return 2
        } else {
            return 1
        }
        
    } catch (_error) {
        log('Error pinging server');
        return 0;
    }
}


// console.log( await serverHealth("localhost", 25569))