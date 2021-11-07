function removeContact() {
  $(".user-remove-contact").unbind("click").on("click", function () {
    let targetId = $(this).data("uid");
    let username = $(this).parent().find("div.user-name p").text();

    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ ?`,
      text: "Bạn không thể hoàn tác quá trình này!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận!",
      cancelButtonText: "Hủy!"
    }).then((result) => {
      if (!result.value) {
        return false;
      } else {
        $.ajax({
          url: "/contact/remove-contact",
          type: "delete",
          data: { uid: targetId },
          success: function (data) {
            if (data.success) {

              $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();

              // giảm 1 ở notification
              decreaseNumberNotification("count-contacts", 1); // js/caculateNotification.js

              // xử lí realtime
              socket.emit("remove-contact", { contactId: targetId });

              // Handle chat sau khi chấp nhận kết bạn
              // b0: check active
              let checkActive = $(`#all-chat`).find(`li[data-chat = ${targetId}]`).hasClass("active");

              // b1: remove leftSide.ejs
              $("#all-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
              $("#user-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();

              // b2: remove rightSide.ejs
              $("#screen-chat").find(`div#to_${targetId}`).remove();

              // b3: remove image modal
              $("body").find(`div#imagesModal_${targetId}`).remove();

              // b4: remove attachment modal
              $("body").find(`div#attachmentsModal_${targetId}`).remove();

              // b5: click first conversation
              if (checkActive) {
                if ($("ul.people").find("a").length) {
                  $("ul.people").find("a")[0].click();
                }
              }
            }
          }
        });
      }
    });
    // xử lí xóa chat sau này 

  });
}

socket.on("respone-remove-contact", function (user) {
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();

  // giảm 1 ở notification
  decreaseNumberNotification("count-contacts", 1); // js/caculateNotification.js

  // Handle chat sau khi chấp nhận kết bạn
  // b0: check active
  let checkActive = $(`#all-chat`).find(`li[data-chat = ${user.id}]`).hasClass("active");

  // b1: remove leftSide.ejs
  $("#all-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
  $("#user-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();

  // b2: remove rightSide.ejs
  $("#screen-chat").find(`div#to_${user.id}`).remove();

  // b3: remove image modal
  $("body").find(`div#imagesModal_${user.id}`).remove();

  // b4: remove attachment modal
  $("body").find(`div#attachmentsModal_${user.id}`).remove();

  // b5: click first conversation
  if (checkActive) {
    $("ul.people").find("a")[0].click();
  }
});

$(document).ready(function () {
  removeContact();
});
