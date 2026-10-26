
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    function getSavedQueue() {
        try {
            return JSON.parse(localStorage.getItem("currentQueue") || "null");
        } catch (error) {
            console.error("Unable to read current queue:", error);
            return null;
        }
    }

    const queueData = getSavedQueue();

    const queueNumberElement = document.getElementById("queueNumber");
    const queueStudentElement = document.getElementById("queueStudent");
    const queueDateElement = document.getElementById("queueDate");
    const queueTimeElement = document.getElementById("queueTime");
    const queueStatusElement = document.getElementById("queueStatus");
    const qrCodeElement = document.getElementById("qrcode");
    const qrErrorElement = document.getElementById("qrError");

    const backButton = document.getElementById("backButton");
    const menuButton = document.getElementById("menuButton");

    // Display queue information safely.
    if (queueData) {
        if (queueNumberElement) {
            queueNumberElement.textContent = queueData.queueNumber || "--";
        }

        if (queueStudentElement) {
            queueStudentElement.textContent =
                `${queueData.name || "Student"} • ${queueData.studentID || ""}`;
        }

        if (queueDateElement) {
            queueDateElement.textContent =
                "Appointment Date: " +
                (queueData.formattedDate || queueData.appointmentDate || "--");
        }

        if (queueTimeElement) {
            queueTimeElement.textContent =
                "Appointment Time: " + (queueData.appointmentTime || "--");
        }

        if (queueStatusElement) {
            queueStatusElement.textContent =
                "Status: " + (queueData.status || "Waiting");
        }

        if (qrCodeElement) {
            qrCodeElement.replaceChildren();

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

                if (qrErrorElement) {
                    qrErrorElement.hidden = true;
                }
            } else if (qrErrorElement) {
                qrErrorElement.hidden = false;
                qrErrorElement.textContent =
                    typeof QRCode === "undefined"
                        ? "QR library not loaded. Check qrcode.min.js."
                        : "This ticket has incomplete information. Please request a new ticket.";
            }
        }
    } else {
        if (queueNumberElement) queueNumberElement.textContent = "--";

        if (queueStudentElement) {
            queueStudentElement.textContent =
                "No queue ticket found. Please request a queue number again.";
        }

        if (queueDateElement) {
            queueDateElement.textContent = "Appointment Date: --";
        }

        if (queueTimeElement) {
            queueTimeElement.textContent = "Appointment Time: --";
        }

        if (queueStatusElement) {
            queueStatusElement.textContent = "Status: --";
        }

        if (qrCodeElement) qrCodeElement.replaceChildren();

        if (qrErrorElement) qrErrorElement.hidden = true;
    }

    // BACK BUTTON
    if (backButton) {
        backButton.type = "button";

        backButton.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.setItem("profileMode", "student");
            window.location.assign("student-profile.html");
        });
    }

    // MENU BUTTON
    if (menuButton) {
        menuButton.type = "button";

        menuButton.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.assign("index.html");
        });
    }
});
