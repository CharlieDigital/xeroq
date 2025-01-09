<template>
  <div class="wrapper">
    <div v-if="sessionId" class="header">
      Connected to session: <strong>{{ sessionId }}</strong>
    </div>
    <div class="container">
      <!-- No session info in the URL; the user just browsed to this page -->
      <div v-if="!sessionId" style="opacity: 0.7; font-style: oblique;">
        There's no session; start from one of the example pages.
      </div>
      <div v-else>
        <!-- The user has session; we show the button to activate the camera -->
        <button
          v-if="showCameraButton && !started"
          @click="handleStartCamera">
          Start Camera
        </button>
        <!-- The actual camera -->
        <div v-if="started" id="camera">
          <video id="video" ref="video"></video>
          <button id="shutter" @click="handleShutterClick">Capture and Transfer</button>
          <canvas id="stage" ref="stage" style="display: block"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { xeroqCapture, type XeroqCapture } from 'xeroq';

const video = ref<HTMLVideoElement>()
const stage = ref<HTMLCanvasElement>()

const params = new URLSearchParams(window.location.search)

const sessionId = ref(params.get("sessionId") ?? "")

const props = defineProps<{
  signalingServer: string,
}>()

const showCameraButton = ref(false)

const started = ref(false)

let streaming = false

let xeroq: XeroqCapture | undefined;

watch (sessionId, (sid) => {
  xeroq = xeroqCapture(sid, {
    signalingServer: props.signalingServer,
    connectFn: (s) => {
      showCameraButton.value = true
    }
  })
}, { immediate: true })

let width = 200;
let height = 200; // Default

/**
 * The user has started to camera.
 */
async function handleStartCamera() {
  if (!xeroq) {
    return
  }

  started.value = true

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })

  // Set up the video.
  video.value!.srcObject = stream;
  video.value!.play();

  video.value!.addEventListener("canplay", () => {
    if (streaming) {
      return
    }

    height =  (video.value!.videoHeight / video.value!.videoWidth) * width;

    video.value!.setAttribute("width", `${width}`);
    video.value!.setAttribute("height", `${height}`);
    stage.value!.setAttribute("width", `${width}`);
    stage.value!.setAttribute("height", `${height}`);

    streaming = true
  }, false)
}

/**
 * The user has clicked the shutter button.
 */
function handleShutterClick() {
  const context = stage.value!.getContext("2d")!;

  context.drawImage(video.value!, 0, 0, width, height);

  // const data = canvas.toDataURL("image/png");
  stage.value!.toBlob(async blob => {
    if (!xeroq) return
    if (blob) await xeroq.sendBlob(blob)
  }, "image/png", 0.8)
}
</script>

<style scoped>
.wrapper {
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 8px;
  margin: 16px 0px;
}

.container {
  padding: 8px;
  text-align: center;
}

.header {
  border-bottom: 1px solid var(--sl-color-gray-5);
  padding: 8px;
}

#camera {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

video, canvas, button {
  border-radius: 8px;
}

</style>
