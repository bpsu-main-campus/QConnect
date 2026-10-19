
/* =========================================
   STUDENT PROFILE
========================================= */

const profileMode = localStorage.getItem("profileMode") || "student";

/* =========================================
   GET STUDENT ID
========================================= */

let studentID = null;

if (profileMode === "student") {
    studentID = localStorage.getItem("loggedInStudentID");
}

if (profileMode === "admin") {
    studentID = localStorage.getItem("selectedStudentID");
}

/* =========================================
   GET REGISTERED STUDENTS
========================================= */

const students = JSON.parse(
    localStorage.getItem("registeredStudents") || "[]"
);

/* =========================================
   FIND STUDENT
========================================= */

const student = students.find(function (item) {
    return String(item.studentID || "").trim().toLowerCase() ===
        String(studentID || "").trim().toLowerCase();
});

/* =========================================
   FORMAT NAME FOR MY PROFILE

   Registration format:
   Last, First Middle

   Profile display:
   Last, First M.
========================================= */

function formatProfileName(name) {
    if (!name) return "";

    const parts = String(name).split(",");
    const lastName = (parts[0] || "").trim();

    if (parts.length < 2) {
        return String(name).trim();
    }

    const firstAndMiddle = parts
        .slice(1)
        .join(",")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (firstAndMiddle.length === 0) {
        return lastName;
    }

    const firstName = firstAndMiddle[0];
    const middleName = firstAndMiddle.slice(1).join(" ");

    if (!middleName) {
        return `${lastName}, ${firstName}`;
    }

    // Use the first letter of the middle name.
    const middleInitial = middleName
        .replace(/\./g, "")
        .charAt(0)
        .toUpperCase();

    return `${lastName}, ${firstName} ${middleInitial}.`;
}

/* =========================================
   PARSE BIRTHDAY

   Supports YYYY-MM-DD and MM-DD-YYYY.
========================================= */

function parseBirthday(birthday) {
    if (!birthday) return null;

    const value = String(birthday).trim();
    let year;
    let month;
    let day;

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const parts = value.split("-");
        year = Number(parts[0]);
        month = Number(parts[1]);
        day = Number(parts[2]);
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
        const parts = value.split("-");
        month = Number(parts[0]);
        day = Number(parts[1]);
        year = Number(parts[2]);
    } else {
        return null;
    }

    const date = new Date(year, month - 1, day);

    // Reject invalid dates.
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

/* =========================================
   FORMAT BIRTHDAY FOR DISPLAY
========================================= */

function formatBirthday(birthday) {
    const date = parseBirthday(birthday);

    if (!date) return birthday || "";

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
}

/* =========================================
   CALCULATE AGE FROM BIRTHDAY
========================================= */

function calculateAge(birthday) {
    const birthDate = parseBirthday(birthday);

    if (!birthDate) return "";

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const birthdayNotReached =
        today.getMonth() < birthDate.getMonth() ||
        (
            today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate()
        );

    if (birthdayNotReached) {
        age--;
    }

    return age >= 0 ? age : "";
}

/* =========================================
   PROFILE FIELD ELEMENTS
========================================= */

const profileName = document.getElementById("profileName");
const profileStudentID = document.getElementById("profileStudentID");
const profileGender = document.getElementById("profileGender");
const profileBirthday = document.getElementById("profileBirthday");
const profileAge = document.getElementById("profileAge");
const profileCampus = document.getElementById("profileCampus");
const profileCourse = document.getElementById("profileCourse");
const profileProgram = document.getElementById("profileProgram");

const profileBox = document.getElementById("profileBox");
const editButton = document.getElementById("editProfileButton");
const saveButton = document.getElementById("saveProfileButton");
const queueButton = document.getElementById("queueButton");

/* =========================================
   IF STUDENT CANNOT BE FOUND
========================================= */

if (!student) {
    alert("Student information could not be found.");
} else {

    /* =====================================
       DISPLAY PROFILE INFORMATION
    ===================================== */

    profileName.value = formatProfileName(student.name);
    profileStudentID.value = student.studentID || "";
    profileGender.value = student.gender || "";
    profileBirthday.value = formatBirthday(student.birthday);
    profileAge.value = calculateAge(student.birthday);
    profileCampus.value = student.campus || "";
    profileCourse.value = student.course || "";
    profileProgram.value = student.program || "";

    /* =====================================
       ADMIN MODE
    ===================================== */

    if (profileMode === "admin") {
        const title = document.querySelector(".profile-page-title");
        const buttons = document.querySelector(".profile-buttons");

        if (title) title.style.display = "none";
        if (buttons) buttons.style.display = "none";
    }

    /* =====================================
       STUDENT MODE
    ===================================== */

    if (profileMode === "student") {

        /*
         * These fields must NEVER become editable:
         * Student ID, Gender, Birthday, and Age.
         *
         * Age is calculated from the saved birthday.
         */

        const lockedFieldIDs = [
            "profileStudentID",
            "profileGender",
            "profileBirthday",
            "profileAge"
        ];

        function lockProtectedFields() {
            lockedFieldIDs.forEach(function (id) {
                const field = document.getElementById(id);

                if (field) {
                    field.disabled = true;
                    field.readOnly = true;
                }
            });
        }

        lockProtectedFields();

        /* =================================
           EDIT PROFILE
        ================================= */

        if (editButton) {
            editButton.addEventListener("click", function () {

                const inputs = document.querySelectorAll(
                    ".profile-field input"
                );

                inputs.forEach(function (input) {
                    if (!lockedFieldIDs.includes(input.id)) {
                        input.disabled = false;
                    }
                });

                lockProtectedFields();

                if (profileBox) {
                    profileBox.classList.add("editing");
                }

                if (saveButton) {
                    saveButton.classList.add("enabled");
                }
            });
        }

        /* =================================
           SAVE PROFILE
        ================================= */

        if (saveButton) {
            saveButton.addEventListener("click", function () {

                if (!saveButton.classList.contains("enabled")) {
                    return;
                }

                /*
                 * Do not change the saved full name just because
                 * the profile displays a middle initial.
                 *
                 * Only save the name if the user actually changed
                 * the displayed name.
                 */

                const originalDisplayName =
                    formatProfileName(student.name);

                const editedDisplayName =
                    profileName.value.trim();

                if (editedDisplayName !== originalDisplayName) {
                    student.name = editedDisplayName;
                }

                // Save only fields that can be edited.
                student.campus = profileCampus.value.trim();
                student.course = profileCourse.value.trim();
                student.program = profileProgram.value.trim();

                // Do not save changes to gender, birthday, age, or ID.
                const index = students.findIndex(function (item) {
                    return String(item.studentID).trim().toLowerCase() ===
                        String(student.studentID).trim().toLowerCase();
                });

                if (index !== -1) {
                    students[index] = student;

                    localStorage.setItem(
                        "registeredStudents",
                        JSON.stringify(students)
                    );

                    localStorage.setItem(
                        "loggedInStudent",
                        JSON.stringify(student)
                    );
                }

                // Refresh the displayed values.
                profileName.value = formatProfileName(student.name);
                profileStudentID.value = student.studentID || "";
                profileGender.value = student.gender || "";
                profileBirthday.value = formatBirthday(student.birthday);
                profileAge.value = calculateAge(student.birthday);
                profileCampus.value = student.campus || "";
                profileCourse.value = student.course || "";
                profileProgram.value = student.program || "";

                // Lock all fields again.
                document.querySelectorAll(".profile-field input").forEach(
                    function (input) {
                        input.disabled = true;
                    }
                );

                lockProtectedFields();

                if (profileBox) {
                    profileBox.classList.remove("editing");
                }

                saveButton.classList.remove("enabled");

                const popup = document.getElementById("savePopup");

                if (popup) {
                    popup.classList.add("active");
                }
            });
        }

        /* =================================
           CLOSE SAVE POPUP
        ================================= */

        const closePopup = document.getElementById("closeSavePopup");

        if (closePopup) {
            closePopup.addEventListener("click", function () {
                const popup = document.getElementById("savePopup");

                if (popup) {
                    popup.classList.remove("active");
                }
            });
        }

        /* =================================
           GET QUEUE NUMBER
           KEEP EXISTING QUEUE BEHAVIOR
        ================================= */

        if (queueButton) {
            queueButton.addEventListener("click", function () {

                let queues = JSON.parse(
                    localStorage.getItem("queueList") || "[]"
                );

                // If this student already has a queue, reuse it.
                const existingQueue = queues.find(function (q) {
                    return String(q.studentID) ===
                        String(student.studentID);
                });

                if (existingQueue) {
                    localStorage.setItem(
                        "currentQueue",
                        JSON.stringify(existingQueue)
                    );

                    window.location.href = "student-queue.html";
                    return;
                }

                const today = new Date();
                let appointmentDate = new Date(today);

                // Start with tomorrow.
                appointmentDate.setDate(
                    appointmentDate.getDate() + 1
                );

                // Skip weekends.
                while (
                    appointmentDate.getDay() === 0 ||
                    appointmentDate.getDay() === 6
                ) {
                    appointmentDate.setDate(
                        appointmentDate.getDate() + 1
                    );
                }

                let assigned = false;
                let queueData = null;

                while (!assigned) {

                    const year = appointmentDate.getFullYear();

                    const month = String(
                        appointmentDate.getMonth() + 1
                    ).padStart(2, "0");

                    const day = String(
                        appointmentDate.getDate()
                    ).padStart(2, "0");

                    const appointmentDateISO =
                        `${year}-${month}-${day}`;

                    const dateQueues = queues.filter(function (q) {
                        return q.appointmentDate === appointmentDateISO;
                    });

                    const maxStudentsPerDay = 16;

                    if (dateQueues.length < maxStudentsPerDay) {

                        const slotNumber = dateQueues.length;
                        const totalMinutes = (8 * 60) + (slotNumber * 30);

                        const hour = Math.floor(totalMinutes / 60);
                        const minute = totalMinutes % 60;

                        let displayHour = hour;
                        let ampm = "AM";

                        if (displayHour >= 12) {
                            ampm = "PM";
                        }

                        if (displayHour > 12) {
                            displayHour -= 12;
                        }

                        if (displayHour === 0) {
                            displayHour = 12;
                        }

                        const formattedTime =
                            displayHour + ":" +
                            String(minute).padStart(2, "0") +
                            " " + ampm;

                        const formattedDate =
                            appointmentDate.toLocaleDateString(
                                "en-US",
                                {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric"
                                }
                            );

                        const queueNumber =
                            "Q" + String(slotNumber + 1).padStart(3, "0");

                        queueData = {
                            queueNumber: queueNumber,
                            name: student.name,
                            studentID: student.studentID,
                            appointmentDate: appointmentDateISO,
                            formattedDate: formattedDate,
                            appointmentTime: formattedTime,
                            status: "Waiting"
                        };

                        queues.push(queueData);

                        localStorage.setItem(
                            "queueList",
                            JSON.stringify(queues)
                        );

                        localStorage.setItem(
                            "currentQueue",
                            JSON.stringify(queueData)
                        );

                        assigned = true;

                    } else {

                        // Move to the next working day.
                        appointmentDate.setDate(
                            appointmentDate.getDate() + 1
                        );

                        while (
                            appointmentDate.getDay() === 0 ||
                            appointmentDate.getDay() === 6
                        ) {
                            appointmentDate.setDate(
                                appointmentDate.getDate() + 1
                            );
                        }
                    }
                }

                window.location.href = "student-queue.html";
            });
        }
    }
}
