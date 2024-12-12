import QRCode from 'qrcode';
import SimplePeer from 'simple-peer'
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { XeroqOptions } from './models';
import { makeId } from './utils';
import { HubConnectionBuilder } from '@microsoft/signalr';

/**
 * Creates the initiator of the P2P WebRTC channel.
 */
export function useXeroq(options: XeroqOptions) {
  const sessionId = options.idConfig?.explicitId ?? makeId(options.idConfig?.length)

  // Receiver for the "answer" from the capture endpoint.
  const signalConnection = new HubConnectionBuilder()
    .withUrl(options.signalingServer, { withCredentials: false })
    .build();

  // This is the payload from the capture endpoint.
  signalConnection.on("signal", data => {
    const decompressedAnswer = decompressFromEncodedURIComponent(data);
    peer.signal(decompressedAnswer)
  });

  // Start and join to the session
  signalConnection
    .start()
    .then(() => {
        console.log("Initiating sync...");
        signalConnection.invoke("sync", sessionId)
      }
    );

  const peer = new SimplePeer({
    initiator: options.initiator,
    trickle: false
  })

  peer.on('error', err => console.error('[Xeroq error]', err))

  // This is the outgoing "offer" that needs to be consumed on the incoming side.
  peer.on('signal', async data => {
    const jsonData = JSON.stringify(data)
    const compressedOffer = compressToEncodedURIComponent(jsonData)
    const url = `${options.interfaceUrl}?offer=${compressedOffer}&offerId=${sessionId}`

    options.readyFn?.(await QRCode.toDataURL(url), sessionId, url);
  })

  // Connected with a remote peer.
  peer.on('connect', async () => {
    console.log("[Xeroq connected]")
    await signalConnection.stop()
  })

  // Received data on the data channel.
  peer.on('data', data => {
    console.debug("[Xeroq data]", data)
  })
}
