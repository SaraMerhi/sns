const profileBtn = document.querySelector("#profileBtn");
const dashboardBtn = document.querySelector("#dashboardBtn");
const profileSection = document.querySelector("#profileSection");
const dashboardContent = document.querySelectorAll(".welcome-box, .create-section, .saved-section");
const profileForm = document.querySelector("#profileForm");
const profileUsername = document.querySelector("#profileUsername");
const profileEmail = document.querySelector("#profileEmail");
const profilePassword = document.querySelector("#profilePassword");

function showProfile(event) {
    if (event) event.preventDefault();

    // Hide dashboard content
    dashboardContent.forEach(section => section.classList.add("hidden"));
    // Show profile section
    profileSection.classList.remove("hidden");

    // Update active states in sidebar
    profileBtn.classList.add("active");
    dashboardBtn.classList.remove("active");

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDashboard(event) {
    if (event) event.preventDefault();

    // Show dashboard content
    dashboardContent.forEach(section => section.classList.remove("hidden"));
    // Hide profile section
    profileSection.classList.add("hidden");

    // Update active states in sidebar
    dashboardBtn.classList.add("active");
    profileBtn.classList.remove("active");

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

if (profileBtn) profileBtn.addEventListener("click", showProfile);
if (dashboardBtn) dashboardBtn.addEventListener("click", showDashboard);

if (profileForm) {
    profileForm.addEventListener("submit", function(event){
        event.preventDefault();

        const data = new FormData();
        data.append("username", profileUsername.value.trim());
        data.append("email", profileEmail.value.trim());
        data.append("password", profilePassword.value.trim());

        fetch("/update-profile", {
            method: "POST",
            body: data
        })
        .then(function(response){
            return response.json();
        })
        .then(function(result){
            showToast(result.message);

            if(result.success === true){
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('An error occurred while updating the profile.');
        });
    });
}
