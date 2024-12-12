import './style.css'
import { useXeroq, useXeroqCapture } from 'xeroq'
import { $divById, $id } from './utils';

$divById('app')!.innerHTML = `
  <div id="container">

  </div>
`

// This works fine with devtunnels or ngrok
const interfaceUrl = "https://4gch11f2-5173.use.devtunnels.ms/";
// This doesn't work for devtunnels so use ngrok
const signalingServer = "https://d526-173-72-7-44.ngrok-free.app/xeroq-hub";
//const signalingServer = "http://localhost:5081/xeroq-hub";

const params = new URLSearchParams(window.location.search)

if (params.has("offer")) {
  renderCapture();
} else {
  renderInitator();
}

/**
 * Render the components to initiate the session.
 */
function renderInitator() {
  $divById("container")!.innerHTML = `
    <img width="400" height="400" src="" id="qr" />
    <br/>
    <a id="url" href="">Session URL</a>
  `

  useXeroq({
    interfaceUrl,
    signalingServer,
    initiator: true,
    readyFn: (qr, _, url) => {
      $id<HTMLImageElement>("qr")!.src = qr
      $id<HTMLAnchorElement>("url")!.href = url
    }
  });
}

/**
 * Render the components to handle the capture
 */
function renderCapture() {
  console.log("Rendering capture...")

  const offer = params.get("offer");
  const offerId = params.get("offerId")

  if (!offer) {
    console.error("No offer")
    return;
  }

  if (!offerId) {
    console.error("No offerId")
    return;
  }

  useXeroqCapture(offer, offerId, {
    signalingServer,
    connectFn: (s) => {
      $divById("container").innerHTML = `
        <div>Session: ${s}</div>
      `
    }
  })
}
