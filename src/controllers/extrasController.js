import {extras} from "./../services/index";
import {validationResult} from "express-validator/check";
import ejs from "ejs";
import {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from "./../helpers/clientHelper";
import {promisify} from "util";

// Make renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind(ejs);

let searchConversation = async (req, res) => {
  let errorsArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorsArr.push(item.msg);
    });
    // Logging when validation errors, this can show to normal user
    // console.log(errorsArr);
    return res.status(500).send(errorsArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let allConversations = await extras.searchConversation(currentUserId, keyword);
    return res.render("main/extras/_searchConversation", {allConversations});
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

let readMorePersonalChat = async (req, res) => {
  try {
    // get skip number from query param
    let skipPersonal = +(req.query.skipPersonal);
    // get more item
    let newPersonalConversations = await extras.readMorePersonalChat(req.user._id, skipPersonal);

    let dataToRender = {
      newPersonalConversations: newPersonalConversations,
      bufferToBase64: bufferToBase64,
      lastItemOfArray: lastItemOfArray,
      convertTimestampToHumanTime: convertTimestampToHumanTime,
      user: req.user
    };

    let leftSideData = await renderFile("src/views/main/extras/readMorePersonal/_leftSide.ejs", dataToRender);
    let rightSideData = await renderFile("src/views/main/extras/readMorePersonal/_rightSide.ejs", dataToRender);
    let imageModalData = await renderFile("src/views/main/extras/readMorePersonal/_imageModal.ejs", dataToRender);
    let attachmentModalData = await renderFile("src/views/main/extras/readMorePersonal/_attachmentModal.ejs", dataToRender);

    return res.status(200).send({
      leftSideData: leftSideData,
      rightSideData: rightSideData,
      imageModalData: imageModalData,
      attachmentModalData: attachmentModalData
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

let readMoreGroupChat = async (req, res) => {
  try {
    // get skip number from query param
    let skipGroup = +(req.query.skipGroup);
    // get more item
    let newGroupConversations = await extras.readMoreGroupChat(req.user._id, skipGroup);

    let dataToRender = {
      newGroupConversations: newGroupConversations,
      bufferToBase64: bufferToBase64,
      lastItemOfArray: lastItemOfArray,
      convertTimestampToHumanTime: convertTimestampToHumanTime,
      user: req.user
    };

    let leftSideData = await renderFile("src/views/main/extras/readMoreGroup/_leftSide.ejs", dataToRender);
    let rightSideData = await renderFile("src/views/main/extras/readMoreGroup/_rightSide.ejs", dataToRender);
    let imageModalData = await renderFile("src/views/main/extras/readMoreGroup/_imageModal.ejs", dataToRender);
    let attachmentModalData = await renderFile("src/views/main/extras/readMoreGroup/_attachmentModal.ejs", dataToRender);
    let membersModalData = await renderFile("src/views/main/extras/readMoreGroup/_membersModal.ejs", dataToRender);

    return res.status(200).send({
      leftSideData: leftSideData,
      rightSideData: rightSideData,
      imageModalData: imageModalData,
      attachmentModalData: attachmentModalData,
      membersModalData: membersModalData
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  searchConversation: searchConversation,
  readMorePersonalChat: readMorePersonalChat,
  readMoreGroupChat: readMoreGroupChat
};
