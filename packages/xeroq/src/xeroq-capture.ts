import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import SimplePeer from "simple-peer";
import { XeroqCaptureOptions } from "./models";
import { HubConnectionBuilder } from "@microsoft/signalr";

/**
 * Creates the capture side components (the remote side that's
 * responsible for capturing the image and streaming it to the
 * initiating side.
 */
export function xeroqCapture(
  sessionId: string,
  options: XeroqCaptureOptions
) {
  let peer: SimplePeer.Instance

  // Sender for the "answer" from this endpoint.
  const signalConnection = new HubConnectionBuilder()
    .withUrl(options.signalingServer, { withCredentials: false })
    .build();

  // Start and join to the session
  signalConnection
    .start()
    .then(async () => {
        console.log("Initiating sync...");
        await signalConnection.invoke("sync", sessionId, true)
      }
    );

  // This payload contains the offer from the initiator.
  signalConnection.on("signalCapture", compressedOffer => {
    peer = new SimplePeer()

    peer.on('error', err => console.error('[Xeroq error]', err))

    const decompressedOffer = decompressFromEncodedURIComponent(compressedOffer)

    peer.on('signal', async data => {
      // This gets triggered when we call `signal()` below after connecting to
      // SignalR.  We ant to connect SignalR first because we need to send the
      // "answer" to the incoming "offer" to the initiator.
      const jsonData = JSON.stringify(data)
      const compressedAnswer = compressToEncodedURIComponent(jsonData)

      // Here we send the signal with the answer
      await signalConnection.invoke("signalInitiator", sessionId, compressedAnswer);
    });

    // This capture side is connected to the initiator and we can send.
    peer.on('connect', async () => {
      if (options?.connectFn) {
        options.connectFn(sessionId);
      }

      window.setTimeout(async () => await signalConnection.stop(), 250)
    })

    peer.signal(decompressedOffer)
  })

  /**
   * This function transmits the photo via WebRTC to the initiator.
   * @param dataUrl URL encoded image format.
   */
  async function sendPhoto(capture: Blob) {
    peer.send(await capture.arrayBuffer())
  }

  return {
    sendPhoto
  }
}
