
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
   COLLEGES, COURSES, AND MAJORS
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

/*
 * A course with one major automatically uses that major.
 * A course with several majors lets the student choose.
 *
 * Course abbreviations and mappings below are proposed display
 * labels. Confirm official abbreviations with your instructor.
 */

const majorsByCourse = {
    "Bachelor of Science in Computer Science": [
        {
            code: "BSCS",
            name: "Bachelor of Science in Computer Science"
        }
    ],

    "Bachelor of Science in Data Science": [
        {
            code: "BSDS",
            name: "Bachelor of Science in Data Science"
        }
    ],

    "Bachelor of Science in Information Technology": [
        {
            code: "BSIT",
            name: "Bachelor of Science in Information Technology"
        }
    ],

    "Bachelor of Science in Entertainment and Multimedia Computing": [
        {
            code: "GD",
            name: "Game Development"
        },
        {
            code: "DAT",
            name: "Digital Animation Technology"
        }
    ],

    "Bachelor of Science in Architecture": [
        {
            code: "BS ARCH",
            name: "Bachelor of Science in Architecture"
        }
    ],

    "Bachelor of Science in Civil Engineering": [
        {
            code: "BSCE",
            name: "Bachelor of Science in Civil Engineering"
        }
    ],

    "Bachelor of Science in Computer Engineering": [
        {
            code: "BSCpE",
            name: "Bachelor of Science in Computer Engineering"
        }
    ],

    "Bachelor of Science in Electrical Engineering": [
        {
            code: "BSEE",
            name: "Bachelor of Science in Electrical Engineering"
        }
    ],

    "Bachelor of Science in Electronics Engineering": [
        {
            code: "BSECE",
            name: "Bachelor of Science in Electronics Engineering"
        }
    ],

    "Bachelor of Science in Industrial Engineering": [
        {
            code: "BSIE",
            name: "Bachelor of Science in Industrial Engineering"
        }
    ],

    "Bachelor of Science in Mechanical Engineering": [
        {
            code: "BSME",
            name: "Bachelor of Science in Mechanical Engineering"
        }
    ],

    "Bachelor of Science in Hospitality Management": [
        {
            code: "BSHM",
            name: "Bachelor of Science in Hospitality Management"
        }
    ],

    "Bachelor of Science in Tourism Management": [
        {
            code: "BSTM",
            name: "Bachelor of Science in Tourism Management"
        }
    ],

    "Bachelor of Arts in Communication": [
        {
            code: "CAP",
            name: "Creative and Performing Arts"
        },
        {
            code: "NMT",
            name: "New Media Track"
        }
    ],

    "Bachelor of Science in Midwifery": [
        {
            code: "BSM",
            name: "Bachelor of Science in Midwifery"
        }
    ],

    "Bachelor of Science in Nursing": [
        {
            code: "BSN",
            name: "Bachelor of Science in Nursing"
        }
    ],

    "Bachelor of Science in Public Health": [
        {
            code: "PH",
            name: "Population Health"
        }
    ],

    "Bachelor of Science in Radiologic Technology": [
        {
            code: "BSRT",
            name: "Bachelor of Science in Radiologic Technology"
        }
    ],

    "Bachelor of Science in Industrial Technology": [
        {
            code: "AFT",
            name: "Apparel and Fashion Technology"
        },
        {
            code: "ADT",
            name: "Architectural Drafting Technology"
        },
        {
            code: "AT",
            name: "Automotive Technology"
        },
        {
            code: "CT",
            name: "Culinary Technology"
        },
        {
            code: "ET",
            name: "Electrical Technology"
        },
        {
            code: "ELT",
            name: "Electronics Technology"
        },
        {
            code: "FST",
            name: "Food and Service Technology"
        },
        {
            code: "HVACT",
            name: "Heating, Ventilating and Air Conditioning Technology"
        },
        {
            code: "MT",
            name: "Mechanical Technology"
        },
        {
            code: "WFT",
            name: "Welding and Fabrication Technology"
        }
    ],

    "Bachelor of Technical-Vocational Teacher Education": [
        {
            code: "ANIM",
            name: "Animation"
        },
        {
            code: "CCT",
            name: "Civil and Construction Technology"
        },
        {
            code: "DT",
            name: "Drafting Technology"
        },
        {
            code: "ET",
            name: "Electrical Technology"
        },
        {
            code: "ELT",
            name: "Electronics Technology"
        },
        {
            code: "FSM",
            name: "Food and Service Management"
        },
        {
            code: "GFD",
            name: "Garments, Fashion and Design"
        },
        {
            code: "HVACT",
            name: "Heating, Ventilating and Air Conditioning Technology"
        },
        {
            code: "HRS",
            name: "Hotel and Restaurant Services"
        },
        {
            code: "MT",
            name: "Mechanical Technology"
        },
        {
            code: "WFT",
            name: "Welding and Fabrication Technology"
        }
    ]
};


/* =========================================
   DROPDOWN HELPERS
========================================= */

function normalizeCollege(value) {
    const text = String(value || "").trim();

    if (colleges[text]) return text;

    const match = Object.entries(colleges).find(
        ([code, name]) =>
            text.toLowerCase() ===
                `${code} - ${name}`.toLowerCase() ||
            text.toLowerCase() ===
                `${name} (${code})`.toLowerCase() ||
            text.toLowerCase() === name.toLowerCase()
    );

    return match ? match[0] : "";
}

function getCourseName(course) {
    if (!course) return "";

    if (typeof course === "object") {
        return course.name;
    }

    const allCourses = Object.values(coursesByCollege).flat();

    const match = allCourses.find(item =>
        item.name.toLowerCase() === String(course).toLowerCase() ||
        `${item.code} - ${item.name}`.toLowerCase() ===
            String(course).toLowerCase() ||
        item.code.toLowerCase() === String(course).toLowerCase()
    );

    return match ? match.name : String(course).trim();
}

function getMajorName(major, courseName) {
    if (!major) return "";

    if (typeof major === "object") {
        return major.name;
    }

    const majors = majorsByCourse[courseName] || [];
    const text = String(major).trim();

    const match = majors.find(item =>
        item.name.toLowerCase() === text.toLowerCase() ||
        `${item.code} - ${item.name}`.toLowerCase() ===
            text.toLowerCase() ||
        item.code.toLowerCase() === text.toLowerCase()
    );

    return match ? match.name : text;
}

function fillDropdown(select, options, placeholder, selectedValue = "") {
    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.appendChild(first);

    options.forEach(item => {
        const option = document.createElement("option");

        if (typeof item === "string") {
            option.value = item;
            option.textContent = item;
        } else {
            option.value = item.name;
            option.textContent = `${item.code} - ${item.name}`;
        }

        select.appendChild(option);
    });

    const selected = String(selectedValue || "").trim();

    if (selected) {
        let option = Array.from(select.options).find(
            item => item.value.toLowerCase() === selected.toLowerCase()
        );

        if (!option) {
            option = document.createElement("option");
            option.value = selected;
            option.textContent = selected;
            select.appendChild(option);
        }

        select.value = option.value;
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
        getCourseName(selectedCourse)
    );

    updateProgramOptions();
}

function updateProgramOptions(selectedProgram = "") {
    const courseName = getCourseName(courseInput.value);
    const majors = majorsByCourse[courseName] || [];

    programInput.innerHTML = "";

    if (majors.length === 1) {
        // One available choice: show it automatically, no N/A.
        const major = majors[0];
        const option = document.createElement("option");

        option.value = major.name;
        option.textContent = `${major.code} - ${major.name}`;
        option.selected = true;

        programInput.appendChild(option);
        programInput.value = major.name;
        return;
    }

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

    const selected = getMajorName(selectedProgram, courseName);

    if (selected && majors.some(major => major.name === selected)) {
        programInput.value = selected;
    } else {
        programInput.value = "";
    }

    // Preserve old saved values if the mapping has changed.
    if (selected && !majors.some(major => major.name === selected)) {
        const option = document.createElement("option");
        option.value = selected;
        option.textContent = selected;
        programInput.appendChild(option);
        programInput.value = selected;
    }
}

collegeInput.addEventListener("change", function () {
    updateCourseOptions();
});

courseInput.addEventListener("change", function () {
    updateProgramOptions();
});


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

    return { last: oldName, first: "", middle: "" };
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
    if (!date) return String(value || "");

    return `${String(date.month).padStart(2, "0")}/` +
        `${String(date.day).padStart(2, "0")}/${date.year}`;
}

function formatBirthdayForStorage(value) {
    const date = parseBirthday(value);
    if (!date) return String(value || "");

    return `${date.year}-${String(date.month).padStart(2, "0")}-` +
        `${String(date.day).padStart(2, "0")}`;
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

    lastNameInput.disabled = !editing || !canEdit;
    firstNameInput.disabled = !editing || !canEdit;
    middleNameInput.disabled = !editing || !canEdit;

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

        collegeInput.disabled = false;
        courseInput.disabled = false;
        programInput.disabled = false;
    }
}


/* =========================================
   LOAD STUDENT PROFILE
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

        window.location.href = profileMode === "admin"
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
        buttonsContainer.hidden = true;
        setEditing(false);
    } else {
        pageTitle.textContent = "My Profile";
        buttonsContainer.hidden = false;
        queueButton.hidden = false;
        setEditing(false);
    }
}

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

    if (profileMode === "admin" || !currentStudent) return;

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
    closeSavePopup.addEventListener("click", function () {
        savePopup.classList.remove("show");
    });
}


/* =========================================
   QUEUE APPOINTMENT
========================================= */

function getLocalISODate(date) {
    return `${date.getFullYear()}-` +
        `${String(date.getMonth() + 1).padStart(2, "0")}-` +
        `${String(date.getDate()).padStart(2, "0")}`;
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
    if (!currentStudent || profileMode === "admin") return;

    const queues = getQueueList();
    const todayISO = getLocalISODate(new Date());

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
