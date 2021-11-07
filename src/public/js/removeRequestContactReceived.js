function removeRequesContactReceived() {
  $(".user-remove-request-contact-received").unbind("click").on("click", function () {
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-request-contact-received",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        if (data.success) {

          // chức năng còn phát triển
          // xóa ở pop-up notif
          // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
          // $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); // xóa cả div và cha(li)
          // decreaseNumberNotification("noti_counter", 1); // js/caculateNotification.js

          decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
          decreaseNumberNotifContact("count-request-contact-received");  // js/caculateNotifContact.js


          //  Xóa bỏ modal tab yêu cầu kết bạn
          $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();

          // xử lí realtime
          socket.emit("remove-request-contact-received", { contactId: targetId });
        }
      }
    });
  });
}

socket.on("respone-remove-request-contact-received", function (user) {

  $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");
  $("#find-user").find(`div.user-remove-request-contact-send[data-uid = ${user.id}]`).hide();


  // xóa modal tab đang chờ xác nhận
  $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotifContact("count-request-contact-sent");
  decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js

});

$(document).ready(function () {
  removeRequesContactReceived();
});
