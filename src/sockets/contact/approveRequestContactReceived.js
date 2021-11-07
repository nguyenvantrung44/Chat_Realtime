import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper";
/**
 * @param io from socket.io lib 
 */
let approveRequestContactReceived = (io) => {

  let clients = {};

  io.on("connection", (socket) => {

    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on("approve-request-contact-received", (data) => {
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      };

      // emit notification
      if (clients[data.contactId]) {
        emitNotifyToArray(clients, data.contactId, io, "respone-approve-request-contact-received", currentUser);
      };
    });
    socket.on("disconnect", () => {
      // remove socket id when socket disconnect
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
    });
    // console.log(clients);
  });
};

module.exports = approveRequestContactReceived;
