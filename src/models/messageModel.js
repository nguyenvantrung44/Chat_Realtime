import mongoose from "mongoose";

let Schema= mongoose.Schema;
let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String
  },
  reciver: {
    id: String,
    name: String,
    avatar: String
  },
  text: String,
  file: {data: Buffer, contentType: String, fileName: String},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null} 
});

MessageSchema.statics = {

  /**
   * 
   * @param {object} item 
   */
  createNewMessage(item) {
    return this.create(item);
  },

  /**
   * lấy ra mesage giữa các cá nhân
   * @param {string} senderId  currentUserId
   * @param {string} receiverId 
   * @param {number} limit 
   */
   getMessagesPersonal(senderId, receiverId, limit) {
    return this.find({
      $or: [
        {$and: [
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]}, 
        {$and: [
          {"receiverId": senderId},
          {"senderId": receiverId}
        ]}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

    /**
   * lấy ra mesage trong group
   * @param {string} receiverId 
   * @param {number} limit 
   */
  getMessagesInGroup(receiverId, limit) {
    return this.find({"receiverId": receiverId}).sort({"createdAt": -1}).limit(limit).exec();
  },

  readMoreMessagesPersonal(senderId, receiverId, skip, limit) {
    return this.find({
      $or: [
        {$and: [
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]}, 
        {$and: [
          {"receiverId": senderId},
          {"senderId": receiverId}
        ]}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },

  readMoreMessagesInGroup(receiverId,skip, limit) {
    return this.find({"receiverId": receiverId}).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  }
};

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: "personal",
  GROUP: "group"
}

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file"
}
module.exports = {
  model: mongoose.model("message",MessageSchema),
  conversationTypes: MESSAGE_CONVERSATION_TYPES,
  messageTypes: MESSAGE_TYPES
}
