"use client";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
export default function LoginButton() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()} className="signing">Sign out</button>
        <Link href={`/levelsEdit`} >Level edit page</Link>
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