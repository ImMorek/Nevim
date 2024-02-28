"use client";
import { addDoc, collection, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../firebase";
export default function LoginButton() {
  const { data: session } = useSession()
  
  const [user, setUser] = useState([]);
  useEffect(() => {
  const collectionRef = collection(db, "users")
  const q = query(collectionRef, session ?  where("userMail", "==", session.user.email) : "");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    setUser(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}))[0])
      console.log(user);
    });
    if(user === undefined) {
        const collectionRef = collection(db, "users");
        const docRef = addDoc(collectionRef,{userMail: session.user.email, isAdmin: false})
  }
    return unsubscribe;
  }, [session]);
  

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()} className="signing">Sign out</button><br/>
        {user !== undefined ? user.isAdmin ? <Link href={`/levelsEdit`} className="levelEditLink" >Level edit page</Link>: null : null}
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()} className="signing">Sign in</button>
    </>
  )
  }