import React, { useState } from 'react'
import { faPlus, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from 'react-simplemde-editor'
import { v4 as uuidv4 } from 'uuid'
import {flattenArr, objToArr} from './utils/helper'
import fileHelper from './utils/fileHelper'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'
import defaultFiles from './utils/defaultFiles'

// 在React的App.js中引用Node.js的模块
// 需要在require前添加window对象
const { join } = window.require('path')
//console.dir(path)

// 在渲染进程中使用主进程的API，需要使用到remote
// 需要在main.js创建Window的时候，设置一个新的参数使能remote
// webPreferences: { enableRemoteModule: true }
// 否则这个remote将获取不到而导致报错
const { remote } = window.require('electron')

//【注意】electron版本不能太新，使用4.0.0版本
const Store = window.require('electron-store')
const store = new Store()
store.set('name', 'OwinLi')
console.log(store.get('name')) // OwinLi
store.delete('name')
console.log(store.get('name')) // undefined

function App() {
  // 修改前的代码
  // const [files, setFiles] = useState(defaultFiles)
  // 修改后的代码
  const [files, setFiles] = useState(flattenArr(defaultFiles))
  //console.log(files)
  const [activeFileID, setActiveFileID] = useState('')
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])
  
  // 添加的代码
  const filesArr = objToArr(files)
  //console.log(filesArr)
  const savedLocation = remote.app.getPath('documents')
  // 修改前代码
  // const activeFile = files.find(file=>file.id === activeFileID)
  // 修改后代码
  const activeFile = files[activeFileID]
  // 如果打开的数组中有搜索的文件
  //const fileListArr = (searchedFiles.length > 0) ? searchedFiles : files
  // 修改后的代码
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr
  
  const openedFiles = openedFileIDs.map(openID => {
    // return files.find(file => file.id === openID)
    return files[openID]
  })
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
  const updateFileName = (id, title, isNew) => {
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
    // 如果是新建文件需要【首次命名】
    if(isNew){
      // 那么保存新建的文件到savedLocation所指定的路径(即documents)
      fileHelper.writeFile(join(savedLocation, `${title}.md`), 
        files[id].body).then((res) => {
          setFiles({...files, [id]: modifiedFile})
          console.log("🌹🌹🌹🌹🌹🌹🌹🌹🌹执行了!") // 可以执行
          console.log(res) // undefined
        }).catch(err => {
          console.log("👻👻👻👻👻👻👻👻👻👻异常了!")
        })
    }else{ //否则如果是已经存在的文件需要【重命名】
      fileHelper.renameFile(join(savedLocation, `${files[id].title}.md`),
        join(savedLocation, `${title}.md`)
    ).then(() => {
      setFiles({...files, [id]: modifiedFile})
    })
    }
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
  // 保存当前的文件
  const saveCurrentFile = () => {
    // 如果存在活跃的文件，才能保存(如果不进行判断，则会报错)
    if(activeFile){
      fileHelper.writeFile(join(savedLocation, `${activeFile.title}.md`),
      activeFile.body
      ).then(() => {
        setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFile.id))
      })
    }
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
            <div className="col">
              <BottomBtn 
                text="保存"
                colorClass="btn-hope-red"
                icon={ faSave }
                onBtnClick={saveCurrentFile}
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
