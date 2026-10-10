
function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notificationMessage");

    if (!notification || !notificationMessage) return;

    notificationMessage.textContent = message;
    notification.classList.add("show");
}

function hideNotification() {
    const notification = document.getElementById("notification");

    if (notification) {
        notification.classList.remove("show");
    }
}

// Example: show a notification
// Call this function whenever you need to notify the user.
showNotification("Welcome to QConnect!");
<script src="notification.js"></script>