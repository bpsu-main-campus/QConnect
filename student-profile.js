
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
   COURSE AND PROGRAM CHOICES
   Keep these choices consistent with registration.
========================================= */

const programsByCourse = {
    "Midwifery": ["Midwifery"],
    "Nursing": ["Nursing"],
    "Public Health": ["Population Health"],
    "Radiologic Technology": ["Radiologic Technology"],
    "BA Communication": [
        "Creative and Performing Arts",
        "New Media Track"
    ],
    "Hospitality Management": ["Hospitality Management"],
    "Tourism Management": ["Tourism Management"],
    "Architecture": ["Architecture"],
    "Civil Engineering": ["Civil Engineering"],
    "Computer Engineering": ["Computer Engineering"],
    "Electrical Engineering": ["Electrical Engineering"],
    "Electronics Engineering": ["Electronics Engineering"],
    "Industrial Engineering": ["Industrial Engineering"],
    "Mechanical Engineering": ["Mechanical Engineering"],
    "Computer Science": ["Computer Science"],
    "Data Science": ["Data Science"],
    "Entertainment and Multimedia Computing": [
        "Game Development",
        "Digital Animation Technology"
    ],
    "Information Technology": ["Information Technology"],
    "Industrial Technology": [
        "Automotive Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Food Technology",
        "Garments Technology",
        "Mechanical Technology"
    ],
    "Bachelor of Technical-Vocational Teacher Education": [
        "Automotive Technology",
        "Electrical Technology",
        "Electronics Technology",
        "Food and Service Management",
        "Garments, Fashion and Design",
        "Mechanical Technology"
    ]
};

/* =========================================
   SAFE STORAGE HELPERS
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

   Registration saves names as:
   Last, First, Middle
========================================= */

function splitStoredName(name) {
    const parts = String(name || "").split(",").map(part => part.trim());

    return {
        last: parts[0] || "",
        first: parts[1] || "",
        middle: parts.slice(2).join(", ").trim()
    };
}

function joinNameParts(last, first, middle) {
    const cleanLast = String(last || "").trim();
    const cleanFirst = String(first || "").trim();
    const cleanMiddle = String(middle || "").trim();

    if (cleanMiddle) {
        return `${cleanLast}, ${cleanFirst}, ${cleanMiddle}`;
    }

    return `${cleanLast}, ${cleanFirst}`;
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

    const month = String(date.month).padStart(2, "0");
    const day = String(date.day).padStart(2, "0");
    const year = String(date.year);

    return `${month}/${day}/${year}`;
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
        (today.getMonth() + 1 === date.month && today.getDate() < date.day);

    if (birthdayHasNotPassed) age--;

    return age >= 0 ? age : "";
}

/* =========================================
   PROGRAM DROPDOWN
========================================= */

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

    // Restore the program saved during registration.
    const savedProgram = String(selectedProgram || "").trim();

    if (savedProgram) {
        let matchingOption = Array.from(programInput.options).find(
            option => option.value.trim() === savedProgram
        );

        // Preserve a saved program even if it isn't in the current choices.
        if (!matchingOption) {
            matchingOption = document.createElement("option");
            matchingOption.value = savedProgram;
            matchingOption.textContent = savedProgram;
            programInput.appendChild(matchingOption);
        }

        programInput.value = savedProgram;
    }

    programInput.disabled = courseInput.disabled;
}


/* =========================================
   LOAD STUDENT PROFILE
========================================= */

let currentStudent = null;

function loadProfile() {
    const students = getRegisteredStudents();

    currentStudent = students.find(student =>
        sameStudentID(student.studentID, studentID)
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
            window.location.href = "Registered-students.html";
        }

        return;
    }

    const nameParts = splitStoredName(currentStudent.name);

    lastNameInput.value = nameParts.last;
    firstNameInput.value = nameParts.first;
    middleNameInput.value = nameParts.middle;

    studentIDInput.value = currentStudent.studentID || "";
    genderInput.value = currentStudent.gender || "";

    birthdayInput.value = formatBirthdayForDisplay(currentStudent.birthday);
    ageInput.value = currentStudent.age ?? calculateAge(currentStudent.birthday);
    campusInput.value = currentStudent.campus || "Main Campus";

    courseInput.value = currentStudent.course || "";
    updateProgramOptions(currentStudent.program || "");

    /* Admin can view, but not edit, student information. */
    if (profileMode === "admin") {
        pageTitle.textContent = "Student Profile";
        buttonsContainer.hidden = true;
        setEditing(false);
    } else {
        pageTitle.textContent = "My Profile";
        buttonsContainer.hidden = false;
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

    /* These fields remain locked. */
    studentIDInput.disabled = true;
    genderInput.disabled = true;
    birthdayInput.disabled = true;
    ageInput.disabled = true;
    campusInput.disabled = true;

    courseInput.disabled = !editing;
    programInput.disabled = !editing;

    if (editing) {
        updateProgramOptions(currentStudent?.program || "");
    }

    editButton.hidden = editing;
    saveButton.hidden = !editing;
}

editButton.addEventListener("click", () => {
    if (profileMode !== "admin") {
        setEditing(true);
    }
});

/* =========================================
   SAVE PROFILE
========================================= */

profileForm.addEventListener("submit", event => {
    event.preventDefault();

    if (profileMode === "admin" || !currentStudent) return;

    const last = lastNameInput.value.trim();
    const first = firstNameInput.value.trim();
    const middle = middleNameInput.value.trim();

    if (!last || !first) {
        alert("Please enter your last name and first name.");
        return;
    }

    const course = courseInput.value;
    const program = programInput.value;

    if (!course || !program) {
        alert("Please select both your course and program/major.");
        return;
    }

    const students = getRegisteredStudents();
    const index = students.findIndex(student =>
        sameStudentID(student.studentID, studentID)
    );

    if (index === -1) {
        alert("Student record not found. Your changes were not saved.");
        return;
    }

    const updatedStudent = {
        ...students[index],
        name: joinNameParts(last, first, middle),
        course,
        program
    };

    students[index] = updatedStudent;
    saveRegisteredStudents(students);

    currentStudent = updatedStudent;
    localStorage.setItem("loggedInStudent", JSON.stringify(updatedStudent));

    loadProfile();
    setEditing(false);

    if (savePopup) savePopup.classList.add("show");
});

if (closeSavePopup) {
    closeSavePopup.addEventListener("click", () => {
        savePopup.classList.remove("show");
    });
}

/* =========================================
   QUEUE APPOINTMENT

   Reuse an existing future queue for this student.
   Otherwise create a new appointment for the next
   available weekday, with 30-minute time slots.
========================================= */

function getLocalISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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
    } catch {
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
    const queues = getQueueList();
    const todayISO = getLocalISODate(new Date());

    /* Reuse this student's existing appointment if it has not passed. */
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

    /* Find a date with fewer than 16 appointments. */
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

    /* Appointments begin at 8:00 AM, with 30-minute slots. */
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
        name: currentStudent.name,
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
   INITIALIZE
========================================= */

if (profileMode === "admin") {
    queueButton.hidden = true;
    editButton.hidden = true;
    saveButton.hidden = true;
}

loadProfile();
