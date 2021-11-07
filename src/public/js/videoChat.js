function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("click").on("click", function () {
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    };

    // b1: caller
    socket.emit("caller-check-listener-online-or-not", dataToEmit);

  });
}

function playVideoStream(videoTagId, stream) {
  let video = document.getElementById(videoTagId);
  video.srcObject = stream;
  video.onloadeddata = function () {
    video.play();
  };
}

function closeVideoStream(stream) {
  return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function () {
  // b2: caller
  socket.on("server-send-listener-is-offline", function () {
    alertify.notify("Người dùng không trực tuyến !", "error", 7);
  });

  let iceServerList = $("#ice-server-list").val();

  let getPeerId = "";
  const peer = new Peer({
    key: "peerjs",
    host: "peerjs-server-trungquandev.herokuapp.com",
    secure: true,
    port: 443,
    config: {
      iceServers: JSON.parse(iceServerList)
    }
    // debug: 3
  });

  peer.on("open", function (peerId) {
    getPeerId = peerId;
  });

  // b3: listener
  socket.on("server-request-peer-id-of-listener", function (response) {
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId
    };

    // b4: listener
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);
  });

  let timerInterval;
  // b5: caller
  socket.on("server-send-peer-id-of-listener-to-caller", function (response) {

    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };

    // b6: caller
    socket.emit("caller-request-call-to-server", dataToEmit);

    Swal.fire({
      position: "top-end",
      title: `Đang gọi cho &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-controll-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">Hủy cuộc gọi</button>
      `,
      backdrop: "rgpa(85, 85, 0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000, // 30 giây,
      position: "center",
      onBeforeOpen: () => {
        $("#btn-cancel-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);

          // b7: caller
          socket.emit("caller-cancel-request-call-to-server", dataToEmit);
        });
        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
      },
      onOpen: () => {
        // b12: caller lắng nghe
        socket.on("server-send-reject-call-to-caller", function (response) {
          Swal.close();
          clearInterval(timerInterval);

          Swal.fire({
            type: "info",
            title: ` <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; hiện tại không thể nghe máy`,
            backdrop: "rgpa(85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận"
          });
        });

      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    });
  });

  // b8: listener
  socket.on("server-send-request-call-to-listener", function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };

    Swal.fire({
      position: "top-end",
      title: `<span style="color: #2ECC71;">${response.callerName}</span> &nbsp; đang gọi cho bạn<i class="fa fa-volume-controll-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/><br/>
        <button id="btn-reject-call" class="btn btn-danger">Từ chối</button>
        <button id="btn-accept-call" class="btn btn-success">Đồng ý</button>
      `,
      backdrop: "rgpa(85, 85, 0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000, // 30 giây,
      position: "center",
      onBeforeOpen: () => {
        $("#btn-reject-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);

          // b10: lắng nghe listener từ chối cuộc gọi
          socket.emit("listener-reject-request-call-to-server", dataToEmit);
        });
        $("#btn-accept-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);

          // b11: lắng nghe listener từ chối cuộc gọi
          socket.emit("listener-accept-request-call-to-server", dataToEmit);
        });
        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
      },
      onOpen: () => {
        // b9: lắng nghe listener hủy call
        socket.on("server-send-cancel-request-call-to-listener", function (response) {
          Swal.close();
          clearInterval(timerInterval);
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    });

  });

  // b13: caller
  socket.on("server-send-accept-call-to-caller", function (response) {
    Swal.close();
    clearInterval(timerInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia).bind(navigator);

    getUserMedia({ video: true, audio: true }, function (stream) {

      // Hiện modal stream
      $("#streamModal").modal("show");

      // chạy stream của caller in local
      playVideoStream("local-stream", stream);

      // call to listener
      let call = peer.call(response.listenerPeerId, stream);

      // listen & play của listener
      call.on("stream", function (remoteStream) {
        // chạy stream của listener in local
        playVideoStream("remote-stream", remoteStream);
      });

      // close modal khi off modal
      $("#streamModal").on("hidden.bs.modal", function () {
        closeVideoStream(stream);
        Swal.fire({
          type: "info",
          title: `Đã kết thúc cuộc gọi với <span style="color: #2ECC71;">${response.listenerName}</span>`,
          backdrop: "rgpa(85, 85, 0.4)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Xác nhận"
        });
      });

    }, function (err) {
      if (err.toString() === "NotAllowedError: Permission denied") {
        alertify.notify("Xin lỗi bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt. Vui lòng mở lại trong cài đặt của trình duyệt !", "error", 7);
      }
      if (err.toString() === "NotFoundError: Requested device not found") {
        alertify.notify("Không tìm thấy thiết bị nghe gọi!", "error", 7);
      }
    });
  });

  // b14: listener
  socket.on("server-send-accept-call-to-listener", function (response) {
    Swal.close();
    clearInterval(timerInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia).bind(navigator);

    peer.on("call", function (call) {
      getUserMedia({ video: true, audio: true }, function (stream) {
        // Hiện modal stream
        $("#streamModal").modal("show");

        // chạy stream của caller in local
        playVideoStream("local-stream", stream);

        call.answer(stream); // Answer the call with an A/V stream.

        call.on("stream", function (remoteStream) {
          // chạy stream của caller in local
          playVideoStream("remote-stream", remoteStream);
        });

        // close modal 
        $("#streamModal").on("hidden.bs.modal", function () {
          closeVideoStream(stream);
          Swal.fire({
            type: "info",
            title: `Đã kết thúc cuộc gọi với <span style="color: #2ECC71;">${response.callerName}</span>`,
            backdrop: "rgpa(85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận"
          });
        });
      }, function (err) {
        if (err.toString() === "NotAllowedError: Permission denied") {
          alertify.notify("Xin lỗi bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt. Vui lòng mở lại trong cài đặt của trình duyệt !", "error", 7);
        }
        if (err.toString() === "NotFoundError: Requested device not found") {
          alertify.notify("Không tìm thấy thiết bị nghe gọi!", "error", 7);
        }
      });
    });
  });
});
