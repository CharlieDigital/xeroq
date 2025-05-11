---
title: Known Issues
description: Current known issues and limitations
---

A list of current known issues and limitations (feel free to make a PR and contribute!)

1. Once the WebRTC endpoints are connected, both sides are disconnected from the web socket signaling server.  In this case, the QR code with the generated session ID **is no longer valid**.  One solution is that there is a way for both sides to "restart" and rejoin the same session ID (currently not implemented).
2. The code currently does not have graceful error handling so it is possible that failures are silent.
3. Google Cloud Run does not support correct connection upgrades to web sockets over HTTP/2 so this is currently disabled and using HTTP/1.1 for the demo app.  It is possible to use HTTP/2 on supported platforms that will correctly upgrade the connection to web sockets.
