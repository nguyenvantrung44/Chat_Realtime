import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN = 2;
const LIMIT_MESSAGES_TAKEN = 10;

let searchConversation = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      // Do cần làm gấp nên chưa tối ưu việc lấy user theo id + keyword, để sau
      let usersContactPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataByIdAndKeyword(contact.userId, keyword);

          if (getUserContact.length) {
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact[0]; // get by id & keyword => just one item
          }
        } else {
          let getUserContact = await UserModel.getNormalUserDataByIdAndKeyword(contact.contactId, keyword);

          if (getUserContact.length) {
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact[0]; // get by id & keyword => just one item
          }
        }
      });

      let userConversations = await Promise.all(usersContactPromise);
      userConversations = _.filter(userConversations, user => typeof user !== "undefined");

      let groupConversations = await ChatGroupModel.getChatGroupsByUserIdAndKeyword(currentUserId, keyword, LIMIT_CONVERSATIONS_TAKEN);

      // merge two array: userConversations & groupConversations
      let allConversations = userConversations.concat(groupConversations);
      // console.log(allConversations);

      // sort by updatedAt desending
      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt;
      });

      resolve(allConversations);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let readMorePersonalChat = (currentUserId, skipPersonal) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.readMoreContacts(currentUserId, skipPersonal, LIMIT_CONVERSATIONS_TAKEN);
      let usersContactPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }

        let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
        getUserContact.updatedAt = contact.updatedAt;
        return getUserContact;
      });

      let userConversations = await Promise.all(usersContactPromise);

      // sort by updatedAt desending
      userConversations = _.sortBy(userConversations, (item) => {
        return -item.updatedAt;
      });

      // get messages to apply in screen chat
      let userConversationsWithMessagesPromise = userConversations.map(async (conversation) => {
        conversation = conversation.toObject();

        let getMessages = await MessageModel.model.getMessagesPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
        conversation.messages = _.reverse(getMessages);

        return conversation;
      });
      let userConversationsWithMessages = await Promise.all(userConversationsWithMessagesPromise);
      // sort by updatedAt desending
      userConversationsWithMessages = _.sortBy(userConversationsWithMessages, (item) => {
        return -item.updatedAt;
      });

      resolve(userConversationsWithMessages);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let readMoreGroupChat = (currentUserId, skipGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      let groupConversations = await ChatGroupModel.readMoreChatGroups(currentUserId, skipGroup, LIMIT_CONVERSATIONS_TAKEN);

      // sort by updatedAt desending
      groupConversations = _.sortBy(groupConversations, (item) => {
        return -item.updatedAt;
      });

      // get messages to apply in screen chat
      let groupConversationsWithMessagesPromise = groupConversations.map(async (conversation) => {
        conversation = conversation.toObject();

        let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
        conversation.messages = _.reverse(getMessages);

        // extras get userInfo
        conversation.membersInfo = [];
        for (let member of conversation.members) {
          let userInfo = await UserModel.getNormalUserDataById(member.userId);
          conversation.membersInfo.push(userInfo);
        }

        return conversation;
      });
      let groupConversationsWithMessages = await Promise.all(groupConversationsWithMessagesPromise);
      // sort by updatedAt desending
      groupConversationsWithMessages = _.sortBy(groupConversationsWithMessages, (item) => {
        return -item.updatedAt;
      });

      resolve(groupConversationsWithMessages);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  searchConversation: searchConversation,
  readMorePersonalChat: readMorePersonalChat,
  readMoreGroupChat: readMoreGroupChat
};
