import { getEnvVaribles, log } from "./config.ts";
import Docker from "https://deno.land/x/denocker/index.ts"

const docker = new Docker("/var/run/docker.sock");
const ENV = getEnvVaribles()
const containerId = await getContainerId(ENV.CONTAINERNAME)


async function getContainerId(name : string) {
    name = `/${name}`

    const containers = await docker.containers.list({all: true})

    for (const container of containers) {
        if (container.Names == undefined) {
            console.log("No containers found")
            Deno.exit()
        }
        if (container.Names.includes(name)) {
            log(`Container found: ${container.Id}`)
            return container.Id
        }
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
