
/* =========================================================
   BPSU MAIN CAMPUS — STUDENT REGISTRATION
   ========================================================= */

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
   GET FORM ELEMENTS
   ========================================================= */

const course = document.getElementById("course");
const program = document.getElementById("program");
const registrationForm = document.getElementById("registrationForm");


/* =========================================================
   UPDATE PROGRAM DROPDOWN
   ========================================================= */

function updateProgramOptions() {
    if (!course || !program) return;

    const selectedCourse = course.value;
    const programs = programsByCourse[selectedCourse] || [];

    // Clear previous options
    program.innerHTML = "";

    // Add the placeholder
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = selectedCourse
        ? "Select Program / Major"
        : "Select Course First";
    placeholder.disabled = true;
    placeholder.selected = true;

    program.appendChild(placeholder);

    // Add programs belonging to the selected course
    programs.forEach(function (programName) {
        const option = document.createElement("option");
        option.value = programName;
        option.textContent = programName;
        program.appendChild(option);
    });

    // Enable only when options are available
    program.disabled = programs.length === 0;
}

if (course && program) {
    course.addEventListener("change", updateProgramOptions);

    // Set the correct state when the page loads
    updateProgramOptions();
}


/* =========================================================
   FORMAT BIRTHDAY AS PASSWORD
   Birthday input: YYYY-MM-DD
   Login password: MM-DD-YYYY
   ========================================================= */

function formatBirthdayForLogin(birthday) {
    if (!birthday) return "";

    const parts = birthday.split("-");

    if (parts.length !== 3) return "";

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


/* =========================================================
   STUDENT REGISTRATION
   ========================================================= */

if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
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

        const selectedCourse = course.value;
        const selectedProgram = program.value;

        // Validate required fields
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

        // Validate Student ID: 00-00000
        const studentIDPattern = /^[0-9]{2}-[0-9]{5}$/;

        if (!studentIDPattern.test(studentID)) {
            alert("Student ID must follow the format 00-00000.");
            return;
        }

        // Read existing registrations
        let students = [];

        try {
            students =
                JSON.parse(
                    localStorage.getItem("registeredStudents")
                ) || [];

            if (!Array.isArray(students)) {
                students = [];
            }
        } catch (error) {
            students = [];
        }

        // Prevent duplicate Student IDs
        const normalizedID = studentID.toLowerCase();

        const alreadyRegistered = students.some(function (student) {
            return String(student.studentID || "")
                .trim()
                .toLowerCase() === normalizedID;
        });

        if (alreadyRegistered) {
            alert("This Student ID is already registered.");
            return;
        }

        // Create the student's full name
        let fullName = `${lastName}, ${firstName}`;

        if (middleName) {
            fullName += `, ${middleName}`;
        }

        // Generate password from birthday
        const password = formatBirthdayForLogin(birthday);

        if (!password) {
            alert("There was a problem processing the birthday.");
            return;
        }

        // Create student record
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

        // Save registration
        students.push(newStudent);

        localStorage.setItem(
            "registeredStudents",
            JSON.stringify(students)
        );

        // Clear old student login selections
        localStorage.removeItem("loggedInStudent");
        localStorage.removeItem("loggedInStudentID");
        localStorage.removeItem("selectedStudentID");

        alert(
            "Registration successful!\n\n" +
            "You can now log in using:\n" +
            "Student ID: " + studentID + "\n" +
            "Password: " + password
        );

        // Redirect to student login
        window.location.href = "student-login.html";
    });
}
