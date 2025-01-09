---
title: Signaling Server
description: Understanding the signaling server
---

The signaling server is a .NET 9 web API that uses SignalR to perform the initial exchange of the WebRTC "offer" and "answer" that is required to establish the connection.

We use SignalR (an abstraction layer over web sockets) here as the code is compact, easy to understand, and easy to use -- check out the source; it's only a few lines of code.

The initiator side connects first and sets the client supplied session ID.  Once the session ID is transferred to the remote capture side, it also connects to the signaling server and both sides use the signaling server to exchange the "offer" and "answer" via SignalR before disconnecting and switching to peer-to-peer WebRTC mode.

## Deploying your own signaling server

The signaling server is easy to deploy as a container to serverless container runtimes that support web sockets like Google Cloud Run.

:::caution
Google Cloud run bills by when the container is actively serving a request.  So until both sides disconnect after the WebRTC connection is established, you will incur billing after you've consumed your free monthly grant of 180k vCPU/seconds (50 hours of active connection time).
:::

Google Cloud Run is recommended for prototyping and testing (and perfectly suitable for small production deployments!) because it is functionally free for the first 50 hours of active connection time.

### Google Cloud Run

TODO

### Google Cloud Compute Engine

TODO

### AWS Elastic Container Service (via Copilot)

TODO

### AWS EC2

TODO

### Azure Container Apps

TODO

## Scaling your signaling server

Google Cloud Run supports a maximum of 1000 concurrent connections per instance.  Even though it supports sticky sessions, it does not offer a guarantee that if a user initiates a session on one instance, that they will connect the remote capture side to the same instance.

In this case, the SignalR connection will fail.

To work around this, [you can deploy/implement a "backplane" for SignalR](https://learn.microsoft.com/en-us/aspnet/signalr/overview/performance/scaleout-in-signalr) or you can switch to [Azure SignalR](https://azure.microsoft.com/en-us/pricing/details/signalr-service/) instead.

If you're using Xeroq in a serious commercial context, then this is the solution that you want to use since it only costs $1.61/day and $1 per 1 million messages.
