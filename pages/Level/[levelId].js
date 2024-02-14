import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import InfoWindow from '../../components/InfoWindow';
import { useRouter } from "next/router";
import LoginButton from '../../components/login-btn';
import { useSession } from "next-auth/react"
import {collection, onSnapshot, where, query, orderBy} from "@firebase/firestore"
import {db} from "../../firebase";
import levelsJson from "../../levels.json"
import tooltipsJson from "../../tooltips.json"

// const tooltipsData = JSON.parse(tooltipsJson);


const LevelPage = () => {

  const router = useRouter(); 
  const levelNumber = router.query.levelId;
  const [level, setLevel] = useState([''])
  const [dbStatus, setDbStatus] = useState([false])
  
  const {data: session } = useSession();
  
  // setLevel(levelsJson.levels.find((l) => parseInt(l.levelNumber, 10) == parseInt(levelNumber)));
  // const level = queryLevel[0]
  console.log(level)
  const [open, setOpen] = React.useState(false)
  const [alertMessage, alertSetMessage] = useState();
  const [alertPriority, setAlertPriority] = useState();
  const [alertTime, setAlertTime] = useState();

  useEffect(() => {
    const collectionRef = collection(db, "levels")
    const q = query(collectionRef, orderBy("levelNumber"));
    console.log(levelNumber)
    if(levelNumber !== undefined) {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id})))
        const leveldata = querySnapshot.docs.map(doc => ({ ...doc.data(), levelId: doc.id}))
        console.log(leveldata[levelNumber - 1]);
        setLevel(leveldata[levelNumber - 1])
        setDbStatus(true);
        return unsubscribe;
      });
    }
    setLevel('');
    return;
  }, [levelNumber])
  

  const currentTime = new Date();

  if (levelNumber === undefined || dbStatus === false || level === '') {
    return <>loading...</>;
  }

  if (!level.text) { return (<>Something went wrong...</>) }
  const text = level.text.replaceAll("\\n", '\n');
  
    function handleEditorDidMount(editor, monaco) {
      switch (level.completionType) {
        case "cursorPosition":
          editor.getModel().findMatches('#').forEach(match => {
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
          editor.onDidChangeCursorPosition((e) => {
            console.log(level.finishCriteria.at(0));
            if(e.position.lineNumber === parseInt(level.finishCriteria.at(0)) && e.position.column === parseInt(level.finishCriteria.at(1))) {
              const finishTime = new Date() - currentTime
              alertSetMessage("Jsi na správné pozici, ");
              setAlertTime(timeToString(finishTime));
              setAlertPriority("finish");
              setOpen(true);      
              if(session) {
                console.log(session.user.email + " " + level.levelId + " " + finishTime);
                const jsonForDb = "ahoj";
                handleSaveData(jsonForDb);  
              }
            }
          })    
          break;
        case "textEdit":
          const desiredText = level.finishCriteria.replaceAll("\\n", '\n');
          editor.getModel().findMatches('#').forEach(match => {
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
            console.log("textedit")
            console.log(desiredText);
            console.log(editor.getValue())
            if(editor.getValue() === desiredText) {
              console.log("wah");
              const finishTime = new Date() - currentTime
              alertSetMessage("Úkol splněn, ");
              setAlertTime(timeToString(finishTime));
              setAlertPriority("finish")

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
            console.log(editor.getValue() === level.finishCritera);
            console.log(editor.getValue())
            console.log(level.finishCritera)
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
        console.log(level.tooltips)
        level.tooltips.map(tooltip_number => {
          console.log(tooltip_number)
          const tooltipData = tooltipsJson.tips.find(tip => tip.tip_number == parseInt(tooltip_number));
          console.log(tooltipData);
          console.log(e.keyCode)
          console.log(tooltipData.trigger)
            if(tooltipData.trigger.includes(e.keyCode)) {
              	setOpen(true);
                alertSetMessage(tooltipData.message);
                setAlertPriority("info");
                e.preventDefault();
            }
        })
      })
      // editor.onKeyDown(async (e) => {
      //   if (e.keyCode === monaco.KeyCode.DownArrow || e.keyCode === monaco.KeyCode.UpArrow || e.keyCode === monaco.KeyCode.LeftArrow || e.keyCode === monaco.KeyCode.RightArrow) {
      //     setOpen(true);
      //     alertSetMessage("Místo šipek použij h, j, k, l");
      //     setAlertPriority("info");
      //     e.preventDefault();
      //   }
      // });
  
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
