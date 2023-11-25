import React from "react";
import "./App.css";
import MyEditor from './components/editor.jsx';

function App() {
  return (
    <div className="custom-editor-root">
      
      <div className="position-relative d-flex w-100 align-items-center justify-content-center">
        <h2>Demo Editor By Nikhil</h2>
        <button className="save-btn">Save</button>
      </div>

      <div className="editor-wrapper">
        <MyEditor />
      </div>

    </div>
  );
}

export default App;
