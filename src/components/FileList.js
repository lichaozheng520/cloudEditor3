import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [ editStatus, setEditStatus ] = useState(false)
  const [ value, setValue ] = useState('')
  const closeSearch = (e) => {
    // 阻止默认事件
    e.preventDefault()
    // 设置默认编辑状态
    setEditStatus(false)
    // 设置默认值
    setValue('')
  }
  useEffect(() => {
    const handleInputEvent = (event) => {
      const { keyCode } = event
      // 如果是enter键就传入搜索值
      if(keyCode === 13 && editStatus){
        const editItem = files.find(file => file.id === editStatus)
        onSaveEdit(editItem.id, value)
        // 设置编辑状态为默认值
        setEditStatus(false)
        // 设置值为默认值
        setValue('')
        // 如果是Esc键就关闭
      }else if(keyCode === 27 && editStatus){
        closeSearch(event)
      }
    }
    document.addEventListener('keyup', handleInputEvent)
    return () => {
      document.removeEventListener('keyup', handleInputEvent)
    }
  })
  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map(file => (
          <li className="list-group-item bg-light row d-flex align-items-center file-item mx-0"
              key={file.id}
          >
            { (file.id !== editStatus) &&
              <>
                <span className="col-2">
                  <FontAwesomeIcon 
                    size="lg" 
                    icon={ faMarkdown } 
                  />
                </span>
                <span 
                  className="col-6 c-link"
                  onClick={() => {onFileClick(file.id)}}
                >
                  {file.title}
                </span>
                <button 
                  type="button"
                  className="icon-button col-2"
                  onClick={() => { setEditStatus(file.id); setValue(file.title); }}
                >
                  <FontAwesomeIcon 
                    title="编辑" 
                    size="lg" 
                    icon={ faEdit }
                  />
                </button>
                <button 
                  type="button"
                  className="icon-button col-2"
                  onClick={() => { onFileDelete(file.id) }}
                >
                  <FontAwesomeIcon
                    title="删除" 
                    size="lg" 
                    icon={ faTrash }
                  />
                </button>
              </>
            }
            { (file.id === editStatus) &&
              <>
                <input className="form-control col-10" 
                  value={value}
                  onChange={ (e) => { setValue(e.target.value) } } />
                <button type="button"
                  className="icon-button col-2"
                  onClick={ closeSearch }>
                  <FontAwesomeIcon 
                    title="关闭"
                    size="lg"
                    icon={ faTimes }
                  />
                </button>
              </>
            }
          </li>
        ))
      }
    </ul>
  )
}

// 添加属性检查
FileList.propTypes = {
  // 要求必须是数组
  files: PropTypes.array,
  // 要求必须是函数
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  onSaveEdit: PropTypes.func,
}

export default FileList
