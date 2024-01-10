import {useState, useEffect} from "react";
import {collection, onSnapshot, orderBy, query} from "@firebase/firestore"
import {db} from "../firebase";
import Link from 'next/link';


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
    console.log("levels:" + levels);

    
    return (
        <nav className="Tutorial-levels">
        {levels.map((level) => {return (
            <li key={level.levelId}>
                <Link href={`/Level/${level.levelNumber}`} >Lvl {level.levelNumber}</Link>
            </li>
        )
        })}
        </nav>
    ) 
};

export default LevelList;