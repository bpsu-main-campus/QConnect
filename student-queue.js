/* =====================================================
   STUDENT QUEUE PAGE
===================================================== */


/* =====================================================
   GET QUEUE DATA
===================================================== */

const queueData =
    JSON.parse(
        localStorage.getItem(
            "currentQueue"
        )
    );


/* =====================================================
   GET ELEMENTS
===================================================== */

const queueNumber =
    document.getElementById(
        "queueNumber"
    );

const queueStudent =
    document.getElementById(
        "queueStudent"
    );

const queueDate =
    document.getElementById(
        "queueDate"
    );

const queueTime =
    document.getElementById(
        "queueTime"
    );

const queueStatus =
    document.getElementById(
        "queueStatus"
    );

const qrCode =
    document.getElementById(
        "qrcode"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const menuButton =
    document.getElementById(
        "menuButton"
    );


/* =====================================================
   DISPLAY QUEUE
===================================================== */

if (queueData) {


    /* QUEUE NUMBER */

    if (queueNumber) {

        queueNumber.textContent =
            queueData.queueNumber;

    }


    /* STUDENT */

    if (queueStudent) {

        queueStudent.textContent =
            queueData.name +
            " • " +
            queueData.studentID;

    }


    /* DATE */

    if (queueDate) {

        queueDate.textContent =
            "Appointment Date: " +
            queueData.formattedDate;

    }


    /* TIME */

    if (queueTime) {

        queueTime.textContent =
            "Appointment Time: " +
            queueData.appointmentTime;

    }


    /* STATUS */

    if (queueStatus) {

        queueStatus.textContent =
            "Status: " +
            queueData.status;

    }


    /* =================================================
       QR CODE
    ================================================= */

    if (
        qrCode &&
        typeof QRCode !== "undefined"
    ) {

        qrCode.innerHTML = "";


        const qrInformation =
            "QCONNECT|" +
            queueData.queueNumber +
            "|" +
            queueData.studentID +
            "|" +
            queueData.appointmentDate +
            "|" +
            queueData.appointmentTime;


        new QRCode(
            qrCode,
            {

                text:
                    qrInformation,

                width:
                    150,

                height:
                    150,

                correctLevel:
                    QRCode.CorrectLevel.M

            }
        );

    }

}


/* =====================================================
   BACK BUTTON
===================================================== */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "profileMode",
                "student"
            );

            window.location.href =
                "student-profile.html";

        }
    );

}


/* =====================================================
   MENU BUTTON
===================================================== */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";

        }
    );

}