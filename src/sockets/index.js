import addNewContact from "./contact/addNewContact";
import removeRequestContactSend from "./contact/removeRequestContactSend";
import removeRequestContactReceived from "./contact/removeRequestContactReceived";
import approveRequestContactReceived from "./contact/approveRequestContactReceived";
import removeContact from "./contact/removeContact";
import chatTextEmoji from "./chat/chatTextEmoji";
import typingOn from "./chat/typingOn";
import typingOff from "./chat/typingOff";
import chatImage from "./chat/chatImage";
import chatAttachment from "./chat/chatAttachment";
import chatVideo from "./chat/chatVideo";
import userOnlineOffline from "./status/UserOnlineOffline";
import newGroupChat from "./group/newGroupChat";


/**
 * @param io from socket.io library 
 */
let initSockets = (io) => {
  addNewContact(io);
  removeRequestContactSend(io);
  removeRequestContactReceived(io);
  approveRequestContactReceived(io);
  removeContact(io);
  chatTextEmoji(io);
  typingOn(io);
  typingOff(io);
  chatImage(io);
  chatAttachment(io);
  chatVideo(io);
  userOnlineOffline(io);
  newGroupChat(io);
}

module.exports = initSockets;
