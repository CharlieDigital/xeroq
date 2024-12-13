import { xeroqInit } from 'xeroq'
import { $divById, $id, interfaceUrl, signalingServer } from './utils';

/**
 * Render the components to initiate the session.
 */
export function renderInitiator() {
  $divById("app")!.innerHTML = `
    <img width="120" height="120" src="" id="qr" />
    <br/>
    <a id="url" href="">Session URL</a>
  `

  xeroqInit({
    interfaceUrl,
    signalingServer,
    initiator: true,
    idConfig: {
      explicitId: import.meta.env.VITE_STATIC_SESSION
    },
    readyFn: (qr, _, url) => {
      $id<HTMLImageElement>("qr")!.src = qr
      $id<HTMLAnchorElement>("url")!.href = url
    },
    photoReceivedFn: handlePhoto
  });
}

/**
 * Invoked when a photo is received from the remote capture side.,
 * @param photo An `ArrayBuffer` which contains the received photo
 */
function handlePhoto(photo: Uint8Array) {
  console.log(photo)

  const app = $divById("app")

  const photoDataUrl = "data:image/png;base64," + arrayBufferToBase64(photo)

  app.innerHTML += `
    <br />
    <img src="${photoDataUrl}" />
  `
}

// https://stackoverflow.com/a/9458996/116051
function arrayBufferToBase64( buffer: ArrayBuffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}
