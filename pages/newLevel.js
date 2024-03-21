import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useSession } from 'next-auth/react';
import tooltipsJson from "../tooltips.json"
import Link from 'next/link';

const NewLevel = () => {
    const { data: session } = useSession()
    
    const[level, setLevel] = useState({levelNumber: '', levelName: '', completionType: 'cursorPosition', finishCriteria: ['', ''], text: '', tooltips: [] });
    const onSubmit = async () => {
        const collectionRef = collection(db, "levels");
        // eslint-disable-next-line no-unused-vars
        const docRef = await addDoc(collectionRef, {...level})
        setLevel({levelNumber: '', levelName: '', completionType: '', finishCriteria: '', text: '' , tooltips: []}); 
    }

    useEffect(() => {
        const collectionRef = collection(db, "levels")
        const q = query(collectionRef);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const levelArray = querySnapshot.docs.map(doc => ({ ...doc.data(), levelId: doc.id}))
        setLevel({...level, levelNumber: levelArray.length + 1})
        });
        return unsubscribe;
    }, [])
    const [ 
        selectedValue, 
        setSelectedValue, 
    ] = useState("cursorPosition"); 
  
    const handleRadioChange = ( 
        value 
    ) => { 
        setSelectedValue(value); 
        setLevel({...level, completionType:value})
    }; 

    const [newTooltip, setNewTooltip] = useState([]);

    const handleCheckboxChange = (value) => {
        let newArray = [...newTooltip, value];
        if(newTooltip.includes(value)){
            newArray = newArray.filter(tip => tip !== value)
        }
        setNewTooltip(newArray)
        setLevel({...level, tooltips:newArray});
    }  

    const [user, setUser] = useState([]);
    useEffect(() => {
    const collectionRef = collection(db, "users")
    const q = query(collectionRef, session ?  where("userMail", "==", session.user.email) : "");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUser(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}))[0])
      });
      return unsubscribe;
    }, [session]);
  
      if (user.isAdmin === false) {
          return(       
          <>
              Nothing for you to see here
          </>);
      }
    return (
        <div className="newLevel">
            <div className="textInputContainer">
            <textarea className="textInput" value={level.text} onChange={e=>setLevel({...level, text:e.target.value})}></textarea>
            {selectedValue === "textEdit" ? <textarea className="textInput" onChange={e=>setLevel({...level, finishCriteria:e.target.value})}></textarea> : null}
            </div>
            <div className="newLevelPropertiesContainer">
                <div className="newLevelTitle">NEW LEVEL</div>
                <label>Level Title:</label>
                <input type="text" className="newTitle" value={level.levelName} onChange={e=>setLevel({...level,levelName:e.target.value})}/>
                <form>
                    <label>
                        <input type="radio" id="cursorPosition" value="cursorPosition" checked={selectedValue === "cursorPosition"} onChange={() => handleRadioChange("cursorPosition")}/>
                        Cursor Position
                        {selectedValue === "cursorPosition" ? <><input type="text" className="cursPosVal1" value={level.finishCriteria[0]} onChange={e=>setLevel({...level,finishCriteria:[e.target.value, level.finishCriteria[1]]})}/><input type="text" className="cursPosVal2" value={level.finishCriteria[1]} onChange={e=>setLevel({...level,finishCriteria:[level.finishCriteria[0], e.target.value]})}/></> : null}
                    </label>
                    <br/>
                    <label>
                        <input type="radio" id="textEdit" value="textEdit" checked={selectedValue === "textEdit"} onChange={() => handleRadioChange("textEdit")}/>
                        Text Edit
                    </label>
                    <div className="tips-options">
                {tooltipsJson.tips.map((tip) => {return(
                    <label>
                    <input type="checkbox" id={tip.tip_number} value={tip.tip_number} key={tip.tip_number} onChange={() => handleCheckboxChange(tip.tip_number)}/>{tip.tip_name}
                    </label>
                    )
                })}
                </div>
                </form>
                <Link href={`/levelsEdit`}><button className="submitBtn" onClick={onSubmit}>Potvrdit</button></Link>
            </div>
        </div>
    );
}
export default NewLevel;