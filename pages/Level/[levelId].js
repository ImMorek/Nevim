import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import InfoWindow from '../../components/InfoWindow';
import { useRouter } from "next/router";
import LoginButton from '../../components/login-btn';
import { useSession } from "next-auth/react"
import {collection, onSnapshot, query, orderBy, addDoc, where} from "@firebase/firestore"
import {db} from "../../firebase";
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
  const [open, setOpen] = useState(false)
  const [alertMessage, alertSetMessage] = useState();
  const [alertPriority, setAlertPriority] = useState();
  const [alertTime, setAlertTime] = useState();
  const [levelCompletions, setLevelCompletions] = useState();
  const [editorTheme, setEditorTheme] = useState(() => {
    const initialTheme = (typeof window !== 'undefined') ? localStorage.getItem("theme") : 'vs-dark';
    return initialTheme ? initialTheme : 'vs-dark';
  });
  const [lastLevel, setLastLevel] = useState();

  const newEditorTheme = (newTheme) => {
    setEditorTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }


  useEffect(() => {
    const collectionRef = collection(db, "levels")
    const q = query(collectionRef, orderBy("levelNumber"));
    if(levelNumber !== undefined) {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const leveldata = querySnapshot.docs.map(doc => ({ ...doc.data(), levelId: doc.id}))
        setLevel(leveldata[levelNumber - 1])
        setDbStatus(true);
        console.log(leveldata.length + " " + levelNumber)
        if( leveldata.length === levelNumber) {setLastLevel(true);}
        return unsubscribe;
      });
    }
    setLevel('');
    return;
  }, [levelNumber])

  useEffect(() => {
    const collectionRef = collection(db, "completions")
    const q = query(collectionRef, where("user", "==", session ? session.user.email : ""));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        var levelfinishes = querySnapshot.docs.map(doc => ({ ...doc.data()}));
        levelfinishes = levelfinishes.sort();
        setLevelCompletions(levelfinishes)
        return unsubscribe;
      });
  }, [session])
  

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
            if(e.position.lineNumber === parseInt(level.finishCriteria.at(0)) && e.position.column === parseInt(level.finishCriteria.at(1))) {
              const finishTime = new Date() - currentTime
              alertSetMessage("Jsi na správné pozici, ");
              setAlertTime(timeToString(finishTime));
              setAlertPriority("finish");
              setLastLevel(lastLevel)
              setOpen(true);      
              if(session) {
                handleSaveData({"level": level.levelId, "time": finishTime, "user": session.user.email});
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
            if(editor.getValue() === desiredText) {
              const finishTime = new Date() - currentTime
              alertSetMessage("Úkol splněn, ");
              setAlertTime(timeToString(finishTime));
              setAlertPriority("finish")

              if(session) {
                handleSaveData({"level": level.levelId, "time": finishTime, "user": session.user.email});
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
            const finishTime = new Date() - currentTime
            if(editor.getValue() === level.finishCritera) {
              alertSetMessage("Úkol splněn,");
              setAlertTime(timeToString(finishTime));
              setAlertPriority("finish")
              if(session) {
                handleSaveData({"level": level.levelId, "time": finishTime, "user": session.user.email});
              }
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
        // eslint-disable-next-line array-callback-return
        level.tooltips.map(tooltip_number => {
          const tooltipData = tooltipsJson.tips.find(tip => tip.tip_number === parseInt(tooltip_number));
            if(tooltipData.trigger.includes(e.keyCode)) {
              	setOpen(true);
                alertSetMessage(tooltipData.message);
                setAlertPriority("info");
                e.preventDefault();
            }
        })
      })
  
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
            theme={editorTheme}
          />
          <InfoWindow setOpen={setOpen} open={open} alertMessage={alertMessage} alertPriority={alertPriority} levelNumber={levelNumber} time={alertTime} lastLevel={lastLevel}/>
          <div className="utilities">
            <div className='level-name'>
              {level.levelName}
            </div>
            <code className="status-node"></code>
            <div className="user-info">
              <LoginButton/>
            </div>
            <div className='EditorStyles'>
              <button className="themeButton darkTheme" onClick={() => newEditorTheme('vs-dark')}></button>
              <button className="themeButton lightTheme" onClick={() => newEditorTheme('vs')}></button>
              <button className="themeButton blackTheme" onClick={() => newEditorTheme('hc-black')}></button>
            </div>
            {session ? 
          <div className="completions">
          {levelCompletions.map((completion => {return (
             completion.level === level.levelId  ?  <div className="levelCompletion"><div className="goldText">Completion time: </div>{timeToString(completion.time)}</div> : null
          )}))}
          </div> : ""  
          }
          </div>
        </div>
      );
  }


export default LevelPage;


const timeToString = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  var miliseconds = ((time % 60000) % 1000);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds +":" +  miliseconds;
}

const handleSaveData = async (inputData) => {
    const collectionRef = collection(db, "completions");
    // eslint-disable-next-line no-unused-vars
    const docRef = await addDoc(collectionRef, inputData)};
