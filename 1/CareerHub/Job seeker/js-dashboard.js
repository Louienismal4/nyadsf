// Initialize Firebase
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
const jobListingsContainer = document.getElementById("jobListingsContainer");
const searchInput = document.querySelector('.search-bar input');

let allJobListings = []; // Store all fetched job listings

// Fetch job listings from Firestore
async function fetchJobListings() {
  try {
      console.log('Fetching job listings...');
      let query = db.collection("jobs").orderBy("timestamp", "desc");
      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
          console.log('No job listings found');
          jobListingsContainer.innerHTML = '<p>No job listings found</p>';
          return;
      }

      allJobListings = [];
      querySnapshot.forEach((doc) => {
          const jobData = doc.data();
          allJobListings.push(jobData);
      });

      filterAndDisplayJobListings();

  } catch (error) {
      console.error("Error fetching job listings:", error);
      jobListingsContainer.innerHTML = `<p>Error fetching job listings: ${error.message}</p>`;
  }
}

// Event listener for search input
searchInput.addEventListener('input', filterAndDisplayJobListings);

// Filtering and display logic
function filterAndDisplayJobListings() {
  const currentSearchQuery = searchInput.value.toLowerCase();
  jobListingsContainer.innerHTML = ''; // Clear existing listings

  console.log(`Filtering jobs with query: "${currentSearchQuery}"`);

  const filteredJobListings = allJobListings.filter(job => {
      const jobTitleLower = job.jobTitle ? job.jobTitle.toLowerCase() : '';
      const companyNameLower = job.companyName ? job.companyName.toLowerCase() : '';
      return jobTitleLower.includes(currentSearchQuery) || companyNameLower.includes(currentSearchQuery);
  });

  if (filteredJobListings.length === 0) {
      jobListingsContainer.innerHTML = '<p>No job listings found</p>';
      return;
  }

  filteredJobListings.forEach((jobData, index) => {
      const datePosted = jobData.timestamp.toDate();
      const formattedDate = getTimeAgo(datePosted);
      const uniqueId = `job${index}`;

      // Create and display job listing element
      const jobDiv = document.createElement("div");
      jobDiv.classList.add("job");
      jobDiv.innerHTML = `
          <div class="job-image">
              <img src="${jobData.imageUrl}" alt="Company Logo" class="job-image"/>
          </div>
          <div class="job-right">
              <h2 class="job-title">${jobData.jobTitle}</h2>
              <div class="job-details">
                  <button id="learnMoreButton_${uniqueId}" class="button">Learn More</button>
                  <p id="companyNameTextView_${uniqueId}"><span class="material-icons" id="icon_company_${uniqueId}">apartment</span>${jobData.companyName}</p>
                  <p id="jobLocationTextView_${uniqueId}"><span class="material-icons" id="icon_location_${uniqueId}">location_on</span>${jobData.location}</p>
                  <p id="workTypeTextView_${uniqueId}"><span class="material-icons" id="icon_worktype_${uniqueId}">access_time</span>${jobData.workType}</p>
                  <p id="workModeTextView_${uniqueId}"><span class="material-icons" id="icon_workmode_${uniqueId}">maps_home_work</span>${jobData.workMode}</p>
                  <p id="salaryDetailsTextView_${uniqueId}"><span class="material-icons" id="icon_salary_${uniqueId}">payments</span>${jobData.currency} ${jobData.maxSalary} monthly</p>
              </div>
              <p class="date-posted">${formattedDate}</p>
          </div>
      `;
      jobListingsContainer.appendChild(jobDiv);

      jobDiv.addEventListener('click', () => {
          sessionStorage.setItem('selectedJob', JSON.stringify(jobData));
          window.location.href = `job_post_details.html?jobId=${jobData.jobId}&employerId=${jobData.employerId}`;
      });

      // Set the size of the icons dynamically
      document.getElementById(`icon_company_${uniqueId}`).style.fontSize = '30px';
      document.getElementById(`icon_location_${uniqueId}`).style.fontSize = '30px';
      document.getElementById(`icon_worktype_${uniqueId}`).style.fontSize = '30px';
      document.getElementById(`icon_workmode_${uniqueId}`).style.fontSize = '30px';
      document.getElementById(`icon_salary_${uniqueId}`).style.fontSize = '30px';
  });
}

// Utility function to calculate time ago
function getTimeAgo(timestamp) {
  const now = new Date();
  const timeDifference = now - timestamp;
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

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
      const month = timestamp.getMonth() + 1;
      const year = timestamp.getFullYear();
      return `${month.toString().padStart(2, '0')}/${year}`;
  }
}

// Fetch and display job listings when the page loads
fetchJobListings();
