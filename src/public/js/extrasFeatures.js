// extras
function searchConversation() {
  $("#input-search-conversation").bind("keypress", function(element) {
    if (element.which === 13) {
      let keyword = $("#input-search-conversation").val();
      let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

      if (!keyword.length) {
        alertify.notify("Chưa nhập nội dung tìm kiếm.", "error", 7);
        return false;
      }

      if (!regexKeyword.test(keyword)) {
        alertify.notify("Lỗi từ khóa tìm kiếm, chỉ cho phép kí tự chữ cái và số. Cho phép khoảng trống.", "error", 7);
        return false;
      }

      $.get(`/conversation/search/${keyword}`, function(data) {
        $("#search-results").find("ul").html(data);
        $("#search-results").css("display", "block");

        $(document).click(function() {
          $("#search-results").css("display", "none");
        });

        $("#search-results").find("li").bind("click", function() {
          let dataChat = $(this).data("chat");
          $("ul.people").find(`a[href="#uid_${dataChat}"]`).click();
        });
      });
    }
  });
}

function readMorePersonalChat() {
  $("#link-read-more-user-chat").bind("click", function() {
    let skipPersonal = $("#user-chat").find("li").length;

    $("#link-read-more-user-chat").css("display", "none");
    $(".read-more-user-chat-loader").css("display", "inline-block");

    $.get(`/message/read-more-personal-chat?skipPersonal=${skipPersonal}`, function(data) {
      if (data.leftSideData.trim() === "") {
        alertify.notify("Bạn không còn cuộc trò chuyện nào để xem nữa cả.", "error", 7);
        $("#link-read-more-user-chat").css("display", "inline-block");
        $(".read-more-user-chat-loader").css("display", "none");

        return false;
      }

      // Step 01: handle leftSide
      $("#user-chat").find("ul").append(data.leftSideData);

      // Step 02: handle scroll left
      resizeNineScroll();
      nineScrollLeft();

      // Step 03: handle rightSide
      $("#screen-chat").append(data.rightSideData);

      // Step 04: call Screen chat
      changeScreenChat();

      // Step 05: convert emoji
      converEmoji();

      // Step 06: handle imageModal
      $("body").append(data.imageModalData);

      // Step 07: call gridPhotos
      gridPhotos(5);

      // Step 08: handle attachment Modal
      $("body").append(data.attachmentModalData);

      // Step 09: check online
      socket.emit("check-status");

      // Step 10: remove loading
      $("#link-read-more-user-chat").css("display", "inline-block");
      $(".read-more-user-chat-loader").css("display", "none");

      // step 11: call readmoreMessage
      readMoreMessages();

      // extras
      zoomImageChat();
    });
  });
}

function readMoreGroupChat() {
  $("#link-read-more-group-chat").bind("click", function() {
    let skipGroup = $("#group-chat").find("li").length;

    $("#link-read-more-group-chat").css("display", "none");
    $(".read-more-group-chat-loader").css("display", "inline-block");

    $.get(`/message/read-more-group-chat?skipGroup=${skipGroup}`, function(data) {
      if (data.leftSideData.trim() === "") {
        alertify.notify("Bạn không còn cuộc trò chuyện nào để xem nữa cả.", "error", 7);
        $("#link-read-more-group-chat").css("display", "inline-block");
        $(".read-more-group-chat-loader").css("display", "none");

        return false;
      }

      // Step 01: handle leftSide
      $("#group-chat").find("ul").append(data.leftSideData);

      // Step 02: handle scroll left
      resizeNineScroll();
      nineScrollLeft();

      // Step 03: handle rightSide
      $("#screen-chat").append(data.rightSideData);

      // Step 04: call Screen chat
      changeScreenChat();

      // Step 05: convert emoji
      converEmoji();

      // Step 06: handle imageModal
      $("body").append(data.imageModalData);

      // Step 07: call gridPhotos
      gridPhotos(5);

      // Step 08: handle attachment Modal
      $("body").append(data.attachmentModalData);

      // Step 09: check online
      socket.emit("check-status");

      // Step 10: remove loading
      $("#link-read-more-group-chat").css("display", "inline-block");
      $(".read-more-group-chat-loader").css("display", "none");

      // step 11: call readmoreMessage
      readMoreMessages();

      // extras
      zoomImageChat();
      $("body").append(data.membersModalData);
      userTalk();
    });
  });
}

$(document).ready(function() {
  searchConversation();
  readMorePersonalChat();
  readMoreGroupChat();
});
