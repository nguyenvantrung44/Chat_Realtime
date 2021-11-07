function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`).unbind("change").on("change", function () {
    let fileData = $(this).prop("files")[0];
    let limit = 1048576; // byte   = 1MB

    if (fileData.size > limit) {
      alertify.notify("Ảnh upload tối đa cho phép là 1MB", "error", 7);
      $(this).val(null);
      return false;
    }

    let targetId = $(this).data("chat");
    let isChatGroup = false;

    let messageFormdata = new FormData();

    messageFormdata.append("my-attachment-chat", fileData);
    messageFormdata.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageFormdata.append("isChatGroup", true);
      isChatGroup = true
    }

    $.ajax({
      url: "/message/add-new-attachment",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormdata,
      success: function (data) {
        let dataToEmit = {
          message: data.message
        }

        // b1: xử lí dữ liệu trước khi show
        let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
        let attachmentChat = ` <a href="data:${data.message.file.contentType}; base64, 
                        ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">
                                  ${data.message.file.fileName}
                              </a>`

        if (isChatGroup) {
          // group
          let senderAvatar = `
                  <img src="/images/users/${data.message.sender.avatar}" 
                  class="avatar-small" title="${data.message.sender.name}"/>
            `;
          messageOfMe.html(`${senderAvatar} ${attachmentChat}`);

          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId; // targetId: id of group
        } else {
          // trò truyện cá nhân
          messageOfMe.html(attachmentChat);
          dataToEmit.contactId = targetId // id of personal
        }

        // b2: append message vào màn hình chat
        $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // b3: remove text trong input ẩn và input của emoji: nothing to code

        // b4: thay đổi message preview và time (leftSide)
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

        // b5: đẩy chat lên đầu 
        $(`.person[data-chat=${divId}]`).on("trungnguyen.moveConversationToTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove); // closest search ul gần nhất và move lên top
          $(this).off("trungnguyen.moveConversationToTop"); // đóng event click
        });
        $(`.person[data-chat=${divId}]`).trigger("trungnguyen.moveConversationToTop");

        // b6: Emit realtime
        socket.emit("chat-attachment", dataToEmit);

        // b7: Emit remove typing real-time: nothing to code!
        // b8: nếu tồn tại typing sẽ xóa: nothing to code!

        // b9: thêm hình ảnh vào modal tệp đính kèm
        let attachmentChatAddModal = `<li>
                                          <a href="data:${data.message.file.contentType}; base64, 
                                          ${bufferToBase64(data.message.file.data.data)}" 
                                              download="${data.message.file.fileName}">
                                              ${data.message.file.fileName}
                                          </a>
                                      </li>`;
        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatAddModal);

      },
      error: function (error) {
        alertify.notify(error.responseText, "error", 7);
      }
    });

  });
}

$(document).ready(function () {
  socket.on("response-chat-attachment", function (response) {
    let divId = "";

    // b1: xử lí dữ liệu trước khi show
    let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
    let attachmentChat = ` <a href="data:${response.message.file.contentType}; base64, 
                              ${bufferToBase64(response.message.file.data.data)}"
                              download="${response.message.file.fileName}">
                                    ${response.message.file.fileName}
                            </a>`

    // group
    if (response.currentGroupId) {
      let senderAvatar = `
             <img src="/images/users/${response.message.sender.avatar}" 
             class="avatar-small" title="${response.message.sender.name}"/>
       `;
      messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      // trò truyện cá nhân
      messageOfYou.html(attachmentChat);
      divId = response.currentUserId;
    }

    // b2: append message vào màn hình chat
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat = ${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    // b3: remove text trong input ẩn và input của emoji: nothing to code

    // b4: thay đổi message preview và time (leftSide)
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

    // b5: đẩy chat lên đầu 
    $(`.person[data-chat=${divId}]`).on("trungnguyen.moveConversationToTop", function () {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove); // closest search ul gần nhất và move lên top
      $(this).off("trungnguyen.moveConversationToTop"); // đóng event click
    });
    $(`.person[data-chat=${divId}]`).trigger("trungnguyen.moveConversationToTop");

    // b6 7 8 nothing to code

    // b9: thêm hình ảnh vào modal image
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let attachmentChatAddModal = `<li>
                                  <a href="data:${response.message.file.contentType}; base64, 
                                  ${bufferToBase64(response.message.file.data.data)}" 
                                      download="${response.message.file.fileName}">
                                      ${response.message.file.fileName}
                                  </a>
                              </li>`;

      $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatAddModal);
    }

  });
});
