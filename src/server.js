import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import pem from "pem";
import https from "https";
import http from 'http';
import socketio from "socket.io";
import initSockets from "./sockets/index";
import configSocketIo from "./config/socketio";
import cookieParser from "cookie-parser";
import events from "events";
import * as configApp from "./config/app";

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//         throw err
//     }
    // Init app
    let app = express();

    // set max connection event listeners
    events.EventEmitter.defaultMaxListeners = configApp.app.max_envent_listeners;

    // Init server with socket.io and express app
    let server = http.createServer(app);
    let io = socketio(server);

    // connect to mongo
    ConnectDB();

    // config session
    session.config(app);

    // config view engine
    configViewEngine(app);

    // enable post data request
    app.use(bodyParser.urlencoded({ extended: true }));

    // enable flash message
    app.use(connectFlash());

    // Use cookie-parser
    app.use(cookieParser());

    // config passportjs
    app.use(passport.initialize()); // khởi tạo
    app.use(passport.session());    // làm việc với session

    //init all routes
    initRoutes(app);

    // config socketio
    configSocketIo(io, cookieParser, session.sessionStore);
   
    // Init all sockets
    initSockets(io);

    // https.createServer({ key: keys.clientKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    //     console.log(`hello trung den voi ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
    // });
//});

server.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`hello trung den voi ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});
