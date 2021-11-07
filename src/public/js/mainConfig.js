
const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: 'burlywood',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function resizeNineScroll() {
  $(".left").getNiceScroll().resize();
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: 'burlywood',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function (editor, event) {
        // gán giá trị thay đổi vào thẻ input đã bị ẩn
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function () {
        // bật lắng nghe dom cho việc chat tin nhắn văn bản và emoji
        textAndEmojiChat(divId);

        // Bật chức năng đang gõ chat
        typingOn(divId);
      },
      blur: function () {
        // Tắt chức năng đang gõ chat
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function (event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('.master-loader').css('display', 'none');
}

function spinLoading() {
  $('.master-loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function () {
      spinLoading();
    })
    .ajaxStop(function () {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function () {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}



function configNotification() {
  $('#noti_Button').click(function () {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function () {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function () {
    let href = $(this).attr("href");
    let modalImageId = href.replace("#", "");

    let originDataImage = $(`#${modalImageId}`).find("div.modal-body").html();

    let countRows = Math.ceil($(`#${modalImageId}`).find("div.all-images>img").length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    $(`#${modalImageId}`).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function () {
        $(`#${modalImageId}`).find(".all-images").css({
          "visibility": "visible"
        });
        $(`#${modalImageId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
      }
    });

    // Bắt sự kiện đóng modal
    $(`#${modalImageId}`).on("hidden.bs.modal", function () {
      $(this).find("div.modal-body").html(originDataImage);
    });
  });
}

function showButtonGroupChat() {
  $('#select-type-chat').bind('change', function () {
    if ($(this).val() === 'group-chat') {
      $('.create-group-chat').show();
      // Do something...
    } else {
      $('.create-group-chat').hide();
    }
  });
}

function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, "success", 7);
  }
}

function changeTypeChat() {
  $("#select-type-chat").bind("change", function () {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");
    if ($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    }
    else {
      $(".create-group-chat").show();
    }
  });
}


function changeScreenChat() {
  $(".room-chat").unbind("click").on("click", function () {
    let divId = $(this).find("li").data("chat");

    $(".person").removeClass("active");
    $(`.person[data-chat=${divId}]`).addClass("active");
    $(this).tab("show");

    // cấu hình thanh cuộn bên box chat rightSide.ejs mỗi khi click chuột vào 1 chat cụ thể
    nineScrollRight(divId);

    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);

    // bật lắng nghe dom chat tin nhắn ảnh
    imageChat(divId);

    // bật lắng nghe dom chat tin nhắn tệp đính kèm
    attachmentChat(divId);

    // Bật lắng nghe dom cho việc call video personal
    videoChat(divId);
  });
}

function converEmoji() {
  $(".convert-emoji").each(function () {
    var original = $(this).html();
    // use .shortnameToImage if only converting shortnames (for slightly better performance)
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
}

function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}

// extras
function zoomImageChat() {
  $(".show-image-chat").unbind("click").on("click", function() {
    $("#img-chat-modal").css("display", "block");
    $("#img-chat-modal-content").attr("src", $(this)[0].src);

    $("#img-chat-modal").on("click", function() {
      $(this).css("display", "none");
    });
  });
}

function notYetConversations() {
  if (!$("ul.people").find("a").length) {
    Swal.fire({
      title: 'Bạn chưa có bạn bè? Hãy tìm kiếm bạn bè của mình nhé!',
      type: "info",
      showCancelButton: false,
      confirmButtonColor: "#2ECC71",
      confirmButtonText: "Xác nhận!"
    }).then((result) => {
      $("#contactsModal").modal("show");
    }
    );
  }
}

function userTalk() {
  $(".user-talk").unbind("click").on("click", function () {
    let dataChat = $(this).data("uid");
    $("ul.people").find(`a[href="#uid_${dataChat}"]`).click();
    $(this).closest("div.modal").modal("hide");
  });
}

$(document).ready(function () {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị button mở modal tạo nhóm trò chuyện
  showButtonGroupChat();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Flash message man hinh` master
  flashMasterNotify();

  // thay đổi kiểu trò truyện
  changeTypeChat();

  // thay đổi màn hình chat
  changeScreenChat();

  // revert unicode về hình ảnh
  converEmoji();

  // click vào phần tử đầu tiên khi F5 trang web
  if ($("ul.people").find("a").length) {
    $("ul.people").find("a")[0].click();
  }

  notYetConversations();

  userTalk();

  zoomImageChat();

  $("#video-chat-group").bind("click", function () {
    alertify.notify("Tính năng đang chờ phát triển !", "error", 7);
  });

});
