import { check } from "express-validator/check";
import { transValidation } from "./../../lang/vi";

let addNewGroup = [
  check("arrayIds", transValidation.add_new_group_user_incorrec)
    .custom((value) => {
      if (!Array.isArray(value) || value.length < 2) {
        return false;
      }
      return true;
    }),
  check("groupChatName", transValidation.add_new_group_name_incorrec)
    .isLength({ min: 5, max: 30 })
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
];
module.exports = {
  addNewGroup: addNewGroup
}
