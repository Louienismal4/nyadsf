// Firebase initialization and constants
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
  const storage = firebase.storage();
  
  const signupForm = document.querySelector('.signup-form');
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const profilePicInput = document.getElementById("profile-upload");
  const registerButton = document.getElementById("Registerbtn"); 
  let imageUri = null;
  
  // Function to show the progress dialog
  function showProgressDialog() {
    const progressDialog = document.getElementById("progressDialog");
    progressDialog.style.display = "block"; 
  }
  
  // Function to hide the progress dialog
  function hideProgressDialog() {
    const progressDialog = document.getElementById("progressDialog");
    progressDialog.style.display = "none";
  }

// Function to handle the profile picture selection
function chooseImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();
  
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      if (file) {
        imageUri = URL.createObjectURL(file);
        profilePicInput.files = fileInput.files; // Set the file in the original input
  
        // Update the image preview 
        const profileImageView = document.getElementById("profile-pic");
        profileImageView.src = imageUri;
      }
    };
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      showProgressDialog();
  
      const name = nameInput.value.trim()
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const phoneNumber = phoneNumberInput.value.trim();
  
      // Input validation
      if (!name || !email || !password || !phoneNumber || !profilePicInput.files[0]) {
          alert("Please fill in all fields"); 
          hideProgressDialog();
          return; 
      }
  
      try {
          // Create user with Firebase Authentication
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          const user = userCredential.user;
  
          // Upload profile picture if selected
          let profilePictureUrl = "";
          if (profilePicInput.files[0]) {
              const storageRef = storage.ref();
              const profilePicRef = storageRef.child(`profile_images/${user.uid}`);
              const snapshot = await profilePicRef.put(profilePicInput.files[0]);
              profilePictureUrl = await snapshot.ref.getDownloadURL();
          }
  
          // Store user data in Firestore
          const userData = {
              userId: user.uid,
              name,
              email,
              password,
              phoneNumber,
              userType: "jobseeker",
              profilePictureUrl: profilePictureUrl
          };
          await db.collection('user_profiles').doc(user.uid).set(userData);

          // After successful signup and data storage, sign in the user automatically
          await auth.signInWithEmailAndPassword(email, password); 
  
          hideProgressDialog();
  
          // Redirect to job seeker dashboard (change as needed)
          window.location.href = '/CareerHub/Job seeker/js-dashboard.html'; 
      } catch (error) {
          hideProgressDialog();
          console.error("Registration Error:", error);
  
          // Handle specific errors 
          if (error.code === 'auth/email-already-in-use') {
              displayErrorMessage(emailInput, "Email already in use.");
          } else if (error.code === 'auth/weak-password') {
              displayErrorMessage(passwordInput, "Password should be at least 6 characters");
          } else {
              alert("Registration failed. Please try again.");
          }
      }
  });
// Helper functions
function loadFile(event) {
    const image = document.getElementById('profile-pic');
    image.src = URL.createObjectURL(event.target.files[0]);
    image.onload = () => {
        URL.revokeObjectURL(image.src); 
        image.style.borderRadius = "50%"; 
        image.style.objectFit = "cover"; 
    };
}
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
}

function displayErrorMessage(inputElement, message) {
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
}
function validateInputs(inputElement, errorMessage) {
    if (!inputElement.value.trim()) { 
        displayErrorMessage(inputElement, errorMessage);
        return false;
    }
    return true;
}
