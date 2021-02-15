const { BrowserWindow } = require('electron')

class AppWindow extends BrowserWindow {
  constructor(config, urlLocation) {
    // 默认选项
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        // 设置node可用
        nodeIntegration: true,
        // 如果不设置的话，则后面remote不能获取到
        enableRemoteModule: true
      },
      show: false,
      backgroundColor: '#efefef',
    }
    // 得到新的config
    const finalConfig = { ...basicConfig, ...config }
    super(finalConfig)
    this.loadURL(urlLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = AppWindow
