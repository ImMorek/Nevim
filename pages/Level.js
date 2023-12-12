import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import levelsJson from '../levels.json'
import InfoWindow from '../components/InfoWindow';
import { useTimer } from 'use-timer';

const LevelPage = () => {
  const levelNumber = 1;
  const level = levelsJson.levels.find((l) => parseInt(l.levelNumber, 10) === levelNumber);
  console.log(levelsJson);
  const [open, setOpen] = React.useState(false)
  const [alertMessage, alertSetMessage] = useState();
  const [alertPriority, setAlertPriority] = useState();
  const {time, start, pause, reset, status} = useTimer({
    initialTime: 0,
    timerType: 'INCREMENTAL'
  });

  if (!level) { return (<>Something went wrong...</>) }
  const text = level.text;

  function handleEditorDidMount(editor, monaco) {

    start();
    switch (level.completionType) {
      case "cursorPosition":
        editor.onDidChangeCursorPosition((e) => {
          if(e.position.lineNumber === level.finishCritera.at(0) && e.position.column === level.finishCritera.at(1)) {
            pause();
            alertSetMessage("Jsi na správné pozici, " + {time}.toString());
            console.log(time)
            setAlertPriority("finish");
            setOpen(true);            
          }
        })    
        break;
      case "textEdit":
        editor.onDidChangeModelContent((e) => {
          if(editor.getValue() === level.finishCritera) {
            pause();
            alertSetMessage("Úkol splněn, " + {time}.toString());
            setAlertPriority("finish")
            setOpen(true);
          }
        })
        break;
      case "replace":
        editor.getModel().findMatches('ahoj').forEach(match => {
          editor.createDecorationsCollection([
            {
              range: match.range,
              options: {
                isWholeLine: false,
                inlineClassName: "text-highlight"
              }
            }
          ])
        })
        editor.onDidChangeModelContent((e) => {
          if(editor.getValue() === level.finishCritera) {
            alertSetMessage("Úkol splněn");
            setAlertPriority("finish")
            setOpen(true);
          }
        })
        break;
      default:
        break;
    }


    window.require.config({
      paths: {
        "monaco-vim": "https://unpkg.com/monaco-vim/dist/monaco-vim"
      }
    });

    editor.onKeyDown(async (e) => {
      if (e.keyCode === monaco.KeyCode.DownArrow || e.keyCode === monaco.KeyCode.UpArrow || e.keyCode === monaco.KeyCode.LeftArrow || e.keyCode === monaco.KeyCode.RightArrow) {
        setOpen(true);
        alertSetMessage("Místo šipek použij h, j, k, l");
        setAlertPriority("info");
        console.log("waited")
        e.preventDefault();
      }
    });

    window.require(["monaco-vim"], function (MonacoVim) {
      const statusNode = document.querySelector(".status-node");
      MonacoVim.initVimMode(editor, statusNode);
    });
  }
    return (
      <div className="vim-editor">
        <Editor
          height="90vh"
          width="75%"
          language="javascript"
          wrapperClassName="something"
          onMount={handleEditorDidMount}
          defaultValue={text}
          theme="vs-dark"
        />
        <InfoWindow setOpen={setOpen} open={open} alertMessage={alertMessage} alertPriority={alertPriority} levelNumber={levelNumber}/>
        <div className="utilities">
          <div className='level-name'>
            {level.levelName}
          </div>
          <code className="status-node"></code>
          <div className="user-info">
            log in
          </div>
        </div>
      </div>
    );
}

export default LevelPage;
