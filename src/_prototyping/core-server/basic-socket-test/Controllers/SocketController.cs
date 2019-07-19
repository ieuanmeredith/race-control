using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace core_server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SocketController : ControllerBase
  {
    [HttpGet]
    public async Task Get()
    {
      var context = ControllerContext.HttpContext;
      var isSocketRequest = context.WebSockets.IsWebSocketRequest;

      if (isSocketRequest)
      {
        // upgrade http connection to websocket 
        WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await GetMessages(context, webSocket);
      }
      else
      {
        context.Response.StatusCode = 400;
      }
    }

    private async Task GetMessages(HttpContext context, WebSocket webSocket)
    {
      var messages = new[]
      {
          "Message1",
          "Message2",
          "Message3",
          "Message4",
          "Message5"
        };

      foreach (var message in messages)
      {
        var bytes = Encoding.ASCII.GetBytes(message);
        var arraySegment = new ArraySegment<byte>(bytes);

        await webSocket.SendAsync(
          arraySegment,
          WebSocketMessageType.Text,
          true,
          CancellationToken.None);
        Thread.Sleep(2000);
      }

      await webSocket.SendAsync(
        new ArraySegment<byte>(null),
        WebSocketMessageType.Binary,
        false,
        CancellationToken.None);
    }
  }
}