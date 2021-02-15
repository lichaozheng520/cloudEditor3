const { remote, ipcRenderer } = require('electron')
const Store = require('electron-store')
const settingsStore = new Store({name: 'Settings'})
const qiniuConfigArr = ['#savedFileLocation','#accessKey', '#secretKey', '#bucketName']

const $ = (selector) => {
const result = document.querySelectorAll(selector)
return result.length > 1 ? result : result[0]
}

document.addEventListener('DOMContentLoaded', () => {
let savedLocation = settingsStore.get('savedFileLocation')
// 如果保存路径存在，则将路径显示到输入框中
if (savedLocation) {
  $('#savedFileLocation').value = savedLocation
}

// get the saved config data and fill in the inputs
qiniuConfigArr.forEach(selector => {
    const savedValue = settingsStore.get(selector.substr(1))
    if (savedValue) {
      $(selector).value = savedValue
    }
})

$('#select-new-location').addEventListener('click', () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: '选择文件的存储路径',
    }).then(path => {
      console.log(path.filePaths)
      path = path.filePaths
      if (Array.isArray(path)) {
        $('#savedFileLocation').value = path[0]
      }
    })
})

$('#settings-form').addEventListener('submit', (e) => {
    e.preventDefault()
    qiniuConfigArr.forEach(selector => {
      if ($(selector)) {
        let { id, value } = $(selector)
        settingsStore.set(id, value ? value : '')
      }
    })
    // sent a event back to main process to enable menu items if qiniu is configed
    ipcRenderer.send('config-is-saved')
    // 关闭当前的窗口
    remote.getCurrentWindow().close()
})

$('.nav-tabs').addEventListener('click', (e) => {
    e.preventDefault()
    $('.nav-link').forEach(element => {
      element.classList.remove('active')
    })
    e.target.classList.add('active')
    $('.config-area').forEach(element => {
      element.style.display = 'none'
    })
    $(e.target.dataset.tab).style.display = 'block'
})

})
