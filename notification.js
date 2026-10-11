
function showNotification(message) {
    const notification = document.getElementById("notification");
    const messageElement = document.getElementById("notificationMessage");

    if (!notification || !messageElement) return;

    messageElement.textContent = message;
    notification.classList.add("show");
}

function hideNotification() {
    const notification = document.getElementById("notification");

    if (notification) {
        notification.classList.remove("show");
    }
}
