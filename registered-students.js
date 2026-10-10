/* =========================================
   REGISTERED STUDENTS
========================================= */

const studentList =
    document.getElementById("studentList");

const searchInput =
    document.getElementById("studentSearch");

const clearSearch =
    document.getElementById("clearSearch");

const upButton =
    document.getElementById("scrollUp");

const downButton =
    document.getElementById("scrollDown");


/* =========================================
   GET REGISTERED STUDENTS
========================================= */

function getStudents() {

    return JSON.parse(
        localStorage.getItem("registeredStudents")
    ) || [];

}


/* =========================================
   DISPLAY STUDENTS
========================================= */

function displayStudents(searchText = "") {

    const students = getStudents();

    studentList.innerHTML = "";


    const search =
        searchText
            .trim()
            .toLowerCase();


    const filteredStudents =
        students.filter(function(student) {

            return (
                String(student.studentID || "")
                    .toLowerCase()
                    .includes(search)
                ||
                String(student.name || "")
                    .toLowerCase()
                    .includes(search)
            );

        });


    /* =========================
       NO STUDENTS
    ========================== */

    if (filteredStudents.length === 0) {

        const emptyMessage =
            document.createElement("li");

        emptyMessage.className =
            "no-students";

        emptyMessage.textContent =
            "No registered students found.";

        studentList.appendChild(
            emptyMessage
        );

        return;

    }


    /* =========================
       CREATE STUDENT LIST
    ========================== */

    filteredStudents.forEach(
        function(student) {

            const listItem =
                document.createElement("li");


            /*
               Example:

               24-99909
               Dela Cruz, Juan, Pedro
            */

            listItem.textContent =
                student.studentID +
                " " +
                student.name;


            /* =========================
               CLICK STUDENT
            ========================== */

            
listItem.addEventListener(
    "click",
    function() {

        localStorage.setItem(
            "selectedStudentID",
            student.studentID
        );

        /* ADMIN IS VIEWING PROFILE */
        localStorage.setItem(
            "profileMode",
            "admin"
        );

        window.location.href =
            "student-profile.html";
    }
);


            studentList.appendChild(
                listItem
            );

        }
    );

}


/* =========================================
   SEARCH
========================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            displayStudents(
                searchInput.value
            );

        }
    );

}


/* =========================================
   CLEAR SEARCH
========================================= */

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        function() {

            searchInput.value = "";

            displayStudents();

        }
    );

}


/* =========================================
   UP BUTTON
========================================= */

if (upButton) {

    upButton.addEventListener(
        "click",
        function() {

            studentList.scrollBy({

                top: -100,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================
   DOWN BUTTON
========================================= */

if (downButton) {

    downButton.addEventListener(
        "click",
        function() {

            studentList.scrollBy({

                top: 100,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================
   INITIAL DISPLAY
========================================= */

displayStudents();