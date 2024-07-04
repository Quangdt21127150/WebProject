const notificationModal = new bootstrap.Modal($("#notificationModal"));
const message = $("#message").text();

if (message) {
  notificationModal.show();
}
