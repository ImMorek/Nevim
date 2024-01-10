import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const NewLevel = () => {

    
    const[level, setLevel] = useState({levelNumber: '', levelName: '', completionType: 'cursorPosition', finishCriteria: [1, 3], text: '' });
    const onSubmit = async () => {
        const collectionRef = collection(db, "levels");
        const docRef = await addDoc(collectionRef, {...level})
        alert('přidáno')
        setLevel({levelNumber: '', levelName: '', completionType: 'cursorPosition', finishCriteria: [1, 3], text: '' }); 
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
    return (
        <div className="newLevel">
            <div className="textInputContainer">
            <textarea className="textInput" value={level.text} onChange={e=>setLevel({...level, text:e.target.value})}></textarea>
            </div>
            <div className="newLevelPropertiesContainer">
                <div className="newLevelTitle">NEW LEVEL</div>
                <label>Level Title:</label>
                <input type="text" className="newTitle" value={level.levelName} onChange={e=>setLevel({...level,levelName:e.target.value})}/>

                <button className="submitBtn" onClick={onSubmit}>Submit</button>
            </div>
        </div>
    );
}
export default NewLevel;