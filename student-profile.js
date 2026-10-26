
/* =========================================
   QCONNECT STUDENT PROFILE
   Fixed course and major dropdown handling
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const profileMode = localStorage.getItem("profileMode") || "student";

    const studentID =
        profileMode === "admin"
            ? localStorage.getItem("selectedStudentID")
            : localStorage.getItem("loggedInStudentID");

    const profileForm = document.getElementById("profileForm");

    const lastNameInput = document.getElementById("profileLastName");
    const firstNameInput = document.getElementById("profileFirstName");
    const middleNameInput = document.getElementById("profileMiddleName");

    const studentIDInput = document.getElementById("profileStudentID");
    const genderInput = document.getElementById("profileGender");
    const birthdayInput = document.getElementById("profileBirthday");
    const ageInput = document.getElementById("profileAge");
    const campusInput = document.getElementById("profileCampus");

    const collegeInput = document.getElementById("profileCollege");
    const courseInput = document.getElementById("profileCourse");
    const programInput = document.getElementById("profileProgram");

    const editButton = document.getElementById("editProfileButton");
    const saveButton = document.getElementById("saveProfileButton");
    const queueButton = document.getElementById("queueButton");
    const buttonsContainer = document.getElementById("profileButtons");

    const pageTitle = document.getElementById("profilePageTitle");
    const savePopup = document.getElementById("savePopup");
    const closeSavePopup = document.getElementById("closeSavePopup");

    if (
        !profileForm ||
        !collegeInput ||
        !courseInput ||
        !programInput
    ) {
        console.error("QConnect profile: one or more required HTML elements are missing.");
        return;
    }

    /* =========================================
       COURSE AND MAJOR DATA
    ========================================= */

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
            {
                code: "BSCS",
                name: "Bachelor of Science in Computer Science"
            },
            {
                code: "BSDS",
                name: "Bachelor of Science in Data Science"
            },
            {
                code: "BSIT",
                name: "Bachelor of Science in Information Technology"
            },
            {
                code: "BSEMC",
                name: "Bachelor of Science in Entertainment and Multimedia Computing"
            }
        ],

        CEA: [
            {
                code: "BS ARCH",
                name: "Bachelor of Science in Architecture"
            },
            {
                code: "BSCE",
                name: "Bachelor of Science in Civil Engineering"
            },
            {
                code: "BSCpE",
                name: "Bachelor of Science in Computer Engineering"
            },
            {
                code: "BSEE",
                name: "Bachelor of Science in Electrical Engineering"
            },
            {
                code: "BSECE",
                name: "Bachelor of Science in Electronics Engineering"
            },
            {
                code: "BSIE",
                name: "Bachelor of Science in Industrial Engineering"
            },
            {
                code: "BSME",
                name: "Bachelor of Science in Mechanical Engineering"
            }
        ],

        CBA: [
            {
                code: "BSHM",
                name: "Bachelor of Science in Hospitality Management"
            },
            {
                code: "BSTM",
                name: "Bachelor of Science in Tourism Management"
            }
        ],

        COAS: [
            {
                code: "BACOMM",
                name: "Bachelor of Arts in Communication"
            }
        ],

        CAHS: [
            {
                code: "BSM",
                name: "Bachelor of Science in Midwifery"
            },
            {
                code: "BSN",
                name: "Bachelor of Science in Nursing"
            },
            {
                code: "BSPH",
                name: "Bachelor of Science in Public Health"
            },
            {
                code: "BSRT",
                name: "Bachelor of Science in Radiologic Technology"
            }
        ],

        CTECH: [
            {
                code: "BSIT-IND",
                name: "Bachelor of Science in Industrial Technology"
            },
            {
                code: "BTTE",
                name: "Bachelor of Technical-Vocational Teacher Education"
            }
        ]
    };

    const majorsByCourse = {
        "Bachelor of Science in Computer Science": [
            { code: "BSCS", name: "Bachelor of Science in Computer Science" }
        ],

        "Bachelor of Science in Data Science": [
            { code: "BSDS", name: "Bachelor of Science in Data Science" }
        ],

        "Bachelor of Science in Information Technology": [
            { code: "BSIT", name: "Bachelor of Science in Information Technology" }
        ],

        "Bachelor of Science in Entertainment and Multimedia Computing": [
            { code: "GD", name: "Game Development" },
            { code: "DAT", name: "Digital Animation Technology" }
        ],

        "Bachelor of Science in Architecture": [
            { code: "BS ARCH", name: "Bachelor of Science in Architecture" }
        ],

        "Bachelor of Science in Civil Engineering": [
            { code: "BSCE", name: "Bachelor of Science in Civil Engineering" }
        ],

        "Bachelor of Science in Computer Engineering": [
            { code: "BSCpE", name: "Bachelor of Science in Computer Engineering" }
        ],

        "Bachelor of Science in Electrical Engineering": [
            { code: "BSEE", name: "Bachelor of Science in Electrical Engineering" }
        ],

        "Bachelor of Science in Electronics Engineering": [
            { code: "BSECE", name: "Bachelor of Science in Electronics Engineering" }
        ],

        "Bachelor of Science in Industrial Engineering": [
            { code: "BSIE", name: "Bachelor of Science in Industrial Engineering" }
        ],

        "Bachelor of Science in Mechanical Engineering": [
            { code: "BSME", name: "Bachelor of Science in Mechanical Engineering" }
        ],

        "Bachelor of Science in Hospitality Management": [
            { code: "BSHM", name: "Bachelor of Science in Hospitality Management" }
        ],

        "Bachelor of Science in Tourism Management": [
            { code: "BSTM", name: "Bachelor of Science in Tourism Management" }
        ],

        "Bachelor of Arts in Communication": [
            { code: "CAP", name: "Creative and Performing Arts" },
            { code: "NMT", name: "New Media Track" }
        ],

        "Bachelor of Science in Midwifery": [
            { code: "BSM", name: "Bachelor of Science in Midwifery" }
        ],

        "Bachelor of Science in Nursing": [
            { code: "BSN", name: "Bachelor of Science in Nursing" }
        ],

        "Bachelor of Science in Public Health": [
            { code: "PH", name: "Population Health" }
        ],

        "Bachelor of Science in Radiologic Technology": [
            { code: "BSRT", name: "Bachelor of Science in Radiologic Technology" }
        ],

        "Bachelor of Science in Industrial Technology": [
            { code: "AFT", name: "Apparel and Fashion Technology" },
            { code: "ADT", name: "Architectural Drafting Technology" },
            { code: "AT", name: "Automotive Technology" },
            { code: "CT", name: "Culinary Technology" },
            { code: "ET", name: "Electrical Technology" },
            { code: "ELT", name: "Electronics Technology" },
            { code: "FST", name: "Food and Service Technology" },
            { code: "HVACT", name: "Heating, Ventilating and Air Conditioning Technology" },
            { code: "MT", name: "Mechanical Technology" },
            { code: "WFT", name: "Welding and Fabrication Technology" }
        ],

        "Bachelor of Technical-Vocational Teacher Education": [
            { code: "ANIM", name: "Animation" },
            { code: "CCT", name: "Civil and Construction Technology" },
            { code: "DT", name: "Drafting Technology" },
            { code: "ET", name: "Electrical Technology" },
            { code: "ELT", name: "Electronics Technology" },
            { code: "FSM", name: "Food and Service Management" },
            { code: "GFD", name: "Garments, Fashion and Design" },
            { code: "HVACT", name: "Heating, Ventilating and Air Conditioning Technology" },
            { code: "HRS", name: "Hotel and Restaurant Services" },
            { code: "MT", name: "Mechanical Technology" },
            { code: "WFT", name: "Welding and Fabrication Technology" }
        ]
    };

    /* =========================================
       NORMALIZE SAVED VALUES
       Supports full names, abbreviations, and
       older saved records.
    ========================================= */

    function clean(value) {
        return String(value ?? "").trim();
    }

    function isMissingMajor(value) {
        const text = clean(value).toLowerCase();

        return (
            text === "" ||
            text === "n/a" ||
            text === "na" ||
            text === "none" ||
            text === "null" ||
            text === "select major" ||
            text === "select program / major"
        );
    }

    function normalizeCollege(value) {
        const text = clean(value).toLowerCase();

        if (!text) return "";

        for (const [code, name] of Object.entries(colleges)) {
            if (
                text === code.toLowerCase() ||
                text === name.toLowerCase() ||
                text === `${name} (${code})`.toLowerCase() ||
                text === `${code} - ${name}`.toLowerCase()
            ) {
                return code;
            }
        }

        return "";
    }

    function getAllCourses() {
        return Object.values(coursesByCollege).flat();
    }

    function getCourseObject(value) {
        const text = clean(value).toLowerCase();

        if (!text) return null;

        return getAllCourses().find(course => {
            return (
                text === course.name.toLowerCase() ||
                text === course.code.toLowerCase() ||
                text === `${course.code} - ${course.name}`.toLowerCase() ||
                text === `${course.name} (${course.code})`.toLowerCase()
            );
        }) || null;
    }

    function getCourseName(value) {
        const course = getCourseObject(value);
        return course ? course.name : clean(value);
    }

    function getMajorObject(value, courseName) {
        const text = clean(value).toLowerCase();

        if (isMissingMajor(text)) return null;

        const majors = majorsByCourse[courseName] || [];

        return majors.find(major => {
            return (
                text === major.name.toLowerCase() ||
                text === major.code.toLowerCase() ||
                text === `${major.code} - ${major.name}`.toLowerCase()
            );
        }) || null;
    }

    /* =========================================
       DROPDOWN HELPERS
    ========================================= */

    function fillDropdown(select, options, placeholder, selectedValue = "") {
        select.replaceChildren();

        const first = document.createElement("option");
        first.value = "";
        first.textContent = placeholder;
        select.appendChild(first);

        options.forEach(item => {
            const option = document.createElement("option");

            option.value = item.name;
            option.textContent = `${item.code} - ${item.name}`;

            select.appendChild(option);
        });

        const selected = clean(selectedValue);

        if (!selected || isMissingMajor(selected)) {
            select.value = "";
            return;
        }

        const match = Array.from(select.options).find(option => {
            return (
                option.value.toLowerCase() === selected.toLowerCase() ||
                option.textContent.toLowerCase() === selected.toLowerCase()
            );
        });

        if (match) {
            select.value = match.value;
        } else {
            // Preserve an older value that is not in the current mapping.
            const oldOption = document.createElement("option");
            oldOption.value = selected;
            oldOption.textContent = selected;
            select.appendChild(oldOption);
            select.value = selected;
        }
    }

    function updateCourseOptions(selectedCourse = "") {
        const collegeCode = normalizeCollege(collegeInput.value);
        const courses = coursesByCollege[collegeCode] || [];

        fillDropdown(courseInput, courses, "Select Course", selectedCourse);

        updateProgramOptions(currentStudent?.program || "");
    }

    function updateProgramOptions(selectedProgram = "") {
        const courseName = getCourseName(courseInput.value);
        const majors = majorsByCourse[courseName] || [];

        programInput.replaceChildren();

        if (!courseName || majors.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No major options available";
            programInput.appendChild(option);
            programInput.value = "";
            return;
        }

        // For courses with exactly one major, select it automatically.
        // This also fixes older records where the saved value was "N/A".
        if (majors.length === 1) {
            const major = majors[0];
            const option = document.createElement("option");

            option.value = major.name;
            option.textContent = `${major.code} - ${major.name}`;
            programInput.appendChild(option);
            programInput.value = major.name;
            return;
        }

        // Courses with multiple majors require a real choice.
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Select Major";
        programInput.appendChild(placeholder);

        majors.forEach(major => {
            const option = document.createElement("option");
            option.value = major.name;
            option.textContent = `${major.code} - ${major.name}`;
            programInput.appendChild(option);
        });

        const selected = getMajorObject(selectedProgram, courseName);

        if (selected) {
            programInput.value = selected.name;
        } else {
            // Never show the literal "N/A" as a major.
            programInput.value = "";
        }
    }

    collegeInput.addEventListener("change", function () {
        courseInput.value = "";
        programInput.value = "";
        updateCourseOptions("");
    });

    courseInput.addEventListener("change", function () {
        updateProgramOptions("");
    });

    /* =========================================
       LOCAL STORAGE HELPERS
    ========================================= */

    function getRegisteredStudents() {
        try {
            const students = JSON.parse(
                localStorage.getItem("registeredStudents") || "[]"
            );

            return Array.isArray(students) ? students : [];
        } catch (error) {
            console.error("Could not read registered students:", error);
            return [];
        }
    }

    function saveRegisteredStudents(students) {
        localStorage.setItem("registeredStudents", JSON.stringify(students));
    }

    function sameStudentID(a, b) {
        return clean(a).toLowerCase() === clean(b).toLowerCase();
    }

    function getNameParts(student) {
        const last = clean(student.lastName);
        const first = clean(student.firstName);
        const middle = clean(student.middleName);

        if (last || first || middle) {
            return { last, first, middle };
        }

        const oldName = clean(student.name);
        if (!oldName) return { last: "", first: "", middle: "" };

        const parts = oldName.split(",").map(part => part.trim());

        if (parts.length >= 2) {
            return {
                last: parts[0] || "",
                first: parts[1] || "",
                middle: parts.slice(2).join(", ").trim()
            };
        }

        return { last: oldName, first: "", middle: "" };
    }

    function joinNameParts(last, first, middle) {
        return [last, first, middle]
            .map(clean)
            .filter(Boolean)
            .join(", ");
    }

    /* =========================================
       BIRTHDAY AND AGE
    ========================================= */

    function parseBirthday(value) {
        const text = clean(value);
        if (!text) return null;

        let year, month, day;

        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
            [year, month, day] = text.split("-").map(Number);
        } else if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(text)) {
            [month, day, year] = text.split(/[/-]/).map(Number);
        } else {
            return null;
        }

        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return { year, month, day };
    }

    function formatBirthdayForDisplay(value) {
        const date = parseBirthday(value);
        if (!date) return clean(value);

        return (
            `${String(date.month).padStart(2, "0")}/` +
            `${String(date.day).padStart(2, "0")}/${date.year}`
        );
    }

    function formatBirthdayForStorage(value) {
        const date = parseBirthday(value);
        if (!date) return clean(value);

        return (
            `${date.year}-` +
            `${String(date.month).padStart(2, "0")}-` +
            `${String(date.day).padStart(2, "0")}`
        );
    }

    function calculateAge(value) {
        const date = parseBirthday(value);
        if (!date) return "";

        const today = new Date();
        let age = today.getFullYear() - date.year;

        if (
            today.getMonth() + 1 < date.month ||
            (
                today.getMonth() + 1 === date.month &&
                today.getDate() < date.day
            )
        ) {
            age--;
        }

        return age >= 0 ? age : "";
    }

    /* =========================================
       EDITING MODE
    ========================================= */

    let currentStudent = null;

    function setEditing(editing) {
        const canEdit = profileMode !== "admin";

        [lastNameInput, firstNameInput, middleNameInput].forEach(input => {
            if (input) input.disabled = !editing || !canEdit;
        });

        [
            studentIDInput,
            genderInput,
            birthdayInput,
            ageInput,
            campusInput
        ].forEach(input => {
            if (input) input.disabled = true;
        });

        collegeInput.disabled = !editing || !canEdit;
        courseInput.disabled = !editing || !canEdit;
        programInput.disabled = !editing || !canEdit;

        if (editButton) editButton.hidden = !canEdit || editing;
        if (saveButton) saveButton.hidden = !canEdit || !editing;

        if (editing && canEdit && currentStudent) {
            // Reload the saved college/course/major while editing.
            const collegeCode = normalizeCollege(
                currentStudent.college || currentStudent.collegeCode
            );

            collegeInput.value = collegeCode;
            updateCourseOptions(currentStudent.course || "");

            collegeInput.disabled = false;
            courseInput.disabled = false;
            programInput.disabled = false;
        }
    }

    /* =========================================
       LOAD PROFILE
    ========================================= */

    function loadProfile() {
        const students = getRegisteredStudents();

        currentStudent = students.find(student =>
            sameStudentID(student.studentID || student.id, studentID)
        );

        if (!currentStudent) {
            alert(
                profileMode === "admin"
                    ? "Student profile not found."
                    : "Your profile could not be found. Please log in again."
            );

            window.location.href =
                profileMode === "admin"
                    ? "registered-students.html"
                    : "student-login.html";

            return;
        }

        const nameParts = getNameParts(currentStudent);

        lastNameInput.value = nameParts.last;
        firstNameInput.value = nameParts.first;
        middleNameInput.value = nameParts.middle;

        studentIDInput.value =
            currentStudent.studentID || currentStudent.id || "";

        genderInput.value = currentStudent.gender || "";
        birthdayInput.value = formatBirthdayForDisplay(currentStudent.birthday);

        ageInput.value =
            currentStudent.age ?? calculateAge(currentStudent.birthday);

        campusInput.value = currentStudent.campus || "Main Campus";

        const collegeCode = normalizeCollege(
            currentStudent.college || currentStudent.collegeCode
        );

        collegeInput.value = collegeCode;

        // Match course abbreviations and full course names.
        updateCourseOptions(currentStudent.course || "");

        // Reload the major after the course dropdown has been populated.
        updateProgramOptions(currentStudent.program || "");

        if (profileMode === "admin") {
            if (pageTitle) pageTitle.textContent = "Student Profile";
            if (buttonsContainer) buttonsContainer.hidden = true;
            setEditing(false);
        } else {
            if (pageTitle) pageTitle.textContent = "My Profile";
            if (buttonsContainer) buttonsContainer.hidden = false;
            if (queueButton) queueButton.hidden = false;
            setEditing(false);
        }
    }

    if (editButton) {
        editButton.addEventListener("click", function () {
            if (profileMode !== "admin") {
                setEditing(true);
            }
        });
    }

    /* =========================================
       SAVE PROFILE
    ========================================= */

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (profileMode === "admin" || !currentStudent) return;

        const last = lastNameInput.value.trim();
        const first = firstNameInput.value.trim();
        const middle = middleNameInput.value.trim();

        if (!last || !first) {
            alert("Please enter your last name and first name.");
            return;
        }

        const college = collegeInput.value;
        const course = getCourseName(courseInput.value);
        const program = programInput.value;

        if (!college || !course || !program || isMissingMajor(program)) {
            alert("Please select your college, course, and major.");
            return;
        }

        const students = getRegisteredStudents();

        const index = students.findIndex(student =>
            sameStudentID(student.studentID || student.id, studentID)
        );

        if (index === -1) {
            alert("Student record not found. Your changes were not saved.");
            return;
        }

        const updatedStudent = {
            ...students[index],
            lastName: last,
            firstName: first,
            middleName: middle,
            name: joinNameParts(last, first, middle),
            college: college,
            course: course,
            program: program
        };

        students[index] = updatedStudent;
        saveRegisteredStudents(students);

        currentStudent = updatedStudent;

        localStorage.setItem("loggedInStudent", JSON.stringify(updatedStudent));

        loadProfile();
        setEditing(false);

        if (savePopup) {
            savePopup.classList.add("show");
        }
    });

    if (closeSavePopup && savePopup) {
        closeSavePopup.addEventListener("click", function () {
            savePopup.classList.remove("show");
        });
    }

    /* =========================================
       QUEUE APPOINTMENT
    ========================================= */

    function getLocalISODate(date) {
        return (
            `${date.getFullYear()}-` +
            `${String(date.getMonth() + 1).padStart(2, "0")}-` +
            `${String(date.getDate()).padStart(2, "0")}`
        );
    }

    function formatQueueDate(dateISO) {
        const date = new Date(`${dateISO}T00:00:00`);

        if (Number.isNaN(date.getTime())) return dateISO;

        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }

    function getQueueList() {
        try {
            const queues = JSON.parse(localStorage.getItem("queueList") || "[]");
            return Array.isArray(queues) ? queues : [];
        } catch (error) {
            console.error("Could not read queue list:", error);
            return [];
        }
    }

    function getNextWeekday(date) {
        const next = new Date(date);
        next.setDate(next.getDate() + 1);

        while (next.getDay() === 0 || next.getDay() === 6) {
            next.setDate(next.getDate() + 1);
        }

        return next;
    }

    function createAppointment() {
        if (!currentStudent || profileMode === "admin") return;

        const queues = getQueueList();
        const todayISO = getLocalISODate(new Date());

        const existing = queues.find(queue =>
            sameStudentID(
                queue.studentID,
                currentStudent.studentID || currentStudent.id
            ) &&
            queue.appointmentDate &&
            queue.appointmentDate >= todayISO
        );

        if (existing) {
            localStorage.setItem("currentQueue", JSON.stringify(existing));
            window.location.href = "student-queue.html";
            return;
        }

        let appointmentDay = getNextWeekday(new Date());
        let appointmentDate = getLocalISODate(appointmentDay);
        let attempts = 0;

        while (attempts < 365) {
            const countForDay = queues.filter(queue =>
                queue.appointmentDate === appointmentDate
            ).length;

            if (countForDay < 16) break;

            appointmentDay = getNextWeekday(appointmentDay);
            appointmentDate = getLocalISODate(appointmentDay);
            attempts++;
        }

        if (attempts >= 365) {
            alert("No appointment dates are currently available. Please try again later.");
            return;
        }

        const dayQueues = queues.filter(queue =>
            queue.appointmentDate === appointmentDate
        );

        const queueNumber = `Q${String(dayQueues.length + 1).padStart(3, "0")}`;

        const totalMinutes = 8 * 60 + dayQueues.length * 30;
        const hour24 = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;
        const period = hour24 >= 12 ? "PM" : "AM";
        const hour12 = hour24 % 12 || 12;

        const appointmentTime =
            `${hour12}:${String(minute).padStart(2, "0")} ${period}`;

        const queue = {
            queueNumber,
            studentID: currentStudent.studentID || currentStudent.id,
            name: joinNameParts(
                currentStudent.lastName,
                currentStudent.firstName,
                currentStudent.middleName
            ) || currentStudent.name || "",
            appointmentDate,
            formattedDate: formatQueueDate(appointmentDate),
            appointmentTime,
            status: "Waiting"
        };

        queues.push(queue);

        localStorage.setItem("queueList", JSON.stringify(queues));
        localStorage.setItem("currentQueue", JSON.stringify(queue));

        window.location.href = "student-queue.html";
    }

    if (queueButton) {
        queueButton.addEventListener("click", function () {
            if (profileMode !== "admin" && currentStudent) {
                createAppointment();
            }
        });
    }

    /* =========================================
       START
    ========================================= */

    loadProfile();
});
