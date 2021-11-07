import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import NotificationModel from "../models/notificationModel";
import _ from "lodash";


const LIMIT_NUMBER = 10;

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserId = [currentUserId];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);

    contactsByUser.forEach((contact) => {
      deprecatedUserId.push(contact.userId);
      deprecatedUserId.push(contact.contactId);
    });
    
    deprecatedUserId = _.uniqBy(deprecatedUserId);
    let users = await UserModel.findAllForAddContact(deprecatedUserId, keyword);
    resolve(users);
  });
};

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExists(currentUserId, contactId);
    if (contactExists) {
      return reject(false);
    }

    // create contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };

    // notification
    let newContact = await ContactModel.createNew(newContactItem);

    // create notification
    let notificationItem = {
      senderId: currentUserId,
      reciverId: contactId,
      type: NotificationModel.types.ADD_CONTACT
    };
    
    await NotificationModel.model.createNew(notificationItem);
    resolve(newContact);
  });
};

let removeContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeContact = await ContactModel.removeContact(currentUserId, contactId);
    if (removeContact.result.n === 0) {
      return reject(false);
    }
    resolve(true);
  });
};

let removeRequestContactSend = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactSend(currentUserId, contactId);
    if (removeReq.result.n === 0) {
      return reject(false);
    }

    // remove notification
    await NotificationModel.model.removeRequestContactSendNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);
  });
};

let removeRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactReceived(currentUserId, contactId);
    if (removeReq.result.n === 0) {
      return reject(false);
    }

    // không làm
    // remove notification
    // await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);
  });
};

let approveRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let approveReq = await ContactModel.approveRequestContactReceived(currentUserId, contactId);

    if (approveReq.nModified === 0) {
      return reject(false);
    }

    // create notification
    let notificationItem = {
      senderId: currentUserId,
      reciverId: contactId,
      type: NotificationModel.types.APPROVE_CONTACT
    };

    // create new notification
    await NotificationModel.model.createNew(notificationItem);
    resolve(true);
  });
};

let getContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER);

      //sử dụng mapp để hứng dữ liệu
      let users = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};
let getContactsSend = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsSend(currentUserId, LIMIT_NUMBER);

      //sử dụng mapp để hứng dữ liệu
      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};
let getContactsRecived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsRecived(currentUserId, LIMIT_NUMBER);

      //sử dụng mapp để hứng dữ liệu
      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};
let countAllContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsSend = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsSend(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsRecived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsRecived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * read more contacts , max 10 one time
 * @param {string} currentUserId 
 * @param {number} skipNumberContacts 
 */
let readMoreContacts = (currentUserId, skipNumberContacts) => {

  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_NUMBER);

      //sử dụng mapp để hứng dữ liệu
      let users = newContacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {

          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });
      // console.log(await Promise.all(getNotifContents));

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * read more contacts send , max 10 one time
 * @param {string} currentUserId 
 * @param {number} skipNumberContacts 
 */
let readMoreContactsSend = (currentUserId, skipNumberContacts) => {

  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsSend(currentUserId, skipNumberContacts, LIMIT_NUMBER);

      //sử dụng mapp để hứng dữ liệu
      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });
      // console.log(await Promise.all(getNotifContents));

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * read more contacts received , max 10 one time
 * @param {string} currentUserId 
 * @param {number} skipNumberContacts 
 */
let readMoreContactsReceived = (currentUserId, skipNumberContacts) => {

  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsReceived(currentUserId, skipNumberContacts, LIMIT_NUMBER);

      //sử dụng mapp để hứng dữ liệu
      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });
      // console.log(await Promise.all(getNotifContents));

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let searchFriends = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let friendIds = [];
    let friends = await ContactModel.getFriends(currentUserId);

    friends.forEach((item) => {
      friendIds.push(item.userId);
      friendIds.push(item.contactId);
    });

    // remove trùng lặp
    friendIds = _.uniqBy(friendIds);

    // lọc userId # currentUserId 
    friendIds = friendIds.filter(userId => userId != currentUserId);    

    let users = await UserModel.findAllToAddGroupChat(friendIds, keyword);

    resolve(users);
  });
};



module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeContact: removeContact,
  removeRequestContactSend: removeRequestContactSend,
  removeRequestContactReceived: removeRequestContactReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  getContacts: getContacts,
  getContactsSend: getContactsSend,
  getContactsRecived: getContactsRecived,
  countAllContacts: countAllContacts,
  countAllContactsSend: countAllContactsSend,
  countAllContactsRecived: countAllContactsRecived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSend: readMoreContactsSend,
  readMoreContactsReceived: readMoreContactsReceived,
  searchFriends: searchFriends
};
