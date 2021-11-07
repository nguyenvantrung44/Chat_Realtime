import { validationResult } from "express-validator/check";
import { groupChat } from "./../services/index";

// extras
import ejs from "ejs";
import {promisify} from "util";


// Make renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind(ejs); // extras

let addNewGroup = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());

    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    return res.status(500).send(errorArr);
  }
  try {
    let currentUserId = req.user._id;
    let arrayMemberIds = req.body.arrayIds;
    let groupChatName = req.body.groupChatName;

    let newGroupChat = await groupChat.addNewGroup(currentUserId, arrayMemberIds, groupChatName);

     // extras
     let membersModalData = await renderFile("src/views/main/extras/_newMembersModal.ejs", {
      newGroupChat: newGroupChat,
      user: req.user
    });

    return res.status(200).send({
      groupChat: newGroupChat,
      membersModalData: membersModalData, //extras
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewGroup: addNewGroup
};
