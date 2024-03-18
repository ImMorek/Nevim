import {useState, useEffect} from "react";
import {collection, onSnapshot, orderBy, query, deleteDoc, doc} from "@firebase/firestore"
import {db} from "../firebase";
import Link from 'next/link';


const deleteLevel = async (level) => {
    const delLevelId = level.id
    if(window.confirm("Opravdu chcete smazat " + level.levelNumber + "?")){
        await deleteDoc(doc(db, "levels", delLevelId))
    }
}

const LevelList = ( ) => {
    const [levels, setLevels] = useState([])

    useEffect(() => {
        const collectionRef = collection(db, "levels")
        const q = query(collectionRef, orderBy("levelNumber"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setLevels(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id})))
        });
        return unsubscribe;
    }, [])
    
    return (
        <nav className="Tutorial-levels-edit">
        {levels.map((level) => {return (
            <li key={level.id} className="Tutorial-list">
                <Link href={`/Level/${level.levelNumber}`} className="completed" >Lvl {level.levelNumber}</Link><button className="deleteButton" onClick={() => deleteLevel(level)}>Delete</button>
            </li>
        )
        })}
        </nav>
    ) 
};

export default LevelList;