
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("profileForm");
    const college = document.getElementById("profileCollege");
    const course = document.getElementById("profileCourse");
    const program = document.getElementById("profileProgram");

    const profileMode = localStorage.getItem("profileMode") || "student";
    const isAdmin = profileMode === "admin";

    const studentID = isAdmin
        ? localStorage.getItem("selectedStudentID")
        : localStorage.getItem("loggedInStudentID");

    const colleges = {
        CCST: "College of Computer Studies and Technology",
        CEA: "College of Engineering and Architecture",
        CBA: "College of Business and Accountancy",
        COAS: "College of Arts and Sciences",
        CAHS: "College of Allied Health Sciences",
        CTECH: "College of Technology"
    };

    const coursesByCollege = {
        CCST: [
            { code: "BSCS", name: "Bachelor of Science in Computer Science", majors: [] },
            { code: "BSDS", name: "Bachelor of Science in Data Science", majors: [] },
            { code: "BSIT", name: "Bachelor of Science in Information Technology", majors: ["DAT - Digital Animation Technology"] },
            { code: "BSEMC", name: "Bachelor of Science in Entertainment and Multimedia Computing", majors: ["GD - Game Development", "DAT - Digital Animation Technology"] }
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
            { code: "BA Communication", name: "Bachelor of Arts in Communication", majors: ["CPA - Creative and Performing Arts", "NMT - New Media Track"] }
        ],
        CAHS: [
            { code: "BS Midwifery", name: "Bachelor of Science in Midwifery", majors: [] },
            { code: "BSN", name: "Bachelor of Science in Nursing", majors: [] },
            { code: "BSPH", name: "Bachelor of Science in Public Health", majors: ["PH - Population Health"] },
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

    let currentStudent = null;
    let selectedCourse = null;

    function cleanValue(value) {
        const text = String(value || "").trim();

        if (
            !text ||
            ["n/a", "na", "none", "null", "undefined"].includes(text.toLowerCase())
        ) {
            return "";
        }

        return text;
    }

    function findCourse(collegeCode, courseCode) {
        const list = coursesByCollege[collegeCode] || [];

        return list.find(function (item) {
            return item.code === courseCode;
        }) || list.find(function (item) {
            return item.name === courseCode;
        }) || null;
    }

    function setProgramOptions(courseItem, savedProgram, readOnly) {
        program.replaceChildren();

        if (!courseItem) {
            const option = new Option("Select Course First", "");
            program.add(option);
            program.disabled = true;
            return;
        }

        const majors = courseItem.majors || [];
        const saved = cleanValue(savedProgram);

        if (majors.length === 0) {
            program.add(new Option("N/A", "N/A", true, true));
            program.disabled = true;
            return;
        }

        if (majors.length === 1) {
            program.add(new Option(majors[0], majors[0], true, true));
            program.disabled = true;
            return;
        }

        const validSavedMajor = majors.find(function (item) {
            return item.toLowerCase() === saved.toLowerCase();
        });

        if (readOnly) {
            if (validSavedMajor) {
                majors.forEach(function (item) {
                    program.add(new Option(item, item, false, item === validSavedMajor));
                });
            } else {
                program.add(new Option("Major not selected", "", true, true));
            }

            program.disabled = true;
            return;
        }

        program.add(new Option("Select Major", "", true, !validSavedMajor));

        majors.forEach(function (item) {
            program.add(new Option(item, item, false, item === validSavedMajor));
        });

        program.disabled = false;
    }

    function updateCourseOptions(savedCourse, savedProgram) {
        course.replaceChildren();

        const collegeCode = college.value;
        const list = coursesByCollege[collegeCode] || [];

        course.add(new Option("Select Course", "", true, !savedCourse));

        list.forEach(function (item) {
            const option = new Option(
                item.code + " - " + item.name,
                item.code,
                false,
                item.code === savedCourse || item.name === savedCourse
            );

            course.add(option);
        });

        course.disabled = isAdmin;

        selectedCourse = findCourse(collegeCode, savedCourse);

        if (selectedCourse) {
            course.value = selectedCourse.code;
            setProgramOptions(selectedCourse, savedProgram, isAdmin);
        } else {
            setProgramOptions(null, "", isAdmin);
        }
    }

    function loadStudents() {
        try {
            const students = JSON.parse(
                localStorage.getItem("registeredStudents") || "[]"
            );

            if (!Array.isArray(students)) return [];

            return students;
        } catch (error) {
            console.error("Could not load registered students:", error);
            return [];
        }
    }

    function getStudentID(student) {
        return String(student.studentID || student.id || "").trim();
    }

    function loadProfile() {
        const students = loadStudents();

        if (!studentID) {
            alert(isAdmin
                ? "No student was selected."
                : "Please log in first.");

            if (!isAdmin) {
                window.location.href = "student-login.html";
            }

            return;
        }

        currentStudent = students.find(function (student) {
            return getStudentID(student) === String(studentID).trim();
        });

        if (!currentStudent) {
            alert("Student record not found.");
            return;
        }

        document.getElementById("profileLastName").value =
            currentStudent.lastName || "";

        document.getElementById("profileFirstName").value =
            currentStudent.firstName || "";

        document.getElementById("profileMiddleName").value =
            currentStudent.middleName || "";

        document.getElementById("profileStudentID").value =
            getStudentID(currentStudent);

        document.getElementById("profileGender").value =
            currentStudent.gender || "";

        document.getElementById("profileBirthday").value =
            currentStudent.birthday || "";

        document.getElementById("profileAge").value =
            currentStudent.age ?? "";

        document.getElementById("profileCampus").value =
            currentStudent.campus || "";

        college.value = currentStudent.college || "";

        updateCourseOptions(
            currentStudent.course || "",
            currentStudent.program || ""
        );

        document.getElementById("profilePageTitle").textContent =
            isAdmin ? "Student Profile" : "My Profile";

        document.getElementById("editProfileButton").hidden = isAdmin;
        document.getElementById("saveProfileButton").hidden = true;
        document.getElementById("queueButton").hidden = isAdmin;

        form.querySelectorAll("input, select").forEach(function (field) {
            field.disabled = true;
        });

        // The course and major controls are already configured above.
        course.disabled = true;
        program.disabled = true;
    }

    function setEditing(editing) {
        const fields = form.querySelectorAll("input, select");

        fields.forEach(function (field) {
            field.disabled = !editing;
        });

        document.getElementById("profileStudentID").disabled = true;
        document.getElementById("profileAge").disabled = true;
        document.getElementById("profileCampus").disabled = true;

        college.disabled = true;

        const selected = findCourse(college.value, course.value);

        course.disabled = true;

        setProgramOptions(
            selected,
            currentStudent ? currentStudent.program : "",
            !editing
        );

        document.getElementById("editProfileButton").hidden = editing;
        document.getElementById("saveProfileButton").hidden = !editing;
        document.getElementById("queueButton").hidden = editing || isAdmin;
    }

    document.getElementById("editProfileButton").addEventListener("click", function () {
        if (isAdmin) return;

        setEditing(true);
    });

    document.getElementById("saveProfileButton").addEventListener("click", function () {
        if (!form.reportValidity()) return;

        const selected = findCourse(college.value, course.value);

        if (!selected) {
            alert("Please select a valid course.");
            return;
        }

        const majors = selected.majors || [];
        let savedProgram = "N/A";

        if (majors.length === 1) {
            savedProgram = majors[0];
        } else if (majors.length > 1) {
            if (!program.value || !majors.includes(program.value)) {
                alert("Please select your major before saving your profile.");
                return;
            }

            savedProgram = program.value;
        }

        const students = loadStudents();
        const index = students.findIndex(function (student) {
            return getStudentID(student) === getStudentID(currentStudent);
        });

        if (index === -1) {
            alert("Student record not found. Your changes were not saved.");
            return;
        }

        students[index] = {
            ...students[index],
            lastName: document.getElementById("profileLastName").value.trim(),
            firstName: document.getElementById("profileFirstName").value.trim(),
            middleName: document.getElementById("profileMiddleName").value.trim(),
            gender: document.getElementById("profileGender").value,
            birthday: document.getElementById("profileBirthday").value,
            age: document.getElementById("profileAge").value,
            campus: document.getElementById("profileCampus").value,
            college: college.value,
            course: selected.code,
            program: savedProgram
        };

        try {
            localStorage.setItem("registeredStudents", JSON.stringify(students));

            currentStudent = students[index];

            const loggedInStudent = JSON.parse(
                localStorage.getItem("loggedInStudent") || "null"
            );

            if (
                loggedInStudent &&
                getStudentID(loggedInStudent) === getStudentID(currentStudent)
            ) {
                localStorage.setItem(
                    "loggedInStudent",
                    JSON.stringify(currentStudent)
                );
            }

            loadProfile();
            const popup = document.getElementById("savePopup");

            if (popup) popup.hidden = false;
        } catch (error) {
            console.error("Could not save profile:", error);
            alert("Unable to save your profile. Please try again.");
        }
    });

    const closeSavePopup = document.getElementById("closeSavePopup");

    if (closeSavePopup) {
        closeSavePopup.addEventListener("click", function () {
            document.getElementById("savePopup").hidden = true;
        });
    }

    // Recalculate age when birthday changes during editing.
    document.getElementById("profileBirthday").addEventListener("change", function () {
        if (!this.value) return;

        const birth = new Date(this.value + "T00:00:00");
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();

        if (
            today.getMonth() < birth.getMonth() ||
            (
                today.getMonth() === birth.getMonth() &&
                today.getDate() < birth.getDate()
            )
        ) {
            age--;
        }

        document.getElementById("profileAge").value = age;
    });

    college.addEventListener("change", function () {
        updateCourseOptions("", "");
    });

    course.addEventListener("change", function () {
        selectedCourse = findCourse(college.value, course.value);
        setProgramOptions(selectedCourse, "", false);
    });

    loadProfile();
});
