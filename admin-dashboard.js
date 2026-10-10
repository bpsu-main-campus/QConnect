/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */


/* =========================================================
   CHECK ADMIN LOGIN
   ========================================================= */

const loggedInAdmin =
    localStorage.getItem("loggedInAdmin");

if (loggedInAdmin !== "true") {

    alert(
        "Please log in as an administrator first."
    );

    window.location.href =
        "admin-login.html";
}


/* =========================================================
   GET ELEMENTS
   ========================================================= */

const registeredStudentsButton =
    document.getElementById(
        "registeredStudentsButton"
    );

const queuingStudentsButton =
    document.getElementById(
        "queuingStudentsButton"
    );

const adminWelcomeMessage =
    document.getElementById(
        "adminWelcomeMessage"
    );


/* =========================================================
   GET ADMIN NAME
   ========================================================= */

const adminName =
    localStorage.getItem(
        "loggedInAdminName"
    );


/* =========================================================
   DISPLAY ADMIN NAME
   ========================================================= */

if (
    adminWelcomeMessage &&
    adminName
) {

    adminWelcomeMessage.textContent =
        "Mr/Ms/Mrx. " +
        adminName +
        ", Please check the queuing students for this day.";
}


/* =========================================================
   REGISTERED STUDENTS
   ========================================================= */

if (registeredStudentsButton) {

    registeredStudentsButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "registered-students.html";
        }
    );
}


/* =====================================================
   QUEUING STUDENTS
===================================================== */

if (queuingStudentsButton) {

    queuingStudentsButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "queuing-students.html";

        }
    );

}