import * as React from "react";
import * as io from "socket.io-client";
const irsdk: any = require("node-irsdk");

export class App extends React.Component<undefined, any> {
  private socket: SocketIOClient.Socket;
  private sessionCache: any = null;
  constructor(props: any) {
    super(props);
    this.state = {
      url: "",
      id: "",
      connected: false,
      status: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  public handleInputChange(event: any) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  public disconnect(event: any) {
    event.preventDefault();
    this.setState({
      ["connected"]: false
    });

    this.socket.disconnect();
  }

  public connect(event: any) {
    event.preventDefault();

    if (this.state.url === "") {
      alert("Url field is empty");
      return;
    }
    if (this.state.id === "") {
      alert("Id field is empty");
      return;
    }

    this.socket = io(this.state.url, {reconnection: false, transports: ["websocket"]} as SocketIOClient.ConnectOpts);

    this.socket.on("connect_failed", () => {
      alert("Failed to connect to Race Control server");
      this.setState({
        ["connected"]: false
      });
    });
    this.socket.on("connect_error", () => {
      alert("Failed to connect to Race Control server");
      this.setState({
        ["connected"]: false
      });
    });
    this.socket.on("disconnect", () => {
      this.setState({
        ["connected"]: false
      });
    });

    this.socket.on("connect", () => {
      if (this.socket.connected) {
        this.setState({
          ["connected"]: true
        });

        console.log("Connected to the Race Control server");
        irsdk.init({
          sessionInfoUpdateInterval: 2000,
          telemetryUpdateInterval: 64, // 15 ticks per second
        });
        const iracing: any = irsdk.getInstance();
        this.setState({
          ["status"]: "Waiting for iRacing..."
        });

        if (this.sessionCache) {
          const driverid = this.state.id;
          const msg = { "driver_id": driverid, "data": this.sessionCache };
          this.socket.emit("session", msg);
        }

        iracing.on("Connected", () => {
          this.setState({
            ["status"]: "Sending data to server"
          });
        });

        iracing.on("Disconnected", () => {
          this.setState({
            ["status"]: "Waiting for iRacing..."
          });
        });

        iracing.on("Telemetry", (data: any) => {
          this.setState({
            ["status"]: "Sending data to server"
          });

          const driverid = this.state.id;
          const msg = { "driver_id": driverid, "data": data };
          this.socket.emit("telemetry", msg);
        });

        iracing.on("SessionInfo", (data: any) => {
          this.sessionCache = data;
          const driverid = this.state.id;
          const msg = { "driver_id": driverid, "data": data };
          this.socket.emit("session", msg);
        });

      } else {
        alert("Failed to connect to Race Control server");
      }
    });
  }

  public render() {
    return (
      <div>
        <h1>Race Control Transmitter</h1>

        {
          this.state.connected ?

            <form onSubmit={this.disconnect}>
              <h2>{this.state.status}</h2>
              <input type="submit" value="Disconnect" />
            </form> :

            <form onSubmit={this.connect}>
              <label>
                Server Url <br/>
                <input type="text" name="url" value={this.state.url} onChange={this.handleInputChange} />
              </label>
              <br/><br/>
              <label>
                Driver ID <br/>
                <input type="text" name="id" value={this.state.id} onChange={this.handleInputChange} />
              </label>
              <br/><br/>
              <input type="submit" value="Connect" />
            </form>
        }
        <br/><small>v1.0.3</small>
      </div>
    );
  }
}
