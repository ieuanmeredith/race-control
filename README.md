# Race Control - An iRacing telemetry & timing system

![race control](https://i.gyazo.com/ad081f8d5d5ad3695c41db17f5756b45.gif)

![race control](https://imgur.com/361a8a99-3b53-4798-91e6-5cf119a59842)

This project is designed to provide a means to view real time telemetry and timing data from the iRacing simulator. Is it currently a work in progress and any/all aspects of the design and running procedure are likely to change at any time.

The context assumed while the system is in use is that all drivers for a car are connected to the same session and only 1 driver is actively driving.

'/src/_prototyping' will likely see these changes before they are integrated to the main solution.

The server and web applications will run on any server capable of running node/angular applications. I choose to run them on AWS EC2 (Ubuntu) instances using PM2 as a process manager.

## Solution Architechture

This system consists of 3 major components.

1. Transmitter (Windows application)
2. Race Control Server (node.js server)
3. Race Control Web Application (Angular 2.0 web app [Blazor implementation in pipeline])

### Tramsmitter

A simple Windows application that interacts with the iRacing simulator to gather telemetry & session data, this is sent via websocket connection to the Race Control Server using the (interface) provided url. Driver id is also provided via the interface.

### Server

Node.js server implementation that receives the data from N number of receivers, processes said data and distributes it via websocket connections to the web app.

Only telemetry/session info from the active driver is processed. This is checked by matching the driver id provided in the Transmitter interface to the active driver list in the iRacing simulator.

There should be a 1-to-1 correlation between cars and servers. That is to say if your team has 3 cars entered into a special event, each car should connect to a unique instance/url of the server.

The Server has 2 routes, '/receiver' and '/web'.

### Web App

Angular 2.0 web application that connects to the Server via websockets to receive and display data. The root route '/' displays all live telemetry data for the car and the '/timing' route displays a live timing page.

There should also be a 1-to-1 correlation between cars and web apps. Each web app should connect to 1 server instance.

## Getting Started

1. Download the latest release of the compiled Transmitter app from the **releases** section of this repo, or build it yourself by running `npm run make` from the 'src/electron/race-control-transmitter' directory and running the compiled .exe in the generated '/out' folder.

2. Using a suitable server for running node.js applications. Make a copy of the 'src/server/' directory to the server and run `ts-node index.ts XXXX` where 'XXXX' is the port number you wish to run the server on. I suggest using PM2 to easily spin up several instances running on different port number if you are running a team with multiple cars racing.

3. In it's current form the Socket Service found under 'src/web/race-control-app/' has a hard coded url template that should use the address of the server and the port number used in point 2 to connect to the server. Run `npm build --prod` to generate the Angular 'dist' folder. You will need to generate a 'dist' folder for each instance of the web app you want to run, changing the socket service to use the correct url each time before building. 

Upload these folders to your server and serve as necessary, ensuring each instance uses a unique port. Again I recommend using PM2 in combination with the npm package 'http-server'.

### Example end result

In this example we will consider a team with 3 cars, each with 4 drivers.

Each car will have an instance of the Server running for their car
- http://123.123.1.1:3000 (car 1)
- http://123.123.1.1:4000 (car 2)
- http://123.123.1.1:5000 (car 3)

Each driver will connect to the Server using the Transmitter
- http://123.123.1.1:3000/receiver (car 1)
- http://123.123.1.1:4000/receiver (car 2)
- http://123.123.1.1:5000/receiver (car 3)

Each car will have an instance of the web app running for their car. Each compiled using the corresponding Server url i.e.
- http://123.123.1.1:3003 (car 1) -> [socket-service url] http://123.123.1.1:3000/web
- http://123.123.1.1:4004 (car 2) -> [socket-service url] http://123.123.1.1:4000/web
- http://123.123.1.1:5005 (car 3) -> [socket-service url] http://123.123.1.1:5000/web

Each web app can be accessed via '/' and '/timing' to view the data being transmitted from the active driver. i.e.
- http://123.123.1.1:3003/
- http://123.123.1.1:3003/timing
