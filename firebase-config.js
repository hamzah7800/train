import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN.firebaseapp.com",
  databaseURL: "https://YOUR_DOMAIN.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Expose to global scope
window.firebaseDB = db;
window.firebaseSet = set;
window.firebaseRef = ref;
window.firebaseOnValue = onValue;
