
/* =========================================
   QCONNECT - REGISTERED STUDENTS
========================================= */

const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("studentSearch");
const clearSearch = document.getElementById("clearSearch");
const upButton = document.getElementById("scrollUp");
const downButton = document.getElementById("scrollDown");


/* =========================================
   GET REGISTERED STUDENTS SAFELY
========================================= */

function getStudents() {
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


/* =========================================
   GET STUDENT NAME
   Supports both separate names and the
   older combined name format.
========================================= */

function getStudentName(student) {
    const oldParts = String(student.name || "")
        .split(",")
        .map(part => part.trim());

    const lastName = String(
        student.lastName ?? oldParts[0] ?? ""
    ).trim();

    const firstName = String(
        student.firstName ?? oldParts[1] ?? ""
    ).trim();

    const middleName = String(
        student.middleName ?? oldParts.slice(2).join(", ") ?? ""
    ).trim();

    return [lastName, firstName, middleName]
        .filter(Boolean)
        .join(", ");
}


/* =========================================
   DISPLAY STUDENTS
========================================= */

function displayStudents(searchText = "") {
    if (!studentList) return;

    const students = getStudents();
    studentList.innerHTML = "";

    const search = String(searchText).trim().toLowerCase();

    const filteredStudents = students.filter(student => {
        const id = String(student.studentID || student.id || "");
        const name = getStudentName(student);

        return (
            id.toLowerCase().includes(search) ||
            name.toLowerCase().includes(search)
        );
    });

    if (filteredStudents.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "no-students";
        emptyMessage.textContent = "No registered students found.";
        studentList.appendChild(emptyMessage);
        return;
    }

    filteredStudents.forEach(student => {
        const listItem = document.createElement("li");

        const id = student.studentID || student.id || "";
        const name = getStudentName(student);

        listItem.textContent = `${id}  ${name}`;
        listItem.tabIndex = 0;
        listItem.setAttribute("role", "button");
        listItem.setAttribute(
            "aria-label",
            `View profile of ${name || id}`
        );

        function openStudentProfile() {
            if (!id) {
                alert("This student record has no Student ID.");
                return;
            }

            // Mark this profile as an ADMIN view.
            localStorage.setItem("profileMode", "admin");
            localStorage.setItem("selectedStudentID", String(id));

            // Clear the student-view ID so it cannot be confused
            // with the selected student in admin mode.
            window.location.href = "student-profile.html?view=admin";
        }

        listItem.addEventListener("click", openStudentProfile);

        listItem.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openStudentProfile();
            }
        });

        studentList.appendChild(listItem);
    });
}


/* =========================================
   SEARCH
========================================= */

if (searchInput) {
    searchInput.addEventListener("input", () => {
        displayStudents(searchInput.value);
    });
}


/* =========================================
   CLEAR SEARCH
========================================= */

if (clearSearch) {
    clearSearch.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }

        displayStudents();
    });
}


/* =========================================
   SCROLL BUTTONS
========================================= */

if (upButton) {
    upButton.addEventListener("click", () => {
        studentList?.scrollBy({
            top: -100,
            behavior: "smooth"
        });
    });
}

if (downButton) {
    downButton.addEventListener("click", () => {
        studentList?.scrollBy({
            top: 100,
            behavior: "smooth"
        });
    });
}


/* =========================================
   INITIAL DISPLAY
========================================= */

displayStudents();
