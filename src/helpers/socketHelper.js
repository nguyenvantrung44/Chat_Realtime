export let pushSocketIdToArray = (clients, userId, socketId) => {
  if (clients[userId]) {
    clients[userId].push(socketId);
  } else {
    clients[userId] = [socketId];
  }
  return clients;
};

// thông báo đến các socketId của userid 
export let emitNotifyToArray = (clients, userId, io, eventName, data) => {
  clients[userId].forEach(socketId => io.sockets.connected[socketId].emit(eventName, data));
};

// remove socket khi F5
export let removeSocketIdFromArray = (clients, userId, socket) => {
  clients[userId] = clients[userId].filter(socketId => socketId !== socket.id);
 
  // remove array when array empty
  if (!clients[userId].length) {
    delete clients[userId];
  }
  return clients;
};
