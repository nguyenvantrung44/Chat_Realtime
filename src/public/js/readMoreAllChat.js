$(document).ready(function () {
  $("#link-read-more-all-chat").bind("click", function () {
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;

    console.log(skipPersonal);
    console.log(skipGroup);
    $("#link-read-more-all-chat").css("display", "none");
    $(".read-more-all-chat-loader").css("display", "inline-block");

    setTimeout(() => {
      $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function (data) {
       
        if(data.leftSideData.trim() === "") {
          alertify.notify("Bạn không còn cuộc trò truyện nào.", "error", 7);
          $("#link-read-more-all-chat").css("display", "inline-block");
          $(".read-more-all-chat-loader").css("display", "none");
          return false;
        }

        // b1: handle leftSide
        $("#all-chat").find("ul").append(data.leftSideData);

        // b2: nineScrollLeft
        resizeNineScroll(); // refresh scroll left
        nineScrollLeft();

        // b3: handle rightSide
        $("#screen-chat").append(data.rightSideData);

        // b4: call function changeScreenChat
        resizeNineScroll();
        changeScreenChat();

        // b5: call function converEmoji
        converEmoji();

        // b6: handle image modal
        $("body").append(data.imageModalData);

        // b7: call function gridPhotos(5);
        gridPhotos(5);

        // b8: handle attachmentModal
        $("body").append(data.attachmentModalData);

        // b9: update online
        socket.emit("check-status");

        // b10: remove loading
        $("#link-read-more-all-chat").css("display", "inline-block");
        $(".read-more-all-chat-loader").css("display", "none");

        // b11: call readMoreMessages
        readMoreMessages();
        //  đợi xử lí sau

        // extras step 10
        zoomImageChat();
        $("body").append(data.membersModalData);
        userTalk();

      });
    }, 1000);

  });
});
