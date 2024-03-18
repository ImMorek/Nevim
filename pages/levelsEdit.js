import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {  collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';



const LevelsEdit = () => {
  const { data: session } = useSession()
  

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
    <div className="Home">
        <header className="Navbar">
            <div className='Tutorial-title'>Edit</div>
            <Link href={'/'}><div className='Back-button'>Back</div></Link>

        <ul className="Navbar-tutorial">
          <Layout/>
        </ul>
        </header>
      <div className='Title-items'>
        <div className='Title'>
        NEVIM
        </div>
        <div className='Version'>
        v11.0.2
        </div>
        <Link href={`/newLevel`} ><div className='Login-button newLevelButton'>New level</div></Link>
      </div>
    </div>
  );
}

export default LevelsEdit;
