import { notification } from ".";
import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";

const LIMIT_NUMBER = 10;

/**
 * get notification when f5 page
 * Just 10 item one time
 * @param {string} currentId 
 * @param {number} limit 
 */
let getNotifications = (currentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentId, LIMIT_NUMBER);

      //sử dụng mapp để hứng dữ liệu
      let getNotifContents = notifications.map(async (notification) => {
        let sender = await UserModel.getNormalUserDataById(notification.senderId);
        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });
      // console.log(await Promise.all(getNotifContents));

      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *  lấy tất cả các thông báo chưa đọc
 * @param {string} currentId  
 */
let countNotifUnread = (currentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificationsUnRead = await NotificationModel.model.countNotifUnread(currentId);
      resolve(notificationsUnRead);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * get thêm thông báo , max là 10 item
 * @param {string} currentId 
 * @param {number} skipNumeber 
 * @returns 
 */
let readMore = (currentId, skipNumeber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newNotifications = await NotificationModel.model.readMore(currentId, skipNumeber, LIMIT_NUMBER);

      //sử dụng mapp để hứng dữ liệu
      let getNotifContents = newNotifications.map(async (notification) => {
        let sender = await UserModel.getNormalUserDataById(notification.senderId);
        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });
      // console.log(await Promise.all(getNotifContents));

      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * đánh dấu tất cả thông báo đã đọc
 * @param {string} currentId 
 * @param {array} targetUsers 
 */
let markAllAsRead = (currentId, targetUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      await NotificationModel.model.markAllAsRead(currentId, targetUsers);
      resolve(true);
    } catch (error) {
      console.log(`Đã có lỗi xảy ra: ${error}`);
      reject(false);
    }
  });
};

module.exports = {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread,
  readMore: readMore,
  markAllAsRead: markAllAsRead
}
