import QRCode from 'qrcode';
import SimplePeer from 'simple-peer'
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { XeroqOptions } from './models';
import { makeId } from './utils';
import { HubConnectionBuilder } from '@microsoft/signalr';

/**
 * Creates the initiator of the P2P WebRTC channel.
 */
export async function xeroqInit(options: XeroqOptions) {
  let peer: SimplePeer.Instance

  // Generate the URL and QR code for the session.
  const sessionId = options.idConfig?.explicitId ?? makeId(options.idConfig?.length)
  const url = `${options.interfaceUrl}?sessionId=${sessionId}`
  options.readyFn?.(await QRCode.toDataURL(url), sessionId, url);

  // Receiver for the "answer" from the capture endpoint.
  const signalConnection = new HubConnectionBuilder()
    .withUrl(options.signalingServer, { withCredentials: false })
    .build();

  // This is the signal when the capture side has connected; now
  // we can start the exchange.
  signalConnection.on("signalStart", () => {
    peer = new SimplePeer({
      initiator: true,
      trickle: false
    })

    peer.on('error', err => console.error('[Xeroq error]', err))

    // This is the outgoing "offer" that needs to be consumed on the incoming side.
    peer.on('signal', async data => {
      const jsonData = JSON.stringify(data)
      const compressedOffer = compressToEncodedURIComponent(jsonData)

      // Send the offer via SignalR
      await signalConnection.send("signalCapture", sessionId, compressedOffer)
    })

    // Connected with a remote peer.
    peer.on('connect', async () => {
      console.log("[Xeroq connected]")
      await signalConnection.stop()
    })

    // Received data on the data channel.
    peer.on('data', data => {
      options.blobReceivedFn?.(data)
    })
  });

  // This is the payload from the capture endpoint.
  signalConnection.on("signalInitiator", data => {
    const decompressedAnswer = decompressFromEncodedURIComponent(data);
    peer.signal(decompressedAnswer)
  });

  // Start and join to the session
  signalConnection
    .start()
    .then(() => {
        console.log("Initiating sync...");
        signalConnection.invoke("sync", sessionId, false)
      }
    );
}
