import mongoose from "mongoose";

let Schema = mongoose.Schema;
let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null }
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  /**
   * các item liên quan đến user
   * @param {string} userId 
   */
  findAllByUser(userId) {
    return this.find({
      // điều kiện hoặc: 
      $or: [
        { "userId": userId },
        { "contactId": userId }
      ]
    }).exec();
  },

  /**
   * Kiểm tra tồn tại của 2 user
   * @param {string} userId 
   * @param {string} contactId 
   */
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        {
          $and: [
            { "userId": userId },
            { "contactId": contactId }
          ]
        },
        {
          $and: [
            { "userId": contactId },
            { "contactId": userId }
          ]
        }
      ]
    }).exec();
  },

  /**
   * xóa danh bạ
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeContact(userId, contactId) {
    return this.remove({
      $or: [
        {
          $and: [
            { "userId": userId },
            { "contactId": contactId },
            { "status": true }
          ]
        },
        {
          $and: [
            { "userId": contactId },
            { "contactId": userId },
            { "status": true }
          ]
        }
      ]
    }).exec();
  },

  /**
   * Hủy yêu cầu kết bạn
   * @param {*} userId 
   * @param {*} contactId 
   */
  removeRequestContactSend(userId, contactId) {
    return this.remove({
      $and: [
        { "userId": userId },
        { "contactId": contactId },
        { "status": false }
      ]
    }).exec();
  },
  /**
   * Hủy yêu cầu kết bạn được gửi đến userId
   * @param {*} userId 
   * @param {*} contactId 
   */
  removeRequestContactReceived(userId, contactId) {
    return this.remove({
      $and: [
        { "userId": contactId },
        { "contactId": userId },
        { "status": false }
      ]
    }).exec();
  },

  /**
   * chấp nhận yêu cầu kết bạn được gửi đến currentUser
   * @param {*} userId 
   * @param {*} contactId 
   */
  approveRequestContactReceived(userId, contactId) {
    return this.update({
      $and: [
        { "userId": contactId },
        { "contactId": userId },
        { "status": false }
      ]
    }, { "status": true },
      { "updatedAt": Date.now() }).exec();
  },

  /**
   * get contacts by userId and limit
   * @param {string} userId 
   * @param {number} limit 
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId }
          ]
        },
        { "status": true }
      ]
    }).sort({ "updatedAt": -1 }).limit(limit).exec();
  },

  /**
    * get contacts send by userId and limit
    * @param {string} userId 
    * @param {number} limit 
    */
  getContactsSend(userId, limit) {
    return this.find({
      $and: [
        { "userId": userId },
        { "status": false }
      ]
    }).sort({ "createdAt": -1 }).limit(limit).exec();
  },

  /**
    * get contacts recei by userId and limit
    * @param {string} userId 
    * @param {number} limit 
    */
  getContactsRecived(userId, limit) {
    return this.find({
      $and: [
        { "contactId": userId },
        { "status": false }
      ]
    }).sort({ "createdAt": -1 }).limit(limit).exec();
  },
  /**
   * count all contacts by userId
   * @param {string} userId 
   */
  countAllContacts(userId) {
    return this.count({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId }
          ]
        },
        { "status": true }
      ]
    }).exec();
  },

  /**
   * count all contacts by userId
   * @param {string} userId 
   */
  countAllContactsSend(userId, limit) {
    return this.count({
      $and: [
        { "userId": userId },
        { "status": false }
      ]
    }).exec();
  },

  /**
     * count all contacts by userId
     * @param {string} userId 
     */
  countAllContactsRecived(userId) {
    return this.count({
      $and: [
        { "contactId": userId },
        { "status": false }
      ]
    }).exec();
  },


  /**
 * read more contacts by userId, skip, limit , max 10 one time
 * @param {string} userid 
 * @param {number} skip 
 * @param {number} limit 
 */
  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId }
          ]
        },
        { "status": true }
      ]
    }).sort({ "updatedAt": -1 }).skip(skip).limit(limit).exec();
  },

  /**
 * read more contacts send by userId, skip, limit , max 10 one time
 * @param {string} userid 
 * @param {number} skip 
 * @param {number} limit 
 */
  readMoreContactsSend(userId, skip, limit) {
    return this.find({
      $and: [
        { "userId": userId },
        { "status": false }
      ]
    }).sort({ "createdAt": -1 }).skip(skip).limit(limit).exec();
  },

  /**
 * read more contacts received by userId, skip, limit , max 10 one time
 * @param {string} userid 
 * @param {number} skip 
 * @param {number} limit 
 */
  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [
        { "contactId": userId },
        { "status": false }
      ]
    }).sort({ "createdAt": -1 }).skip(skip).limit(limit).exec();
  },

  /**
   * cập nhật contact khi có 1 new message
   * @param {string} userId 
   * @param {string} contactId 
   */
  updateWhenHasNewMessage(userId, contactId) {
    return this.update({
      $or: [
        {
          $and: [
            { "userId": userId },
            { "contactId": contactId }
          ]
        },
        {
          $and: [
            { "userId": contactId },
            { "contactId": userId }
          ]
        }
      ]
    }, {
      "updatedAt": Date.now()
    }).exec();
  },

  /**
  * get friends by userId 
  * @param {string} userId 
  */
  getFriends(userId) {
    return this.find({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId }
          ]
        },
        { "status": true }
      ]
    }).sort({ "updatedAt": -1 }).exec();
  }
  
};




module.exports = mongoose.model("contact", ContactSchema);
