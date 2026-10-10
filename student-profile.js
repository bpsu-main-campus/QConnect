
/* =========================================
   STUDENT PROFILE
========================================= */


/* =========================================
   GET PROFILE MODE
========================================= */

const profileMode =
    localStorage.getItem("profileMode") ||
    "student";


/* =========================================
   GET STUDENT ID
========================================= */

let studentID = null;


/* STUDENT LOGIN */

if (profileMode === "student") {

    studentID =
        localStorage.getItem(
            "loggedInStudentID"
        );

}


/* ADMIN VIEW */

if (profileMode === "admin") {

    studentID =
        localStorage.getItem(
            "selectedStudentID"
        );

}


/* =========================================
   GET STUDENTS
========================================= */

const students =
    JSON.parse(
        localStorage.getItem(
            "registeredStudents"
        )
    ) || [];


/* =========================================
   FIND STUDENT
========================================= */

const student =
    students.find(function(item){

        return String(item.studentID)
            .trim()
            .toLowerCase() ===
            String(studentID)
            .trim()
            .toLowerCase();

    });


/* =========================================
   IF NOT FOUND
========================================= */

if (!student) {

    alert(
        "Student information could not be found."
    );

}


/* =========================================
   FORMAT BIRTHDAY
========================================= */

function formatBirthday(birthday){

    if(!birthday){
        return "";
    }

    const parts =
        birthday.split("-");

    return (
        parts[1] +
        "-" +
        parts[2] +
        "-" +
        parts[0]
    );
}


/* =========================================
   DISPLAY PROFILE
========================================= */

if(student){

    document.getElementById("profileName").value =
        student.name;

    document.getElementById("profileStudentID").value =
        student.studentID;

    document.getElementById("profileGender").value =
        student.gender;

    document.getElementById("profileBirthday").value =
        formatBirthday(student.birthday);

    document.getElementById("profileAge").value =
        student.age;

    document.getElementById("profileCampus").value =
        student.campus;

    document.getElementById("profileCourse").value =
        student.course;

    document.getElementById("profileProgram").value =
        student.program;

}


/* =========================================
   ADMIN MODE
========================================= */

if(profileMode === "admin"){

    /* REMOVE TITLE */

    const title =
        document.querySelector(
            ".profile-page-title"
        );

    if(title){
        title.style.display = "none";
    }


    /* REMOVE BUTTONS */

    const buttons =
        document.querySelector(
            ".profile-buttons"
        );

    if(buttons){
        buttons.style.display = "none";
    }

}


/* =========================================
   STUDENT MODE
========================================= */

if(profileMode === "student"){

    const editButton =
        document.getElementById(
            "editProfileButton"
        );

    const saveButton =
        document.getElementById(
            "saveProfileButton"
        );

    const queueButton =
        document.getElementById(
            "queueButton"
        );


    /* EDIT */

    if(editButton){

        editButton.addEventListener(
            "click",
            function(){

                const inputs =
                    document.querySelectorAll(
                        ".profile-field input"
                    );

                inputs.forEach(function(input){

                    if(
                        input.id !==
                        "profileStudentID"
                    ){
                        input.disabled = false;
                    }

                });

                document
                    .getElementById("profileBox")
                    .classList.add("editing");

                saveButton.classList.add("enabled");

            }
        );

    }


    /* SAVE */

    if(saveButton){

        saveButton.addEventListener(
            "click",
            function(){

                if(
                    !saveButton.classList.contains(
                        "enabled"
                    )
                ){
                    return;
                }

                student.name =
                    document
                        .getElementById("profileName")
                        .value;

                student.gender =
                    document
                        .getElementById("profileGender")
                        .value;

                student.course =
                    document
                        .getElementById("profileCourse")
                        .value;

                student.program =
                    document
                        .getElementById("profileProgram")
                        .value;


                const index =
                    students.findIndex(
                        function(item){

                            return item.studentID ===
                                student.studentID;

                        }
                    );

                students[index] =
                    student;

                localStorage.setItem(
                    "registeredStudents",
                    JSON.stringify(students)
                );

                localStorage.setItem(
                    "loggedInStudent",
                    JSON.stringify(student)
                );


                const inputs =
                    document.querySelectorAll(
                        ".profile-field input"
                    );

                inputs.forEach(function(input){
                    input.disabled = true;
                });

                document
                    .getElementById("profileBox")
                    .classList.remove("editing");

                saveButton.classList.remove("enabled");

                document
                    .getElementById("savePopup")
                    .classList.add("active");

            }
        );

    }


    /* CLOSE POPUP */

    const closePopup =
        document.getElementById(
            "closeSavePopup"
        );

    if(closePopup){

        closePopup.addEventListener(
            "click",
            function(){

                document
                    .getElementById("savePopup")
                    .classList.remove("active");

            }
        );

    }


/* =====================================================
   GET QUEUE NUMBER
   AUTOMATIC APPOINTMENT SCHEDULING
===================================================== */

if (queueButton) {

    queueButton.addEventListener(
        "click",
        function () {

            /* ---------------------------------------------
               GET EXISTING QUEUES
            --------------------------------------------- */

            let queues =
                JSON.parse(
                    localStorage.getItem("queueList")
                ) || [];


            /* ---------------------------------------------
               CHECK IF THIS STUDENT ALREADY HAS A QUEUE
            --------------------------------------------- */

            const existingQueue =
                queues.find(
                    function (q) {

                        return q.studentID ===
                            student.studentID;

                    }
                );


            /* ---------------------------------------------
               IF STUDENT ALREADY HAS A QUEUE
               
               DO NOT CREATE ANOTHER ONE.
               JUST SHOW THEIR EXISTING QUEUE.
            --------------------------------------------- */

            if (existingQueue) {

                localStorage.setItem(
                    "currentQueue",
                    JSON.stringify(existingQueue)
                );

                window.location.href =
                    "student-queue.html";

                return;
            }


            /* ---------------------------------------------
               TODAY
            --------------------------------------------- */

            const today =
                new Date();


            /* ---------------------------------------------
               START WITH TOMORROW
            --------------------------------------------- */

            let appointmentDate =
                new Date(today);

            appointmentDate.setDate(
                appointmentDate.getDate() + 1
            );


            /* ---------------------------------------------
               SKIP SATURDAY AND SUNDAY
            --------------------------------------------- */

            while (
                appointmentDate.getDay() === 0 ||
                appointmentDate.getDay() === 6
            ) {

                appointmentDate.setDate(
                    appointmentDate.getDate() + 1
                );

            }


            /* ---------------------------------------------
               FIND NEXT AVAILABLE SLOT

               Q001 = 8:00 AM
               Q002 = 8:30 AM
               Q003 = 9:00 AM
               etc.
            --------------------------------------------- */

            let assigned = false;

            let queueData = null;


            while (!assigned) {

                /* -----------------------------------------
                   FORMAT DATE
                ----------------------------------------- */

                const year =
                    appointmentDate.getFullYear();

                const month =
                    String(
                        appointmentDate.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        appointmentDate.getDate()
                    ).padStart(2, "0");


                const appointmentDateISO =
                    year + "-" +
                    month + "-" +
                    day;


                /* -----------------------------------------
                   GET QUEUES FOR THIS DATE
                ----------------------------------------- */

                const dateQueues =
                    queues.filter(
                        function (q) {

                            return q.appointmentDate ===
                                appointmentDateISO;

                        }
                    );


                /* -----------------------------------------
                   MAX STUDENTS PER DAY
                ----------------------------------------- */

                const maxStudentsPerDay = 16;


                if (
                    dateQueues.length <
                    maxStudentsPerDay
                ) {

                    /* -------------------------------------
                       AVAILABLE SLOT
                    ------------------------------------- */

                    const slotNumber =
                        dateQueues.length;


                    const totalMinutes =
                        (8 * 60) +
                        (slotNumber * 30);


                    const hour =
                        Math.floor(
                            totalMinutes / 60
                        );


                    const minute =
                        totalMinutes % 60;


                    /* -------------------------------------
                       FORMAT TIME
                    ------------------------------------- */

                    let displayHour =
                        hour;

                    let ampm =
                        "AM";


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
                        displayHour +
                        ":" +
                        String(minute).padStart(2, "0") +
                        " " +
                        ampm;


                    /* -------------------------------------
                       FORMAT DATE FOR DISPLAY
                    ------------------------------------- */

                    const formattedDate =
                        appointmentDate.toLocaleDateString(
                            "en-US",
                            {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            }
                        );


                    /* -------------------------------------
                       QUEUE NUMBER
                    ------------------------------------- */

                    const queueNumber =
                        "Q" +
                        String(
                            slotNumber + 1
                        ).padStart(3, "0");


                    /* -------------------------------------
                       CREATE QUEUE
                    ------------------------------------- */

                    queueData = {

                        queueNumber:
                            queueNumber,

                        name:
                            student.name,

                        studentID:
                            student.studentID,

                        appointmentDate:
                            appointmentDateISO,

                        formattedDate:
                            formattedDate,

                        appointmentTime:
                            formattedTime,

                        status:
                            "Waiting"

                    };


                    /* -------------------------------------
                       SAVE QUEUE
                    ------------------------------------- */

                    queues.push(
                        queueData
                    );


                    localStorage.setItem(
                        "queueList",
                        JSON.stringify(queues)
                    );


                    localStorage.setItem(
                        "currentQueue",
                        JSON.stringify(queueData)
                    );


                    assigned = true;

                }

                else {

                    /* -------------------------------------
                       DATE IS FULL
                       MOVE TO NEXT WORKING DAY
                    ------------------------------------- */

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


            /* ---------------------------------------------
               GO TO QUEUE PAGE
            --------------------------------------------- */

            window.location.href =
                "student-queue.html";

            }
        );
    }
}