import express from "express";
import { home, auth, user, contact, notification, message, groupChat, extras } from "./../controllers/index";
import { authValid, userValid, contactValid, messageValid, groupChatValid, extrasValid } from "./../validation/index";
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/facebook";
import initPassportGoogle from "./../controllers/passportController/google";
import passport from "passport";

//init passport 
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */

let initRoutes = (app) => {
  router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);
  router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister);
  router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount); // api gửi ở email của người dùng(dùng để active account)
  router.post("/login", auth.checkLoggedOut, passport.authenticate("local", { // xác thực kiểu account local
    successRedirect: "/", // xác thực thành công chuyển hướng về home
    failureRedirect: "/login-register", // error 
    successFlash: true, // bật true để có thể truyền các flash request về
    failureFlash: true
  }));

  router.get("/auth/facebook", auth.checkLoggedOut, passport.authenticate("facebook", { scope: ["email"] }));
  router.get("/auth/facebook/callback", auth.checkLoggedOut, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", { scope: ["openid email profile"] }));
  router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get("/", auth.checkLoggedIn, home.getHome);
  router.get("/logout", auth.checkLoggedIn, auth.getLogOut);

  router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar);
  router.put("/user/update-info", auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);
  router.put("/user/update-password", auth.checkLoggedIn, userValid.updatePassword, user.updatePassword);

  router.get("/contact/find-users/:keyword", auth.checkLoggedIn, contactValid.findUsersContact, contact.findUsersContact);
  router.post("/contact/add-new", auth.checkLoggedIn, contact.addNew);
  router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
  router.delete("/contact/remove-request-contact-send", auth.checkLoggedIn, contact.removeRequestContactSend);
  router.delete("/contact/remove-request-contact-received", auth.checkLoggedIn, contact.removeRequestContactReceived);
  router.put("/contact/approve-request-contact-received", auth.checkLoggedIn, contact.approveRequestContactReceived);
  router.get("/contact/read-more-contacts", auth.checkLoggedIn, contact.readMoreContacts);
  router.get("/contact/read-more-contacts-send", auth.checkLoggedIn, contact.readMoreContactsSend);
  router.get("/contact/read-more-contacts-received", auth.checkLoggedIn, contact.readMoreContactsReceived);
  router.get("/contact/search-friends/:keyword", auth.checkLoggedIn, contactValid.searchFriends, contact.searchFriends);

  router.get("/notification/read-more", auth.checkLoggedIn, notification.readMore);
  router.put("/notification/mark-all-as-read", auth.checkLoggedIn, notification.markAllAsRead);

  // message
  router.post("/message/add-new-text-emoji", auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);
  router.post("/message/add-new-image", auth.checkLoggedIn, message.addNewImage);
  router.post("/message/add-new-attachment", auth.checkLoggedIn, message.addNewAttachment);
  router.get("/message/read-more-all-chat", auth.checkLoggedIn, message.readMoreAllChat);
  router.get("/message/read-more", auth.checkLoggedIn, message.readMore);

  router.post("/group-chat/add-new", auth.checkLoggedIn, groupChatValid.addNewGroup, groupChat.addNewGroup );
  
  // admin
  router.get("/disconnectUserbyID/:id", auth.checkLoggedIn, user.blockUser);
  router.get("/connectUserbyID/:id", auth.checkLoggedIn, user.unBlockUser);

  router.get("/conversation/search/:keyword", auth.checkLoggedIn, extrasValid.searchConversation, extras.searchConversation);
  router.get("/message/read-more-personal-chat", auth.checkLoggedIn, extras.readMorePersonalChat);
  router.get("/message/read-more-group-chat", auth.checkLoggedIn, extras.readMoreGroupChat);
  
  return app.use("/", router);
};

module.exports = initRoutes;
