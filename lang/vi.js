export const transValidation = {
  email_incorrect: "Email phải có dạng example@trungnguyen.com!",
  gender_incorrect: "Bạn là Robot hả ?",
  password_incorrect: "Mật khẩu chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!",
  password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác!",
  update_username: "Username giới hạn trong khoảng 3-17 kí tự và không được phép chứa kí tự đặc biệt!",
  update_gender: "Oops! Dữ liệu giới tính có vấn đề; hacker hả bạn ^ ^!",
  update_address: "Địa chỉ giới hạn trong khoảng 3-30 kí tự!",
  update_phone: "Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10 kí tự chữ số!",
  keyword_find_user: "Lỗi từ khóa tìm kiếm, chỉ cho phép ký tự chữ cái và số, cho phép khoảng trống!",
  message_text_emoji_incorrect: "Tin nhắn không hợp lệ. Đảm bảo tối thiểu 1 ký tự, tối đa 400 ký tự!",
  add_new_group_user_incorrec: "Vui lòng chọn bạn bè để thêm vào nhóm! Tối thiểu 2 người.",
  add_new_group_name_incorrec: "Tên nhóm trò chuyện có độ dài từ 5 đến 30 kí tự. Không chứa kí tự đặc biệt."
};

export const transErrors = {
  account_in_use: "Email này đã được sử dụng!",
  account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống, nếu tin rằng điều này là hiểu lầm, vui lòng liên hệ lại với bộ phận hỗ trợ của chúng tôi!",
  account_not_active: "Email đã được đăng kí nhưng chưa kích hoạt tài khoản, vui lòng kiểm tra email của bạn hoặc liên hệ lại với bộ phận hỗ trợ của chúng tôi!",
  account_undefined: "Tài khoản này không tồn tại!",
  token_underfined: "Token không tồn tại!",
  login_failed: "Sai tài khoản hoặc mật khẩu!",
  server_error: "Có lỗi ở phía server, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để báo cáo lỗi này. Xin cảm ơn!",
  avatar_type: "Kiểu file không hợp lệ, chỉ chấp nhận .jpg, .png hoặc .jpeg",
  avatar_size: "Ảnh upload tối đa cho phép là 1MB",
  image_message_type: "Kiểu file không hợp lệ, chỉ chấp nhận .jpg, .png hoặc .jpeg",
  image_message_size: "Ảnh upload tối đa cho phép là 1MB",
  attachment_message_size: "Tệp tin đính kèm upload tối đa cho phép là 1MB",
  user_current_password_failed: "Mật khẩu hiện tại không chính xác!",
  conversation_notfault: "Cuộc trò chuyện không tồn tại!"
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email của bạn để kích hoạt tài khoản trước khi đăng nhập. Xin cảm ơn!`
  },
  account_actived: "Kích hoạt tài khoản thành công, bạn có thể đăng nhập vào ứng dụng!",
  loginSuccess: (username) => {
    return `
      Xin chào ${username}, chúc bạn một ngày tốt lành!
    `;
  },
  loginAdminSuccess: (username) => {
    return `
      Xin chào quản trị viên ${username}, chúc bạn một ngày tốt lành!
    `;
  },
  logout_success: "Đăng xuất tài khoản thành công, hẹn gặp lại bạn!" ,
  user_info_updated: "Cập nhật thông tin người dùng thành công!",
  user_password_updated: "Cập nhật mật khẩu thành công!"
};

export const transMail = {
  subject: "Zalo Chat: Xác nhận kích hoạt tài khoản!",
  template: (linkVerify) => {
    return `
      <h2>Bạn nhận được email này vì đã đăng kí tài khoản trên ứng dụng Zalo Chat.</h2>
      <h3>Vui lòng click vào bên dưới để xác nhận kích hoạt tài khoản.</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Nếu tin rằng email này là nhầm lẫn, hãy bỏ qua nó. Trân trọng!</h4>
    `;
  },
  send_failed: "Có lỗi trong quá trình gửi email. Vui lòng liên hệ lại với bộ phận của chúng tôi!"
};
