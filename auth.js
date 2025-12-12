// Switch Between Login & Signup
const loginCard = document.querySelectorAll(".auth-card")[0];
const signupCard = document.querySelectorAll(".auth-card")[1];

document.getElementById("toSignup").addEventListener("click", () => {
    loginCard.classList.remove("active");
    signupCard.classList.add("active");
});

document.getElementById("toLogin").addEventListener("click", () => {
    signupCard.classList.remove("active");
    loginCard.classList.add("active");
});


// STORE USERS IN LOCAL STORAGE
function saveUser(user) {
    localStorage.setItem("bookclub-user", JSON.stringify(user));
}

function getUser() {
    return JSON.parse(localStorage.getItem("bookclub-user"));
}


// SIGNUP
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signName").value.trim();
    const email = document.getElementById("signEmail").value.trim();
    const pass = document.getElementById("signPass").value.trim();
    const msg = document.getElementById("signupMsg");

    // If user already exists
    if (getUser()) {
        msg.textContent = "An account already exists. Please login.";
        msg.style.color = "red";
        return;
    }

    // Create user object
    const user = {
        name: name,
        email: email,
        password: pass
    };

    saveUser(user);

    msg.textContent = "Account created successfully! You can now login.";
    msg.style.color = "green";

    // Switch to login after 1s
    setTimeout(() => {
        signupCard.classList.remove("active");
        loginCard.classList.add("active");
    }, 1000);
});


// LOGIN
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    const msg = document.getElementById("loginMsg");

    const user = getUser();

    if (!user) {
        msg.textContent = "No account found. Please sign up first.";
        msg.style.color = "red";
        return;
    }

    if (email === user.email && pass === user.password) {
        msg.textContent = "Login successful! Redirecting...";
        msg.style.color = "green";

        // Redirect to homepage after 1s
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } else {
        msg.textContent = "Incorrect email or password.";
        msg.style.color = "red";
    }
});

// FOOTER YEAR
document.getElementById("yearAuth").textContent = new Date().getFullYear();
