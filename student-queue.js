
/* =====================================================
   QCONNECT - STUDENT QUEUE PAGE
===================================================== */

function getSavedQueue() {
    try {
        return JSON.parse(
            localStorage.getItem("currentQueue")
        );
    } catch (error) {
        console.error("Unable to read current queue:", error);
        return null;
    }
}

const queueData = getSavedQueue();

/* =====================================================
   GET ELEMENTS
===================================================== */

const queueNumberElement =
    document.getElementById("queueNumber");

const queueStudentElement =
    document.getElementById("queueStudent");

const queueDateElement =
    document.getElementById("queueDate");

const queueTimeElement =
    document.getElementById("queueTime");

const queueStatusElement =
    document.getElementById("queueStatus");

const qrCodeElement =
    document.getElementById("qrcode");

const qrErrorElement =
    document.getElementById("qrError");

const backButton =
    document.getElementById("backButton");

const menuButton =
    document.getElementById("menuButton");

/* =====================================================
   DISPLAY QUEUE INFORMATION
===================================================== */

if (queueData) {

    queueNumberElement.textContent =
        queueData.queueNumber || "--";

    queueStudentElement.textContent =
        `${queueData.name || "Student"} • ${queueData.studentID || ""}`;

    queueDateElement.textContent =
        "Appointment Date: " +
        (
            queueData.formattedDate ||
            queueData.appointmentDate ||
            "--"
        );

    queueTimeElement.textContent =
        "Appointment Time: " +
        (queueData.appointmentTime || "--");

    queueStatusElement.textContent =
        "Status: " + (queueData.status || "Waiting");

    /* =================================================
       GENERATE QR CODE
    ================================================= */

    if (qrCodeElement) {

        qrCodeElement.innerHTML = "";

        if (
            typeof QRCode !== "undefined" &&
            queueData.queueNumber &&
            queueData.studentID &&
            queueData.appointmentDate &&
            queueData.appointmentTime
        ) {

            const qrInformation = JSON.stringify({
                system: "QCONNECT",
                queueNumber: queueData.queueNumber,
                studentID: queueData.studentID,
                appointmentDate: queueData.appointmentDate,
                appointmentTime: queueData.appointmentTime
            });

            new QRCode(qrCodeElement, {
                text: qrInformation,
                width: 128,
                height: 128,
                correctLevel: QRCode.CorrectLevel.M
            });

        } else if (qrErrorElement) {

            qrErrorElement.hidden = false;

            if (typeof QRCode === "undefined") {
                qrErrorElement.textContent =
                    "QR library not loaded. Check qrcode.min.js.";
            } else {
                qrErrorElement.textContent =
                    "This ticket has incomplete information. Generate a new queue ticket.";
            }
        }
    }

} else {

    queueNumberElement.textContent = "--";

    queueStudentElement.textContent =
        "No queue ticket found. Please request a queue number again.";

    queueDateElement.textContent =
        "Appointment Date: --";

    queueTimeElement.textContent =
        "Appointment Time: --";

    queueStatusElement.textContent =
        "Status: --";

    if (qrCodeElement) {
        qrCodeElement.innerHTML = "";
    }
}

/* =====================================================
   BACK BUTTON
===================================================== */

if (backButton) {
    backButton.addEventListener("click", function () {
        localStorage.setItem("profileMode", "student");
        window.location.href = "student-profile.html";
    });
}

/* =====================================================
   MENU BUTTON
===================================================== */

if (menuButton) {
    menuButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });
}
