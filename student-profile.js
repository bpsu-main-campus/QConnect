
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================
       ELEMENTS AND PROFILE MODE
    ========================================= */

    const form = document.getElementById("profileForm");
    const collegeInput = document.getElementById("profileCollege");
    const courseInput = document.getElementById("profileCourse");
    const programInput = document.getElementById("profileProgram");

    const editButton = document.getElementById("editProfileButton");
    const saveButton = document.getElementById("saveProfileButton");
    const queueButton = document.getElementById("queueButton");

    const savePopup = document.getElementById("savePopup");
    const closeSavePopup = document.getElementById("closeSavePopup");
    const pageTitle = document.getElementById("profilePageTitle");

    if (!form || !collegeInput || !courseInput || !programInput) {
        console.error("Profile form elements are missing. Check student-profile.html.");
        return;
    }

    const profileMode = localStorage.getItem("profileMode") || "student";
    const isAdmin = profileMode === "admin";

    const studentID = isAdmin
        ? localStorage.getItem("selectedStudentID")
        : localStorage.getItem("loggedInStudentID");

    let currentStudent = null;
    let originalStudent = null;

    /* =========================================
       COLLEGES AND COURSES
       Course names must match registration records.
    ========================================= */

    const collegeNames = {
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
                name: "Bachelor of Science in Computer Science",
                majors: []
            },
            {
                name: "Bachelor of Science in Data Science",
                majors: []
            },
            {
                name: "Bachelor of Science in Information Technology",
                majors: ["DAT - Digital Animation Technology"]
            },
            {
                name: "Bachelor of Science in Entertainment and Multimedia Computing",
                majors: [
                    "GD - Game Development",
                    "DAT - Digital Animation Technology"
                ]
            }
        ],

        CEA: [
            { name: "Bachelor of Science in Architecture", majors: [] },
            { name: "Bachelor of Science in Civil Engineering", majors: [] },
            { name: "Bachelor of Science in Computer Engineering", majors: [] },
            { name: "Bachelor of Science in Electrical Engineering", majors: [] },
            { name: "Bachelor of Science in Electronics Engineering", majors: [] },
            { name: "Bachelor of Science in Industrial Engineering", majors: [] },
            { name: "Bachelor of Science in Mechanical Engineering", majors: [] }
        ],

        CBA: [
            { name: "Bachelor of Science in Hospitality Management", majors: [] },
            { name: "Bachelor of Science in Tourism Management", majors: [] }
        ],

        COAS: [
            {
                name: "Bachelor of Arts in Communication",
                majors: [
                    "CPA - Creative and Performing Arts",
                    "NMT - New Media Track"
                ]
            }
        ],

        CAHS: [
            { name: "Diploma in Midwifery", majors: [] },
            { name: "Bachelor of Science in Nursing", majors: [] },
            {
                name: "Bachelor of Science in Public Health",
                majors: ["PH - Population Health"]
            },
            { name: "Bachelor of Science in Radiologic Technology", majors: [] }
        ],

        CTECH: [
            {
                name: "Bachelor of Science in Industrial Technology",
                majors: [
                    "AFT - Automotive Technology",
                    "ADT - Architectural Drafting Technology",
                    "AT - Apparel Technology",
                    "CT - Civil Technology",
                    "ET - Electrical Technology",
                    "Electronics Technology",
                    "FST - Food Science Technology",
                    "HVAC - Heating, Ventilating and Air Conditioning Technology",
                    "MT - Mechanical Technology",
                    "WFT - Welding and Fabrication Technology"
                ]
            },
            {
                name: "Bachelor of Technical-Vocational Teacher Education",
                majors: [
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
            }
        ]
    };

    /* =========================================
       STORAGE HELPERS
    ========================================= */

    function loadStudents() {
        try {
            const data = JSON.parse(
                localStorage.getItem("registeredStudents") || "[]"
            );

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Could not load registered students:", error);
            return [];
        }
    }

    function saveStudents(students) {
        localStorage.setItem("registeredStudents", JSON.stringify(students));
    }

    function sameStudentID(a, b) {
        return String(a || "").trim().toLowerCase() ===
            String(b || "").trim().toLowerCase();
    }

    function getStudentID(student) {
        return student.studentID || student.id || "";
    }

    /* =========================================
       NAME HELPERS
    ========================================= */

    function splitStoredName(name) {
        const parts = String(name || "")
            .split(",")
            .map(part => part.trim());

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
       COURSE AND MAJOR HELPERS
    ========================================= */

    function normalizeCollege(value) {
        const text = String(value || "").trim();

        if (coursesByCollege[text]) return text;

        const match = Object.entries(collegeNames).find(([code, name]) =>
            text.toLowerCase() === name.toLowerCase() ||
            text.toLowerCase().includes("(" + code.toLowerCase() + ")")
        );

        return match ? match[0] : "";
    }

    function findCollegeForCourse(courseName) {
        for (const [college, courses] of Object.entries(coursesByCollege)) {
            if (courses.some(course => course.name === courseName)) {
                return college;
            }
        }

        return "";
    }

    function findCourse(college, courseName) {
        const courses = coursesByCollege[college] || [];

        return courses.find(course => course.name === courseName) || null;
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
            option.value = course.name;
            option.textContent = course.name;
            courseInput.appendChild(option);
        });

        // Preserve older records if a saved course is not in the list.
        if (selectedCourse && !courses.some(course => course.name === selectedCourse)) {
            const option = document.createElement("option");
            option.value = selectedCourse;
            option.textContent = selectedCourse;
            courseInput.appendChild(option);
        }

        courseInput.value = selectedCourse;

        updateProgramOptions(
            selectedCourse,
            currentStudent ? currentStudent.program : ""
        );
    }

    function updateProgramOptions(courseName, selectedProgram = "") {
        const course = findCourse(collegeInput.value, courseName);
        const majors = course ? course.majors : [];

        programInput.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = majors.length
            ? "Select Program / Major"
            : "N/A";
        programInput.appendChild(placeholder);

        if (majors.length === 0) {
            const option = document.createElement("option");
            option.value = "N/A";
            option.textContent = "N/A";
            programInput.appendChild(option);
            programInput.value = "N/A";
            programInput.disabled = true;
            programInput.required = false;
            return;
        }

        majors.forEach(major => {
            const option = document.createElement("option");
            option.value = major;
            option.textContent = major;
            programInput.appendChild(option);
        });

        // Preserve a previously saved value if it differs from the current list.
        if (selectedProgram && !majors.includes(selectedProgram)) {
            const option = document.createElement("option");
            option.value = selectedProgram;
            option.textContent = selectedProgram;
            programInput.appendChild(option);
        }

        programInput.value = selectedProgram || "";
        programInput.disabled = isAdmin || !isEditing;
        programInput.required = true;
    }

    /* =========================================
       EDITING STATE
       Only name, college, course and major editable.
    ========================================= */

    let isEditing = false;

    function setEditing(editing) {
        if (isAdmin) return;

        isEditing = editing;

        [
            "profileLastName",
            "profileFirstName",
            "profileMiddleName"
        ].forEach(id => {
            const field = document.getElementById(id);
            if (field) field.disabled = !editing;
        });

        collegeInput.disabled = !editing;
        courseInput.disabled = !editing;

        updateProgramOptions(
            courseInput.value,
            currentStudent ? currentStudent.program : ""
        );

        programInput.disabled =
            !editing || programInput.value === "N/A";

        if (editButton) editButton.hidden = editing;
        if (saveButton) saveButton.hidden = !editing;
        if (queueButton) queueButton.hidden = editing;

        // Keep personal and identifying details read-only.
        [
            "profileStudentID",
            "profileGender",
            "profileBirthday",
            "profileAge",
            "profileCampus"
        ].forEach(id => {
            const field = document.getElementById(id);
            if (field) field.disabled = true;
        });
    }

    /* =========================================
       DISPLAY PROFILE
    ========================================= */

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

        currentStudent = students.find(student =>
            sameStudentID(getStudentID(student), studentID)
        );

        if (!currentStudent) {
            alert("Student record not found.");
            return;
        }

        originalStudent = { ...currentStudent };

        const names = getStudentNames(currentStudent);

        document.getElementById("profileLastName").value = names.last;
        document.getElementById("profileFirstName").value = names.first;
        document.getElementById("profileMiddleName").value = names.middle;

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

        let college = normalizeCollege(currentStudent.college);

        if (!college) {
            college = findCollegeForCourse(currentStudent.course);
        }

        collegeInput.value = college;

        updateCourseOptions(currentStudent.course || "");

        // Fix N/A for courses with exactly one possible major.
        const selectedCourse = findCourse(college, currentStudent.course);
        if (
            selectedCourse &&
            selectedCourse.majors.length === 1 &&
            (
                !currentStudent.program ||
                currentStudent.program === "N/A"
            )
        ) {
            programInput.value = selectedCourse.majors[0];
        }

        if (pageTitle) {
            pageTitle.textContent = isAdmin ? "Student Profile" : "My Profile";
        }

        if (editButton) editButton.hidden = isAdmin;
        if (saveButton) saveButton.hidden = true;
        if (queueButton) queueButton.hidden = isAdmin;

        // All fields start read-only.
        form.querySelectorAll("input, select").forEach(field => {
            field.disabled = true;
        });

        isEditing = false;
    }

    /* =========================================
       COLLEGE / COURSE CHANGE EVENTS
    ========================================= */

    collegeInput.addEventListener("change", function () {
        if (!isEditing || isAdmin) return;

        updateCourseOptions("");
    });

    courseInput.addEventListener("change", function () {
        if (!isEditing || isAdmin) return;

        updateProgramOptions(courseInput.value, "");
    });

    /* =========================================
       EDIT BUTTON
    ========================================= */

    if (editButton) {
        editButton.addEventListener("click", function () {
            if (isAdmin) return;
            setEditing(true);
        });
    }

    /* =========================================
       SAVE BUTTON
    ========================================= */

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            if (isAdmin || !currentStudent || !isEditing) return;

            if (!form.reportValidity()) return;

            const last = document.getElementById("profileLastName").value.trim();
            const first = document.getElementById("profileFirstName").value.trim();
            const middle = document.getElementById("profileMiddleName").value.trim();

            const college = collegeInput.value;
            const courseName = courseInput.value;
            const selectedCourse = findCourse(college, courseName);

            if (!last || !first) {
                alert("Please enter your last name and first name.");
                return;
            }

            if (!selectedCourse) {
                alert("Please select a valid course.");
                return;
            }

            let savedProgram = "N/A";

            if (selectedCourse.majors.length === 1) {
                savedProgram = selectedCourse.majors[0];
            } else if (selectedCourse.majors.length > 1) {
                if (
                    !programInput.value ||
                    !selectedCourse.majors.includes(programInput.value)
                ) {
                    alert("Please select your program / major.");
                    return;
                }

                savedProgram = programInput.value;
            }

            const students = loadStudents();
            const index = students.findIndex(student =>
                sameStudentID(getStudentID(student), studentID)
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
                course: courseName,
                program: savedProgram
            };

            students[index] = updatedStudent;
            saveStudents(students);

            currentStudent = updatedStudent;
            localStorage.setItem("loggedInStudent", JSON.stringify(updatedStudent));

            loadProfile();

            if (savePopup) {
                savePopup.classList.add("show");
            } else {
                alert("Profile saved successfully!");
            }
        });
    }

    /* =========================================
       SAVE POPUP
    ========================================= */

    if (closeSavePopup && savePopup) {
        closeSavePopup.addEventListener("click", function () {
            savePopup.classList.remove("show");
        });
    }

    /* =========================================
       APPOINTMENT / QUEUE
       Weekdays only, 16 appointments per day,
       30-minute slots starting at 8:00 AM.
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

    function createAppointment() {
        if (!currentStudent || isAdmin) return;

        const queues = getQueueList();
        const todayISO = getLocalISODate(new Date());
        const currentID = getStudentID(currentStudent);

        // Reuse this student's existing future appointment.
        const existing = queues.find(queue =>
            sameStudentID(queue.studentID, currentID) &&
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

        const names = getStudentNames(currentStudent);

        const queue = {
            queueNumber: queueNumber,
            studentID: currentID,
            name: joinNameParts(names.last, names.first, names.middle),
            appointmentDate: appointmentDate,
            formattedDate: formatQueueDate(appointmentDate),
            appointmentTime: appointmentTime,
            status: "Waiting"
        };

        queues.push(queue);

        localStorage.setItem("queueList", JSON.stringify(queues));
        localStorage.setItem("currentQueue", JSON.stringify(queue));

        window.location.href = "student-queue.html";
    }

    if (queueButton) {
        queueButton.addEventListener("click", function () {
            if (isAdmin || !currentStudent) return;
            createAppointment();
        });
    }

    /* =========================================
       START
    ========================================= */

    loadProfile();
});
