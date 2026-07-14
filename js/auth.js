import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

let role = "customer";

// Role Change
window.switchTab = function(type){

    role = type;

    document.getElementById("tabCustomer").classList.toggle("active", type==="customer");
    document.getElementById("tabPartner").classList.toggle("active", type==="partner");

    const text=document.getElementById("accountText");
    const btn=document.getElementById("createAccountBtn");

    if(type==="customer"){
        text.innerHTML="New to TiffinKota?";
        btn.innerHTML="Create Account";
    }else{
        text.innerHTML="Want to sell food?";
        btn.innerHTML="Become a Partner";
    }

}

// Google Login

const provider=new GoogleAuthProvider();

document
.getElementById("googleLoginBtn")
.addEventListener("click",googleLogin);

async function googleLogin(){

try{

const result=await signInWithPopup(auth,provider);

const user=result.user;

const ref=doc(db,"users",user.uid);

const snap=await getDoc(ref);

if(!snap.exists()){

await setDoc(ref,{
uid:user.uid,
name:user.displayName,
email:user.email,
phone:user.phoneNumber || "",
photo:user.photoURL,
role:role,
createdAt:Date.now()
});

}

const data=(await getDoc(ref)).data();

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ...

if (data.role === "partner") {

    const q = query(
        collection(db, "shops"),
        where("ownerId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        // Shop nahi bani hai
        window.location.href = "create-shop.html";

    } else {

        // Shop pehle se bani hui hai
        window.location.href = "partner-dashboard.html";

    }

} else {

    window.location.href = "customer-dashboard.html";

}

}

}catch(err){

alert(err.message);

}

}
