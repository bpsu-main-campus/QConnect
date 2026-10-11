
/* =========================================
   QCONNECT NOTIFICATION SYSTEM
   ========================================= */

/**
 * Display an in-page notification.
 * Example:
 * showNotification("Your queue status has changed!");
 */
function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById(
        "notificationMessage"
    );

    if (!notification || !notificationMessage) {
        console.warn("QConnect notification elements were not found.");
        return;
    }

    notificationMessage.textContent = message;
    notification.classList.add("show");

    // Clear any previous timer.
    clearTimeout(notification.hideTimer);

    // Hide the message after five seconds.
    notification.hideTimer = setTimeout(() => {
        hideNotification();
    }, 5000);
}

/**
 * Hide the notification.
 */
function hideNotification() {
    const notification = document.getElementById("notification");

    if (!notification) {
        return;
    }

    notification.classList.remove("show");
    clearTimeout(notification.hideTimer);
}

/* =========================================
   BUTTON EVENTS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const testButton = document.getElementById("testNotification");
    const closeButton = document.getElementById("closeNotification");

    // Test notification button.
    if (testButton) {
        testButton.addEventListener("click", () => {
            showNotification(
                "Test successful! QConnect notifications are working on this page."
            );
        });
    }

    // Close notification button.
    if (closeButton) {
        closeButton.addEventListener("click", hideNotification);
    }
});
