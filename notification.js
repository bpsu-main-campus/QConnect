function ensureNotificationElement() {
    let notification = document.getElementById("notification");

    if (notification) {
        return notification;
    }

    notification = document.createElement("div");
    notification.id = "notification";
    notification.className = "notification";
    notification.setAttribute("role", "status");
    notification.setAttribute("aria-live", "polite");
    notification.innerHTML =
        '<span id="notificationMessage"></span>' +
        '<button type="button" id="closeNotification" aria-label="Close notification">×</button>';

    const main = document.querySelector("main");
    (main || document.body).prepend(notification);

    return notification;
}

function showNotification(message) {
    const notification = ensureNotificationElement();
    const messageElement = document.getElementById("notificationMessage");

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;
    notification.classList.add("show");

    if (notification.hideTimer) {
        clearTimeout(notification.hideTimer);
    }

    notification.hideTimer = setTimeout(() => {
        notification.classList.remove("show");
    }, 5000);
}

function hideNotification() {
    const notification = document.getElementById("notification");

    if (!notification) {
        return;
    }

    notification.classList.remove("show");

    if (notification.hideTimer) {
        clearTimeout(notification.hideTimer);
    }
}

document.addEventListener("click", (event) => {
    if (event.target.closest("#closeNotification")) {
        hideNotification();
    }

    if (event.target.closest("#testNotification")) {
        showNotification(
            "Test successful! QConnect notifications are appearing on this page."
        );
    }
});
