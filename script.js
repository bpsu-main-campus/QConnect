/* =========================================================
   MAIN MENU / LOGIN FLOW
   ========================================================= */

const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");
const headerLogin = document.getElementById("headerLogin");

const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const adminButton = document.getElementById("adminButton");
const studentButton = document.getElementById("studentButton");


/* =========================================================
   STUDENT REGISTRATION
   ========================================================= */

if (registerButton) {
    registerButton.addEventListener("click", function () {
        window.location.href = "student-registration.html";
    });
}


/* =========================================================
   OPEN LOGIN MODAL
   ========================================================= */

function openLoginModal() {
    if (loginModal) {
        loginModal.classList.add("active");
    }
}


/* =========================================================
   CLOSE LOGIN MODAL
   ========================================================= */

function closeLoginModal() {
    if (loginModal) {
        loginModal.classList.remove("active");
    }
}


/* =========================================================
   LOGIN BUTTONS
   ========================================================= */

if (loginButton) {
    loginButton.addEventListener("click", openLoginModal);
}

if (headerLogin) {
    headerLogin.addEventListener("click", openLoginModal);
}

if (closeModal) {
    closeModal.addEventListener("click", closeLoginModal);
}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

if (adminButton) {
    adminButton.addEventListener("click", function () {
        window.location.href = "admin-login.html";
    });
}


/* =========================================================
   STUDENT LOGIN
   ========================================================= */

if (studentButton) {
    studentButton.addEventListener("click", function () {
        window.location.href = "student-login.html";
    });
}


/* =========================================================
   CLOSE WHEN CLICKING OUTSIDE THE MODAL
   ========================================================= */

if (loginModal) {
    loginModal.addEventListener("click", function (event) {
        if (event.target === loginModal) {
            closeLoginModal();
        }
    });
}