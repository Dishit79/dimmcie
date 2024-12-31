import { serverHealth } from "./util/minecraft.ts";
import { getEnvVaribles, log } from "./util/config.ts";
import { PlaceHolderServer } from "./placeholderserver.ts";
import { stopServer } from "./util/docker.ts";

const ENV = getEnvVaribles()
console.log( ENV )
let lastCase = 999

const placeholderServer = new PlaceHolderServer()


async function main() {

    const serverStat =  await serverHealth(ENV.PORT)

    log("Doing Checks...")

    if (serverStat == 2) {
        log("Server health is good. Passing...")
        return
    }

    if (serverStat == 1) {

        if (lastCase == 999) {
            log("Server is idle. Starting shutdown countdown...")
            lastCase = Date.now()
        } 
        else if (Date.now() - lastCase > ENV.SERVERSHUTDOWNLIMIT) {
            log("Server reached end of life. Shutting down...")
            stopServer()
            log("Server stopped. Starting placeholder server...")
            placeholderServer.init()
            lastCase = 999
        }
    }
     
    else {
        if ( placeholderServer.running == false) {
            log("Server is offline. Starting placeholder server...")
            lastCase = 999
            placeholderServer.init()
        } else {
            log("Placeholder server is already running.")
        }

    }

}

main()

Deno.cron("test", ENV.CRON, () => {
    main()
})