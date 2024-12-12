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
   * A function that has a single string parameter `qrCodeDataUrl` that contains
   * a data URL with the WebRTC offer.  The value can be assigned to an `<img>`
   * element to display a QR code.
   */
  readyFn?: (qrCodeDataUrl: string, sessionId: string, rawUrl: string) => void
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
