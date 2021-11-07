import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper";
/**
 * @param io from socket.io lib 
 */
let userOnlineOffline = (io) => {

  let clients = {};

  io.on("connection", (socket) => {

    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);


    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    // khi 1 group mới được tạo
    socket.on("new-group-created", (data) => { // data of emit
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
    });

    socket.on("member-received-group-chat", (data) => {
      // b1: bắn id group vào socket
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on("check-status", () => {
      let listUserOnline = Object.keys(clients);
      // b1: emit  về cho user
      socket.emit("server-send-list-users-online", listUserOnline);


      // b2: emit đến các user khi có 1 new user online
      socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);
    });

    socket.on("disconnect", () => {
      // remove socket id when socket disconnect
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });

      // b3 emit đến các user khi có 1 new user offline
      socket.broadcast.emit("server-send-when-user-offline", socket.request.user._id);
    });
    // console.log(clients);
  });
};

module.exports = userOnlineOffline;
