import { getEnvVaribles } from "./config.ts";
import Docker from "https://deno.land/x/denocker/index.ts"

const docker = new Docker("/var/run/docker.sock");
const ENV = getEnvVaribles()


export async function startServer() {

    await docker.containers.start(ENV.CONTAINERID)
    console.log("Starting server...")
}

export function stopServer() {

   docker.containers.stop(ENV.CONTAINERID)
   console.log("Stopping server...")

}

