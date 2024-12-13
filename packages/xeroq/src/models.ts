/**
 * Configuration options for Xeroq.
 */
export type XeroqOptions = {
  /**
   * URL where the interface is hosted.
   */
  interfaceUrl: string,
  /**
   * The URL to the SignalR endpoint for the signaling server.
   */
  signalingServer: string,
  /**
   * True when this is the initiator.
   */
  initiator: boolean,
  /**
   * Options for the ID that is passed along to the client.
   */
  idConfig?: XeroqIdConfig,
  /**
   * This function is invoked when the session is ready.
   * @param qrCodeDataUrl The data URL encoded format of the QR code which contains the URL for the capture
   * @param sessionId The session ID encoded in the QR code
   * @param rawUrl The raw URL that is encoded in the QR code
   */
  readyFn?: (qrCodeDataUrl: string, sessionId: string, rawUrl: string) => void
  /**
   * The function invoked when a photo is received from the capture side.
   * @param photo An `Uint8Array` which contains the photo that was snapped.
   */
  photoReceivedFn?: (photo: Uint8Array) => void
}

/**
 * Type that describes the ID options.
 */
export type XeroqIdConfig = {
  /**
   * When specified, use this specific ID
   */
  explicitId?: string
  /**
   * When specified, generate a random ID of this length.  Default is
   * length 8 if neither is specified.
   */
  length?: number
}

/**
 * Options for the capture end of the application.
 */
export type XeroqCaptureOptions = {
  /**
   * The URL to the SignalR endpoint for the signaling server.
   */
  signalingServer: string,
  /**
   * Function to invoke when connected
   */
  connectFn?: (sessionId: string) => void
}
