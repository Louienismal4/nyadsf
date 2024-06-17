// Initialize Firebase (Replace with your actual config)
firebase.initializeApp({
  apiKey: "AIzaSyADw9Aulfkk890OS-jthydlu_4Jb8p4QyA",
  authDomain: "careerhub-ef19c.firebaseapp.com",
  databaseURL: "https://careerhub-ef19c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "careerhub-ef19c",
  storageBucket: "careerhub-ef19c.appspot.com",
  messagingSenderId: "912561357985",
  appId: "1:912561357985:web:e4dbea13d474bc74f29ce0",
  measurementId: "G-QWP9RQ25KE"
});

const auth = firebase.auth();
const db = firebase.firestore();

// Function to handle the login process
async function handleLogin() {
  const emailInput = document.querySelector('.form input[type="email"]');
  const passwordInput = document.querySelector('.form input[type="password"]');

  // Check if all fields are filled
  if (!emailInput.value || !passwordInput.value) {
      alert("Please fill in all fields.");
      return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
      // Attempt to sign in the user with Firebase Authentication
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore to determine their type
      const userDoc = await db.collection('user_profiles').doc(user.uid).get();
      
      if (!userDoc.exists) {
          alert("User not found.");
      }

      const userData = userDoc.data();

      // Check if the user is a job seeker or an employer
      if (userData.userType === 'jobseeker') {
          localStorage.setItem('loggedInUserId', user.uid);
          alert("Welcome to CareerHub");
          window.location.href = '/CareerHub/Job seeker/js-dashboard.html';
      } else if (userData.userType === 'employer') {
          localStorage.setItem('loggedInUserId', user.uid);
          window.location.href = '/CareerHub/Employer/sign in employer.html';
      } else {
        alert("Invalid user type.");
      }
  } catch (error) {
      // Handle login errors
      console.error("Login Error:", error.message);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          alert("Incorrect email or password.");
      } else {
          alert("An error occurred during login."); 
      }
  }
}

// Add event listener to the login button
document
  .querySelector('.form-btn')
  .addEventListener('click', handleLogin);

// Check if the user is already logged in when the page loads
const loggedInUserId = localStorage.getItem('loggedInUserId');
if (loggedInUserId) {
  // Fetch user data and redirect based on user type
}
