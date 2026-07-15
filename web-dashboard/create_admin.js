import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwvB6wvkMrox9p1dv_WhAJeAoNDN-vrT0",
  authDomain: 'elephant-392b0.firebaseapp.com',
  projectId: 'elephant-392b0',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  try {
    const cred = await createUserWithEmailAndPassword(auth, "admin@hec.local", "admin123");
    await setDoc(doc(db, "users", cred.user.uid), {
      name: "System Admin",
      role: "admin",
      phone: "admin",
      createdAt: new Date()
    });
    console.log("Admin created successfully!");
    process.exit(0);
  } catch(e) {
    console.error("Failed:", e.code, e.message);
    process.exit(1);
  }
}
createAdmin();
