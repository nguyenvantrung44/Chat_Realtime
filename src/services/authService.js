
import UserModel from "./../models/userModel";
import bcrypt from "bcryptjs";
import uuidv4 from "uuid/v4";
import {transErrors, transSuccess, transMail} from "./../../lang/vi";
import sendMail from "./../config/mailer";

let saltRounds = 7;

let register =  (email,gender,password, protocol, host) => {
  return new Promise( async (resolve, reject) => {
    let userByEmail = await UserModel.findByEmail(email);
    if(userByEmail){
      if(userByEmail.deletedAt != null ){
        return reject(transErrors.account_removed);
      }
      if(!userByEmail.local.isActive){
        return reject(transErrors.account_not_active);
      }
      return reject(transErrors.account_in_use);
    }
    let salt = bcrypt.genSaltSync(saltRounds);
  
    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt), // tranh tan cong vet' can, tan cong tu dien dc, vi no ngau nhien
        verifyToken: uuidv4()
      }
    };
    let user = await UserModel.createNew(userItem);
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`; // đường dẫn liên kết active account
    //send email
    sendMail(email, transMail.subject, transMail.template(linkVerify))
    .then(success => {
      resolve(transSuccess.userCreated(user.local.email));
    })
    .catch(async (error) => {
      //remove user
      await UserModel.removeById(user._id);
      reject(transMail.send_failed);
    });
  });
};

let verifyAccount =  (token) => {
  return new Promise(async (resolve, reject) => {

    let userByToken = await UserModel.findByToken(token);
    // kiểm tra token có tồn tại
    if(!userByToken){
      return reject(transErrors.token_underfined);
    }
    await UserModel.verify(token);

    resolve(transSuccess.account_actived);
  });
}
module.exports = {
  register: register,
  verifyAccount: verifyAccount
};
