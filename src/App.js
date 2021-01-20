import React from 'react'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'

function App() {
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-6 bg-danger left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={ (value) => { console.log(value) } }
          />
          <FileList 
            files={defaultFiles}
            onFileClick={ (id) => {console.log(id)} }
            onFileDelete={ (id) => {console.log('deleting', id)} }
            onSaveEdit={ (id, newValue) => {
              console.log(id); 
              console.log(newValue)}
            }
          />
          <div className="row no-gutters">
            <div className="col">
              <BottomBtn 
                text="新建"
                colorClass="btn-primary"
                icon={ faPlus }
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
        <div className="col-6 bg-primary right-panel">
          <h1>This is the right!</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
