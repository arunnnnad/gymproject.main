// Firebase configuration
const firebaseConfig = {
  // Your Firebase configuration will go here
  // This should be replaced with actual Firebase credentials when deploying
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required for persistence
      console.log('Persistence not supported by current browser');
    }
  });

// Authentication state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log('User is signed in:', user.uid);
    
    // Set user data in session storage
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL || 'https://via.placeholder.com/100',
      isAdmin: false // Default value, will be updated from database
    };
    
    // Check if user is admin
    db.collection('users').doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          const dbUser = doc.data();
          userData.isAdmin = dbUser.role === 'admin';
          userData.userType = dbUser.userType || 'user';
          userData.displayName = dbUser.name || userData.displayName;
          
          sessionStorage.setItem('user', JSON.stringify(userData));
          
          // Redirect based on role if on login/register page
          const currentPath = window.location.pathname;
          if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
            if (userData.isAdmin) {
              window.location.href = '../pages/admin-dashboard.html';
            } else if (userData.userType === 'member') {
              window.location.href = '../pages/member-dashboard.html';
            } else {
              window.location.href = '../pages/user-dashboard.html';
            }
          }
        } else {
          // No user document, create one
          db.collection('users').doc(user.uid).set({
            email: user.email,
            name: user.displayName || 'User',
            role: 'user',
            userType: 'user',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            sessionStorage.setItem('user', JSON.stringify(userData));
            if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
              window.location.href = '../pages/user-dashboard.html';
            }
          })
          .catch((error) => {
            console.error('Error creating user document:', error);
          });
        }
      })
      .catch((error) => {
        console.error('Error getting user document:', error);
        sessionStorage.setItem('user', JSON.stringify(userData));
      });
  } else {
    // User is signed out
    console.log('User is signed out');
    sessionStorage.removeItem('user');
    
    // Redirect to login if on a dashboard page
    const currentPath = window.location.pathname;
    if (currentPath.includes('-dashboard.html')) {
      window.location.href = '../pages/login.html';
    }
  }
});

// Sign out function
function signOut() {
  auth.signOut()
    .then(() => {
      // Sign-out successful
      console.log('User signed out successfully');
      sessionStorage.removeItem('user');
      window.location.href = '../index.html';
    })
    .catch((error) => {
      // An error happened
      console.error('Error signing out:', error);
    });
}

// Google sign-in function
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
}