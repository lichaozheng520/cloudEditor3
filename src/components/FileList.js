import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress.js'

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [ editStatus, setEditStatus ] = useState(false)
  const [ value, setValue ] = useState('')
  let node = useRef(null)
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  
  const closeSearch = (editItem) => {
    // 设置默认编辑状态
    setEditStatus(false)
    // 设置默认值
    setValue('')
    // if we are editing a newly created file,
    // we should delete this file when pressing esc
    if(editItem.isNew){
      onFileDelete(editItem.id)
    }
  }

  useEffect(() => {
    const newFile = files.find(file => file.isNew)
    console.log(newFile) //undefined
    if(newFile){
      setEditStatus(newFile.id)
      setValue(newFile.title)
    }
    // 当files有所变化的时候运行该useEffect
  }, [files])

  useEffect(() => {
    const editItem = files.find(file => file.id === editStatus)
    // 如果是enter键/同时是编辑状态/同时value值不为空,那么就传入搜索值
    if(enterPressed && editStatus && (value.trim() !== '')){
      onSaveEdit(editItem.id, value, editItem.isNew)
      // 设置编辑状态为默认值
      setEditStatus(false)
      // 设置值为默认值
      setValue('')
      // 如果是Esc键/同时是编辑状态，那么就关闭
    }else if(escPressed && editStatus){
      closeSearch(editItem)
    }
  })
  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map(file => (
          <li className="list-group-item bg-light row d-flex align-items-center file-item mx-0"
              key={file.id}
          >
            { ((file.id !== editStatus) && !file.isNew) &&
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
            { ((file.id === editStatus) || file.isNew) &&
              <>
                <input className="form-control col-10" 
                  value={value}
                  placeholder="请输入文件名称"
                  onChange={ (e) => { setValue(e.target.value) } } />
                <button type="button"
                  className="icon-button col-2"
                  onClick={() => { closeSearch(file)} }>
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
