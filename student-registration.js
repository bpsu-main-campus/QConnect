
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");
    const studentID = document.getElementById("studentID");
    const birthday = document.getElementById("birthday");
    const college = document.getElementById("college");
    const course = document.getElementById("course");
    const program = document.getElementById("program");

    /*
      Proposed college-to-course groupings.
      Confirm these assignments with your group or instructor.
    */
    const coursesByCollege = {
        CCST: [
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Data Science",
            "Bachelor of Science in Information Technology",
            "Bachelor of Science in Entertainment and Multimedia Computing"
        ],

        CEA: [
            "Bachelor of Science in Architecture",
            "Bachelor of Science in Civil Engineering",
            "Bachelor of Science in Computer Engineering",
            "Bachelor of Science in Electrical Engineering",
            "Bachelor of Science in Electronics Engineering",
            "Bachelor of Science in Industrial Engineering",
            "Bachelor of Science in Mechanical Engineering"
        ],

        CBA: [
            "Bachelor of Science in Hospitality Management",
            "Bachelor of Science in Tourism Management"
        ],

        COAS: [
            "Bachelor of Arts in Communication"
        ],

        CAHS: [
            "Bachelor of Science in Midwifery",
            "Bachelor of Science in Nursing",
            "Bachelor of Science in Public Health",
            "Bachelor of Science in Radiologic Technology"
        ],

        CTECH: [
            "Bachelor of Science in Industrial Technology",
            "Bachelor of Technical-Vocational Teacher Education"
        ]
    };

    /*
      Programs / majors for each course.
      Where no separate major is listed, the course name is used.
    */
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

        "Bachelor of Science in Information Technology": [
            "Bachelor of Science in Information Technology"
        ],

        "Bachelor of Science in Entertainment and Multimedia Computing": [
            "Game Development",
            "Digital Animation Technology"
        ],

        "Bachelor of Science in Industrial Technology": [
            "Apparel and Fashion Technology",
            "Architectural Drafting Technology",
            "Automotive Technology",
            "Culinary Technology",
            "Electrical Technology",
            "Electronics Technology",
            "Food and Service Technology",
            "HVAC Technology",
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
            "HVAC Technology",
            "Hotel and Restaurant Services",
            "Mechanical Technology",
            "Welding and Fabrication Technology"
        ]
    };

    // Populate a dropdown and reset its selected value.
    function populateDropdown(dropdown, placeholder, options) {
        dropdown.replaceChildren();

        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.textContent = placeholder;
        placeholderOption.disabled = true;
        placeholderOption.selected = true;

        dropdown.appendChild(placeholderOption);

        options.forEach(function (item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            dropdown.appendChild(option);
        });

        dropdown.disabled = options.length === 0;
    }

    // STEP 1: Select a college to unlock its courses.
    college.addEventListener("change", function () {
        const availableCourses = coursesByCollege[college.value] || [];

        populateDropdown(
            course,
            availableCourses.length ? "Select Course" : "No courses listed",
            availableCourses
        );

        // Reset the program whenever the college changes.
        populateDropdown(
            program,
            "Select Course First",
            []
        );
    });

    // STEP 2: Select a course to unlock its programs / majors.
    course.addEventListener("change", function () {
        const availablePrograms = programsByCourse[course.value] || [
            course.value
        ];

        populateDropdown(
            program,
            "Select Program / Major",
            availablePrograms
        );
    });

    // Set today's date as the latest allowed birthday.
    birthday.max = new Date().toLocaleDateString("en-CA");

    // Clear any previous custom ID error while typing.
    studentID.addEventListener("input", function () {
        studentID.setCustomValidity("");
    });

    // STEP 3: Validate and save the registration.
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const normalizedID = studentID.value.trim();

        if (!/^[0-9]{2}-[0-9]{5}$/.test(normalizedID)) {
            studentID.setCustomValidity(
                "Student ID must follow the format 00-00000."
            );
            studentID.reportValidity();
            return;
        }

        const birthDate = new Date(birthday.value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (
            Number.isNaN(birthDate.getTime()) ||
            birthDate > today
        ) {
            alert("Please enter a valid birthday that is not in the future.");
            return;
        }

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

        let registeredStudents = [];

        try {
            registeredStudents = JSON.parse(
                localStorage.getItem("registeredStudents") || "[]"
            );

            if (!Array.isArray(registeredStudents)) {
                registeredStudents = [];
            }
        } catch (error) {
            alert("Unable to read saved registrations. Please try again.");
            return;
        }

        // Prevent duplicate student IDs.
        const duplicate = registeredStudents.some(function (student) {
            return String(
                student.studentID || student.id || ""
            ).trim() === normalizedID;
        });

        if (duplicate) {
            alert("This Student ID is already registered.");
            return;
        }

        // Keep the birthday-based default password format.
        const month = String(birthDate.getMonth() + 1).padStart(2, "0");
        const day = String(birthDate.getDate()).padStart(2, "0");
        const year = birthDate.getFullYear();
        const defaultPassword = month + "-" + day + "-" + year;

        const student = {
            studentID: normalizedID,
            lastName: document.getElementById("lastName").value.trim(),
            firstName: document.getElementById("firstName").value.trim(),
            middleName: document.getElementById("middleName").value.trim(),
            gender: document.getElementById("gender").value,
            birthday: birthday.value,
            age: age,
            college: college.value,
            course: course.value,
            program: program.value,
            representative: document.getElementById("representative").value,
            campus: "Main Campus",
            defaultPassword: defaultPassword,
            registeredAt: new Date().toISOString()
        };

        registeredStudents.push(student);

        try {
            localStorage.setItem(
                "registeredStudents",
                JSON.stringify(registeredStudents)
            );
        } catch (error) {
            alert("Unable to save registration on this browser.");
            return;
        }

        alert("Student registered successfully!");
        window.location.href = "student-login.html";
    });
});
