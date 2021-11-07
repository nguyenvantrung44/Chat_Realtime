function textAndEmojiChat(divId) {
  $(".emojionearea").unbind("keyup").on("keyup", function (element) {
    let currentEmojiArea = $(this);
    if (element.which === 13) {
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();

      if (!targetId.length || !messageVal.length) {
        return false;
      }

      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVal
      };

      if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataTextEmojiForSend.isChatGroup = true;
      }

      // gọi gửi message
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
        // success

        let dataToEmit = {
          message: data.message
        }

        // b1: xử lí dữ liệu trước khi show
        let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
        messageOfMe.text(data.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfMe.html());

        if (dataTextEmojiForSend.isChatGroup) {
          // group
          let senderAvatar = `
                <img src="/images/users/${data.message.sender.avatar}" 
                class="avatar-small" title="${data.message.sender.name}"/>
          `;
          messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);

          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId; // targetId: id of group
        } else {
          // trò truyện cá nhân
          messageOfMe.html(convertEmojiMessage);
          dataToEmit.contactId = targetId // id of personal
        }



        // b2: append message vào màn hình chat
        $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // b3: remove text trong input ẩn và input của emoji
        $(`#write-chat-${divId}`).val("");
        currentEmojiArea.find(".emojionearea-editor").text("");

        // b4: thay đổi message preview và time (leftSide)
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

        // b5: đẩy chat lên đầu 
        $(`.person[data-chat=${divId}]`).on("trungnguyen.moveConversationToTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove); // closest search ul gần nhất và move lên top
          $(this).off("trungnguyen.moveConversationToTop"); // đóng event click
        });
        $(`.person[data-chat=${divId}]`).trigger("trungnguyen.moveConversationToTop");

        // b6: Emit realtime
        socket.emit("chat-text-emoji", dataToEmit);

        // b7: Emit remove typing real-time
        typingOff(divId);

        // b8: nếu tồn tại typing sẽ xóa
        let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
        if (checkTyping.length) {
          checkTyping.remove();
        }

      }).fail(function (responese) {
        // error
        console.log(responese);
      });
    }
  });
}

$(document).ready(function () {
  socket.on("response-chat-text-emoji", function (response) {

    let divId = "";
    // b1: xử lí dữ liệu trước khi show
    let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
    messageOfYou.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(messageOfYou.html());

    // group
    if (response.currentGroupId) {
      let senderAvatar = `
            <img src="/images/users/${response.message.sender.avatar}" 
            class="avatar-small" title="${response.message.sender.name}"/>
      `;
      messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);
      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      // trò truyện cá nhân
      messageOfYou.html(convertEmojiMessage);
      divId = response.currentUserId;
    }
    // b3 : nothing
    // b2: append message vào màn hình chat
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat = ${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    // b4: thay đổi message preview và time (leftSide)
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

    // b5: đẩy chat lên đầu 
    $(`.person[data-chat=${divId}]`).on("trungnguyen.moveConversationToTop", function () {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove); // closest search ul gần nhất và move lên top
      $(this).off("trungnguyen.moveConversationToTop"); // đóng event click
    });
    $(`.person[data-chat=${divId}]`).trigger("trungnguyen.moveConversationToTop");

    // b6: nothing
  });
});
