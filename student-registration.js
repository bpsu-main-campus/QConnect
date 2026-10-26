```javascript
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");
    const studentID = document.getElementById("studentID");
    const birthday = document.getElementById("birthday");
    const college = document.getElementById("college");
    const course = document.getElementById("course");
    const program = document.getElementById("program");

    /*
      PROPOSED COLLEGE AND COURSE GROUPINGS.
      Verify these against your instructor's official list.
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

        Other: [
            "Bachelor of Science in Midwifery",
            "Bachelor of Science in Nursing",
            "Bachelor of Science in Public Health",
            "Bachelor of Science in Radiologic Technology",
            "Bachelor of Arts in Communication",
            "Bachelor of Science in Hospitality Management",
            "Bachelor of Science in Tourism Management",
            "Bachelor of Science in Industrial Technology",
            "Bachelor of Technical-Vocational Teacher Education"
        ]
    };

    /*
      PROGRAM / MAJOR OPTIONS.
      Courses with no separate major use their course name.
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

    function fillDropdown(dropdown, placeholder, options) {
        dropdown.replaceChildren();

        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.textContent = placeholder;
        firstOption.disabled = true;
        firstOption.selected = true;
        dropdown.appendChild(firstOption);

        options.forEach(function (item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            dropdown.appendChild(option);
        });

        dropdown.disabled = options.length === 0;
    }

    // Update courses after the college is selected.
    college.addEventListener("change", function () {
        const availableCourses = coursesByCollege[college.value] || [];

        fillDropdown(course, "Select Course", availableCourses);
        fillDropdown(program, "Select Course First", []);
    });

    // Update programs after the course is selected.
    course.addEventListener("change", function () {
        const availablePrograms = programsByCourse[course.value] || [
            course.value
        ];

        fillDropdown(program, "Select Program / Major", availablePrograms);
    });

    // Student ID must follow the format 00-00000.
    studentID.addEventListener("input", function () {
        studentID.setCustomValidity("");
    });

    // Prevent birthdays in the future.
    birthday.max = new Date().toISOString().split("T")[0];

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const idPattern = /^[0-9]{2}-[0-9]{5}$/;

        if (!idPattern.test(studentID.value.trim())) {
            studentID.setCustomValidity(
                "Please use the Student ID format 00-00000."
            );
            studentID.reportValidity();
            return;
        }

        const birthDate = new Date(birthday.value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (birthDate > today) {
            alert("Birthday cannot be in the future.");
            return;
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        const registeredStudents = JSON.parse(
            localStorage.getItem("registeredStudents") || "[]"
        );

        const normalizedID = studentID.value.trim();

        const duplicateStudent = registeredStudents.some(function (student) {
            return String(student.studentID || student.id || "").trim() === normalizedID;
        });

        if (duplicateStudent) {
            alert("This Student ID is already registered.");
            return;
        }

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
            registeredAt: new Date().toISOString()
        };

        registeredStudents.push(student);

        localStorage.setItem(
            "registeredStudents",
            JSON.stringify(registeredStudents)
        );

        // Keep the selected student's credentials available to the
        // existing login page if it uses these localStorage fields.
        // The birthday password format is MM-DD-YYYY.
        const month = String(birthDate.getMonth() + 1).padStart(2, "0");
        const day = String(birthDate.getDate()).padStart(2, "0");
        const year = birthDate.getFullYear();

        student.defaultPassword = month + "-" + day + "-" + year;

        // Update the stored record with the default password.
        localStorage.setItem(
            "registeredStudents",
            JSON.stringify(registeredStudents)
        );

        alert("Student registered successfully!");
        window.location.href = "student-login.html";
    });
});
```
