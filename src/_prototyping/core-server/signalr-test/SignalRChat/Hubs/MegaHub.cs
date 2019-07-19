using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class MegaHub : Hub
    {
        private readonly IHubContext<ChatHub> _chatHubContext;

        public MegaHub(IHubContext<ChatHub> chatHub){
            _chatHubContext = chatHub;
        }
        public async Task SendMessage(string user, string message)
        {
            // await Clients.All.SendAsync("ReceiveMessage", user, message);
            await _chatHubContext.Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}