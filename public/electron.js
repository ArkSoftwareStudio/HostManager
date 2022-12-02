const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs');

const PATHS = {
  waiterData: path.join(app.getPath('documents'), './host/Data/Waiters'),
  waiterJson: path.join(app.getPath('documents'), './host/Data/Waiters/Waiters.json'),
  sectionData: path.join(app.getPath('documents'), './host/Data/Sections'),
  sectionJson: path.join(app.getPath('documents'), './host/Data/Sections/Sections.json'),
  logsData: path.join(app.getPath('documents'), './host/Data/Logs'),
  logsJson: path.join(app.getPath('documents'), './host/Data/Logs/Logs.json')
}

const _ACTIONS = {
  take: "SIT",
  free: "FREE",
  delete: "DELETE",
  create: "CREATE",
  add: "ADD",
  assign : "ASSIGN"
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

function createLog(log) {
  const logObj = {
    logId: Math.random().toString(32).slice(2),
    dateTime: formatDate(new Date()),
    action: log.action,
    description: log.description || 'N/A'
  }

  if (fs.existsSync(PATHS.logsJson)) {
    let fileString = fs.readFileSync(PATHS.logsJson, 'utf-8');
    let tempArr = JSON.parse(fileString);
    tempArr.push(logObj);
    writeFile(PATHS.logsJson, tempArr);

    return tempArr;
  } else {
    fs.mkdirSync(PATHS.logsData);
    let arr = [];
    arr.push(logObj)
    writeFile(PATHS.logsJson, arr)

    return arr;
  }
}


function writeFile(path, file) {
  fs.writeFile(path, JSON.stringify(file), {
    encoding: 'utf-8', flag: "w",
    mode: 0o666
  }, (err) => {
    if (err) return console.log(err);
  })
}

async function createDirFile(dirPath, filePath) {
  let emptyArr = [];
  let datajson = JSON.stringify(emptyArr);
  fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) return console.log(err);
    fs.writeFile(filePath, datajson, {
      encoding: 'utf-8', flag: "w",
      mode: 0o666
    }, (err) => {
      if (err) return console.log(err);
    });
  })

  return [];
}

function readFileToJson(path) {
  let fileContents = fs.readFileSync(path, "utf-8");
  let json = JSON.parse(fileContents)
  return json;
}

function createWindow() {

  //#region MAIN WINDOW CREATION
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1440,
    height: 720,
    frame: true,
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
  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
  // Open the DevTools.


  win.removeMenu();


  const sExistsFunction = () => { return fs.existsSync(PATHS.sectionJson); }

  //#endregion MAIN WINDOW CREATION

  //#region IPC MAIN HANDLES
  ipcMain.handle('data', async (e, args) => {
    switch (args.method) {

      //#region WAITER MODIFICATIONS
      case 'getWaiters':
        if (fs.existsSync(PATHS.waiterJson)) {
          try {
            return readFileToJson(PATHS.waiterJson);
          } catch (err) {
            console.error(err);
            return [];
          }
        }

        createDirFile(PATHS.waiterData, PATHS.waiterJson).then((result) => {
          return result;
        });

        return [];

      case 'addWaiter':
        if (fs.existsSync(PATHS.waiterJson)) {
          let alreadyExists = false;
          let waiterJson = readFileToJson(PATHS.waiterJson);
          waiterJson.filter((waiter) => {
            if (waiter.firstName === args.waiter.firstName && waiter.lastName === args.waiter.lastName) alreadyExists = true;
            return waiter;
          })
          if (!alreadyExists) waiterJson.push(args.waiter);
          writeFile(PATHS.waiterJson, waiterJson);
          createLog({
            action: _ACTIONS.add,
            description: `NEW WAITER: ${args.waiter.firstName} ${args.waiter.lastName}`
          });
          return waiterJson;
        }
        return [];

      case 'deleteWaiter':
        if (fs.existsSync(PATHS.waiterJson)) {
          let waiterJson = readFileToJson(PATHS.waiterJson)
          let sectionJson = readFileToJson(PATHS.sectionJson);
          let result = waiterJson.filter((item) => {
            if (item.id === args.id) {
              createLog({
                action: _ACTIONS.delete,
                description: `${item.firstName} ${item.lastName} WAS DELETED`
              });
              let tempArr = sectionJson.filter(section => {
                if (section.waiter.id === args.id) {
                  console.log(`THIS WAITER WAS ASSIGNED TO SECTION ${section.sectionName}`)
                  section.waiter = false;
                  console.log(section);
                }
                return section;
              })
              writeFile(PATHS.sectionJson, tempArr);
            }
            return item.id !== args.id
          })

          writeFile(PATHS.waiterJson, result);
          return result;
        }
        return [];

      //#endregion

      //#region TABLE MODIFICATIONS
      case 'toggleTable':
        if (sExistsFunction) {
          let fileContents = fs.readFileSync(PATHS.sectionJson, "utf-8");
          let json = JSON.parse(fileContents)
          let newJson = json.filter((section) => {
            if (args.info.sectionName === section.sectionName) {
              section.tables.filter((table) => {
                if (table.tableNumber === args.info.tableNumber) {
                  table.isTaken = !table.isTaken;
                  table.isTaken ?
                    createLog(
                      {
                        action: _ACTIONS.take,
                        description: `TABLE ${table.tableNumber} IS TAKEN`
                      }
                    )
                    :
                    createLog({
                      action: _ACTIONS.free,
                      description: `TABLE ${table.tableNumber} IS FREE TO USE`
                    });
                }
                return table;
              })
            }
            return section;
          })

          writeFile(PATHS.sectionJson, newJson);

          return newJson;
        }
        return [];

      case 'addTable':
        let checkExists = fs.existsSync(PATHS.sectionJson)
        if (checkExists) {
          let fileContents = fs.readFileSync(PATHS.sectionJson, "utf-8");
          let json = JSON.parse(fileContents)
          console.log(args.section);
          let newSection = json.filter((section) => {
            if (section.sectionId === args.section.sectionId) {
              section.tables.push({
                tableId: Math.random().toString(32).slice(2),
                tableNumber: `${args.section.tableName}`,
                isTaken: false
              })
              createLog({
                action: _ACTIONS.create,
                description: `TABLE ${args.section.tableName} WAS ADDED`
              });
            }
            return section;
          })

          writeFile(PATHS.sectionJson, newSection);

          return newSection;
        }

        return [];

      case 'deleteTable':
        if (sExistsFunction) {
          let fileContents = fs.readFileSync(PATHS.sectionJson, "utf-8");
          let json = JSON.parse(fileContents)
          let sections = json.filter((section) => {
            return section.sectionName === args.info.sectionName;
          })
          let tables = sections[0].tables.filter((table) => {
            if (table.tableId === args.info.tableId) createLog({
              action: _ACTIONS.delete,
              description: `TABLE ${args.info.tableName} WAS DELETED`
            });
            return table.tableId !== args.info.tableId;
          })

          sections[0].tables = tables;

          let newSections = json.filter((section) => {
            if (section.sectionName === args.info.sectionName) return sections[0];
            return section;
          })


          writeFile(PATHS.sectionJson, newSections);

          return newSections;
        }
        return [];

      //#endregion

      //#region SECTION MODIFICATIONS
      case 'getSections':
        if (fs.existsSync(PATHS.sectionJson)) {
          try {
            return readFileToJson(PATHS.sectionJson);
          } catch (err) {
            console.error(err);
            return [];
          }
        }
        createDirFile(PATHS.sectionData, PATHS.sectionJson).then((result) => {
          return result;
        });
        return [];

      case 'addSection':
        if (fs.existsSync(PATHS.sectionJson)) {

          let json = readFileToJson(PATHS.sectionJson);
          json.push(args.section.newSection)

          createLog({
            action: _ACTIONS.create,
            description: `SECTION ${args.section.newSection.sectionName} WAS ADDED`
          })

          writeFile(PATHS.sectionJson, json);
          return json;
        }

        return [];

      case 'deleteSection':
        if (sExistsFunction) {
          console.log('deleting Section...')
          let json = readFileToJson(PATHS.sectionJson);
          let newArray = json.filter((section) => {
            if (section.sectionId === args.sectionId) {
              createLog({
                action: _ACTIONS.delete,
                description: `SECTION ${section.sectionName} WAS DELETED`
              });
            }
            return section.sectionId !== args.sectionId;
          })
          writeFile(PATHS.sectionJson, newArray);
          return newArray;
        }
        return [];

      case 'assignWaiter':
        if (sExistsFunction) {
          let fileContents = fs.readFileSync(PATHS.sectionJson, "utf-8");
          let json = JSON.parse(fileContents)
          let newArray = json.filter((section) => {
            if (section.sectionId === args.sectionId) {
              section.waiter = args.waiter;
              createLog({
                action: _ACTIONS.assign,
                description : `${args.waiter.firstName} ${args.waiter.lastName} WAS ASSIGNED TO SECTION ${section.sectionName}`
              })
              return section;
            }
            return section;
          })
          writeFile(PATHS.sectionJson, newArray);
          return newArray;
        }
        return [];
      //#endregion SECTION MODIFICATIONS

      default: break;
    }
  })

  ipcMain.handle('logs', async (e, args) => {
    if (args.method === 'getLogs') {
      if (fs.existsSync(PATHS.logsJson)) {
        let fileData = fs.readFileSync(PATHS.logsJson);
        let arr = JSON.parse(fileData);
        return arr.reverse();
      }
    }
    return [];
  })
  //#endregion IPC MAIN HANDLES

  //#region IPC MAIN ON
  ipcMain.on('close-app', () => {
    win.close();
  })
  //#endregion IPC MAIN ON

}

app.whenReady().then(createWindow);

//#region  ACTIVATE AND CLOSE FUNCTIONS
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

//#endregion