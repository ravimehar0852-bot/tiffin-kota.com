import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

let currentUser = null;

// Check Login
onAuthStateChanged(auth, (user) => {

    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    // Auto Fill
    if (document.getElementById("ownerName"))
        document.getElementById("ownerName").value = user.displayName || "";

    if (document.getElementById("email"))
        document.getElementById("email").value = user.email || "";

    if (document.getElementById("phone"))
        document.getElementById("phone").value = user.phoneNumber || "";

});

const form = document.getElementById("shopForm");

form.addEventListener("submit", createShop);

async function createShop(e) {

    e.preventDefault();

    if (!currentUser) {
        alert("Login required");
        return;
    }

    const shopName = document.getElementById("shopName").value.trim();
    const ownerName = document.getElementById("ownerName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const city = document.getElementById("city").value.trim();
    const address = document.getElementById("address").value.trim();
    const category = document.getElementById("category").value;
    const openTime = document.getElementById("openTime").value;
    const closeTime = document.getElementById("closeTime").value;
    const deliveryTime = document.getElementById("deliveryTime").value;
    const minimumOrder = document.getElementById("minimumOrder").value;

    if (
        !shopName ||
        !ownerName ||
        !phone ||
        !city ||
        !address
    ) {
        alert("Please fill all required fields.");
        return;
    }

    // Check if partner already has a shop
    const q = query(
        collection(db, "shops"),
        where("ownerId", "==", currentUser.uid)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        alert("You already created a shop.");
        window.location.href = "partner-dashboard.html";
        return;
    }

    try {

    await addDoc(collection(db, "shops"), {

        ownerId: currentUser.uid,

        shopName: shopName,

        ownerName: ownerName,

        phone: phone,

        email: email,

        city: city,

        address: address,

        category: category,

        openTime: openTime,

        closeTime: closeTime,

        deliveryTime: deliveryTime,

        minimumOrder: Number(minimumOrder),

        status: "active",

        createdAt: serverTimestamp()

    });

    alert("Shop Created Successfully 🎉");

    window.location.href = "partner-dashboard.html";

} catch (error) {

    console.error(error);

    alert("Failed to create shop.");

    }
