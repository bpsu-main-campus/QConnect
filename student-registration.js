```javascript
/* =========================================================
   BPSU QCONNECT — STUDENT REGISTRATION
   ========================================================= */

"use strict";

/* COURSE → PROGRAM / MAJOR OPTIONS */

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
        "Creative and Performing Arts",
        "New Media Track"
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
        "Game Development",
        "Digital Animation Technology"
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
   INITIALIZE AFTER HTML HAS LOADED
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registrationForm");
    const courseSelect = document.getElementById("course");
    const programSelect = document.getElementById("program");
    const representativeSelect =
        document.getElementById("representative");

    if (!form || !courseSelect || !programSelect) {
        console.error(
            "Registration form, course dropdown, or program dropdown is missing."
        );

        alert(
            "The registration page could not load correctly. " +
            "Please refresh the page or contact the website administrator."
        );

        return;
    }


    /* =====================================================
       UPDATE PROGRAM / MAJOR DROPDOWN
       ===================================================== */

    function updateProgramOptions() {
        const selectedCourse = courseSelect.value;
        const programs = programsByCourse[selectedCourse] || [];

        // Clear previous program options
        programSelect.replaceChildren();

        // Add placeholder
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = selectedCourse
            ? "Select Program / Major"
            : "Select Course First";
        placeholder.disabled = true;
        placeholder.selected = true;

        programSelect.appendChild(placeholder);

        // Add programs for the selected course
        programs.forEach(function (programName) {
            const option = document.createElement("option");

            option.value = programName;
            option.textContent = programName;

            programSelect.appendChild(option);
        });

        // Enable only if programs exist
        programSelect.disabled = programs.length === 0;

        console.log(
            "Selected course:",
            selectedCourse,
            "| Available programs:",
            programs
        );
    }

    courseSelect.addEventListener("change", updateProgramOptions);

    // Initialize dropdown based on current selection
    updateProgramOptions();


    /* =====================================================
       HELPER FUNCTIONS
       ===================================================== */

    function formatBirthdayForLogin(birthday) {
        if (!birthday) return "";

        const parts = birthday.split("-");

        if (parts.length !== 3) return "";

        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        return `${month}-${day}-${year}`;
    }

    function calculateAge(birthday) {
        const birthDate = new Date(birthday + "T00:00:00");
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDifference =
            today.getMonth() - birthDate.getMonth();

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

    function getRegisteredStudents() {
        try {
            const saved = localStorage.getItem("registeredStudents");

            if (!saved) return [];

            const parsed = JSON.parse(saved);

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Could not read registered students:", error);

            throw new Error(
                "Existing registration data could not be read. " +
                "No data was changed."
            );
        }
    }


    /* =====================================================
       HANDLE REGISTRATION
       ===================================================== */

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const studentID =
            document.getElementById("studentID").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const firstName =
            document.getElementById("firstName").value.trim();

        const middleName =
            document.getElementById("middleName").value.trim();

        const gender =
            document.getElementById("gender").value;

        const birthday =
            document.getElementById("birthday").value;

        const selectedCourse = courseSelect.value;
        const selectedProgram = programSelect.value;

        const representative = representativeSelect
            ? representativeSelect.value
            : "";

        /* Validate required fields */

        if (
            !studentID ||
            !lastName ||
            !firstName ||
            !gender ||
            !birthday ||
            !selectedCourse ||
            !selectedProgram ||
            !representative
        ) {
            alert(
                "Please complete all required fields, " +
                "including Program / Major."
            );
            return;
        }

        /* Validate student ID */

        if (!/^[0-9]{2}-[0-9]{5}$/.test(studentID)) {
            alert("Student ID must follow the format 00-00000.");
            return;
        }

        /* Validate birthday */

        const birthDate = new Date(birthday + "T00:00:00");

        if (
            Number.isNaN(birthDate.getTime()) ||
            birthDate.getTime() > Date.now()
        ) {
            alert("Please enter a valid birthday.");
            return;
        }

        /* Read saved registrations safely */

        let students;

        try {
            students = getRegisteredStudents();
        } catch (error) {
            alert(error.message);
            return;
        }

        /* Prevent duplicate student IDs */

        const normalizedID = studentID.toLowerCase();

        const alreadyRegistered = students.some(function (student) {
            return String(student.studentID || "")
                .trim()
                .toLowerCase() === normalizedID;
        });

        if (alreadyRegistered) {
            alert(
                "This Student ID is already registered. " +
                "Please log in instead."
            );
            return;
        }

        /* Build full name */

        let fullName = `${lastName}, ${firstName}`;

        if (middleName) {
            fullName += `, ${middleName}`;
        }

        /* Generate password using the existing format */

        const password = formatBirthdayForLogin(birthday);

        if (!password) {
            alert("Unable to process the birthday.");
            return;
        }

        /* Create student record */

        const newStudent = {
            studentID: studentID,
            name: fullName,
            gender: gender,
            birthday: birthday,
            age: calculateAge(birthday),
            campus: "Main Campus",
            course: selectedCourse,
            program: selectedProgram,
            representative: representative,
            password: password
        };

        /* Save before redirecting */

        students.push(newStudent);

        try {
            localStorage.setItem(
                "registeredStudents",
                JSON.stringify(students)
            );

            // Verify that the new record was saved
            const savedStudents = JSON.parse(
                localStorage.getItem("registeredStudents")
            );

            const wasSaved = Array.isArray(savedStudents) &&
                savedStudents.some(function (student) {
                    return String(student.studentID).trim() === studentID;
                });

            if (!wasSaved) {
                throw new Error("Registration could not be verified.");
            }

        } catch (error) {
            console.error("Registration save error:", error);

            alert(
                "Registration could not be saved. " +
                "Please try again. Your form has not been redirected."
            );

            return;
        }

        /* Success message */

        alert(
            "Registration successful!\n\n" +
            "Student ID: " + studentID + "\n" +
            "Password: " + password + "\n\n" +
            "You can now log in."
        );

        /* Redirect only after a successful save */

        window.location.href = "student-login.html";
    });

});
```
