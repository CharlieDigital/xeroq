# Xeroq

Ever start filling out a form on your desktop that asks you for a picture of your ID?  Then you whip our your phone and upload the picture to Google Photos, download it on your desktop, and then upload it on your desktop?

Xeroq aims to solve this by providing a serverless, peer-to-peer, WebRTC based solution to allow developers creating forms to easily add form controls to get images from a device onto a desktop or from one device to a form flow started on another device.

Xeroq does this by directly connecting the two sides using WebRTC and then using a data channel to pass the information between them.

## Terminology

|Term|Definition|
|--|--|
|**Initiator**|The side where the user initiates the session; where the form is.|
|**Capture**|The side where the user will perform the actual capture.|
|**Offer**|This is the configuration data for the initiator that we need to transmit to the capture side.|
|**Answer**|This is the configuration data for the capture side that we need to transmit to the initiator.|
|**SignalR**|This is a Microsoft ASP.NET runtime component that provides a brokered web socket channel.  We use this channel to send the signaling data between the two sides to connect them.|

## What Happens

1. At startup, the initiator generates a session ID and encodes it into a QR code.
2. The initiator also starts a connection to a SignalR server to register the session
3. From another device ("capture side"), the user scans the QR code to connect to the session via SignalR
4. Via SignalR, the capture side sends a "ready" signal to the initiator
5. The initiator generates a WebRTC "offer" and transmits this to the capture side via SignalR
6. The capture side receives this "offer" and generates an "answer" which is transmitted to the initiator via SignalR
7. Both sides now connect directly via WebRTC and disconnect from SignalR

## Local Dev

For local development, follow these steps:

In **window 1**, we start the .NET 9 backend which provides a web socket server (via SignalR) to allow the capture side to transmit an "answer" to the initiator.

```bash
cd signaling
dotnet run                            # Start the signaling server
```

In **window 2**, we build (TODO: add `watch`) the main JavaScript library:

```bash
cd packages/xeroq
pnpm run build                        # Build the package
```

In **window 3**, we can start the demo app.

```bash
cd demo
pnpm run dev                          # Run the demo app
```

You will need to use a combination of VS Code dev tunnels and ngrok or just ngrok to expose the local application.

Dev tunnels do not correctly upgrade the web socket connections for SignalR so ngrok is a better choice.

```bash
ngrok http 5081                       # Start ngrok for the backend signaling server
ngrok http 5173                       # Start ngrok for the demo page
```

## Resources

- [simple-peer](https://github.com/feross/simple-peer)
- [pnpm monorepos](https://dev.to/vinomanick/create-a-monorepo-using-pnpm-workspace-1ebn)
