import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, limit } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDWhvTOiGN7EOF30DT4rlFyQTrkbhm1RA8",
  authDomain: "streamverse-3c157.firebaseapp.com",
  projectId: "streamverse-3c157",
  storageBucket: "streamverse-3c157.firebasestorage.app",
  messagingSenderId: "243613319235",
  appId: "1:243613319235:web:8b2314280dda6dfdbdd4f6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
    try {   
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
        toast.success("Account created successfully! 🎉");
        return { success: true, user };
    } catch (error) {
        console.log(error);
        let errorMessage = error.code.split('/')[1].split('-').join(' ');
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email is already registered.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "Password should be at least 6 characters.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Invalid email address.";
        }
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
    }
};

const login = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back! 🎬");
        return { success: true, user: result.user };
    } catch (error) {
        console.log(error);
        let errorMessage = error.code.split('/')[1].split('-').join(' ');
        if (error.code === 'auth/user-not-found') {
            errorMessage = "No account found with this email.";
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = "Incorrect password.";
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = "Invalid email or password.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Invalid email address.";
        }
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
    }
}

const logout = () => {
    signOut(auth);
    toast.success("Logged out successfully!");
}

const addToMyList = async (userId, item) => {
  try {
    const existing = await isInMyList(userId, item.id);
    if (existing) {
      toast.info("Already in My List!");
      return;
    }
    await addDoc(collection(db, "mylist"), {
      userId,
      itemId: item.id,
      title: item.title || item.name,
      poster: item.poster_path,
      type: item.media_type || item.type || 'movie',
      rating: item.vote_average,
      addedAt: new Date()
    });
    toast.success("Added to My List! ❤️");
  } catch (error) {
    console.error(error);
    toast.error("Failed to add to list");
  }
};

const removeFromMyList = async (userId, itemId) => {
  try {
    const q = query(collection(db, "mylist"), where("userId", "==", userId), where("itemId", "==", itemId));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (document) => {
      await deleteDoc(doc(db, "mylist", document.id));
    });
    toast.success("Removed from My List!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to remove from list");
  }
};

const getMyList = async (userId) => {
  try {
    const q = query(collection(db, "mylist"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

const isInMyList = async (userId, itemId) => {
  try {
    const q = query(collection(db, "mylist"), where("userId", "==", userId), where("itemId", "==", itemId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    return false;
  }
};
// Add these to your existing firebase.js:
export const addToContinueWatching = async (uid, movie) => {
  try {
    const q = query(collection(db, "continueWatching"), 
      where("uid", "==", uid), 
      where("movieId", "==", movie.id)
    );
    const existing = await getDocs(q);
    if (!existing.empty) return; // already exists
    await addDoc(collection(db, "continueWatching"), {
      uid,
      movieId: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      type: movie.type || 'movie',
      timestamp: Date.now(),
      progress: Math.floor(Math.random() * 80) + 10 // fake progress 10-90%
    });
  } catch(e) { console.error(e); }
}

export const getContinueWatching = async (uid) => {
  try {
    const q = query(
      collection(db, "continueWatching"),
      where("uid", "==", uid),
      limit(10)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch(e) { return []; }
}

export const removeFromContinueWatching = async (docId) => {
  try {
    await deleteDoc(doc(db, "continueWatching", docId));
  } catch(e) { console.error(e); }
}

export { auth, db, signup, login, logout, addToMyList, removeFromMyList, getMyList, isInMyList };