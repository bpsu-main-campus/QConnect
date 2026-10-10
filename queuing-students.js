
/* =========================================
   ADMIN CHECK
========================================= */

const loggedInAdmin = localStorage.getItem("loggedInAdmin");

if (loggedInAdmin !== "true") {
    alert("Please log in as an administrator first.");
    window.location.href = "admin-login.html";
} else {

    /* =========================================
       GET QUEUES
    ========================================= */

    let queues = [];

    try {
        queues = JSON.parse(localStorage.getItem("queueList")) || [];
    } catch (error) {
        console.error("Unable to load queues:", error);
        queues = [];
    }

    /* =========================================
       REMOVE EXPIRED QUEUES
       Keep registered students untouched.
    ========================================= */

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    queues = queues.filter(queue => {
        if (!queue.appointmentDate) {
            return true;
        }

        // Handles dates stored as YYYY-MM-DD
        const appointmentDate = new Date(
            queue.appointmentDate + "T00:00:00"
        );

        // Keep records with invalid dates to avoid accidental deletion
        if (Number.isNaN(appointmentDate.getTime())) {
            return true;
        }

        // Remove queues whose appointment date has passed
        return appointmentDate >= today;
    });

    // Save the remaining queues
    localStorage.setItem("queueList", JSON.stringify(queues));

    /* =========================================
       GET PAGE ELEMENTS
    ========================================= */

    const container = document.getElementById("queueContainer");
    const dateTitle = document.getElementById("queueDateTitle");

    if (dateTitle) {
        dateTitle.textContent =
            "Queue appointments and their current status";
    }

    /* =========================================
       SORT QUEUES BY DATE
    ========================================= */

    queues.sort((a, b) => {
        const dateA = new Date(a.appointmentDate || "9999-12-31");
        const dateB = new Date(b.appointmentDate || "9999-12-31");

        return dateA - dateB;
    });

    /* =========================================
       DISPLAY QUEUE TABLE
    ========================================= */

    if (container) {

        if (queues.length === 0) {

            container.innerHTML = `
                <p style="
                    text-align: center;
                    color: #651515;
                    padding: 30px;
                ">
                    No students are currently queued.
                </p>
            `;

        } else {

            let tableHTML = `
                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    background: #fffdf5;
                    color: #651515;
                ">
                    <thead>
                        <tr style="
                            background: #651515;
                            color: white;
                        ">
                            <th style="padding: 12px;">Queue</th>
                            <th style="padding: 12px;">Student ID</th>
                            <th style="padding: 12px;">Name</th>
                            <th style="padding: 12px;">Date</th>
                            <th style="padding: 12px;">Time</th>
                            <th style="padding: 12px;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            queues.forEach(queue => {

                tableHTML += `
                    <tr style="
                        border-bottom: 1px solid #ddd;
                        text-align: center;
                    ">
                        <td style="padding: 12px;">
                            ${queue.queueNumber || "—"}
                        </td>

                        <td style="padding: 12px;">
                            ${queue.studentID || "—"}
                        </td>

                        <td style="padding: 12px;">
                            ${queue.name || "—"}
                        </td>

                        <td style="padding: 12px;">
                            ${queue.formattedDate || queue.appointmentDate || "—"}
                        </td>

                        <td style="padding: 12px;">
                            ${queue.appointmentTime || "—"}
                        </td>

                        <td style="padding: 12px;">
                            ${queue.status || "Waiting"}
                        </td>
                    </tr>
                `;

            });

            tableHTML += `
                    </tbody>
                </table>
            `;

            container.innerHTML = tableHTML;
        }
    }
}
