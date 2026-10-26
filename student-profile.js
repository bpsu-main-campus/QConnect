
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
   COLLEGE AND COURSE CHOICES
   Keep these consistent with registration.
========================================= */

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

const collegeNames = {
    CCST: "College of Computer Studies and Technology (CCST)",
    CEA: "College of Engineering and Architecture (CEA)",
    CBA: "College of Business and Accountancy (CBA)",
    COAS: "College of Arts and Sciences (COAS)",
    CAHS: "College of Allied Health Sciences (CAHS)",
    CTECH: "College of Technology (CTECH)"
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
        console.error("Unable to read registered students:", error);
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
   Supports both:
   1. Separate lastName/firstName/middleName
   2. Older name: "Last, First, Middle"
========================================= */

function splitStoredName(name) {
    const parts = String(name || "").split(",").map(part => part.trim());

    return {
        last: parts[0] || "",
        first: parts[1] || "",
        middle: parts.slice(2).join(", ").trim()
    };
}

function getStudentNames(student) {
    const oldName = splitStoredName(student.name);

    return {
        last: String(student.lastName ?? oldName.last).trim(),
        first: String(student.firstName ?? oldName.first).trim(),
        middle: String(student.middleName ?? oldName.middle).trim()
    };
}

function joinNameParts(last, first, middle) {
    return [last, first, middle]
        .map(value => String(value || "").trim())
        .filter((value, index) => index < 2 || value !== "")
        .join(", ");
}


/* =========================================
   COLLEGE HELPERS
========================================= */

function normalizeCollege(value) {
    const text = String(value || "").trim();

    if (collegeNames[text]) {
        return text;
    }

    const match = Object.entries(collegeNames).find(([code, name]) =>
        text.toLowerCase() === name.toLowerCase() ||
        text.toLowerCase().includes(`(${code.toLowerCase()})`)
    );

    if (match) {
        return match[0];
    }

    return "";
}

function findCollegeForCourse(course) {
    for (const [college, courses] of Object.entries(coursesByCollege)) {
        if (courses.includes(course)) {
            return college;
        }
    }

    return "";
}

function updateCourseOptions(selectedCourse = "") {
    const college = collegeInput.value;
    const courses = coursesByCollege[college] || [];

    courseInput.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select Course";
    courseInput.appendChild(placeholder);

    courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseInput.appendChild(option);
    });

    // Keep an older saved course visible even if it is not in the current list.
    if (selectedCourse && !courses.includes(selectedCourse)) {
        const option = document.createElement("option");
        option.value = selectedCourse;
        option.textContent = selectedCourse;
        courseInput.appendChild(option);
    }

    courseInput.value = selectedCourse || "";
    updateProgramOptions();
}

function updateProgramOptions(selectedProgram = "") {
    const course = courseInput.value;
    const programs = programsByCourse[course] || [];

    programInput.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select Program / Major";
    programInput.appendChild(placeholder);

    programs.forEach(program => {
        const option = document.createElement("option");
        option.value = program;
        option.textContent = program;
        programInput.appendChild(option);
    });

    // Preserve a saved program if it isn't in the current choices.
    if (selectedProgram && !programs.includes(selectedProgram)) {
        const option = document.createElement("option");
        option.value = selectedProgram;
        option.textContent = selectedProgram;
        programInput.appendChild(option);
    }

    programInput.value = selectedProgram || "";
}


/* =========================================
   DATE HELPERS
   Stored format: YYYY-MM-DD
   Display format: MM/DD/YYYY
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

    return `${String(date.month).padStart(2, "0")}/${String(date.day).padStart(2, "0")}/${date.year}`;
}

function formatBirthdayForStorage(value) {
    const date = parseBirthday(value);
    if (!date) return String(value || "");

    return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
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

        if (profileMode !== "admin") {
            window.location.href = "student-login.html";
        } else {
            window.location.href = "registered-students.html";
        }

        return;
    }

    const names = getStudentNames(currentStudent);

    lastNameInput.value = names.last;
    firstNameInput.value = names.first;
    middleNameInput.value = names.middle;

    studentIDInput.value =
        currentStudent.studentID || currentStudent.id || "";

    genderInput.value = currentStudent.gender || "";

    birthdayInput.value =
        formatBirthdayForDisplay(currentStudent.birthday);

    ageInput.value =
        currentStudent.age ?? calculateAge(currentStudent.birthday);

    campusInput.value = currentStudent.campus || "Main Campus";

    // Use the saved college, or infer it from the course for older records.
    const savedCourse = currentStudent.course || "";
    const college =
        normalizeCollege(currentStudent.college) ||
        findCollegeForCourse(savedCourse);

    collegeInput.value = college;

    updateCourseOptions(savedCourse);
    updateProgramOptions(currentStudent.program || "");

    if (profileMode === "admin") {
        pageTitle.textContent = "Student Profile";
        buttonsContainer.hidden = true;
        setEditing(false);
    } else {
        pageTitle.textContent = "My Profile";
        buttonsContainer.hidden = false;
        editButton.hidden = false;
        saveButton.hidden = true;
        queueButton.hidden = false;
        setEditing(false);
    }
}


/* =========================================
   EDIT MODE
========================================= */

function setEditing(editing) {
    lastNameInput.disabled = !editing;
    firstNameInput.disabled = !editing;
    middleNameInput.disabled = !editing;

    // These personal information fields stay locked.
    studentIDInput.disabled = true;
    genderInput.disabled = true;
    birthdayInput.disabled = true;
    ageInput.disabled = true;
    campusInput.disabled = true;

    collegeInput.disabled = !editing;
    courseInput.disabled = !editing;
    programInput.disabled = !editing;

    editButton.hidden = editing;
    saveButton.hidden = !editing;
}

if (collegeInput) {
    collegeInput.addEventListener("change", () => {
        updateCourseOptions("");
    });
}

if (courseInput) {
    courseInput.addEventListener("change", () => {
        updateProgramOptions("");
    });
}

if (editButton) {
    editButton.addEventListener("click", () => {
        if (profileMode === "student" && currentStudent) {
            setEditing(true);
        }
    });
}


/* =========================================
   SAVE PROFILE
========================================= */

profileForm.addEventListener("submit", event => {
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

        // Save separate fields so the profile and other pages can use them.
        lastName: last,
        firstName: first,
        middleName: middle,

        // Keep the combined name too for older pages that still use it.
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

if (closeSavePopup && savePopup) {
    closeSavePopup.addEventListener("click", () => {
        savePopup.classList.remove("show");
    });
}


/* =========================================
   QUEUE APPOINTMENT
   Reuse an existing future appointment.
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
    if (!currentStudent) return;

    const queues = getQueueList();
    const todayISO = getLocalISODate(new Date());

    // Reuse an existing appointment that has not passed.
    const existing = queues.find(queue =>
        sameStudentID(queue.studentID, currentStudent.studentID || currentStudent.id) &&
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

    // Limit each day to 16 appointments.
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

    // Appointments begin at 8:00 AM, with 30-minute slots.
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
            getStudentNames(currentStudent).last,
            getStudentNames(currentStudent).first,
            getStudentNames(currentStudent).middle
        ),
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
    queueButton.addEventListener("click", () => {
        if (profileMode !== "admin" && currentStudent) {
            createAppointment();
        }
    });
}


/* =========================================
   START
========================================= */

loadProfile();
