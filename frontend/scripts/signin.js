document.addEventListener("DOMContentLoaded", function() {
    const signInBtn = document.querySelector(".sign-in");
    const createAccountBtn = document.querySelector(".create-account");

    signInBtn.addEventListener("click", function() {
        const username = document.querySelector("input[type='text']").value;
        const password = document.querySelector("input[type='password']").value;
        
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }
        
        console.log("User signed in:", { username, password });
        alert("Sign In Successful!");
    });

    createAccountBtn.addEventListener("click", function() {
        window.location.href = "/frontend/create.html"; // Adjusted path
    });
});
