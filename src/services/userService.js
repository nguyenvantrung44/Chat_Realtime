import UserModel from "./../models/userModel";
import { transErrors } from "./../../lang/vi";
import bcryptjs from "bcryptjs";

const saltRounds = 7;

/**
 * update user info
 * @param {userId} id 
 * @param {dataUpdate} item 
 */
let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};
/**
 * update password for user
 * @param {userId} id 
 * @param {dataUpdate} dataUpdate 
 */
let updatePassword = (id, dataUpdate) => {
  return new Promise(async (resolve, reject) => {
    // tìm user theo id
    let currentUser = await UserModel.findUserByIdToUpdatePassword(id);

    // nếu không tồn tại idUser
    if (!currentUser) {
      return reject(transErrors.account_undefined);
    }
    // check password hiện tại với dataUpdate.currentPassword(nhận từ controller)
    let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);

    // false
    if (!checkCurrentPassword) {
      return reject(transErrors.user_current_password_failed);
    }
    // true
    let salt = bcryptjs.genSaltSync(saltRounds);
    await UserModel.updatePassword(id, bcryptjs.hashSync(dataUpdate.newPassword, salt));
    // after update pw success , return true to controller
    resolve(true);

  });
}

let getUser = () => {
  return new Promise(async (resolve, reject) => {
    let users = await UserModel.getUser();
    resolve(users);
  });
}

let blockUser = (id) => {
  return new Promise(async (resolve, reject) => {
    let users = await UserModel.blockUser(id, Date.now());
    resolve(users);
  });
}

let unBlockUser = (id) => {
  return new Promise(async (resolve, reject) => {
    let users = await UserModel.unBlockUser(id);
    resolve(users);
  });
}

module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword,
  getUser: getUser,
  unBlockUser: unBlockUser,
  blockUser: blockUser
};
