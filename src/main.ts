import { serverHealth } from "./util/minecraft.ts";
import { getEnvVaribles, sleep } from "./util/config.ts";
import { PlaceHolderServer } from "./placeholderserver.ts";
import { stopServer } from "./util/docker.ts";

const ENV = getEnvVaribles()
console.log( ENV )
let lastCase = 999

const placeholderServer = new PlaceHolderServer()


async function main() {

    const serverStat =  await serverHealth( ENV.IP, ENV.PORT )

    console.log("Start cycle")

    if (serverStat == 2) {
        console.log("Server health is good. Passing...")
        return
    }

    if (serverStat == 1) {

        if (lastCase == 999) {
            console.log("Server is idle. Starting shutdown countdown...")
            lastCase = Date.now()
        }

        if (Date.now() - lastCase > ENV.SERVERSHUTDOWNLIMIT) {
            console.log("Server reached end of life. Shutting down...")
            stopServer()
            sleep(1000)
            console.log("Server stopped. Starting placeholder server...")
            placeholderServer.init()
            lastCase = 999
        }
    }
     
    else {
        if ( placeholderServer.running == false) {
            console.log("Server is offline. Starting placeholder server...")
            lastCase = 999
            placeholderServer.init()
        } else {
            console.log("Placeholder server is already running.")
        }

    }

}

main()

Deno.cron("test", "*/5 * * * *", () => {
    main()
})