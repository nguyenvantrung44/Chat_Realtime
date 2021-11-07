function removeRequesContactSend() {
  $(".user-remove-request-contact-send").unbind("click").on("click", function () {
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-request-contact-send",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.success) {
          $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
          $("#find-user").find(`div.user-remove-request-contact-send[data-uid = ${targetId}]`).hide();

          decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
          decreaseNumberNotifContact("count-request-contact-sent");  // js/caculateNotifContact.js

          // xóa modal tab đang chờ xác nhận
          $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();

          // xử lí realtime
          socket.emit("remove-request-contact-send", { contactId: targetId });
        }
      }
    });
  });
}

socket.on("respone-remove-request-contact-send", function (user) {
  // xóa ở pop-up notif
  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
  $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); // xóa cả div và cha(li)

  //  Xóa bỏ modal tab yêu cầu kết bạn
  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotifContact("count-request-contact-received");
  decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
  decreaseNumberNotification("noti_counter", 1); // js/caculateNotification.js
});

$(document).ready(function () {
  removeRequesContactSend();
});
