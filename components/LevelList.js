import {useState, useEffect} from "react";
import {collection, onSnapshot, orderBy, query, where} from "@firebase/firestore"
import {db} from "../firebase";
import Link from 'next/link';
import { useSession } from "next-auth/react";



const LevelList = ( ) => {
    const {data: session } = useSession();

    const [levels, setLevels] = useState([])
    useEffect(() => {
        const collectionRef = collection(db, "levels")
        const q = query(collectionRef, orderBy("levelNumber"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setLevels(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id})))
        });
        return unsubscribe;
    }, [])

    const [completions, setCompletions] = useState([]);
    useEffect(() => {
        const completionsRef = collection(db, "completions")
        const q = query(completionsRef, where("user", "==", session ? session.user.email : ""));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setCompletions(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id})))
        });
        return unsubscribe;
    }, [session])
    // const tooltipData = tooltipsJson.tips.find(tip => tip.tip_number == parseInt(tooltip_number));

    return (
        <nav className="Tutorial-levels">
        {levels.map((level) => {return (
            <li key={level.id}>
                <Link href={`/Level/${level.levelNumber}` } className={(completions.find(completion => completion.level === level.id)) ? "completed" : "notCompleted"}>Lvl {level.levelNumber}</Link>
            </li>
        )
        })}
        </nav>
    ) 
};

export default LevelList;