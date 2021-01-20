  import React, { useState, useEffect, useRef } from 'react'
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
  import PropTypes from 'prop-types'
  import useKeyPress from '../hooks/useKeyPress.js'
  
  const FileSearch = ({ title, onFileSearch }) => {
  const [ inputActive, setInputActive ] = useState(false)
  const [ value, setValue ] = useState('')
  
  // 传入键码，使用自定义Hook useKeyPress中的两个键
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  
  let node = useRef(null)
  
  // 定义方法closeSearch
  const closeSearch = () => {
    setInputActive(false)
    // 清空
    setValue('')
  }
  useEffect(() => {
    if(enterPressed && inputActive){
      onFileSearch(value)
    }
    if(escPressed && inputActive){
      closeSearch()
    }
    /* const handleInputEvent = (event) => {
      const { keyCode } = event
      if(keyCode === 13 && inputActive){
        onFileSearch(value)
      }else if(keyCode === 27 && inputActive){
        closeSearch(event)
      }
    }
    document.addEventListener('keyup', handleInputEvent)
    return () => {
      document.removeEventListener('keyup', handleInputEvent)
    } */
  })
  useEffect(() => {
    // 当点击"搜索"的时候才调用focus
    if(inputActive){
      // 自动获取焦点
      node.current.focus()
    }
  }, [inputActive])
  
  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
      { !inputActive &&
        <>
          <span>{ title }</span>
          <button type="button"
            className="icon-button"
            onClick={() => { setInputActive(true) }}>
            <FontAwesomeIcon title="搜索" size="lg" icon={ faSearch } />
          </button>
        </>
      }
      { inputActive && 
        <>
          <input className="form-control" 
            value={value}
            ref={node}
            onChange={ (e) => { setValue(e.target.value) } } />
          <button type="button"
            className="icon-button"
            onClick={ closeSearch }>
            <FontAwesomeIcon title="关闭" size="lg" icon={ faTimes } />
          </button>
        </>
      }
    </div>
  )
}
  
// 添加属性检查
FileSearch.propTypes = {
  // 要求必须是字符串
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}
// 添加默认属性
FileSearch.defaultProps = {
  //如果同时添加了title属性，那么默认属性会被覆盖
  title: 'My Document'
}

export default FileSearch
