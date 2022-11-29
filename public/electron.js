const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs');

let userJson = fs.readFileSync(path.join(__dirname, '../src/Data/Waiters/Waiters.json'), 'utf-8');
let waiters = JSON.parse(userJson);

function UpdateWaiterList(){
    userJson = fs.readFileSync(path.join(__dirname, '../src/Data/Waiters/Waiters.json'), 'utf-8');
    waiters = JSON.parse(userJson);
}

function DeleteWaiter(id){
  var filtered = waiters.filter((item) => {
    return item.id !== id;
  })
  var writeJson = JSON.stringify(filtered);
  fs.writeFileSync(path.join(__dirname, '../src/Data/Waiters/Waiters.json'), writeJson, 'utf-8');
  UpdateWaiterList();
}


function createWindow() {
  // Create the browser window.
  var addWin = null;
  const win = new BrowserWindow({
    width: 1440,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  if(isDev){
    win.loadURL(
      isDev
        ? 'http://localhost:3000' : `file://${__dirname}/../build/index.html`
    );
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

  ipcMain.on('data', (e, args) => {
    switch(args.method){
      case 'getWaiters':
        UpdateWaiterList();
        e.reply('data', {method:'getWaiters', payload: waiters})
      break;

      case 'delete-waiter':
        DeleteWaiter(args.payload);
        UpdateWaiterList();
        e.reply('reload', {method:'getWaiters', payload: waiters})
      break;

      default: break;
    }

  })

  ipcMain.handle('waiter', async (e, args) => {
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
            nodeIntegration: true,
            contextIsolation: false
          },
        });
        
        addWin.loadURL(
          isDev
            ? 'http://localhost:3000#/waiterModal'
            : `file://${path.join(__dirname, '../build/index.html#/waiterModal')}`
        );
      break;

      case 'cancel':
        if(addWin) addWin.close();
        addWin = null;
      break;


      case 'addWaiter':
          waiters.push(args.payload);
          userJson = JSON.stringify(waiters);
          fs.writeFileSync(path.join(__dirname, '../src/Data/Waiters/Waiters.json'), userJson, 'utf-8');
          UpdateWaiterList();
          win.webContents.send('reload', {method:'getWaiters', payload: waiters});
          addWin.webContents.send('success');
      break;

      case 'getWaiters':
        userJson = fs.readFileSync(path.join(__dirname, '../src/Data/Waiters/Waiters.json'), 'utf-8');
        waiters = JSON.parse(userJson);
        e.sender.send(waiters);
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