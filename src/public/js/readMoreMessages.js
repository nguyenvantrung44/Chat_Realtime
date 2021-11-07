function readMoreMessages() {
  $(".right .chat").unbind("scroll").on("scroll", function () {

    // get the first message
    let firstMessage = $(this).find(".bubble:first");
    // get position of first message
    let currentOffset = firstMessage.offset().top - $(this).scrollTop();


    if ($(this).scrollTop() === 0) {
      let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`
      $(this).prepend(messageLoading);

      let targetId = $(this).data("chat");
      let skipMessage = $(this).find("div.bubble").length;
      let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

      let thisDom = $(this);

      $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function (data) {
        if (data.rightSideData.trim() === "") {
          alertify.notify("Bạn không còn tin nhắn trong cuộc trò truyện.", "error", 7);
          thisDom.find("img.message-loading").remove();
          return false;
        }

        // b1: 
        $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);

        // b2: prevent scroll
        $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);

        // b3: convert emoji
        converEmoji();

        // b4: handle image modal
        $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);

        // b5: call gridPhotos(5);
        gridPhotos(5);

        // b6: handle attachment modal
        $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);

        // b7: remove message loading
        thisDom.find("img.message-loading").remove();

        // extras step 8
        zoomImageChat();        

      });
    }
  });
}

$(document).ready(function () {
  readMoreMessages();
});
