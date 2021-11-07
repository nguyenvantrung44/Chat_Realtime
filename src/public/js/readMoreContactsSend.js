$(document).ready(function () {
  $("#link-read-more-contacts-send").bind("click", function () {
    let skipNumber = $("#request-contact-sent").find("li").length;

    $("#link-read-more-contacts-send").css("display", "none");
    $(".read-more-contacts-send-loader").css("display", "inline-block");

    setTimeout(() => {
      $.get(`/contact/read-more-contacts-send?skipNumber=${skipNumber}`, function (newContactUsers) {
        if (!newContactUsers.length) {
          alertify.notify("Bạn không còn danh sách nào.", "error", 7);
          $("#link-read-more-contacts-send").css("display", "inline-block");
          $(".read-more-contacts-send-loader").css("display", "none");
          return false;
        };

        newContactUsers.forEach(function (user) {
          $("#request-contact-sent")
            .find("ul")
            .append(
              `<li class="_contactList" data-uid="${user._id}">
                    <div class="contactPanel">
                        <div class="user-avatar">
                            <img src="images/users/${user.avatar}" alt="">
                        </div>
                        <div class="user-name">
                            <p>
                              ${user.username}
                            </p>
                        </div>
                        <br>
                        <div class="user-address">
                            <span>&nbsp ${(user.address !== null) ? user.address : ""}</span>
                        </div>
                        <div class="user-remove-request-contact-send action-danger display-important" data-uid="${user._id}">
                            Hủy yêu cầu
                        </div>
                    </div>
                </li>`); // thêm thông báo ở modal notif khi read more      
        });

        // js/removeRequesContactSend.js;
        removeRequesContactSend(); 

        $("#link-read-more-contacts-send").css("display", "inline-block");
        $(".read-more-contacts-send-loader").css("display", "none");
      });
    }, 1000);

  });
});
