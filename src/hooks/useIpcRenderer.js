import { useEffect } from 'react'
const { ipcRenderer } = window.require('electron')

/*
 const obj = {
   'create-file': () => {},
   'remove-file': () => {}
 }
*/

const useIpcRenderer = (keyCallbackMap) => {
  useEffect(() => {
    Object.keys(keyCallbackMap).forEach(key => {
      ipcRenderer.on(key, keyCallbackMap[key])
    })
    return () => {
      // 清除副作用
      Object.keys(keyCallbackMap).forEach(key => {
        ipcRenderer.removeListener(key, keyCallbackMap[key])
      })
    }
  })
}

export default useIpcRenderer
