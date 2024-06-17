function validateForm() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const experience = document.getElementById('experience').value;

    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regular expression for name validation (allow letters only, can be adjusted to include spaces and hyphens)
    const nameRegex = /^[A-Za-z]+$/;

    if (!firstName || !lastName || !email || !phoneNumber || !experience) {
        alert('Please fill out all required fields.');
        return false;
    } else if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    } else if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        alert('Names should contain letters only.');
        return false;
    }
    return true;
}

// Format phone number
document.getElementById('phoneNumber').addEventListener('input', function (e) {
    var value = e.target.value;
    e.target.value = value.replace(/\D/g, '').slice(0, 15); // Keep only digits and limit to 15
});

document.addEventListener('DOMContentLoaded', function () {
    // Preview uploaded image
    document.getElementById('fileUpload').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.getElementById('uploadedImage');
                img.src = e.target.result; // Set the source of the img element to the file content
                img.style.display = 'block'; // Make the image visible
                document.getElementById('uploadText').style.display = 'none'; // Hide the upload prompt text
                document.getElementById('removeImageButton').style.display = 'block'; // Show the remove image button
            };
            reader.onerror = function(e) {
                console.error('File reading failed: ', e);
                alert('Failed to read file.');
            };
            reader.readAsDataURL(file); // Start reading the file as DataURL
        }
    });

    // Remove uploaded image
    document.getElementById('removeImageButton').addEventListener('click', function () {
        const img = document.getElementById('uploadedImage');
        img.src = ''; // Remove the source of the img element
        img.style.display = 'none'; // Hide the image
        document.getElementById('removeImageButton').style.display = 'none'; // Hide the remove image button
        document.getElementById('fileUpload').value = ''; // Reset the file input
    });
});

// Submit form function
function submitForm() {
    if (validateForm()) {
        // Placeholder for form submission logic
        console.log('Form submitted');
        alert('Form submitted successfully!');
    }
}
