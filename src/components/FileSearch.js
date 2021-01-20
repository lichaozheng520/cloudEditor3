  import React, { useState, useEffect, useRef } from 'react'
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
  import PropTypes from 'prop-types'
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
    <div className="alert alert-primary d-flex justify-content-between">
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