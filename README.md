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

![](/assets/zeroq-flow.png)

1. At startup, the initiator generates a session ID and encodes it into a QR code.
2. The initiator also starts a connection to a SignalR server to register the session
3. From another device ("capture side"), the user scans the QR code
4. This initiates a connection to the signaling server via SignalR on the same session
5. The initiator is notified that the capture side has connected and generates and offer
6. The initiator transmits the offer to the capture side via the signaling server
7. The capture side receives this offer
8. The capture side generates an answer to the initiator and disconnects from the signaling server
9. The initiator receives the answer and disconnects from the signaling server
10. The two sides connect peer-to-peer via WebRTC using the offer and answer
11. The capture side transmits images to the initiator

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
- [Creating Vue component libraries](https://www.matijanovosel.com/blog/making-and-publishing-components-with-vue-3-and-vite)
