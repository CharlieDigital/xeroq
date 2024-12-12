import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import SimplePeer from "simple-peer";
import { XeroqCaptureOptions } from "./models";
import { HubConnectionBuilder } from "@microsoft/signalr";

/**
 * Creates the capture side components (the remote side that's
 * responsible for capturing the image and streaming it to the
 * initiating side.
 */
export function useXeroqCapture(
  compressedOffer: string,
  sessionId: string,
  options: XeroqCaptureOptions
) {
  const peer = new SimplePeer()

  peer.on('error', err => console.error('[Xeroq error]', err))

  const decompressed = decompressFromEncodedURIComponent(compressedOffer)

  peer.on('signal', async data => {
    // This gets triggered when we call `signal()` below after connecting to
    // SignalR.  We ant to connect SignalR first because we need to send the
    // "answer" to the incoming "offer" to the initiator.
    const jsonData = JSON.stringify(data)
    const compressedAnswer = compressToEncodedURIComponent(jsonData)

    // Here we send the signal with the answer
    await signalConnection.invoke("signal", sessionId, compressedAnswer);
    await signalConnection.stop()
  });

  // This capture side is connected to the initiator and we can send.
  peer.on('connect', () => {
    if (options?.connectFn) {
      options.connectFn(sessionId);
    }

    peer.send("HELLO, WORLD FROM YOUR PEER");
  })

  // Sender for the "answer" from this endpoint.
  const signalConnection = new HubConnectionBuilder()
    .withUrl(options.signalingServer, { withCredentials: false })
    .build();

  // Start and join to the session
  signalConnection
    .start()
    .then(() => {
        console.log("Initiating sync...");
        signalConnection.invoke("sync", sessionId)
        // Wait for this connection before we signal.
        peer.signal(decompressed);
      }
    );
}
