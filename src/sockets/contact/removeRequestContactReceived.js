import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "../../helpers/socketHelper";

/**
 * @param io from socket.io lib 
 */
let removeRequestContactReceived = (io) => {

  let clients = {};

  io.on("connection", (socket) => {

    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on("remove-request-contact-received", (data) => {
      let currentUser = {
        id: socket.request.user._id
      };

      // emit notification
      if (clients[data.contactId]) {
        emitNotifyToArray(clients, data.contactId, io, "respone-remove-request-contact-received", currentUser);
      };
    });
    socket.on("disconnect", () => {
      // remove socket id when socket disconnect
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
    });
    // console.log(clients);
  });
};

module.exports = removeRequestContactReceived;
