import {useState, useEffect} from "react";
import {collection, onSnapshot, orderBy, query} from "@firebase/firestore"
import {db} from "../firebase";
import Link from 'next/link';
import { useSession } from "next-auth/react";



const LevelList = ( ) => {
    const [levels, setLevels] = useState([])
    const { data: session } = useSession()

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
                <Link href={`/Level/${level.levelNumber}`} >Lvl {level.levelNumber}</Link>{session ? ' x': ''}
            </li>
        )
        })}
        </nav>
    ) 
};

export default LevelList;