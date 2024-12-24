import { stopServer } from "./docker.ts";
import { PlaceHolderServer } from "../server.ts";


function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  
export function terminateServer(): PlaceHolderServer  {

    stopServer()
    // console.log("Waiting 30 seconds before terminating...");
    sleep(30000);

    return new PlaceHolderServer()

}