import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import levelsJson from '../../levels.json'
import InfoWindow from '../../components/InfoWindow';
import { useTimer } from 'use-timer';
import { useRouter } from "next/router";
import LoginButton from '../../components/login-btn';
import { useSession } from "next-auth/react"

const LevelPage = () => {
  const router = useRouter(); 
  // const levelNumber = router.query.levelId;
  const levelNumber = 1;
  const {data: session } = useSession();

  console.log(levelNumber)
  console.log(levelsJson);
  const level = levelsJson.levels.find((l) => parseInt(l.levelNumber, 10) === levelNumber);
  const [open, setOpen] = React.useState(false)
  const [alertMessage, alertSetMessage] = useState();
  const [alertPriority, setAlertPriority] = useState();
  const [alertTime, setAlertTime] = useState();
  const {time, start, pause, reset, status} = useTimer({
    initialTime: 0,
    timerType: 'INCREMENTAL'
  });
  const currentTime = new Date();
  
    if (!level) { return (<>Something went wrong...</>) }
    const text = level.text;
  
    function handleEditorDidMount(editor, monaco) {
  
      switch (level.completionType) {
        case "cursorPosition":
          start();
          editor.onDidChangeCursorPosition((e) => {
            if(e.position.lineNumber === level.finishCritera.at(0) && e.position.column === level.finishCritera.at(1)) {
              const finishTime = new Date() - currentTime
              alertSetMessage("Jsi na správné pozici, ");
              setAlertTime(timeToString(finishTime));
              setAlertPriority("finish");
              setOpen(true);      
              if(session){
                console.log("Úkol zvládnul " + session.user.email + " za " + finishTime);
              }      
            }
          })    
          break;
        case "textEdit":
          start();
          editor.onDidChangeModelContent((e) => {
            if(editor.getValue() === level.finishCritera) {
              const finishTime = new Date() - currentTime
              alertSetMessage("Úkol splněn, " + {time});
              setAlertTime(timeToString(finishTime));
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
          <InfoWindow setOpen={setOpen} open={open} alertMessage={alertMessage} alertPriority={alertPriority} levelNumber={levelNumber} time={alertTime}/>
          <div className="utilities">
            <div className='level-name'>
              {level.levelName}
            </div>
            <code className="status-node"></code>
            <div className="user-info">
              <LoginButton/>
            </div>
          </div>
        </div>
      );
  }


export default LevelPage;


const timeToString = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
