import { constants } from "buffer";
import Docker from "npm:dockerode";

const docker = new Docker();

const COTAINERID = "minecraft";




export function startServer() {

    const container = docker.getContainer(COTAINERID);
    container.start()
}

export function stopServer() {

   const container = docker.getContainer(COTAINERID);
   container.stop()

}