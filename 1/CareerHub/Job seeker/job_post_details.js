// Initialize Firebase (same as before)
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

const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    initUI();
});

function initUI() {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    const employerId = urlParams.get('employerId'); // Get employerId from URL
  
    if (jobId && employerId) { // Check for both jobId and employerId
      fetchJobDetails(jobId, employerId);
    } else {
      // Handle the case where jobId or employerId is null or empty
      alert("Job details not found. Please try again.");
      window.location.href = '/CareerHub/Job seeker/js-dashboard.html';
    }
}

function fetchJobDetails(jobId, employerId) {
    db.collection("jobs")
    .where("jobId", "==", jobId)
    .where("employerId", "==", employerId)
    .get() // Fetch the document where both jobId and employerId match
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) { // Check if the query returned any results
        const documentSnapshot = querySnapshot.docs[0]; 
        const jobData = documentSnapshot.data();
        console.log("Fetched job data:", jobData); 

            // Populate HTML elements (use the EXACT field names from your Firestore document)
            document.getElementById('jobTitleTextView').textContent = jobData.jobTitle;
            document.getElementById('jobPhotoImageView').src = jobData.imageUrl;
            document.getElementById('location').textContent = jobData.location; // Ensure this matches the field in Firestore
            document.getElementById('companyName').textContent = jobData.companyName;
            document.getElementById('workType').textContent = jobData.workType;
            document.getElementById('workMode').textContent = jobData.workMode;
            document.getElementById('salaryDetails').textContent = `${jobData.currency} ${jobData.minSalary} - ${jobData.currency} ${jobData.maxSalary} (${jobData.salaryType})`;
            document.getElementById('datePosted').textContent = getTimeAgo(jobData.timestamp.toDate());
            document.getElementById('emailWork').textContent = jobData.email || "Not provided";
            document.getElementById('phone').textContent = jobData.phoneNumber || "Not provided";
            document.getElementById('jobRequirements').textContent = jobData.jobRequirements;
            document.getElementById('jobDescription').textContent = jobData.jobDescription;
        } else {
            console.log("Job not found with jobId:", jobId); // Log when job is not found
            showError("Job not found");
        }
    })
    .catch(error => {
        console.error("Error fetching job details:", error);
        showError("Error fetching job details");
    });
}


document.getElementById(`bookmarkIcon`).style.fontSize = '40px';

function getTimeAgo(timestamp) {
    const now = new Date();
    const timeDifference = now - timestamp;

    // Define time intervals in milliseconds
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day; // Approximation
    const year = 365 * day; // Approximation

    if (timeDifference < minute) {
        return "Just now";
    } else if (timeDifference < hour) {
        const minutes = Math.round(timeDifference / minute);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifference < day) {
        const hours = Math.round(timeDifference / hour);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (timeDifference < week) {
        const days = Math.round(timeDifference / day);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (timeDifference < month) {
        const weeks = Math.round(timeDifference / week);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (timeDifference < year) {
        const months = Math.round(timeDifference / month);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        // For times over a year, display "MM/YYYY"
        const month = timestamp.getMonth() + 1; // JavaScript months are 0-based
        const year = timestamp.getFullYear();
        return `${month}/${year}`;
    }
}

function showError(message) {
    alert(message);
    window.location.href = '/CareerHub/Job seeker/js-dashboard.html';
}
