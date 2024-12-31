import * as mc from "@minecraft/minecraftstatuspinger";
import { getContainerStatus } from "./docker.ts";
import { getEnvVaribles, log } from "./config.ts";

// 2 = online healthy
// 1 = online unhealthy
// 0 = offline
const ENV = getEnvVaribles()

export async function serverHealth(): Promise<number> {

    // This bullshitery is done to see if the docker-compose actually has networkmode: host enabled or not 
    let host = ""
    if (ENV.IP == undefined || ENV.IP == null) {
        const conStatus = await getContainerStatus()
        host = conStatus[1]
        const status = conStatus[0]
       
        if (status == false) {
            return 0
        }
    } else {
        host = ENV.IP
    }

    try {
        const server = await mc.lookup(
            {
                host: host,
                port: ENV.PORT
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
        log('Error pinging server');
        return 0;
    }
}


// console.log( await serverHealth("localhost", 25569))