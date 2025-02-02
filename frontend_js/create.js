document.addEventListener("DOMContentLoaded", function() {
    const createAccountBtn = document.querySelector(".create-account");
    const signInBtn = document.querySelector(".sign-in");

    createAccountBtn.addEventListener("click", function() {
        const username = document.querySelector("input[type='text']").value;
        const email = document.querySelector("input[type='email']").value;
        const password = document.querySelector("input[type='password']").value;
        
        if (!username || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }
        
        console.log("Account Created:", { username, email, password });
        alert("Account Created Successfully!");
    });

    signInBtn.addEventListener("click", function() {
        window.location.href = "signin.html"; // Redirect to sign-in page
    });
});
