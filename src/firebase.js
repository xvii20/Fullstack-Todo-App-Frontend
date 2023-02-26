// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";

import axios from 'axios';


// if you are using the authentication service from Firebase you need to import these 3 library and also  you need  GoogleAuthProvider allows you to use google authentication.  signInWithPopup allows a popup to appear when you click on sign in
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,FacebookAuthProvider, browserSessionPersistence, setPersistence, sendPasswordResetEmail } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY, 
   authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID, 
    storageBucket: process.env.REACT_APP_STORAGBUCKET,  
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID, 
    appId: process.env.REACT_APP_APPID 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// you can use this auth variable to get the user information who is currently authenticated
export const auth = getAuth(app)




// This function creates the sign in logic for Google Auth. We will attach this function to a button so when a user clicks this button, the google sign in popup will appear. Also once, you login, it should return a promise. you can console.log the result to see something called user credentials object, it shows info about the user
// setPersistence(auth,browserSessionPersistence)

export const signInWithGoogle = async () => {

     const provider = new GoogleAuthProvider()

   

  
    //if you console.log(auth) there will a huge object. a very important property will be in this object called currentUser. This property changes when a user logs in or out. when a user logs in it shows a big object with userinfo. if a user logs out it shows null. so we can use this to track to do conditional statement whether a user is logged in or not
   // when a user is already logged in, and she clicks on the login button again, she will be logged out. we do this so we can have one button for both login and logout
  
    if (auth.currentUser == true){
      let response = await signOut(auth)
    console.log(response)
} 

else{
    // this signs the user in


    // this lets the user choose which account to sign in
    provider.setCustomParameters({
      prompt: 'select_account'
    }); 


    
   // console.log(browserSessionPersistence)
    console.log(auth)
let result = await signInWithPopup(auth,provider)



let authobjforid = {email:auth.currentUser.email}
await axios.post("http://localhost:5000/signupwithaccount",authobjforid)

console.log(result)
console.log(auth)
// console.log(auth.currentUser.uid) this code gets the users uid  which u can put in database
// uid: "qn412HmjeKaUcXKeJ4nNbLSlvOf1"
let token = result.user.accessToken // get the access token information

/*
// get the user display name in my case its xi i
console.log(result.user.displayName)
console.log(result.user.email) // get users email
console.log(result.user.photoURL)  // get the users profile picture  */

// you can then store this 4 things in local Storage!!
/*
localStorage.setItem("keyname",result.user.displayName)
localStorage.setItem("keyemail",result.user.email)
localStorage.setItem("keyprofilepic",result.user.photoURL)
localStorage.setItem("accesstoken",token)
*/

 }



// window.location.reload() // refreshes the page so that way the pictures, name, and email will show on the page. because if the page did not refresh, the pictures, name and email wont show on the page until you refresh the page.
}

// at the very bottom of the firebase.js file add this code.

// Signing in with facebook function
export const Signinwithfacebooky = async () => {
    const facebookprov = new FacebookAuthProvider();
   
    if (!!auth.currentUser){
        signOut(auth)
    
}


else{





    // this signs the user in
let result = await signInWithPopup(auth,facebookprov)
let authobjforid = {email:auth.currentUser.email}
await axios.post("http://localhost:5000/signupwithaccount",authobjforid)

console.log(result)
console.log(auth)
let token = result.user.accessToken}

}

