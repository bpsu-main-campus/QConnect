
/* =========================================
   QCONNECT STUDENT PROFILE
========================================= */

/*
   Admin profiles are opened using:
   student-profile.html?view=admin

   Students open their own profile normally.
*/

const urlParams = new URLSearchParams(window.location.search);

const profileMode =
    urlParams.get("view") === "admin"
        ? "admin"
        : (localStorage.getItem("profileMode") || "student");

const studentID =
    profileMode === "admin"
        ? localStorage.getItem("selectedStudentID")
        : localStorage.getItem("loggedInStudentID");


/* =========================================
   ELEMENTS
========================================= */

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
   PROGRAM / MAJOR OPTIONS
========================================= */

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
    localStorage.setItem(
        "registeredStudents",
        JSON.stringify(students)
    );
}


function sameStudentID(a, b) {
    return String(a || "").trim().toLowerCase() ===
           String(b || "").trim().toLowerCase();
}


/* =========================================
   NAME HELPERS

   Supports new records with separate fields
   and old records with a combined name.
========================================= */

function getNameParts(student) {
    const storedName = String(student.name || "");

    const parts = storedName
        .split(",")
        .map(part => part.trim());

    return {
        last: String(
            student.lastName ?? parts[0] ?? ""
        ).trim(),

        first: String(
            student.firstName ?? parts[1] ?? ""
        ).trim(),

        middle: String(
            student.middleName ?? parts.slice(2).join(", ") ?? ""
        ).trim()
    };
}


function joinNameParts(last, first, middle) {
    return [
        String(last || "").trim(),
        String(first || "").trim(),
        String(middle || "").trim()
    ]
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

    return (
        String(date.month).padStart(2, "0") + "/" +
        String(date.day).padStart(2, "0") + "/" +
        date.year
    );
}


function formatBirthdayForStorage(value) {
    const date = parseBirthday(value);

    if (!date) return String(value || "");

    return (
        date.year + "-" +
        String(date.month).padStart(2, "0") + "-" +
        String(date.day).padStart(2, "0")
    );
}


function calculateAge(value) {
    const date = parseBirthday(value);

    if (!date) return "";

    const today = new Date();

    let age = today.getFullYear() - date.year;

    const birthdayNotReached =
        today.getMonth() + 1 < date.month ||
        (
            today.getMonth() + 1 === date.month &&
            today.getDate() < date.day
        );

    if (birthdayNotReached) age--;

    return age >= 0 ? age : "";
}


/* =========================================
   PROGRAM DROPDOWN
========================================= */

function updateProgramOptions(selectedProgram = "") {
    if (!courseInput || !programInput) return;

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

    const savedProgram = String(selectedProgram || "").trim();

    if (savedProgram) {
        let matchingOption = Array.from(programInput.options).find(
            option => option.value.trim() === savedProgram
        );

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
   EDITING CONTROLS
========================================= */

function setEditing(editing) {
    /*
       Admins must never edit a student's profile.
    */

    if (profileMode === "admin") {
        editing = false;
    }

    if (lastNameInput) lastNameInput.disabled = !editing;
    if (firstNameInput) firstNameInput.disabled = !editing;
    if (middleNameInput) middleNameInput.disabled = !editing;

    // These details remain locked for students too.
    if (studentIDInput) studentIDInput.disabled = true;
    if (genderInput) genderInput.disabled = true;
    if (birthdayInput) birthdayInput.disabled = true;
    if (ageInput) ageInput.disabled = true;
    if (campusInput) campusInput.disabled = true;

    // College, course, and program are editable by the student.
    if (collegeInput) collegeInput.disabled = !editing;
    if (courseInput) courseInput.disabled = !editing;
    if (programInput) programInput.disabled = !editing;

    if (editing && courseInput && programInput) {
        updateProgramOptions(currentStudent?.program || "");
    }

    if (editButton) editButton.hidden = editing;
    if (saveButton) saveButton.hidden = !editing;
}


/* =========================================
   LOAD STUDENT PROFILE
========================================= */

let currentStudent = null;


function loadProfile() {
    const students = getRegisteredStudents();

    currentStudent = students.find(student =>
        sameStudentID(
            student.studentID || student.id,
            studentID
        )
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

    const nameParts = getNameParts(currentStudent);

    if (lastNameInput) lastNameInput.value = nameParts.last;
    if (firstNameInput) firstNameInput.value = nameParts.first;
    if (middleNameInput) middleNameInput.value = nameParts.middle;

    if (studentIDInput) {
        studentIDInput.value =
            currentStudent.studentID || currentStudent.id || "";
    }

    if (genderInput) {
        genderInput.value = currentStudent.gender || "";
    }

    if (birthdayInput) {
        birthdayInput.value =
            formatBirthdayForDisplay(currentStudent.birthday);
    }

    if (ageInput) {
        ageInput.value =
            currentStudent.age ?? calculateAge(currentStudent.birthday);
    }

    if (campusInput) {
        campusInput.value = currentStudent.campus || "Main Campus";
    }

    /*
       Restore the saved college if the HTML has a college field.
       This supports the new registration form.
    */

    if (collegeInput) {
        collegeInput.value = currentStudent.college || "";
    }

    if (courseInput) {
        courseInput.value = currentStudent.course || "";
    }

    if (programInput && courseInput) {
        updateProgramOptions(currentStudent.program || "");
    }

    if (profileMode === "admin") {
        // Admin can view the record but cannot edit or queue.
        if (pageTitle) pageTitle.textContent = "Student Profile";

        if (buttonsContainer) buttonsContainer.hidden = true;
        if (editButton) editButton.hidden = true;
        if (saveButton) saveButton.hidden = true;
        if (queueButton) queueButton.hidden = true;

        setEditing(false);
    } else {
        if (pageTitle) pageTitle.textContent = "My Profile";

        if (buttonsContainer) buttonsContainer.hidden = false;
        if (editButton) editButton.hidden = false;
        if (saveButton) saveButton.hidden = true;
        if (queueButton) queueButton.hidden = false;

        setEditing(false);
    }
}


/* =========================================
   EDIT PROFILE BUTTON
========================================= */

if (editButton) {
    editButton.addEventListener("click", () => {
        if (profileMode !== "admin" && currentStudent) {
            setEditing(true);
        }
    });
}


/* =========================================
   SAVE PROFILE
========================================= */

if (profileForm) {
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

        const college = collegeInput ? collegeInput.value : currentStudent.college || "";
        const course = courseInput ? courseInput.value : currentStudent.course || "";
        const program = programInput ? programInput.value : currentStudent.program || "";

        if (!course || !program) {
            alert("Please select both your course and program/major.");
            return;
        }

        const students = getRegisteredStudents();

        const index = students.findIndex(student =>
            sameStudentID(
                student.studentID || student.id,
                studentID
            )
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

            // Keep the combined field for older parts of QConnect.
            name: joinNameParts(last, first, middle),

            college,
            course,
            program
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
}


/* =========================================
   SAVE POPUP
========================================= */

if (closeSavePopup && savePopup) {
    closeSavePopup.addEventListener("click", () => {
        savePopup.classList.remove("show");
    });
}


/* =========================================
   QUEUE APPOINTMENT HELPERS
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
        console.error("Unable to read queue list:", error);
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


/* =========================================
   CREATE OR REUSE APPOINTMENT
========================================= */

function createAppointment() {
    if (!currentStudent) return;

    const queues = getQueueList();
    const todayISO = getLocalISODate(new Date());

    // Reuse an appointment that has not passed.
    const existing = queues.find(queue =>
        sameStudentID(queue.studentID, currentStudent.studentID) &&
        queue.appointmentDate &&
        queue.appointmentDate >= todayISO
    );

    if (existing) {
        localStorage.setItem(
            "currentQueue",
            JSON.stringify(existing)
        );

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

    const queueNumber =
        `Q${String(dayQueues.length + 1).padStart(3, "0")}`;

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
        studentID: currentStudent.studentID,
        name: joinNameParts(
            currentStudent.lastName || getNameParts(currentStudent).last,
            currentStudent.firstName || getNameParts(currentStudent).first,
            currentStudent.middleName || getNameParts(currentStudent).middle
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


/* =========================================
   GET QUEUE BUTTON
========================================= */

if (queueButton) {
    queueButton.addEventListener("click", () => {
        if (profileMode !== "admin" && currentStudent) {
            createAppointment();
        }
    });
}


/* =========================================
   INITIALIZE PROFILE
========================================= */

loadProfile();
