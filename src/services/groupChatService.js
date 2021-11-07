import _ from "lodash";
import chatGroupModel from "./../models/chatGroupModel";
import userModel from "./../models/userModel";

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
  return new Promise(async (resolve, reject) => {
    try {
      // add currentUserid to array member, unshift đẩy item lên đầu # push: the end 
      arrayMemberIds.unshift({ userId: `${currentUserId}` });
      arrayMemberIds = _.uniqBy(arrayMemberIds, "userId"); // xóa lắp

      let newGroupItem = {
        name: groupChatName,
        userAmount: arrayMemberIds.length,
        userId:  `${currentUserId}`,
        members: arrayMemberIds
      };

      let newGroup = await chatGroupModel.createNew(newGroupItem);

       // extras get userInfo
       newGroup = newGroup.toObject();
       newGroup.membersInfo = [];
       for (let member of newGroup.members) {
         let userInfo = await userModel.getNormalUserDataById(member.userId);
         newGroup.membersInfo.push(userInfo);
       }

      resolve(newGroup);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  addNewGroup: addNewGroup
}
