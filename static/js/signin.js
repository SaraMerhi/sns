const form = document.querySelector("#signinForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#errorMessage");

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}

form.addEventListener("submit", function(event){
    event.preventDefault();
    clearError();

    const data = new FormData();
    data.append("email", emailInput.value.trim());
    data.append("password", passwordInput.value.trim());

    fetch("/signin", {
        method: "POST",
        body: data
    })
    .then(function(response){
        return response.json();
    })
    .then(function(result){
        if(result.success === true){
            if(result.role === "Admin"){
                window.location.href = "/admin-dashboard";
            }
            else if(result.role === "User"){
                window.location.href = "/user-dashboard";
            }
        }
        else{
            showError(result.message || "Sign in failed");
        }
    })
    .catch(function(error){
        showError("An error occurred: " + error);
    });
});