// b0: 
  socket.emit("check-status");

// b1: lắng nghe các user đang online
socket.on("server-send-list-users-online", function (listUserIds) {
  listUserIds.forEach(userId => {
    $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
    $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
  });
});

// b2: lắng nghe user login online
socket.on("server-send-when-new-user-online", function (userId) {
    $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
    $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
});

// b3: lắng nghe user login offline
socket.on("server-send-when-user-offline", function (userId) {
    $(`.person[data-chat=${userId}]`).find("div.dot").removeClass("online");
    $(`.person[data-chat=${userId}]`).find("img").removeClass("avatar-online");
});
