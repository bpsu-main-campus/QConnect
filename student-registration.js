
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");
    const studentID = document.getElementById("studentID");
    const birthday = document.getElementById("birthday");
    const college = document.getElementById("college");
    const course = document.getElementById("course");
    const program = document.getElementById("program");

    /*
      Course codes are displayed separately from majors.
      Confirm the official course/major combinations with your group.
    */
    const coursesByCollege = {
        CCST: [
            "BSCS",
            "BSDS",
            "BSIT",
            "BSEMC"
        ],
        CEA: [
            "BS Architecture",
            "BS Civil Engineering",
            "BS Computer Engineering",
            "BS Electrical Engineering",
            "BS Electronics Engineering",
            "BS Industrial Engineering",
            "BS Mechanical Engineering"
        ],
        CBA: [
            "BS Hospitality Management",
            "BS Tourism Management"
        ],
        COAS: [
            "BA Communication"
        ],
        CAHS: [
            "BS Midwifery",
            "BS Nursing",
            "BS Public Health",
            "BS Radiologic Technology"
        ],
        CTECH: [
            "BS Industrial Technology",
            "Bachelor of Technical-Vocational Teacher Education"
        ]
    };

    /*
      Major choices are separate from course names.
      DAT is included as requested by your friend.
    */
    const majorsByCourse = {
        "BSCS": ["No separate major"],
        "BSDS": ["No separate major"],
        "BSIT": ["DAT - Digital Animation Technology"],
        "BSEMC": [
            "Game Development",
            "Digital Animation Technology"
        ],
        "BS Architecture": ["No separate major"],
        "BS Civil Engineering": ["No separate major"],
        "BS Computer Engineering": ["No separate major"],
        "BS Electrical Engineering": ["No separate major"],
        "BS Electronics Engineering": ["No separate major"],
        "BS Industrial Engineering": ["No separate major"],
        "BS Mechanical Engineering": ["No separate major"],
        "BS Hospitality Management": ["No separate major"],
        "BS Tourism Management": ["No separate major"],
        "BA Communication": [
            "Creative and Performing Arts",
            "New Media Track"
        ],
        "BS Midwifery": ["No separate major"],
        "BS Nursing": ["No separate major"],
        "BS Public Health": ["Population Health"],
        "BS Radiologic Technology": ["No separate major"],
        "BS Industrial Technology": [
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

    function fillDropdown(select, placeholder, options) {
        select.replaceChildren();

        const first = document.createElement("option");
        first.value = "";
        first.textContent = placeholder;
        first.disabled = true;
        first.selected = true;
        select.appendChild(first);

        options.forEach(function (value) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });

        select.disabled = options.length === 0;
    }

    college.addEventListener("change", function () {
        fillDropdown(
            course,
            "Select Course",
            coursesByCollege[college.value] || []
        );

        fillDropdown(program, "Select Major", []);
    });

    course.addEventListener("change", function () {
        fillDropdown(
            program,
            "Select Major",
            majorsByCourse[course.value] || ["No separate major"]
        );
    });

    // Prevent selecting a future birthday.
    const today = new Date();
    birthday.max = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    studentID.addEventListener("input", function () {
        studentID.setCustomValidity("");
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const normalizedID = studentID.value.trim();

        if (!/^[0-9]{2}-[0-9]{5}$/.test(normalizedID)) {
            studentID.setCustomValidity(
                "Student ID must follow the format 00-00000."
            );
            studentID.reportValidity();
            return;
        }

        const birthDate = new Date(birthday.value + "T00:00:00");
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (Number.isNaN(birthDate.getTime()) || birthDate > currentDate) {
            alert("Please enter a valid birthday that is not in the future.");
            return;
        }

        let age = currentDate.getFullYear() - birthDate.getFullYear();

        if (
            currentDate.getMonth() < birthDate.getMonth() ||
            (
                currentDate.getMonth() === birthDate.getMonth() &&
                currentDate.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }

        let students;

        try {
            students = JSON.parse(
                localStorage.getItem("registeredStudents") || "[]"
            );

            if (!Array.isArray(students)) students = [];
        } catch (error) {
            alert("Could not read saved registrations. Please try again.");
            return;
        }

        const duplicate = students.some(function (student) {
            return String(student.studentID || student.id || "").trim()
                === normalizedID;
        });

        if (duplicate) {
            alert("This Student ID is already registered.");
            return;
        }

        const month = String(birthDate.getMonth() + 1).padStart(2, "0");
        const day = String(birthDate.getDate()).padStart(2, "0");
        const defaultPassword = `${month}-${day}-${birthDate.getFullYear()}`;

        const newStudent = {
            studentID: normalizedID,
            lastName: document.getElementById("lastName").value.trim(),
            firstName: document.getElementById("firstName").value.trim(),
            middleName: document.getElementById("middleName").value.trim(),
            gender: document.getElementById("gender").value,
            birthday: birthday.value,
            age: age,
            campus: document.getElementById("campus").value,
            college: college.value,
            course: course.value,
            program: program.value,
            representative: document.getElementById("representative").value,
            defaultPassword: defaultPassword,
            registeredAt: new Date().toISOString()
        };

        students.push(newStudent);

        try {
            localStorage.setItem("registeredStudents", JSON.stringify(students));
        } catch (error) {
            alert("Unable to save registration in this browser.");
            return;
        }

        alert("Student registered successfully!");
        window.location.href = "student-login.html";
    });
});
