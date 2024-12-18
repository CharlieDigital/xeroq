import { xeroqCapture } from 'xeroq'
import { $click, $divById, $id, signalingServer } from './utils';

/**
 * Render the components to handle the capture
 */
export function renderCapture() {
  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get("sessionId")
  const app = $divById("app")
  let streaming = false

  if (!sessionId) {
    console.error("No sessionId")
    return;
  }

  const xeroq = xeroqCapture(sessionId, {
    signalingServer,
    connectFn: (s) => {
      app.innerHTML = `
        <div>Session: ${s}</div>
        <button id="start">Start Camera</button>
      `

      $click("start", startCamera)
    }
  })

  /**
   * Start the camera to capture a photo
   * See: https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos
   */
  async function startCamera() {
    $id("start").style.display = "none";

    app.innerHTML += `
      <div id="camera">
        <video id="video"></video>
        <br/>
        <button id="shutter">Take Photo</button>
        <canvas id="staging" style="display: block"></canvas>
      </div>
    `

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })

    const video = $id<HTMLVideoElement>("video")
    const canvas = $id<HTMLCanvasElement>("staging")
    const shutter = $id<HTMLButtonElement>("shutter")

    console.log(`Video Height: ${video.videoHeight}, Video Width: ${video.videoWidth}`)

    let width = 200;
    let height = 200; // Default

    // Set up the video.
    video.srcObject = stream;
    video.play();

    video.addEventListener("canplay", () => {
      if (streaming) {
        return
      }

      height =  (video.videoHeight / video.videoWidth) * width;

      video.setAttribute("width", `${width}`);
      video.setAttribute("height", `${height}`);
      canvas.setAttribute("width", `${width}`);
      canvas.setAttribute("height", `${height}`);

      streaming = true
    }, false)

    // Set up the shutter button
    shutter.addEventListener("click", (evt) => {
      const context = canvas.getContext("2d")!;

      context.drawImage(video, 0, 0, width, height);

      // const data = canvas.toDataURL("image/png");
      canvas.toBlob(async blob => {
        if (blob) await xeroq.sendBlob(blob)
      }, "image/png", 0.8)

      evt.preventDefault()
    }, false)
  }
}
