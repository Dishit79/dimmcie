import * as mc from "@minecraft/minecraftstatuspinger";
import { getContainerStatus } from "./docker.ts";


// 2 = online healthy
// 1 = online unhealthy
// 0 = offline


export async function serverHealth(port : number): Promise<number> {

    const [conStatus, host] = await getContainerStatus()

    if (conStatus == false) {
        return 0
    }
    
   try {
        const server = await mc.lookup(
            {
                host: host,
                port: port
            }
        )
        // console.log(server)
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        if (server.status.players.max == 0 && server.status.players.online == 0) {
            return 0
        }
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        const data = server.status.players.online
        if (data > 0) {
            return 2
        } else {
            return 1
        }
        
    } catch (_error) {
        // log('Error pinging server');
        console.log(_error)
        return 0;
    }
}


// console.log( await serverHealth("localhost", 25569))