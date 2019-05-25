import { app, BrowserWindow } from "electron";
import { enableLiveReload } from "electron-compile";
import path = require("path");
import ChildProcess = require("child_process");

if (require("electron-squirrel-startup")) {
  const appFolder = path.resolve(process.execPath, "..");
  const rootAtomFolder = path.resolve(appFolder, "..");
  const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
  const exeName = path.basename(process.execPath);

  const spawn = function(command: any, args: any) {
    let spawnedProcess;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args: any) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":
      // Install desktop and start menu shortcuts
      spawnUpdate(["--createShortcut", exeName]);
      setTimeout(app.quit, 1000);

    case "--squirrel-uninstall":
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers
      // Remove desktop and start menu shortcuts
      spawnUpdate(["--removeShortcut", exeName]);
      setTimeout(app.quit, 1000);

    case "--squirrel-obsolete":
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
    default:
      app.quit();
  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) { enableLiveReload(); }

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 330,
    height: 300,
    title: "Race Control - Transmitter"
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
