import React, { useState, useEffect, useRef } from 'react'
const FileSearch = ({ title, onFileSearch }) => {
  const [ inputActive, setInputActive ] = useState(false)
  const [ value, setValue ] = useState('')
  
  let node = useRef(null)
  
  // 定义方法closeSearch
  const closeSearch = (e) => {
    // 阻止默认行为
    e.preventDefault()
    setInputActive(false)
    // 清空
    setValue('')
  }
  useEffect(() => {
    const handleInputEvent = (event) => {
      const { keyCode } = event
      // 如果是enter键就传入搜索值
      if(keyCode === 13 && inputActive){
        onFileSearch(value)
        // 如果是Esc键就关闭
      }else if(keyCode === 27 && inputActive){
        closeSearch(event)
      }
    }
    document.addEventListener('keyup', handleInputEvent)
    return () => {
      document.removeEventListener('keyup', handleInputEvent)
    }
  })
  useEffect(() => {
    // 当点击"搜索"的时候才调用focus
    if(inputActive){
      // 自动获取焦点
      node.current.focus()
    }
  }, [inputActive])
  
  return (
    <div className="alert alert-primary">
      { !inputActive &&
        <div className="d-flex justify-content-between">
          <span>{ title }</span>
          <button type="button"
            className="btn btn-primary"
            onClick={() => { setInputActive(true) }}>
            搜索
          </button>
        </div>
      }
      { inputActive && 
        <div className="row">
          <input className="form-control col-8" 
            value={value}
            ref={node}
            onChange={ (e) => { setValue(e.target.value) } } />
          <button type="button"
            className="btn btn-primary col-4"
            onClick={ closeSearch }>
            关闭
          </button>
        </div>
      }
    </div>
  )
}
export default FileSearch
