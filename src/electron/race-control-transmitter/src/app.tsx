import * as React from "react";

export class App extends React.Component<undefined, undefined> {
  public render() {
    return (
      <div>
        <label>Server URL</label><br/>
        <input type="text"/>
        <br/><br/>
        <label>Driver ID</label><br/>
        <input type="text"/>
        <br/><br/>
        <button id="connect">click</button>
      </div>
    );
  }

  public test() {
    const notificationButton = document.getElementById("connect");

    notificationButton!.addEventListener("click", () => {
        console.log("clicked");
    });
  }
}
