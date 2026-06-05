const savedRooms = document.querySelector("#savedRooms");

const profileBtn = document.querySelector("#profileBtn");
const profileSection = document.querySelector("#profileSection");
const profileForm = document.querySelector("#profileForm");
const profileUsername = document.querySelector("#profileUsername");
const profileEmail = document.querySelector("#profileEmail");
const profilePassword = document.querySelector("#profilePassword");

profileBtn.addEventListener("click", function(event){
    event.preventDefault();
    profileSection.classList.toggle("hidden");
});

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
        alert(result.message);

        if(result.success === true){
            location.reload();
        }
    });
});