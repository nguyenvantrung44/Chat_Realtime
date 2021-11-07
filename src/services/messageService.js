import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel"
import messageModel from "./../models/messageModel";
import { transErrors } from "./../../lang/vi";
import { app } from "./../config/app";
import _ from "lodash";
import fsExtra from "fs-extra";

//LIMIT_CONVERSATION_TAKEN
const LIMIT_CONVERSATION_TAKEN = 15;
const LIMIT_MESSAGE_TAKEN = 30;

/**
 * get all convertation
 * @param {string} curentUserId
 */
let getAllConversationItems = (curentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contact = await contactModel.getContacts(curentUserId, LIMIT_CONVERSATION_TAKEN);
      let userConversationsPromise = contact.map(async (ct) => {
        if (ct.contactId == curentUserId) {
          let getUserContact = await userModel.findUserById(ct.userId);
          getUserContact.updatedAt = ct.updatedAt;
          return getUserContact;

        } else {
          let getUserContact = await userModel.findUserById(ct.contactId);
          getUserContact.updatedAt = ct.updatedAt;
          return getUserContact;
          // return await userModel.findUserById(ct.contactID);
        }

      });

      // có dữ liệu danh bạ 
      let userConversations = await Promise.all(userConversationsPromise);
      // lấy group chat của userId
      let groupConversations = await chatGroupModel.getChatGroups(curentUserId, LIMIT_CONVERSATION_TAKEN);
      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return item.updatedAt;
      });

      // lấy message apply vào màn hình chat
      let allConversationsWithMessagesPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();

        if (conversation.members) {
          let getMessages = await messageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGE_TAKEN);
          conversation.messages = _.reverse(getMessages);

          // get user info
          conversation.membersInfo = [];
          for (let member of conversation.members) {
            let userInfo = await userModel.getNormalUserDataById(member.userId);
            conversation.membersInfo.push(userInfo);
          }        
          
        } else {
          let getMessages = await messageModel.model.getMessagesPersonal(curentUserId, conversation._id, LIMIT_MESSAGE_TAKEN);
          conversation.messages = _.reverse(getMessages);
        }

        return conversation;
      });

      let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);

      // sắp xếp updatedAt giảm dần
      allConversationsWithMessages = _.sortBy(allConversationsWithMessages, (item) => {
        return -item.updatedAt;
      });
    
      resolve({
        allConversationsWithMessages: allConversationsWithMessages
      });
    } catch (error) {
      reject(error)
    }
  });
};

/**
 * thêm 1 message text emoji
 * @param {object} sender curentUser
 * @param {string} receiveId id of user or group
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender, receiveId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiveId);
        if (!getChatGroupReceiver) {
          return reject(transErrors.conversation_notfault);
        };

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.avatar_group_chat
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.GROUP,
          messageType: messageModel.messageTypes.TEXT,
          sender: sender,
          reciver: receiver,
          text: messageVal,
          createdAt: Date.now()
        };

        // new message
        let newMessage = await messageModel.model.createNewMessage(newMessageItem);

        // update group chat
        await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);

        resolve(newMessage);
      } else {
        let getUserReceiver = await userModel.getNormalUserDataById(receiveId);
        if (!getUserReceiver) {
          return reject(transErrors.conversation_notfault);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.PERSONAL,
          messageType: messageModel.messageTypes.TEXT,
          sender: sender,
          reciver: receiver,
          text: messageVal,
          createdAt: Date.now()
        };

        // new message
        let newMessage = await messageModel.model.createNewMessage(newMessageItem);
        await contactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
        resolve(newMessage);
      }
    } catch (error) {
      console.log(error);
    }
  });
};
/**
 * thêm 1 message image
 * @param {object} sender curentUser
 * @param {string} receiveId id of user or group
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewImage = (sender, receiveId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiveId);
        if (!getChatGroupReceiver) {
          return reject(transErrors.conversation_notfault);
        };

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.avatar_group_chat
        };

        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.GROUP,
          messageType: messageModel.messageTypes.IMAGE,
          sender: sender,
          reciver: receiver,
          file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
          createdAt: Date.now()
        };

        // new message
        let newMessage = await messageModel.model.createNewMessage(newMessageItem);

        // update group chat
        await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);

        resolve(newMessage);
      } else {
        let getUserReceiver = await userModel.getNormalUserDataById(receiveId);
        if (!getUserReceiver) {
          return reject(transErrors.conversation_notfault);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };

        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.PERSONAL,
          messageType: messageModel.messageTypes.IMAGE,
          sender: sender,
          reciver: receiver,
          file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
          createdAt: Date.now()
        };

        // new message
        let newMessage = await messageModel.model.createNewMessage(newMessageItem);
        await contactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
        resolve(newMessage);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

/**
 * thêm 1 message attachment
 * @param {object} sender curentUser
 * @param {string} receiveId id of user or group
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewAttachment = (sender, receiveId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiveId);
        if (!getChatGroupReceiver) {
          return reject(transErrors.conversation_notfault);
        };

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.avatar_group_chat
        };

        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.GROUP,
          messageType: messageModel.messageTypes.FILE,
          sender: sender,
          reciver: receiver,
          file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
          createdAt: Date.now()
        };

        // new message
        let newMessage = await messageModel.model.createNewMessage(newMessageItem);

        // update group chat
        await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);

        resolve(newMessage);
      } else {
        let getUserReceiver = await userModel.getNormalUserDataById(receiveId);
        if (!getUserReceiver) {
          return reject(transErrors.conversation_notfault);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };

        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.PERSONAL,
          messageType: messageModel.messageTypes.FILE,
          sender: sender,
          reciver: receiver,
          file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
          createdAt: Date.now()
        };

        // new message
        let newMessage = await messageModel.model.createNewMessage(newMessageItem);
        await contactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
        resolve(newMessage);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

/**
 * get thêm chat personal & group chat
 * @param {string} currentUserId 
 * @param {number} skipPersonal 
 * @param {number} skipGroup 
 */
let readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contact = await contactModel.readMoreContacts(currentUserId, skipPersonal, LIMIT_CONVERSATION_TAKEN);

      let userConversationsPromise = contact.map(async (ct) => {
        if (ct.contactId == currentUserId) {
          let getUserContact = await userModel.findUserById(ct.userId);
          getUserContact.updatedAt = ct.updatedAt;
          return getUserContact;

        } else {
          let getUserContact = await userModel.findUserById(ct.contactId);
          getUserContact.updatedAt = ct.updatedAt;
          return getUserContact;
          // return await userModel.findUserById(ct.contactID);
        }

      });

      // có dữ liệu danh bạ 
      let userConversations = await Promise.all(userConversationsPromise);

      // lấy group chat của userId
      let groupConversations = await chatGroupModel.readMoreChatGroups(currentUserId, skipGroup, LIMIT_CONVERSATION_TAKEN);
      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy(allConversations, (item) => {
        return item.updatedAt;
      });

      // lấy message apply vào màn hình chat
      let allConversationsWithMessagesPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();

        if (conversation.members) {
          let getMessages = await messageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGE_TAKEN);
          conversation.messages = _.reverse(getMessages);

          // extras get userInfo
          conversation.membersInfo = [];
          for (let member of conversation.members) {
            let userInfo = await userModel.getNormalUserDataById(member.userId);
            conversation.membersInfo.push(userInfo);
          }

        } else {
          let getMessages = await messageModel.model.getMessagesPersonal(currentUserId, conversation._id, LIMIT_MESSAGE_TAKEN);
          conversation.messages = _.reverse(getMessages);
        }

        return conversation;
      });

      let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);

      // sắp xếp updatedAt giảm dần
      allConversationsWithMessages = _.sortBy(allConversationsWithMessages, (item) => {
        return -item.updatedAt;
      });


      resolve(allConversationsWithMessages);
    } catch (error) {
      reject(error)
    }
  });
};

/**
 * 
 * @param {string} currentUserId 
 * @param {number} skipMessage 
 * @param {string} targetId 
 * @param {boolean} chatInGroup 
 */
let readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      // message in group chat
      if (chatInGroup) {
        let getMessages = await messageModel.model.readMoreMessagesInGroup(targetId, skipMessage, LIMIT_MESSAGE_TAKEN);
        getMessages = _.reverse(getMessages);

        return resolve(getMessages);
      }

      // message in personal
      let getMessages = await messageModel.model.readMoreMessagesPersonal(currentUserId, targetId, skipMessage, LIMIT_MESSAGE_TAKEN);
      getMessages = _.reverse(getMessages);
      return resolve(getMessages);

    } catch (error) {
      reject(error)
    }
  });
};

module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment,
  readMoreAllChat: readMoreAllChat,
  readMore: readMore
};
