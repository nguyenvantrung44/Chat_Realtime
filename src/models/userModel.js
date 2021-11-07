import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

let Schema = mongoose.Schema;
let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
  isAdmin: { type: Boolean, default: false }
});
/**
 * Chỉ nằm ở phạm vi schema để giúp chúng ta tìm ra các bản ghi
 */
UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },

  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec();
  },

  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },

  findUserById(id) {
    return this.findById(id).exec();
  },

  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  },

  findUserByIdForSessionToUse(id) {
    return this.findById(id, { "local.password": 0 }).exec();
  },

  findFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },

  findGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },

  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec(); // return old item after updated
  },

  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, { "local.password": hashedPassword }).exec();
  },
  /**
   * tìm users để add vào contact
   * @param {array} deprecatedUserId 
   * @param {string} keyword 
   */
  findAllForAddContact(deprecatedUserId, keyword) {
    return this.find({
      // nin: not in, lọc những user có id không nằm trong array
      $and: [
        { "_id": { $nin: deprecatedUserId } },
        { "local.isActive": true },
        //tìm những user có username gần giống nhất mà user gửi lên
        {
          $or: [
            { "username": { "$regex": new RegExp(keyword, "i") } },
            { "local.email": { "$regex": new RegExp(keyword, "i") } },
            { "facebook.email": { "$regex": new RegExp(keyword, "i") } },
            { "google.email": { "$regex": new RegExp(keyword, "i") } }
          ]
        }
      ]
    }, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
  },

  getNormalUserDataById(id) {
    return this.findById(id, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
  },

  /**
 * tìm bạn bè của user để add vào group chat
 * @param {array} friendIds 
 * @param {string} keyword 
 */
  findAllToAddGroupChat(friendIds, keyword) {
    return this.find({
      // in, lọc những user có id  nằm trong array
      $and: [
        { "_id": { $in: friendIds } },
        { "local.isActive": true },
        //tìm những user có username gần giống nhất mà user gửi lên
        {
          $or: [
            { "username": { "$regex": new RegExp(keyword, "i") } },
            { "local.email": { "$regex": new RegExp(keyword, "i") } },
            { "facebook.email": { "$regex": new RegExp(keyword, "i") } },
            { "google.email": { "$regex": new RegExp(keyword, "i") } }
          ]
        }
      ]
    }, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
  },
  getUser() {
    return this.find(
      {
        "isAdmin": {$nin: "true"}
      },
      { _id: 1, username: 1, phone: 1, address: 1, "local.email": 1, "facebook.email": 1, "google.email": 1, gender: 1, "deletedAt": 1 }).exec();
  },
  blockUser(id, deletedAt) {
    console.log(id, deletedAt);
    return this.findOneAndUpdate(
      {
        "_id": id
      },
      {
        "deletedAt": deletedAt 
      }).exec();
  },

  unBlockUser(id) {
    return this.findOneAndUpdate(
      {
        "_id": id
      },
      {
        "deletedAt": null
      }).exec();
  },
  // extras
  getNormalUserDataByIdAndKeyword (id, keyword) {
    return this.find({
      $and: [
        {"_id": id},
        {"local.isActive": true},
        { $or: [
          {"username": {"$regex": new RegExp(keyword, "i") }},
          {"local.email": {"$regex": new RegExp(keyword, "i") }},
          {"facebook.email": {"$regex": new RegExp(keyword, "i") }},
          {"google.email": {"$regex": new RegExp(keyword, "i") }}
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  }

};
/**
 * sau khi có được bản ghi thì để sử dụng được, để so sánh thì sử sụng methods
 */
UserSchema.methods = {
  comparePassword(password) {
    return bcryptjs.compare(password, this.local.password); // return promise has result is true or false
  }
};

module.exports = mongoose.model("user", UserSchema);
