/* =====================================================
   ADMIN LOGIN
   ===================================================== */

const adminLoginForm =
    document.getElementById("adminLoginForm");

const backButton =
    document.getElementById("backButton");


/* =====================================================
   ADMIN LOGIN
   ===================================================== */

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =========================
               GET USERNAME
            ========================= */

            const username =
                document
                    .getElementById("adminName")
                    .value
                    .trim();


            /* =========================
               GET BPSU EMAIL
            ========================= */

            const email =
                document
                    .getElementById("adminEmail")
                    .value
                    .trim();


            /* =========================
               GET PASSWORD
            ========================= */

            const password =
                document
                    .getElementById("adminPassword")
                    .value
                    .trim();


            /* =========================
               CHECK EMPTY FIELDS
            ========================= */

            if (
                username === "" ||
                email === "" ||
                password === ""
            ) {

                alert(
                    "Please complete all login fields."
                );

                return;
            }


            /* =================================================
               ADMIN LOGIN SUCCESS
            ================================================= */

            localStorage.setItem(
                "loggedInAdmin",
                "true"
            );

            localStorage.setItem(
                "loggedInAdminName",
                username
            );

            localStorage.setItem(
                "loggedInAdminEmail",
                email
            );


            /* =================================================
               GO TO ADMIN DASHBOARD
            ================================================= */

            window.location.href =
                "admin-dashboard.html";
        }
    );
}


/* =====================================================
   BACK BUTTON
   ===================================================== */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";
        }
    );
}