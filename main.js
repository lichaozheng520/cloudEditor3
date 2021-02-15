const  { app, BrowserWindow, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
let mainWindow, settingsWindow

app.on('ready', () => {
  const mainWindowConfig = {
    width: 1160,
    height: 680
  }
  // const urlLoaction = isDev ? 'http://localhost:3000' : 'dummyurl'
  const urlLoaction = isDev ? 'http://localhost:3000' :
    `file://${path.join(__dirname, './build/index.html')}`
  mainWindow = new AppWindow(mainWindowConfig, urlLoaction)
  // 当关闭的时候，变量需要被回收掉
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // hook up main events
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow
    }
    const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)
    // 当关闭的时候，变量需要被回收掉
    settingsWindow.on('closed', () => {
      settingsWindow = null
    })
  })
  // set the menu
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})
