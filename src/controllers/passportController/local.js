import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../../models/userModel";
import ChatGroupModel from "./../../models/chatGroupModel";
import { transErrors, transSuccess } from "./../../../lang/vi";

let localStrategy = passportLocal.Strategy;

/**
 * Valid user account type: local
 */

let initPassportLocal = () => {
  passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      let user = await UserModel.findByEmail(email);
      if (!user) {
        return done(null, false, req.flash("errors", transErrors.login_failed));
      }
      if (!user.local.isActive) {
        return done(null, false, req.flash("errors", transErrors.account_not_active));
      }
      if (user.deletedAt != null) {
        return done(null, false, req.flash("errors", transErrors.account_undefined));
      }

      let checkPassword = await user.comparePassword(password);

      if (!checkPassword) {
        return done(null, false, req.flash("errors", transErrors.login_failed));
      }
      if (user.isAdmin) {
        return done(null, user, req.flash("success", transSuccess.loginAdminSuccess(user.username)));
      }

      return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
    } catch (error) {
      return done(null, false, req.flash("errors", transErrors.server_error));
    }
  }));

  // save userid to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  /**
   * this is called by passport.session()
   * return userInfo to req.user
   */
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await UserModel.findUserByIdForSessionToUse(id);
      let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);

      user = user.toObject();
      user.chatGroupIds = getChatGroupIds; // gán vào object user
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
};

module.exports = initPassportLocal;
