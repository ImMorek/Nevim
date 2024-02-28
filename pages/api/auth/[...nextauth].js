import { collection, setDoc } from "firebase/firestore";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { db } from '../../../firebase';


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    // ...add more providers here
  ],
  // session: {strategy: "jwt"},
  // callbacks: {
  //   async signIn({isNewUser, email, token}) {
  //     // if (isNewUser) {
  //     //     const usersRef = collection(db, "users");
  //     //     setDoc(usersRef, {email: email});
  //     //     console.log("new user");
  //     // };
  //     console.log("signin");
  //   }
  // }
    
  
}
export default NextAuth(authOptions)