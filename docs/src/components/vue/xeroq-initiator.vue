<template>
  <div class="wrapper">
    <div class="container">
      <div style="flex: 1 1;">
        <img
          v-for="url in photos"
          :src="url"
          class="photo"
        />
      </div>
      <div style="flex: 0 1; text-align: right; min-width: 120px; margin-top: 0px !important;">
        <img
          v-if="qrCode !== ''"
          :src="qrCode"
          style="width: 120px; height: 120px;"
        />
      </div>
    </div>
    <div style="border-top: 1px solid var(--sl-color-gray-5); padding: 8px; text-align: center">
      <a :href="captureUrl" target="_blank">{{ captureUrl }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { xeroqInit } from 'xeroq';
import { STATIC_SESSION } from '../../environment';
import { arrayBufferToBase64 } from '../utils';

const props = defineProps<{
  interfaceUrl: string,
  signalingServer: string,
}>()

const emits = defineEmits<{
  photoReceived: [Uint8Array]
}>()

const qrCode = ref('')

const captureUrl = ref('')

const photos = ref<string[]>([])

const isLocalDev = window.location.hostname === "localhost";

onMounted(() => {
  xeroqInit({
    // The URL that displays the capture interface
    interfaceUrl: `${props.interfaceUrl.replace(/\/$/, "")}/reference/capture-example/`,

    // The URL of the signaling server
    signalingServer: props.signalingServer,

    // Use a static ID for local dev
    idConfig: isLocalDev ? {
      explicitId: STATIC_SESSION
    } : undefined,

    // The function to be invoked when the connection is ready
    readyFn: (qr, id, url) => {
      qrCode.value = qr
      captureUrl.value = url
    },

    // The function to receive the photo
    blobReceivedFn: handleBlob
  });
})

function handleBlob(photo: Uint8Array): void {
  const photoDataUrl = "data:image/png;base64," + arrayBufferToBase64(photo)

  photos.value.push(photoDataUrl)

  // Emit and handle this or handle it here.
  emits("photoReceived", photo)
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
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.photo {
  height: 120px;
  border-radius: 8px;
  margin-right: 4px;
}

button {
  border-radius: 8px;
}
</style>
