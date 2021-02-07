import { useState, useEffect } from 'react'

const useKeyPress = (targetKeyCode) => {
  const [keyPressed, setKeyPressed] = useState(false)
  
  const keyDownHandler = ({ keyCode }) => {
    if(keyCode === targetKeyCode){
      setKeyPressed(true)
    }
  }
  const keyUpHandler = ({ keyCode }) => {
    if(keyCode === targetKeyCode){
      setKeyPressed(false)
    }
  }
  
  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)
    return () => {
      // 清除副作用
      document.removeEventListener('keydown', keyDownHandler)
      document.removeEventListener('keyup', keyUpHandler)
    }
    // 这里有一个空数组(为了卸载的时候清除掉)
  })
  
  return keyPressed
}

export default useKeyPress
