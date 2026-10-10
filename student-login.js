/* =========================================================
   STUDENT LOGIN
   ========================================================= */

const studentLoginForm =
    document.getElementById("studentLoginForm");

const backButton =
    document.getElementById("backButton");


/* =========================================================
   LOGIN
   ========================================================= */

if (studentLoginForm) {

    studentLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* -----------------------------------------
               GET LOGIN INFORMATION
            ----------------------------------------- */

            const studentID =
                document
                    .getElementById("studentID")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("studentPassword")
                    .value
                    .trim();


            /* -----------------------------------------
               VALIDATE EMPTY FIELDS
            ----------------------------------------- */

            if (!studentID || !password) {

                alert(
                    "Please enter your Student ID and password."
                );

                return;
            }


            /* -----------------------------------------
               GET REGISTERED STUDENTS
            ----------------------------------------- */

            let students = [];

            try {

                students =
                    JSON.parse(
                        localStorage.getItem(
                            "registeredStudents"
                        )
                    ) || [];

            } catch (error) {

                alert(
                    "Unable to read registered student data."
                );

                return;
            }


            /* -----------------------------------------
               FIND STUDENT
            ----------------------------------------- */

            const normalizedID =
                studentID.toLowerCase();

            const student =
                students.find(function (item) {

                    return String(item.studentID)
                        .trim()
                        .toLowerCase() === normalizedID;
                });


            /* -----------------------------------------
               STUDENT NOT FOUND
            ----------------------------------------- */

            if (!student) {

                alert(
                    "Student ID is not registered."
                );

                return;
            }


            /* -----------------------------------------
               GET STORED PASSWORD
            ----------------------------------------- */

            let correctPassword =
                String(student.password || "").trim();


            /* -----------------------------------------
               BACKWARD COMPATIBILITY
               If an old student record does not have
               a password, create it from birthday.
            ----------------------------------------- */

            if (!correctPassword && student.birthday) {

                const parts =
                    student.birthday.split("-");

                if (parts.length === 3) {

                    correctPassword =
                        `${parts[1]}-${parts[2]}-${parts[0]}`;
                }
            }


            /* -----------------------------------------
               CHECK PASSWORD
            ----------------------------------------- */

            if (password !== correctPassword) {

                alert(
                    "Incorrect Student ID or password."
                );

                return;
            }


            /* =================================================
               LOGIN SUCCESS
               ================================================= */


            /* -----------------------------------------
               SAVE LOGGED-IN STUDENT
            ----------------------------------------- */

            localStorage.setItem(
                "loggedInStudentID",
                student.studentID
            );

            localStorage.setItem(
                "loggedInStudent",
                JSON.stringify(student)
            );

            
localStorage.setItem(
    "profileMode",
    "student"
);
            /* -----------------------------------------
               IMPORTANT:
               PROFILE ALSO USES selectedStudentID
            ----------------------------------------- */

            localStorage.setItem(
                "selectedStudentID",
                student.studentID
            );


            /* -----------------------------------------
               GO TO PROFILE
            ----------------------------------------- */

            window.location.href =
                "student-profile.html";
        }
    );
}


/* =========================================================
   BACK BUTTON
   ========================================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";
        }
    );
}