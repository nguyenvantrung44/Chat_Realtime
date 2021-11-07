import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper";
/**
 * @param io from socket.io lib 
 */
let newGroupChat = (io) => {

  let clients = {};

  io.on("connection", (socket) => {

    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);


    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on("new-group-created", (data) => { // data of emit

      // b1: bắn id group vào socket
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);

      let response = {
        groupChat: data.groupChat,
        membersModalData: data.membersModalData
      }

      // bắn về cho các member
      data.groupChat.members.forEach(member => {
        if (clients[member.userId] && member.userId != socket.request.user._id) {
          emitNotifyToArray(clients, member.userId, io, "response-new-group-created", response);
        }
      });

    });

    socket.on("member-received-group-chat", (data) => {
      // b1: bắn id group vào socket
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on("disconnect", () => {
      // remove socket id when socket disconnect
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });

  });
};

module.exports = newGroupChat;

