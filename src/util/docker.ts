import { getEnvVaribles, log } from "./config.ts";
import Docker from "https://deno.land/x/denocker@v0.2.1/index.ts"

const docker = new Docker("/var/run/docker.sock");
const ENV = getEnvVaribles()
let lastIdRefreshed = 0
let containerId = await getContainerId(ENV.CONTAINERNAME)

async function getContainerId(name : string) {
    name = `/${name}`

    const containers = await docker.containers.list({all: true})

    for (const container of containers) {
        if (container.Names == undefined) {
            console.log("Container not found - (getContainerId)")
            Deno.exit()
        }
        if (container.Names.includes(name)) {
            log(`Container found: ${container.Id}`)
            lastIdRefreshed = Date.now()
            return container.Id
        }
    }
}

export async function getContainerStatus() : Promise<[boolean, string]> {

    if (Date.now() - lastIdRefreshed > (1000 * 60 * 60 * 4)) {
        containerId = await getContainerId(ENV.CONTAINERNAME)
    }

    // deno-lint-ignore ban-ts-comment
    //@ts-ignore
    const containerData =  await docker.containers.inspect(containerId)
    if (containerData.State == undefined) {
        log("Container not found - (getContainerStatus)")
        Deno.exit()
    }
    const running = containerData.State.Running

    if (running){
        let ip = containerData.NetworkSettings?.Networks
        // deno-lint-ignore ban-ts-comment
        //@ts-ignore
        ip = Object.values(containerData.NetworkSettings?.Networks || {}).find((i:any) => i.IPAddress)?.IPAddress
      
        if (ip != undefined || ip != null){
            return [true, ip.toString()]
        } 
        return [true, ""]
    } else {
        return [false, ""]
    }
}


export async function startServer() {
    // deno-lint-ignore ban-ts-comment
    //@ts-ignore
    await docker.containers.start(containerId)
    log("Starting Minecraft server...")
}

export function stopServer() {
    // deno-lint-ignore ban-ts-comment
    //@ts-ignore
    docker.containers.stop(containerId)
    log("Stopping Minecraft server...")

}


// await getContainerStatus()