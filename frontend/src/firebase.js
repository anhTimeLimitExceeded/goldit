import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuGhkM4VbXS0nWCPEFQfuwAtbk1v8s2Jg",
  authDomain: "goldit-59cf2.firebaseapp.com",
  projectId: "goldit-59cf2",
  storageBucket: "goldit-59cf2.appspot.com",
  messagingSenderId: "58518634501",
  appId: "1:58518634501:web:042a959975b9d56ef91c6c",
  measurementId: "G-PH0QB9KEC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const signIn = async () => {
  await signInWithPopup(auth, googleProvider);
};
const signOut = async () => {
  await auth.signOut();
};
const getIdToken = async () => {
  return await auth.currentUser ? auth.currentUser.getIdToken() : "no token";
};

export default app;
export { auth, googleProvider, signIn, signOut, getIdToken };
