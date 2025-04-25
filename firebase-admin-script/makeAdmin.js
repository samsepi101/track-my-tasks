// makeAdmin.js
import { config } from "dotenv";
import { initializeApp, credential } from "firebase-admin";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Load environment variables
config();

// Initialize Firebase Admin SDK
const serviceAccount = {
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle line breaks in private key
};

initializeApp({
    credential: credential.cert(serviceAccount),
});

// Firestore reference
const db = getFirestore();

// Function to make a user an admin
const makeAdmin = async () => {
    const uid = "YOUR_UID_HERE"; // Replace with your UID
    try {
        await setDoc(doc(db, "users", uid), { role: "admin" });
        console.log("Admin assigned successfully");
    } catch (error) {
        console.error("Error assigning admin role:", error);
    }
};

makeAdmin();
