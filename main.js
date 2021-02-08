const  { app, BrowserWindow, Menu } = require('electron')
const isDev = require('electron-is-dev')
const menuTemplate = require('./src/menuTemplate')
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1160,
    height: 680,
    webPreferences: {
      // 设置node可用
      nodeIntegration: true,
      // 如果不设置的话，则后面remote不能获取到
      enableRemoteModule: true
    }
  })
  const urlLoaction = isDev ? 'http://localhost:3000' : 'dummyurl'
  mainWindow.loadURL(urlLoaction)
  
  // set the menu
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})
