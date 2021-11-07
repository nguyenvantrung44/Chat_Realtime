import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper";
/**
 * @param io from socket.io lib 
 */
let typingOff = (io) => {

  let clients = {};

  io.on("connection", (socket) => {

    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    

    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on("new-group-created", (data) => { // data of emit
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
    });

    socket.on("member-received-group-chat", (data) => {
      // b1: bắn id group vào socket
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on("user-is-not-typing", (data) => { // data of emit

      // group
      if (data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id
        };
        // emit notification
        if (clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, "response-user-is-not-typing", response);
        };
      }

      // personal
      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id
        };
        // emit notification
        if (clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, "response-user-is-not-typing", response);
        };
      }
    });
    socket.on("disconnect", () => {
      // remove socket id when socket disconnect
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
    // console.log(clients);
  });
};

module.exports = typingOff;
