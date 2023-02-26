import './App.css';
import { useState, useEffect,useRef } from 'react';
import axios from 'axios';

// my custom made function for signing in with google
import { signInWithGoogle } from './firebase';

import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged,signOut,FacebookAuthProvider, createUserWithEmailAndPassword,Signinwi, signInWithEmailAndPassword,sendPasswordResetEmail,sendEmailVerification} from "firebase/auth"
import { auth } from './firebase';

// my custom made function for signing in with facebook
import { Signinwithfacebooky } from './firebase';

import {BrowserRouter, Routes, Route, Link, Outlet, NavLink,useParams,useNavigate, Navigate  } from "react-router-dom";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrash, faPlus, faPenToSquare, faArrowLeft} from "@fortawesome/free-solid-svg-icons"

import Iconx from "./result"

function App() {
 
  let [googname,setgoogname] = useState("")
  let [googemail,setgoogemail] = useState("")
  let [googpic,setgoogpic] = useState("")


  console.log("frozen")

    // onAuthStateChanged takes in the auth parameter and then a function with some data as the parameter, u can name it anything u want other than data
    // also onAuthstatechanged basically sends data to firebase whenever the user logs in and logs out. once firebase knows this data, it can save login or logout state. AND THis data is persisting, so even if user refreshes page, they will stil be logged in, or out
    onAuthStateChanged(auth, (data) => {
    // console.log(data)  returns the users information as an object
    if (data){ //console.log("logged in!!!")

      // set facebook and google info depending on which account the user logged in
    setgoogname(data.displayName)  
    setgoogemail(data.email)
    setgoogpic(data.photoURL)

   
  }
  else { //console.log("logged out!!")
    // when a user logs out, we set the users email, name, and profile picture to empy string, because we dont want their names and profile pic displaying on the screen when they already logged out. ALSO THIS includes google and facebook i dont know why i only called it goog
  setgoogname("")
  setgoogemail("")
  setgoogpic("")
  
  }
    
    })
    


function Dashboardz(){
let [profilemodalappear,setprofilemodalappear] = useState(false)
let [newtodo,setnewtodo] = useState([])

let [todomodalstatus,settodomodalstatus] = useState(false)
let [todomodal,settodomodal] = useState("")
let [addtodo,setaddtodo] = useState("")
let [darkoverlay,setdarkoverlay] = useState(false)


let [desctodo,setdesctodo] = useState("")

// sets the get response into todos so we can load and map them onto the screen. because the response.rows data is an array of objects we need put usestate as an array of objects too
 let [todo,settodo] = useState([{}])
 let [todoid,settodoid] = useState([])
 let [editmodalappear,seteditmodalappear] = useState(false)


 let [editmodaldescription,seteditmodaldescription] = useState("")
 let [editmodalid,seteditmodalid] = useState("")
 let [editmodalprogress,seteditmodalprogress] = useState("")
 let [editmodaltitle,seteditmodaltitle] = useState("")
 let [edittododate,setedittododate] = useState("")

let inputrefprogress = useRef(null)
let inputreftitle = useRef(null)
let inputrefdate = useRef(null)

let [randomimg,setrandomimg] = ("")

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${day}.${month}.${year}`;

useEffect(function(){
// get all todos from database on pageload
async function gettodos () {
  let response = await axios.get(`http://localhost:5000/todos/${auth.currentUser.email}` /*`https://pern-stack-backend-complete-production.up.railway.app/todos/${auth.currentUser.email}`*/)
  // sort the response by id from ascending order
  let sortedresponse = response.data.sort(function(a,b){

    return parseFloat(a.id) - parseFloat(b.id);
  })
  console.log(sortedresponse)  //same as response.rows  for the backend
settodo(sortedresponse)  // set usestate on the response data rows so we can map the todos
  }
gettodos()

},[newtodo])




function descfunc (e){
  setdesctodo(e.target.value)

}




  function addTodoFunc(e){
    setaddtodo(e.target.value)
  }

  function Closetodomodal(e){
e.stopPropagation()
    settodomodalstatus(false)
    seteditmodalappear(false)
setdarkoverlay(false)

}

  function Modalsetter(e){

    e.preventDefault()
    settodomodalstatus(true)
    
    setdarkoverlay(true)


  
  }

function makemodalappear (e){
    e.stopPropagation()
    setdarkoverlay(true)
    setprofilemodalappear(function(prevstate){return !prevstate})
  }

// add Todo to database frontend post request 
async function Addtodospost(e){
    e.stopPropagation()
    setdarkoverlay(false)
    settodomodalstatus(false)

    try{

        let todoobject ={title:addtodo,tododate:currentDate,description:desctodo,progress:"Not Completed", email:auth.currentUser.email}
        let response = await axios.post( `http://localhost:5000/todos` /*`https://pern-stack-backend-complete-production.up.railway.app/todos`*/,todoobject)

// copy the todo added to database so we can immediately render it on the screen instead of having to refrsh the page.
        setnewtodo({...todoobject})
        setaddtodo("")
          }
    catch(error){console.log(error)}
  }

  return ( <div className="bodyofpage" onClick={function(){setprofilemodalappear(false)
  
    if(editmodalappear == true || todomodalstatus == true){
  setdarkoverlay(true)

}
else{setdarkoverlay(false)}
  
  
  
  }}> 


<div className="parentnavbar"> 
<div className="navbar" > 


<h1 className="greetings"> Hello {auth.currentUser.displayName || auth.currentUser.email}! </h1> 

{profilemodalappear? 
<div className="profilemodal"> 
<div className="innerprofilemodaldiv">

  <div className="youraccountdiv">
  <h1 className="youraccounttext"> Your Account</h1>
  </div>
  <hr className="horiz"></hr>

{/* if the user signs in with a regular account, it will show a photo of another img */}
<img src={auth.currentUser.photoURL? auth.currentUser.photoURL : "https://images.unsplash.com/photo-1480044965905-02098d419e96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"} alt="No img" className='modalprofilepic'  />
<div className="containprofileusername"> 
{/* if the displayname is too long cut it short and add ... at the end */}
<h2 className="modalprofileusername"> {auth.currentUser.displayName && auth.currentUser.displayName.length > 18? auth.currentUser.displayName.substring(0, auth.currentUser.displayName.length - (auth.currentUser.displayName.length - 15))+ "..." : auth.currentUser.displayName} </h2>
</div> 

<div className="containprofileemail"> 
<h2 className="modalprofileemail"> {auth.currentUser.email && auth.currentUser.email.length > 18? auth.currentUser.email.substring(0, auth.currentUser.email.length - (auth.currentUser.email.length - 15))+ "..." : auth.currentUser.email }</h2>
</div> 



</div>
<hr className="horiz"></hr>
<div className="signoutbuttondiv"> 
<button onClick={function(){signOut(auth)}} className="signoutbutton"> Sign Out</button>
</div>
<hr className="horiz"></hr>

<div className="containdeleteall"> 
<div className="deletealltodosdiv">


<button className="deletealltodos" onClick={async function(){
 let response = await axios.delete(`http://localhost:5000/todos/users/${auth.currentUser.email}` /* `https://pern-stack-backend-complete-production.up.railway.app/todos/users/${auth.currentUser.email}` */)
 setnewtodo(response)
}}> Delete All Todos  </button>


</div>

</div>

</div>
: ""}


<img src={auth.currentUser.photoURL? auth.currentUser.photoURL : "https://images.unsplash.com/photo-1480044965905-02098d419e96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"}  alt="No img" className="profilepic" onClick={makemodalappear}/>
<div className={darkoverlay? "darkoverlay" : "removedarkoverlay"}> </div>




</div>
</div>
{/* scroll all the way down button
<button className="scrollupbutton" onClick={function(){window.scrollTo(0,0)}}> scroll up </button> */}

{todomodalstatus? 
<div className="todomodal"> 
    <div className="todomodalheader"> 
    <div className="tododescriptiondiv">
    <h1 className="headertext"> Add A Description </h1>
    </div>
     <div onClick={Closetodomodal} className="xclose"> X </div>

     </div>
     <hr></hr>
     <div className="centerdescriptiondiv"> 
     <textarea className="description"
// This will cap the <textarea> character limit to 40 characters.
maxLength={40}
   onChange={descfunc}
   placeholder="Add a Description to Your Todo"

/>
</div>

    <hr></hr>

    <div className="modalbuttondiv">
    <button className="add2" onClick={Addtodospost}> Add </button>
    </div>

    </div> :  ""}

<div className="headerdiv"> 
<h1 className="nameofapp"> Your Personal Todo List </h1>
</div>

<div className="middlediv"> 

<form onSubmit={Modalsetter}>
<div>
<input  className="addnewtodoinputfield"
type="text"
maxLength={30}
placeholder="Add New Todo"
onChange={addTodoFunc}
required
value={addtodo}
/>
<button onSubmit={Modalsetter} className="addnewtodobutton"> <FontAwesomeIcon icon={faPlus} className="fa-plus"/> </button>
</div>
</form>

</div>


{editmodalappear?     

<div className="edittodomodalvisible"> 

  <div className="todomodalheader"> 
  <div className="tododescriptiondiv">
  <h1 className="headertext"> Edit Todo </h1>
  </div>
   <div onClick={function(e){seteditmodalappear(false)
   e.stopPropagation()
  setdarkoverlay(false)

}

  } className="xclose"> X </div>

   </div>

<div className="containtitleanddate"> 

<div className="containtitle"> 
<label className="edittodotitleheader" onClick={function focustitle() {inputreftitle.current.focus()}}> Title </label>
 <input className = "edittitle"
type="text"
ref={inputreftitle}
value={editmodaltitle}
maxLength={30}
//  sets the new value of editmodaltitle to whatever u typed in the input text box 
onChange={function changetitle(e){seteditmodaltitle(e.target.value)}}
/>
</div>


<div className="datecontain"> 
<label className="editdateheader" onClick={function focusdate(){inputrefdate.current.focus()}}> Date</label>
<input className="editdate"
type="text"
ref={inputrefdate}
value={edittododate}
maxLength = {24}
onChange={function changedate(e){setedittododate(e.target.value)}}
/>
</div>
</div>

   <hr></hr>

   <div className="centertheeditdescription"> 
   <textarea className="description"

maxLength={40}
onChange={function changedescription(e){seteditmodaldescription(e.target.value)}}
 value={editmodaldescription}
 placeholder="Add a Description to Your Todo"

/>
</div>


<div className="containprogress"> 
<label htmlFor="editmodalprogressinput" onClick={function focusprogress(){inputrefprogress.current.focus()}}></label>
<select value={editmodalprogress} className="selects"  onChange={function(e){seteditmodalprogress(e.target.value)
console.log(editmodalprogress)}}> 
<option > Not Completed</option>
<option> Completed</option>


</select>
</div>

  <hr className="horizontal"></hr>

  <div className="modalbuttondiv">

<button className="cancelbutton" onClick={function(e){
    e.stopPropagation()
    seteditmodalappear(false)
    setdarkoverlay(false);
    }}> Cancel</button>

<button className="add" onClick={async function editthecorrecttodo(e){
    let edittodoobject ={id:editmodalid, title:editmodaltitle,tododate:edittododate,description:editmodaldescription,progress: editmodalprogress}
    let response = await axios.put(`http://localhost:5000/todos/${editmodalid}` /*`https://pern-stack-backend-complete-production.up.railway.app/todos/${editmodalid}`*/, edittodoobject)

// allows rerendering of the page without hard reloading the page.
    setnewtodo(response)
    setdarkoverlay(false)
    seteditmodalappear(false)
  }}> Change </button>

</div>

</div>  :""  }  



{/* {todo == false?  ""  : ""}   */}
{  todo.length == 0? ""  : todo.map(function (element,i){

return (<div key={i} className="parentoftododiv"> 
<div  className="tododiv"> 
<div className="headeroftododiv">

<h1 className="tododate"> {element.tododate} </h1>


</div>
<h1 className="todotitle"> {element.title}</h1>

<p className="tododescription"> {element.description} </p>

<div className="centerprogress"> 
<h2 className={element.progress == "Not Completed"? "todoprogress" : "todoprogresscomplete"}> Progress: {element.progress}</h2>
</div>

<div className="todobuttondiv"> 
<button className="deletebutton" onClick={async function deletetodo(){
let response = await axios.delete(`https://pern-stack-backend-complete-production.up.railway.app/todos/${element.id}`)
console.log(response)
setnewtodo(response)
}}> <FontAwesomeIcon icon={faTrash} className="fa-trash"/> </button>

<button className="editbutton" onClick={
  // because the button is in the map method from the function, it has access to the element.id and we can use it to refer to a specific todo and send that as a req.params to the backend
 function editthetodo(e){seteditmodalappear(true)
    e.stopPropagation()
    seteditmodaldescription(element.description)  
    seteditmodalid(element.id)
    seteditmodaltitle(element.title)
    setedittododate(element.tododate)
    seteditmodalprogress(element.progress)
    setdarkoverlay(true)


}}> 
<FontAwesomeIcon icon={faPenToSquare} className="fa-pen-to-square" /></button>
</div>
</div>
</div>)

}

)

} 

<>
{todomodal}
</>

</div>
)}


  return (

<BrowserRouter>

<Routes>

<Route path="/" element={auth.currentUser? <Dashboardz /> : <Navigate to="/login" /> } />

{/* This code says if auth.CurrentUser is true  show the dashboard component. If it is false, Navigate to the Login page */}
<Route path="dashboard" element={auth.currentUser? <Dashboardz /> : <Navigate to="/login" /> } />

<Route path="register" element={< RegisterPage />} />

{/* This code says if auth.CurrentUser is true Navigate to the Dashboard. Else show the LoginPage Component.  I put all my google and facebook auth logic in the LoginPage Component*/}
<Route path="login" element={ auth.currentUser? <Navigate to="/dashboard" />  : <LoginPage />} />

</Routes>
</BrowserRouter>
  
  );
}

// splitted path

function LoginPage(){
  let gotoregisterpage = useNavigate()
  
  let [resetpasswordpressed,setresetpasswordpressed] = useState(false)

  // sign up with email and password
  let [email, setemail] = useState("")
  let [password, setpassword] = useState("")

  let [emailtosendpassword,setemailtosendpassword] = useState("")

  // show the login modal
  let [loginwrapperappear,setloginwrapperappear] = useState(true)

  // show the reset password email field
  let [resetemailfieldappear,setresetemailappear] = useState(false)

  //shows the go back link
  let [gobackappear,setgobackappear] = useState(false)

  // Login with email and password
  let [loginemail,setloginemail] = useState("")
  let [loginpassword,setloginpassword] = useState("")

  //seterror message if there is one
  let [errormessagedisplay,seterrormessagedisplay] = useState("")

 

const normallogin = async (event) => {
  event.preventDefault()
  if (!!auth.currentUser){
    signOut(auth)

}
else{

  try{
    // Code to login with regular email and password
    const loginuser = await signInWithEmailAndPassword(auth,loginemail,loginpassword)
    console.log(loginuser)  //basically its the same user object as the google and facebook one
    }
    catch (error){console.log(error.message)
    seterrormessagedisplay(error.message)}

}}

// password reset 
async function resetpasswordfunc(){try{

auth.useDeviceLanguage()


 let response = await sendPasswordResetEmail(auth,emailtosendpassword)

setresetpasswordpressed(true)
 
setTimeout(() => {
  setresetpasswordpressed(false)

},10000)

}
catch (error){console.log(error)}


  }
  

function handleemailresetfield (e){setemailtosendpassword(e.target.value)}



function loginemailfunc(e){setloginemail(e.target.value) 

}
function loginpasswordfunc(e){setloginpassword(e.target.value)
}
  


  return (
  <>
<div className="loginpagediv">



{loginwrapperappear? 
  <div className="loginpagewrapper">


  <div className="loginworddiv"> <h1 className="loginword"> Login </h1></div>
  {/* regular email and password login */}

  
  <form onSubmit={normallogin}>
  <div className="containlogininputemail">
  <input className="logininputemail"
  type="email"
  placeholder="Email"
  onChange={loginemailfunc}
  required
  
  />
  </div>

  <div className="containlogininputpassword">
  <input className="logininputpassword"
  type="password"
  placeholder="Password"
  onChange={loginpasswordfunc}
  required
  
  />
  </div>

  {errormessagedisplay?
  <div className="erroruserdiv">
  <p className="erroruser"> {errormessagedisplay}</p>
  </div>
  
  : ""}

  <div className="containloginbutton"> 
  <button className="loginbutton"> Login </button>
  </div>
  
  
  </form>
<div className="containor">
<span className="orspan"> or </span>
</div>
  {/* What this code does is if the user is signed out, the button will display the text Sign in With Google. Otherwise it will display Sign Out */}

  <div className="containgooglebutton">
<button className="googlebutton" onClick={signInWithGoogle}>  <Iconx />  Sign in with Google  </button>
 {/* <img src={require("./btn_google_signin_dark_pressed_web.png")} className="googlebuttonreal" onClick={signInWithGoogle}/> */}
  </div>

  
  <div className="containfacebookbutton">
  <button onClick={Signinwithfacebooky} className={"facebookbutton"}>  <img src={require('./flogo2.png')} className="flogo2"/>  Login with Facebook </button> 
  </div>

  <div className="forgotpassworddiv"> 
  <span className="forgotpassword" onClick={function(){setloginwrapperappear(false)
  setgobackappear(true)}}> Forgot Password?</span>
  </div>

  <div className="registertextdiv"> 
    <p className="registertext"> Dont Have an Account?  <span className="signuptext" onClick={function(){gotoregisterpage("/register")}}> Sign Up </span> </p>
    </div> 

  </div> : 


  <div className='emailresetdiv'> 
<div className="inneremailresetdiv">

{gobackappear? 
<div className="gobackdiv"> 
 <FontAwesomeIcon icon={faArrowLeft} className="goback" onClick={function(){setloginwrapperappear(true)
  setgobackappear(false)}}/>
</div>
: ""}


<div className="resetpasswordheaderdiv"> 
  <h1 className="resetpasswordheader"> Reset Password </h1>
  </div>  


  <div className="resettipdiv"> 
<p className="resettip"> Please type the email of the account u want to reset password.</p>
</div> 


<div className="containemailresetinputandbuttondiv"> 
  <input className="emailresetinput"
  type="email"
  required
placeholder='Email'
onChange={handleemailresetfield}
  />
  <button onClick={resetpasswordfunc
} className="resetpasswordbutton"> Send</button>
  </div>

  </div> 
  </div>}
   
{resetpasswordpressed?  <div className="passwordsentdiv"> <h1 className="passwordsent"> You have received an Email, Please check your Email</h1> </div>  : 

""}
  </div> 



  </>
  )

}

function RegisterPage(){
  let [email, setemail] = useState("")
  let [password, setpassword] = useState("")

  let gotologinpage = useNavigate()
  let todashboard = useNavigate()

  let [errormessage,seterrormessage] = useState("")

    // this function allows the user to create an account and log in automatically. createduserinformation will store the user information of the created account. btw we need to pass in our useState in the createuserwithemailandpassword parenthesis. 
const register = async (event) => {
  
  event.preventDefault()
try{
const createduserinformation = await createUserWithEmailAndPassword(auth,email,password)
console.log(createduserinformation)  //basically its the same user object as the google and facebook one
let objectword = {email:email,password:password}
let response = await axios.post("http://localhost:5000/signupwithaccount" /*"https://pern-stack-backend-complete-production.up.railway.app/signupwithaccount" */ ,objectword)


// await sendEmailVerification(auth.currentUser)

// when the user successfully registers an account, it will redirect the user to the /dashboard  endpoint
todashboard("/dashboard")

}
catch (error){console.log(error.message)
seterrormessage(error.message)}
}

  function handlechange(e){

    setemail(e.target.value)
  
    }
    
    function handlepassword(e){
      setpassword(e.target.value)
  
    }



  return (
<div className="registrationpagediv">

 <div className="registrationpagewrapper"> 
<div className="createanaccountdiv">
  <div className="gobackdiv2"> 
<FontAwesomeIcon icon={faArrowLeft} className="goback2" onClick={function(){gotologinpage("/login")}}/>
</div>
 <h1 className="createanaccount"> Create an Account </h1>
 </div>


  <form onSubmit={register}>

<div> 
  <div className="createanaccountemaillabel">Email</div>
  <input className="createanaccountemailinput"
  type="text"
  maxLength={30}
  placeholder="email"
  onChange={handlechange}
  required
  />
</div>
  

<div>
  <div className="createanaccountpasswordlabel">Password</div>
  <input className="createanaccountpasswordinput"
  type="password"
  placeholder="password"
  onChange={handlepassword}
  required
  />
  </div>

<div className="registererrormessagediv">
<p className="registererrormessage"> {errormessage.substring(10)} </p>
</div>

<div className="registersubmitbuttondiv">
  <button className="registersubmitbutton"> Register</button>
  </div>

  </form>

  </div>

  </div>



  )


  
}


export default App;
