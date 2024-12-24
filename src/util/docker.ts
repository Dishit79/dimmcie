import Docker from "npm:dockerode";

const docker = new Docker();

const COTAINERID = "minecraft";




export function startServer() {

    const container = docker.getContainer(COTAINERID);
    container.start()
}

export function stopServer() {

    // later

}