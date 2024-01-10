import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import InfoWindow from '../../components/InfoWindow';
import { useRouter } from "next/router";
import LoginButton from '../../components/login-btn';
import { useSession } from "next-auth/react"
import {collection, onSnapshot, where, query, orderBy} from "@firebase/firestore"
import {db} from "../../firebase";
import levelsJson from "../../levels.json"

const LevelPage = () => {

  const router = useRouter(); 
  const levelNumber = router.query.levelId;
  // const levelNumber = 2;
  const [level, setLevel] = useState([])

  useEffect(() => {
      const collectionRef = collection(db, "levels")
      const q = query(collectionRef, orderBy("levelNumber"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id})))
        console.log(querySnapshot)
        const leveldata = querySnapshot.docs.map(doc => ({ ...doc.data(), levelId: doc.id}))
        console.log(leveldata);
        console.log(leveldata[0].finishCriteria);
        setLevel(leveldata[levelNumber - 1])
      });
      return unsubscribe;
  }, [])
  
  const {data: session } = useSession();
  
  // setLevel(levelsJson.levels.find((l) => parseInt(l.levelNumber, 10) === parseInt(levelNumber)));
  // const level = queryLevel[0]
  console.log(level)
  const [open, setOpen] = React.useState(false)
  const [alertMessage, alertSetMessage] = useState();
  const [alertPriority, setAlertPriority] = useState();
  const [alertTime, setAlertTime] = useState();

  const currentTime = new Date();

  if (levelNumber === undefined) {
    return <>loading...</>;
  }
  if (!level.text) { return (<>Something went wrong...</>) }
  const text = level.text.replaceAll("\\n", '\n');
  console.log(level.finishCriteria)
  
    function handleEditorDidMount(editor, monaco) {
      switch (level.completionType) {
        case "cursorPosition":
          editor.onDidChangeCursorPosition((e) => {
            if(e.position.lineNumber === level.finishCriteria.at(0) && e.position.column === level.finishCriteria.at(1)) {
              const finishTime = new Date() - currentTime
              alertSetMessage("Jsi na správné pozici, ");
              setAlertTime(timeToString(finishTime));
              setAlertPriority("finish");
              console.log(session.user.email + " " + level.levelId + " " + finishTime);
              setOpen(true);      
              const jsonForDb = "ahoj";
              handleSaveData(jsonForDb);  
            }
          })    
          break;
        case "textEdit":
          editor.onDidChangeModelContent((e) => {
            if(editor.getValue() === level.finishCritera) {
              const finishTime = new Date() - currentTime
              alertSetMessage("Úkol splněn, ");
              setAlertTime(timeToString(finishTime));
              setAlertPriority("finish")
              console.log(session.user.email + " " + level.levelId + " " + finishTime);
              if(session) {
                const jsonForDb = {"level": level.levelId, "time": finishTime, "user": session.user.email};
                handleSaveData(jsonForDb);
              }
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

const handleSaveData = async (inputData) => {
  console.log("šel bych ukládat")
};
