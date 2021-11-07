import session from "express-session";
import connectMongo from "connect-mongo";
require('dotenv').config();

let MongoStore = connectMongo(session);

/**
 * nơi lưu trữ session
 */
let sessionStore = new MongoStore({
  url: `mongodb://hozachat:hozachat@cluster0-shard-00-00.tqaqq.mongodb.net:27017,cluster0-shard-00-01.tqaqq.mongodb.net:27017,cluster0-shard-00-02.tqaqq.mongodb.net:27017/hozachat?ssl=true&replicaSet=atlas-p9ekey-shard-0&authSource=admin&retryWrites=true&w=majority`,
  autoReconnect: true
  // autoRemove: "native"
});

/**
 * Config session for app
 * @param app from exactly express module
 */
let config = (app) => {
  app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore, // lưu session
    resave: true, // để lưu lại
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 86400000 seconds = 1 day - thời gian sống tối đa của session
    }
  }));
};

module.exports = {
  config: config,
  sessionStore: sessionStore
};
