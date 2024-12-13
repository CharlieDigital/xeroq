using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddCors(config =>
    config.AddPolicy("signaling", policy =>
        policy
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()
    )
);

var app = builder.Build();

var port = builder.Environment.IsDevelopment() ? 5081 : 8080;

app.Urls.Add($"http://0.0.0.0:{port}");

app.UseCors("signaling");

app.MapHub<SignalingHub>("/xeroq-hub");

app.Run();

/// <summary>
/// The signaling hub via SignalR
/// </summary>
class SignalingHub : Hub {
    /// <summary>
    /// Sends the signal from the capture endpoint to the initiator.
    /// </summary>
    /// <param name="session">The session ID</param>
    /// <param name="payload">The payload (signal data) from the capture side.</param>
    public async Task SignalInitiator(string session, string payload) =>
        await Clients.Group(session).SendAsync("signalInitiator", payload);

    /// <summary>
    /// Sends the signal from the initiator to the capture endpoint.
    /// </summary>
    /// <param name="session">The session ID</param>
    /// <param name="payload">The payload (signal data) from the capture side.</param>
    public async Task SignalCapture(string session, string payload) =>
        await Clients.Group(session).SendAsync("signalCapture", payload);

    /// <summary>
    /// Initiates a session from either side (initiator and capture side).
    /// </summary>
    /// <param name="session">The session ID.</param>
    /// <param name="ready">True when invoked from the capture side</param>
    public async Task Sync(string session, bool ready) {
        await Groups.AddToGroupAsync(Context.ConnectionId, session);

        if (ready) {
            // This should be handled by the initiator to start the peer
            await Clients.Group(session).SendAsync("signalStart");
        }
    }
}
