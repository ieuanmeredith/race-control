using Microsoft.AspNetCore.SignalR;
using SignalRServer.Classes.Interfaces;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
  public class ReceiverHub : Hub
  {
    private readonly IHubContext<WebHub> _webHubContext;

    public ReceiverHub(IHubContext<WebHub> webHubContext)
    {
      _webHubContext = webHubContext;
    }

    public async Task Telemetry(ITelemetry telemetry)
    {
      // todo: process data

      // send to web clients via webhub context
      await _webHubContext.Clients.All.SendAsync("telemetry_message");
      await _webHubContext.Clients.All.SendAsync("timing_message");
    }

    public void Session(ISession session)
    {
      // todo: set data
    }
  }
}