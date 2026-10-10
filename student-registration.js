/* =========================================================
   BPSU MAIN CAMPUS
   STUDENT REGISTRATION
   ========================================================= */


/* =========================================================
   COURSE → PROGRAM OPTIONS
   ========================================================= */

const programsByCourse = {

    "Bachelor of Science in Midwifery": [
        "Bachelor of Science in Midwifery"
    ],

    "Bachelor of Science in Nursing": [
        "Bachelor of Science in Nursing"
    ],

    "Bachelor of Science in Public Health": [
        "Population Health"
    ],

    "Bachelor of Science in Radiologic Technology": [
        "Bachelor of Science in Radiologic Technology"
    ],

    "Bachelor of Arts in Communication": [
        "Bachelor of Arts in Communication"
    ],

    "Bachelor of Science in Hospitality Management": [
        "Bachelor of Science in Hospitality Management"
    ],

    "Bachelor of Science in Tourism Management": [
        "Bachelor of Science in Tourism Management"
    ],

    "Bachelor of Science in Architecture": [
        "Bachelor of Science in Architecture"
    ],

    "Bachelor of Science in Civil Engineering": [
        "Bachelor of Science in Civil Engineering"
    ],

    "Bachelor of Science in Computer Engineering": [
        "Bachelor of Science in Computer Engineering"
    ],

    "Bachelor of Science in Electrical Engineering": [
        "Bachelor of Science in Electrical Engineering"
    ],

    "Bachelor of Science in Electronics Engineering": [
        "Bachelor of Science in Electronics Engineering"
    ],

    "Bachelor of Science in Industrial Engineering": [
        "Bachelor of Science in Industrial Engineering"
    ],

    "Bachelor of Science in Mechanical Engineering": [
        "Bachelor of Science in Mechanical Engineering"
    ],

    "Bachelor of Science in Computer Science": [
        "Bachelor of Science in Computer Science"
    ],

    "Bachelor of Science in Data Science": [
        "Bachelor of Science in Data Science"
    ],

    "Bachelor of Science in Entertainment and Multimedia Computing": [
        "Digital Animation Technology",
        "Game Development"
    ],

    "Bachelor of Science in Information Technology": [
        "Bachelor of Science in Information Technology"
    ],

    "Bachelor of Science in Industrial Technology": [
        "Apparel and Fashion Technology",
        "Architectural Drafting Technology",
        "Automotive Technology",
        "Culinary Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Food and Service Technology",
        "Heating, Ventilating and Air Conditioning Technology",
        "Mechanical Technology",
        "Welding and Fabrication Technology"
    ],

    "Bachelor of Technical-Vocational Teacher Education": [
        "Animation",
        "Civil and Construction Technology",
        "Drafting Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Food and Service Management",
        "Garments, Fashion and Design",
        "Heating, Ventilating and Air Conditioning Technology",
        "Hotel and Restaurant Services",
        "Mechanical Technology",
        "Welding and Fabrication Technology"
    ]
};


/* =========================================================
   GET ELEMENTS
   ========================================================= */

const course = document.getElementById("course");
const program = document.getElementById("program");
const registrationForm = document.getElementById("registrationForm");


/* =========================================================
   COURSE CHANGE
   ========================================================= */

if (course && program) {

    course.addEventListener("change", function () {

        const selectedCourse = course.value;

        program.innerHTML = "";

        const defaultOption = document.createElement("option");

        defaultOption.value = "";
        defaultOption.textContent = "Select Program";
        defaultOption.disabled = true;
        defaultOption.selected = true;

        program.appendChild(defaultOption);

        const programs = programsByCourse[selectedCourse] || [];

        programs.forEach(function (programName) {

            const option = document.createElement("option");

            option.value = programName;
            option.textContent = programName;

            program.appendChild(option);
        });

        program.disabled = false;
    });
}


/* =========================================================
   FORMAT PASSWORD
   Birthday:
   YYYY-MM-DD

   Password:
   MM-DD-YYYY
   ========================================================= */

function formatBirthdayForLogin(birthday) {

    if (!birthday) {
        return "";
    }

    const parts = birthday.split("-");

    if (parts.length !== 3) {
        return "";
    }

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return `${month}-${day}-${year}`;
}


/* =========================================================
   CALCULATE AGE
   ========================================================= */

function calculateAge(birthday) {

    const birthDate = new Date(birthday + "T00:00:00");
    const today = new Date();

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        age--;
    }

    return age;
}


/* =========================================================
   REGISTRATION
   ========================================================= */

if (registrationForm) {

    registrationForm.addEventListener("submit", function (event) {

        event.preventDefault();

        /* -----------------------------------------
           GET FORM VALUES
        ----------------------------------------- */

        const studentID =
            document.getElementById("studentID")
                .value
                .trim();

        const lastName =
            document.getElementById("lastName")
                .value
                .trim();

        const firstName =
            document.getElementById("firstName")
                .value
                .trim();

        const middleName =
            document.getElementById("middleName")
                .value
                .trim();

        const gender =
            document.getElementById("gender")
                .value;

        const birthday =
            document.getElementById("birthday")
                .value;

        const selectedCourse =
            course.value;

        const selectedProgram =
            program.value;


        /* -----------------------------------------
           VALIDATE REQUIRED FIELDS
        ----------------------------------------- */

        if (
            !studentID ||
            !lastName ||
            !firstName ||
            !gender ||
            !birthday ||
            !selectedCourse ||
            !selectedProgram
        ) {

            alert("Please complete all required information.");

            return;
        }


        /* -----------------------------------------
           VALIDATE STUDENT ID FORMAT
        ----------------------------------------- */

        const studentIDPattern = /^[0-9]{2}-[0-9]{5}$/;

        if (!studentIDPattern.test(studentID)) {

            alert(
                "Student ID must follow the format 00-00000."
            );

            return;
        }


        /* -----------------------------------------
           GET EXISTING STUDENTS
        ----------------------------------------- */

        let students = [];

        try {

            students =
                JSON.parse(
                    localStorage.getItem("registeredStudents")
                ) || [];

        } catch (error) {

            students = [];
        }


        /* -----------------------------------------
           CHECK DUPLICATE STUDENT ID
        ----------------------------------------- */

        const normalizedID =
            studentID.toLowerCase();

        const alreadyRegistered =
            students.some(function (student) {

                return String(student.studentID)
                    .trim()
                    .toLowerCase() === normalizedID;
            });


        if (alreadyRegistered) {

            alert(
                "This Student ID is already registered."
            );

            return;
        }


        /* -----------------------------------------
           CREATE FULL NAME
        ----------------------------------------- */

        let fullName =
            `${lastName}, ${firstName}`;

        if (middleName) {
            fullName += `, ${middleName}`;
        }


        /* -----------------------------------------
           CREATE PASSWORD
        ----------------------------------------- */

        const password =
            formatBirthdayForLogin(birthday);


        if (!password) {

            alert(
                "There was a problem processing the birthday."
            );

            return;
        }


        /* -----------------------------------------
           CREATE STUDENT OBJECT
        ----------------------------------------- */

        const newStudent = {

            studentID: studentID,

            name: fullName,

            gender: gender,

            birthday: birthday,

            age: calculateAge(birthday),

            campus: "Main Campus",

            course: selectedCourse,

            program: selectedProgram,

            password: password
        };


        /* -----------------------------------------
           SAVE STUDENT
        ----------------------------------------- */

        students.push(newStudent);

        localStorage.setItem(
            "registeredStudents",
            JSON.stringify(students)
        );


        /* -----------------------------------------
           REMOVE OLD LOGIN DATA
        ----------------------------------------- */

        localStorage.removeItem("loggedInStudent");
        localStorage.removeItem("loggedInStudentID");
        localStorage.removeItem("selectedStudentID");


        /* -----------------------------------------
           SUCCESS
        ----------------------------------------- */

        alert(
            "Registration successful!\n\n" +
            "You can now log in using:\n" +
            "Student ID: " + studentID + "\n" +
            "Password: " + password
        );


        /* -----------------------------------------
           GO TO LOGIN
        ----------------------------------------- */

        window.location.href =
            "student-login.html";
    });
}