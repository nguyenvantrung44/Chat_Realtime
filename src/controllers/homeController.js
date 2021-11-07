import { notification, contact, message, user } from "./../services/index";
import { bufferToBase64, lastItemOfArray, convertTimestampToHumanTime } from "./../helpers/clientHelper";
import request from "request";


let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // Node Get ICE STUN and TURN list
    // let o = {
    //   format: "urls"
    // };

    // let bodyString = JSON.stringify(o);
    // let options = {
    //   url: "https://global.xirsys.net/_turn/hoza-chat",
    //   // host: "global.xirsys.net",
    //   // path: "/_turn/hoza-chat",
    //   method: "PUT",
    //   headers: {
    //     "Authorization": "Basic " + Buffer.from("nguyenvantrung44:db0724c4-3c6e-11ec-a0a4-0242ac130003").toString("base64"),
    //     "Content-Type": "application/json",
    //     "Content-Length": bodyString.length
    //   }
    // };

    // // call a request to get ICE list of turn server
    // request(options, (error, response, body) => {
    //   if(error){
    //     console.log("Error when ice list: "+error);
    //     return reject(error);
    //   }

    //   let bodyJson = JSON.parse(body);
    //   resolve(bodyJson.v.iceServers); 
    // });
    resolve([]);
  });
};

let getHome = async (req, res) => {

  // chỉ hiển thị 10 item 1 lần
  let notifications = await notification.getNotifications(req.user._id);

  // get tổng notif chưa đọc
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  // get contacts(10 item one time)
  let contacts = await contact.getContacts(req.user._id);

  // get contacts send(10 item one time)
  let contactsSend = await contact.getContactsSend(req.user._id);

  // get contacts reci(10 item one time)
  let contactsRecived = await contact.getContactsRecived(req.user._id);

  // count contact
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSend = await contact.countAllContactsSend(req.user._id);
  let countAllContactsRecived = await contact.countAllContactsRecived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);

  // tất cả message 
  let allConversationsWithMessages = getAllConversationItems.allConversationsWithMessages;

  // get ice list from turn server
  let iceServersList = await getICETurnServer();

  // getUser 
  let users = await user.getUser();

  if (req.user.isAdmin) {
    return res.render("admin/master", {
      errors: req.flash("errors"),
      success: req.flash("success"),
      getUser: users
    })
  } 

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    contactsSend: contactsSend,
    contactsRecived: contactsRecived,
    countAllContacts: countAllContacts,
    countAllContactsSend: countAllContactsSend,
    countAllContactsRecived: countAllContactsRecived,
    allConversationsWithMessages: allConversationsWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimestampToHumanTime: convertTimestampToHumanTime,
    iceServersList: JSON.stringify(iceServersList)
  });

};

module.exports = {
  getHome: getHome
};
