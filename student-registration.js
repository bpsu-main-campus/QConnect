
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");
    const studentID = document.getElementById("studentID");
    const birthday = document.getElementById("birthday");
    const college = document.getElementById("college");
    const course = document.getElementById("course");
    const major = document.getElementById("program");

    /*
      College codes and names.
      Course labels use a short code plus the full degree name.
    */
    const coursesByCollege = {
        CCST: [
            {
                code: "BSCS",
                name: "Bachelor of Science in Computer Science",
                majors: []
            },
            {
                code: "BSDS",
                name: "Bachelor of Science in Data Science",
                majors: []
            },
            {
                code: "BSIT",
                name: "Bachelor of Science in Information Technology",
                majors: [
                    "DAT - Digital Animation Technology"
                ]
            },
            {
                code: "BSEMC",
                name: "Bachelor of Science in Entertainment and Multimedia Computing",
                majors: [
                    "GD - Game Development",
                    "DAT - Digital Animation Technology"
                ]
            }
        ],

        CEA: [
            { code: "BS Architecture", name: "Bachelor of Science in Architecture", majors: [] },
            { code: "BSCE", name: "Bachelor of Science in Civil Engineering", majors: [] },
            { code: "BSCpE", name: "Bachelor of Science in Computer Engineering", majors: [] },
            { code: "BSEE", name: "Bachelor of Science in Electrical Engineering", majors: [] },
            { code: "BSECE", name: "Bachelor of Science in Electronics Engineering", majors: [] },
            { code: "BSIE", name: "Bachelor of Science in Industrial Engineering", majors: [] },
            { code: "BSME", name: "Bachelor of Science in Mechanical Engineering", majors: [] }
        ],

        CBA: [
            { code: "BSHM", name: "Bachelor of Science in Hospitality Management", majors: [] },
            { code: "BSTM", name: "Bachelor of Science in Tourism Management", majors: [] }
        ],

        COAS: [
            {
                code: "BA Communication",
                name: "Bachelor of Arts in Communication",
                majors: [
                    "CPA - Creative and Performing Arts",
                    "NMT - New Media Track"
                ]
            }
        ],

        CAHS: [
            { code: "BS Midwifery", name: "Bachelor of Science in Midwifery", majors: [] },
            { code: "BSN", name: "Bachelor of Science in Nursing", majors: [] },
            {
                code: "BSPH",
                name: "Bachelor of Science in Public Health",
                majors: ["PH - Population Health"]
            },
            { code: "BSRT", name: "Bachelor of Science in Radiologic Technology", majors: [] }
        ],

        CTECH: [
            {
                code: "BSITech",
                name: "Bachelor of Science in Industrial Technology",
                majors: [
                    "AFT - Apparel and Fashion Technology",
                    "ADT - Architectural Drafting Technology",
                    "AT - Automotive Technology",
                    "CT - Culinary Technology",
                    "ET - Electrical Technology",
                    "Electronics Technology",
                    "FST - Food and Service Technology",
                    "HVAC - Heating, Ventilating and Air Conditioning Technology",
                    "MT - Mechanical Technology",
                    "WFT - Welding and Fabrication Technology"
                ]
            },
            {
                code: "BTVTEd",
                name: "Bachelor of Technical-Vocational Teacher Education",
                majors: [
                    "Animation",
                    "Civil and Construction Technology",
                    "Drafting Technology",
                    "Electrical Technology",
                    "Electronics Technology",
                    "Food and Service Management",
                    "Garments, Fashion and Design",
                    "HVAC - Heating, Ventilating and Air Conditioning Technology",
                    "Hotel and Restaurant Services",
                    "Mechanical Technology",
                    "Welding and Fabrication Technology"
                ]
            }
        ]
    };

    let selectedCourse = null;

    function resetDropdown(select, placeholder) {
        select.replaceChildren();

        const option = document.createElement("option");
        option.value = "";
        option.textContent = placeholder;
        option.disabled = true;
        option.selected = true;

        select.appendChild(option);
        select.disabled = true;
    }

    function fillCourses(collegeCode) {
        resetDropdown(course, "Select Course");
        resetDropdown(major, "Select Course First");

        const courses = coursesByCollege[collegeCode] || [];

        courses.forEach(function (item) {
            const option = document.createElement("option");

            // Save the short course code, display code + full name.
            option.value = item.code;
            option.textContent = `${item.code} - ${item.name}`;

            course.appendChild(option);
        });

        course.disabled = courses.length === 0;
    }

    function fillMajors(courseCode) {
        resetDropdown(major, "Select Major");

        const courses = coursesByCollege[college.value] || [];

        selectedCourse = courses.find(function (item) {
            return item.code === courseCode;
        }) || null;

        if (!selectedCourse) return;

        const majors = selectedCourse.majors;

        // No separate major: display N/A, not a fake dropdown choice.
        if (majors.length === 0) {
            const option = document.createElement("option");
            option.value = "N/A";
            option.textContent = "N/A";
            option.selected = true;

            major.replaceChildren(option);
            major.disabled = true;
            return;
        }

        majors.forEach(function (item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            major.appendChild(option);
        });

        // Automatically select a major when there is only one.
        if (majors.length === 1) {
            major.value = majors[0];
            major.disabled = true;
        } else {
            major.disabled = false;
        }
    }

    college.addEventListener("change", function () {
        fillCourses(college.value);
    });

    course.addEventListener("change", function () {
        fillMajors(course.value);
    });

    // Prevent future birthdays.
    function getLocalDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    birthday.max = getLocalDateString(new Date());

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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
            alert("Please enter a valid birthday that is not in the future.");
            return;
        }

        let age = today.getFullYear() - birthDate.getFullYear();

        if (
            today.getMonth() < birthDate.getMonth() ||
            (
                today.getMonth() === birthDate.getMonth() &&
                today.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }

        let students = [];

        try {
            students = JSON.parse(
                localStorage.getItem("registeredStudents") || "[]"
            );

            if (!Array.isArray(students)) students = [];
        } catch (error) {
            alert("Unable to read saved registrations. Please try again.");
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
            program: major.value,
            representative: document.getElementById("representative").value,
            defaultPassword: defaultPassword,
            registeredAt: new Date().toISOString()
        };

        students.push(newStudent);

        try {
            localStorage.setItem(
                "registeredStudents",
                JSON.stringify(students)
            );
        } catch (error) {
            alert("Unable to save registration in this browser.");
            return;
        }

        alert("Student registered successfully!");
        window.location.href = "student-login.html";
    });
});
