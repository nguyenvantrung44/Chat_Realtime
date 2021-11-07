let userAvatar = null;
let userInfo = {};
let avatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout() {
  let timerInterval;
  Swal.fire({
    position: "top-end",
    title: "Tự động đăng xuất sau 5 giây!",
    html: "Thời gian: <strong></strong>",
    timer: 5000,
    onBeforeOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
      }, 1000);
    },
    onClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    $.get("/logout", function () {
      location.reload();
    });
  });
}
// validate client
function updateUserInfo() {
  $("#input-change-avatar").bind("change", function(){
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // byte   = 1MB


    if($.inArray(fileData.type, math) === -1) { 
      alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận .jpg, .png hoặc .jpeg", "error", 7);
      $(this).val(null);
      return false;
    }
    if(fileData.size > limit) {
      alertify.notify("Ảnh upload tối đa cho phép là 1MB", "error", 7);
      $(this).val(null);
      return false;
    }

    if(typeof (FileReader) != "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty(); // làm rỗng image

      let fileReader = new FileReader();
      fileReader.onload = function(element) {
        $("<img>", {
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview);
      }
      imagePreview.show(); // hiển thị
      fileReader.readAsDataURL(fileData);
      let formdata = new FormData();
      formdata.append("avatar", fileData);
      userAvatar = formdata;
    } else {
      alertify.notify("Trình duyệt của bạn không hỗ trợ file FileReader", "error", 7);
    }
  });

  $("#input-change-username").bind("change", function(){
    let username = $(this).val(); // lấy value sau khi người dùng thay đổi và click ra ngoài form thì sự kiện change này sẽ được gọi
    let regxUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!regxUsername.test(username) || username.length < 3 || username.length > 17 ){
      alertify.notify("Username giới hạn trong khoảng 3-17 kí tự và không được phép chứa kí tự đặc biệt!", "error", 7);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }
    userInfo.username = username; // truyển thuộc tính username vào đối tượng userInfo
  });

  $("#input-change-gender-male").bind("click", function(){
    let gender = $(this).val();
    if(gender !== "male"){
      alertify.notify("Oops! Dữ liệu giới tính có vấn đề; hacker hả bạn?  ^ ^", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;
  });

  $("#input-change-gender-female").bind("click", function(){
    let gender = $(this).val();
    if(gender !== "female"){
      alertify.notify("Oops! Dữ liệu giới tính có vấn đề; hacker hả bạn?  ^ ^", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;
  });

  $("#input-change-address").bind("change", function(){
    let address = $(this).val();

    if(address.length < 3 || address.length > 30){
      alertify.notify("Địa chỉ giới hạn trong khoảng 3-30 kí tự!", "error", 7);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }
    userInfo.address = address;
  });

  $("#input-change-phone").bind("change", function(){
    let phone = $(this).val();
    let regxPhone  = new RegExp(/^(0)[0-9]{9}$/);

    if(!regxPhone.test(phone)){
      alertify.notify("Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10 kí tự chữ số!", "error", 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }
    userInfo.phone = phone;
  });

  $("#input-change-current-password").bind("change", function(){
    let currentPassword = $(this).val();
    let regxPassword  = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if(!regxPassword.test(currentPassword)){
      alertify.notify("Mật khẩu chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.currentPassword;
      return false;
    }
    userUpdatePassword.currentPassword = currentPassword;
  });

  $("#input-change-new-password").bind("change", function(){
    let newPassword = $(this).val();
    let regxPassword  = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if(!regxPassword.test(newPassword)){
      alertify.notify("Mật khẩu chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.newPassword;
      return false;
    }
    userUpdatePassword.newPassword = newPassword;
  });

  $("#input-change-confirm-new-password").bind("change", function(){
    let confirmNewPassword = $(this).val();

    if(!userUpdatePassword.newPassword) {
      alertify.notify("Bạn chưa nhập mật khẩu mới!", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword ;
      return false;
    }
    if(confirmNewPassword !== userUpdatePassword.newPassword) {
      alertify.notify("Nhập lại mật khẩu chưa chính xác!", "error", 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword ;
      return false;
    }
    userUpdatePassword.confirmNewPassword = confirmNewPassword;
  });

}

function callUpdateUserAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "put",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function(result) {
      // display success
      $(".user-modal-alert-success").find("span").text(result.message); // result.message do server trả về(userController)
      $(".user-modal-alert-success").css("display", "block"); // ghi đè lại css

      // update avatar at navbar
      $("#navbar-avatar").attr("src", result.imageSrc); // result.imageSrc do server trả về(userController)

      // update avatarSrc vì hiện tại vẫn là src của avatar cũ
      avatarSrc= result.imageSrc;

      // reset all
      $("#input-btn-cancle-update-user").click();
    },
    error: function(error) {
      //Display error
      $(".user-modal-alert-error").find("span").text(error.responseText);// lỗi trả về từ server
      $(".user-modal-alert-error").css("display", "block");

      // reset all
      $("#input-btn-cancle-update-user").click();
    }
  });
}

function callUpdateUserInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "put",
    data: userInfo,
    success: function(result) {
      // display success
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      // update originUserInfo, merge toàn bộ dữ liệu từ userInfo vào originUserInfo có cùng key(username, gender,address, phone)
      originUserInfo = Object.assign(originUserInfo, userInfo);

      // update username navbar id <span>
      $("#navbar-username").text(originUserInfo.username);

      // reset all
      $("#input-btn-cancle-update-user").click();

    },
    error: function(error) {
      //Display error
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");

      // reset all
      $("#input-btn-cancle-update-user").click();
    }
  });
}

function callUpdateUserPassword() {
  $.ajax({
    url: "/user/update-password",
    type: "put",
    data: userUpdatePassword,
    success: function(result) {
      // display success
      $(".user-modal-password-alert-success").find("span").text(result.message);
      $(".user-modal-password-alert-success").css("display", "block");

      // reset all
      $("#input-btn-cancel-update-user-password").click();

      // logout after change password success
      callLogout();

    },
    error: function(error) {
      //Display error
      $(".user-modal-password-alert-error").find("span").text(error.responseText);
      $(".user-modal-password-alert-error").css("display", "block");

      // reset all
      $("#input-btn-cancel-update-user-password").click();
    }
  });
}
$(document).ready(function() {

  avatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: ( $("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  };

  // update user info after change value to update
  updateUserInfo();
  
  // kiểm tra nếu có sự thay đổi data thì update ngược lại thì thông báo
  $("#input-btn-update-user").bind("click", function(){
    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật!", "error", 7);
      return false;
    }
    if(userAvatar) {
      callUpdateUserAvatar();   
    }
    if(!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
  });

  $("#input-btn-cancel-update-user").bind("click", function(){
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src",avatarSrc); // trả về đường dẫn ảnh đại diện ban đầu khi click cancel
    // trả về các giá trị mặc định khi tải lên  
    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
  });

  $("#input-btn-update-user-password").bind("click", function(){
    if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword) {
      alertify.notify("Bạn phải thay đổi đầy đủ thông tin!", "error", 7);
      return false;
    }
    Swal.fire({
      title: 'Bạn có chắc chắn muốn thay đổi mật khẩu?',
      text: "Bạn không thể hoàn tác quá trình này!",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText:"Xác nhận!",
      cancelButtonText:"Hủy!"
    }).then((result) => {
      if(!result.value){
        $("#input-btn-cancel-update-user-password").click();
        return false;
      }
      callUpdateUserPassword();
    });
    
  });

  $("#input-btn-cancel-update-user-password").bind("click", function(){
    userUpdatePassword = {};
    $("#input-change-current-password").val(null);
    $("#input-change-new-password").val(null);
    $("#input-change-confirm-new-password").val(null);
  });
});
