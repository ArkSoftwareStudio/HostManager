const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs');

const PATHS = {
  waiterData : path.join(app.getPath('documents'), './host/Data/Waiters'),
  waiterJson : path.join(app.getPath('documents'), './host/Data/Waiters/Waiters.json')
}


function createWindow() {

  // Create the browser window.
  var addWin = null;
  const win = new BrowserWindow({
    width: 1440,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // and load the index.html of the app.
  if(isDev){
    win.loadURL('http://localhost:3000');
  }else{
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
  // Open the DevTools.

    win.webContents.openDevTools({ mode: 'detach' });

  win.removeMenu();

  ipcMain.handle('data', async (e, args) => {
    switch(args.method){
      case 'getWaiters':
        let rawData = [];
        let fileExists = fs.existsSync(PATHS.waiterJson)
        if(!fileExists){
          let datajson = JSON.stringify(rawData);

          fs.mkdir(PATHS.waiterData, {recursive: true}, (err) =>{
            if (err) return console.log(err);
            fs.writeFile(PATHS.waiterJson, datajson, {encoding: 'utf-8', flag: "w",
            mode: 0o666}, (err) => {
              if(err) return console.log(err);
            });
          })

          return [];
        }else{
          try{
            let fileContents = fs.readFileSync(PATHS.waiterJson, "utf-8");
            let json = JSON.parse(fileContents)
            return json;
          }catch(err) {
            console.log("JSON IS NULL");
            return [];
          }
        }
      break;

      case 'deleteWaiter': 
        if(fs.existsSync(PATHS.waiterJson)){
          let waiterDoc = fs.readFileSync(PATHS.waiterJson, 'utf-8');
          let waiterJson = JSON.parse(waiterDoc);
          let result = waiterJson.filter((item) => {
            return item.id !== args.id
          })
          fs.writeFile(PATHS.waiterJson, JSON.stringify(result), {encoding: 'utf-8'}, (err) => {
            if(err) return console.log(err);
          })
          return result;
        }

      break;

      case 'addWaiter':
        if(fs.existsSync(PATHS.waiterJson)){
          let waiterDoc = fs.readFileSync(PATHS.waiterJson, 'utf-8');
          let waiterJson = JSON.parse(waiterDoc);
          waiterJson.push(args.waiter)
          fs.writeFile(PATHS.waiterJson, JSON.stringify(waiterJson), {encoding: 'utf-8'}, (err) => {
            if(err) return console.log(err);
          })
          addWin.webContents.send('success');
          win.webContents.send('reload');
          return waiterJson;
        }
      break;

      default: break;
    }
  })


  ipcMain.on('waiter', async (e, args) => {
    switch(args.method){
      case 'open-form':
        addWin = new BrowserWindow({
          width: 720,
          height: 360,
          parent: win,
          frame: false,
          modal: true,
          resizable: false,
          movable: false,
          webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
          },
        });
        
        if(isDev){
          addWin.loadURL('http://localhost:3000#/waiterModal');
        }else{
          addWin.loadFile(`${path.join(__dirname, 'index.html')}`, {hash: "/waiterModal"});
        }

        addWin.webContents.openDevTools({mode: 'detach'});
      break;

      case 'cancel':
        if(addWin) addWin.close();
        addWin = null;
      break;

        default: break;
    }
  });

  
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});