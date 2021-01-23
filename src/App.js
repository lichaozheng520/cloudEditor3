import React, { useState } from 'react'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from 'react-simplemde-editor'
import { v4 as uuidv4 } from 'uuid'
import {flattenArr, objToArr} from './utils/helper'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'

function App() {
  // 修改前的代码
  // const [files, setFiles] = useState(defaultFiles)
  // 修改后的代码
  const [files, setFiles] = useState(flattenArr(defaultFiles))
  console.log(files)
  const [activeFileID, setActiveFileID] = useState('')
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])
  
  // 添加的代码
  const filesArr = objToArr(files)
  console.log(filesArr)
  
  const openedFiles = openedFileIDs.map(openID => {
    // return files.find(file => file.id === openID)
    return files[openID]
  })
  // 修改前代码
  // const activeFile = files.find(file=>file.id === activeFileID)
  // 修改后代码
  const activeFile = files[activeFileID]
  
  const fileClick = (fileID) => {
    // set current active file
    setActiveFileID(fileID)
    // if openedFiles don't have the current ID
    // then add new fileID to openedFiles
    if(!openedFileIDs.includes(fileID)){
      setOpenedFileIDs([ ...openedFileIDs, fileID ])
    }
  }
  const tabClick = (fileID) => {
    // set current active file
    setActiveFileID(fileID)
  }
  // 关闭Tab功能
  const tabClose = (id) => {
    // remove current id from openedFileID
    const tabsWithout = openedFileIDs.filter(fileID => fileID !== id)
    setOpenedFileIDs(tabsWithout)
    // set the active to the first opened tab if still tabs left
    if(tabsWithout.length > 0){
      setActiveFileID(tabsWithout[0])
    }else{
      setActiveFileID('')
    }
  }
  // 当文件改变的时候
  const fileChange = (id, value) => {
    // 原来的代码
    /* const newFile = files.map(file => {
      if(file.id === id){
      file.body = value
    }
    return file
    }) */
    // 修改后的代码
    const newFile = {...files[id], body: value}
    setFiles({...files, [id]: newFile})
    // update unsavedIDs
    if(!unsavedFileIDs.includes(id)){
      setUnsavedFileIDs([...unsavedFileIDs, id])
    }
  }
    // 当删除文件的时候
  const deleteFile = (id) => {
    // filter out the current file id
    
    // 修改前的代码
    //const newFile = files.filter(file => file.id !== id)
    // 修改后的代码
    delete files[id]
    setFiles(files)
    // close the tab if opened
    tabClose(id)
  }
  // 更新文件名的功能
  const updateFileName = (id, title) => {
    // 修改前的代码
    //  const newFiles = files.map(file => {
    //    if(file.id === id){
    //      file.title = title
    //      file.isNew = false
    //    }
    //    return file
    //  })
    // setFiles(newFiles)
    
    // 修改后的代码
    const modifiedFile = {...files[id], title, isNew: false}
    setFiles({...files, [id]: modifiedFile})
  }
  // 文件搜索功能
  const fileSearch = (keyword) => {
    // filter out the new files based on the keyword
    
    // 修改前的代码
    //const newFiles = files.filter(file => file.title.includes(keyword))
    // 修改后的代码
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    // setFiles(newFiles)
    setSearchedFiles(newFiles)
  }
  // 如果打开的数组中有搜索的文件
  //const fileListArr = (searchedFiles.length > 0) ? searchedFiles : files
  // 修改后的代码
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr
  // 新建文件
  const createNewFile = () => {
    const newID = uuidv4()
    
    // 修改前的代码
    //  const newFiles = [
    //    ...files,
    //    {
    //      id: newID,
    //      title: '',
    //      body: '## 请输入Markdown',
    //      createAt: new Date().getTime(),
    //      isNew: true
    //    }
    //  ]
    //  setFiles(newFiles)
    
    // 修改后的代码
    const newFile = {
      id: newID,
      title: '',
      body: '## 请输入Markdown',
      createAt: new Date().getTime(),
      isNew: true
    }
    setFiles({...files, [newID]: newFile})
  }
  
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={ fileSearch }
          />
          <FileList
            files={fileListArr}
            onFileClick={ fileClick }
            onFileDelete={ deleteFile }
            onSaveEdit={ updateFileName }
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn 
                text="新建"
                colorClass="btn-primary"
                icon={ faPlus }
                onBtnClick={createNewFile}
              />
            </div>
            <div className="col">
              <BottomBtn 
                text="导入"
                colorClass="btn-success"
                icon={ faFileImport }
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          { !activeFile &&
            <div className="start-page">
              选择或者创建新的Markdown 文档
            </div>
          }
          { activeFile &&
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => {fileChange(activeFile.id, value)}}
                options={{
                  minHeight: '515px',
                  // 阻止自动下载
                  autoDownloadFontAwesome: false
                }}
              />
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
