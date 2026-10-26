
/* =========================================
   QCONNECT STUDENT PROFILE
========================================= */

const profileMode = localStorage.getItem("profileMode") || "student";

const studentID = profileMode === "admin"
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


/* =========================================
   COLLEGES, COURSES, AND PROGRAMS
========================================= */

const colleges = {
    CCST: "College of Computer Studies and Technology (CCST)",
    CEA: "College of Engineering and Architecture (CEA)",
    CBA: "College of Business and Accountancy (CBA)",
    COAS: "College of Arts and Sciences (COAS)",
    CAHS: "College of Allied Health Sciences (CAHS)",
    CTECH: "College of Technology (CTECH)"
};

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


/* =========================================
   STORAGE HELPERS
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
    return String(a || "").trim().toLowerCase() ===
           String(b || "").trim().toLowerCase();
}


/* =========================================
   NAME HELPERS
   Supports both separate name fields and
   older records saved as "Last, First, Middle".
========================================= */

function getNameParts(student) {
    let last = String(student.lastName || "").trim();
    let first = String(student.firstName || "").trim();
    let middle = String(student.middleName || "").trim();

    if (last || first || middle) {
        return { last, first, middle };
    }

    const oldName = String(student.name || "").trim();

    if (!oldName) {
        return { last: "", first: "", middle: "" };
    }

    const parts = oldName.split(",").map(part => part.trim());

    if (parts.length >= 2) {
        return {
            last: parts[0] || "",
            first: parts[1] || "",
            middle: parts.slice(2).join(", ").trim()
        };
    }

    // Fallback for older records saved as a plain full name.
    return {
        last: oldName,
        first: "",
        middle: ""
    };
}

function joinNameParts(last, first, middle) {
    return [last, first, middle]
        .map(part => String(part || "").trim())
        .filter(Boolean)
        .join(", ");
}


/* =========================================
   DATE HELPERS
========================================= */

function parseBirthday(value) {
    if (!value) return null;

    const text = String(value).trim();

    let year;
    let month;
    let day;

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
    if (!date) return String(value || "");

    return `${String(date.month).padStart(2, "0")}/` +
           `${String(date.day).padStart(2, "0")}/` +
           `${date.year}`;
}

function formatBirthdayForStorage(value) {
    const date = parseBirthday(value);
    if (!date) return String(value || "");

    return `${date.year}-` +
           `${String(date.month).padStart(2, "0")}-` +
           `${String(date.day).padStart(2, "0")}`;
}

function calculateAge(value) {
    const date = parseBirthday(value);
    if (!date) return "";

    const today = new Date();

    let age = today.getFullYear() - date.year;

    const birthdayHasNotPassed =
        today.getMonth() + 1 < date.month ||
        (
            today.getMonth() + 1 === date.month &&
            today.getDate() < date.day
        );

    if (birthdayHasNotPassed) {
        age--;
    }

    return age >= 0 ? age : "";
}


/* =========================================
   DROPDOWN HELPERS
========================================= */

function normalizeCollege(value) {
    const text = String(value || "").trim();

    if (colleges[text]) {
        return text;
    }

    const match = Object.entries(colleges).find(
        ([code, fullName]) =>
            fullName.toLowerCase() === text.toLowerCase() ||
            text.toLowerCase().includes(`(${code.toLowerCase()})`)
    );

    return match ? match[0] : "";
}

function fillDropdown(select, options, placeholder, selectedValue = "") {
    select.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = placeholder;
    select.appendChild(firstOption);

    options.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });

    const savedValue = String(selectedValue || "").trim();

    if (savedValue) {
        let option = Array.from(select.options).find(
            item => item.value === savedValue
        );

        // Keep older saved values visible even if no longer in the list.
        if (!option) {
            option = document.createElement("option");
            option.value = savedValue;
            option.textContent = savedValue;
            select.appendChild(option);
        }

        select.value = savedValue;
    } else {
        select.value = "";
    }
}

function updateCourseOptions(selectedCourse = "") {
    const collegeCode = normalizeCollege(collegeInput.value);
    const courses = coursesByCollege[collegeCode] || [];

    fillDropdown(
        courseInput,
        courses,
        "Select Course",
        selectedCourse
    );

    updateProgramOptions();
}

function updateProgramOptions(selectedProgram = "") {
    const course = courseInput.value;
    const programs = programsByCourse[course] || [];

    fillDropdown(
        programInput,
        programs,
        "Select Program / Major",
        selectedProgram
    );
}

collegeInput.addEventListener("change", function () {
    updateCourseOptions();
    updateProgramOptions();
});

courseInput.addEventListener("change", function () {
    updateProgramOptions();
});


/* =========================================
   EDITING MODE
========================================= */

function setEditing(editing) {
    const canEdit = profileMode !== "admin";

    lastNameInput.disabled = !editing || !canEdit;
    firstNameInput.disabled = !editing || !canEdit;
    middleNameInput.disabled = !editing || !canEdit;

    // These personal information fields remain locked.
    studentIDInput.disabled = true;
    genderInput.disabled = true;
    birthdayInput.disabled = true;
    ageInput.disabled = true;
    campusInput.disabled = true;

    collegeInput.disabled = !editing || !canEdit;
    courseInput.disabled = !editing || !canEdit;
    programInput.disabled = !editing || !canEdit;

    editButton.hidden = !canEdit || editing;
    saveButton.hidden = !canEdit || !editing;

    if (editing && canEdit && currentStudent) {
        updateCourseOptions(currentStudent.course || "");
        updateProgramOptions(currentStudent.program || "");

        // Re-enable the editable dropdowns after repopulating them.
        collegeInput.disabled = false;
        courseInput.disabled = false;
        programInput.disabled = false;
    }
}


/* =========================================
   LOAD STUDENT PROFILE
========================================= */

let currentStudent = null;

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

        if (profileMode === "admin") {
            window.location.href = "registered-students.html";
        } else {
            window.location.href = "student-login.html";
        }

        return;
    }

    const nameParts = getNameParts(currentStudent);

    lastNameInput.value = nameParts.last;
    firstNameInput.value = nameParts.first;
    middleNameInput.value = nameParts.middle;

    studentIDInput.value =
        currentStudent.studentID || currentStudent.id || "";

    genderInput.value = currentStudent.gender || "";

    birthdayInput.value =
        formatBirthdayForDisplay(currentStudent.birthday);

    ageInput.value =
        currentStudent.age ?? calculateAge(currentStudent.birthday);

    campusInput.value = currentStudent.campus || "Main Campus";

    const collegeCode = normalizeCollege(
        currentStudent.college || currentStudent.collegeCode
    );

    collegeInput.value = collegeCode;

    updateCourseOptions(currentStudent.course || "");
    updateProgramOptions(currentStudent.program || "");

    if (profileMode === "admin") {
        pageTitle.textContent = "Student Profile";

        // Admin can view student information but cannot edit or queue.
        buttonsContainer.hidden = true;
        setEditing(false);
    } else {
        pageTitle.textContent = "My Profile";

        buttonsContainer.hidden = false;
        editButton.hidden = false;
        queueButton.hidden = false;

        setEditing(false);
    }
}


/* =========================================
   EDIT PROFILE BUTTON
========================================= */

editButton.addEventListener("click", function () {
    if (profileMode !== "admin") {
        setEditing(true);
    }
});


/* =========================================
   SAVE PROFILE
========================================= */

profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (profileMode === "admin" || !currentStudent) {
        return;
    }

    const last = lastNameInput.value.trim();
    const first = firstNameInput.value.trim();
    const middle = middleNameInput.value.trim();

    if (!last || !first) {
        alert("Please enter your last name and first name.");
        return;
    }

    const college = collegeInput.value;
    const course = courseInput.value;
    const program = programInput.value;

    if (!college || !course || !program) {
        alert("Please select your college, course, and program/major.");
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

        // Save names separately for the profile and login system.
        lastName: last,
        firstName: first,
        middleName: middle,

        // Keep the old combined name field for pages that still use it.
        name: joinNameParts(last, first, middle),

        college: college,
        course: course,
        program: program
    };

    students[index] = updatedStudent;
    saveRegisteredStudents(students);

    currentStudent = updatedStudent;

    localStorage.setItem(
        "loggedInStudent",
        JSON.stringify(updatedStudent)
    );

    loadProfile();
    setEditing(false);

    if (savePopup) {
        savePopup.classList.add("show");
    }
});


/* =========================================
   CLOSE SAVE MESSAGE
========================================= */

if (closeSavePopup && savePopup) {
    closeSavePopup.addEventListener("click", function () {
        savePopup.classList.remove("show");
    });
}


/* =========================================
   QUEUE APPOINTMENT
========================================= */

function getLocalISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatQueueDate(dateISO) {
    const date = new Date(`${dateISO}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dateISO;
    }

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function getQueueList() {
    try {
        const queues = JSON.parse(
            localStorage.getItem("queueList") || "[]"
        );

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
    if (!currentStudent || profileMode === "admin") {
        return;
    }

    const queues = getQueueList();
    const todayISO = getLocalISODate(new Date());

    // Reuse an appointment that has not passed yet.
    const existing = queues.find(queue =>
        sameStudentID(queue.studentID, currentStudent.studentID) &&
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

    // Limit each date to 16 appointments.
    let attempts = 0;

    while (attempts < 365) {
        const countForDay = queues.filter(queue =>
            queue.appointmentDate === appointmentDate
        ).length;

        if (countForDay < 16) {
            break;
        }

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

    // Appointments start at 8:00 AM in 30-minute intervals.
    const totalMinutes = 8 * 60 + dayQueues.length * 30;
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;

    const appointmentTime =
        `${hour12}:${String(minute).padStart(2, "0")} ${period}`;

    const queue = {
        queueNumber,
        studentID: currentStudent.studentID,
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
