import mongoose from "mongoose";
import bluebird from "bluebird"; 
require('dotenv').config();

/**
 * Connect to mongodb
 */
let connectDB = () => {
  mongoose.Promise = bluebird;
  // let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  let URI = `mongodb://hozachat:hozachat@cluster0-shard-00-00.tqaqq.mongodb.net:27017,cluster0-shard-00-01.tqaqq.mongodb.net:27017,cluster0-shard-00-02.tqaqq.mongodb.net:27017/hozachat?ssl=true&replicaSet=atlas-p9ekey-shard-0&authSource=admin&retryWrites=true&w=majority`;
  return mongoose.connect(URI);
};

module.exports = connectDB;
