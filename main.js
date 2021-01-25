const  { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      // 如果不设置的话，则后面remote不能获取到
      enableRemoteModule: true
    }
  })
  const urlLoaction = isDev ? 'http://localhost:3000' : 'dummyurl'
  mainWindow.loadURL(urlLoaction)
})
