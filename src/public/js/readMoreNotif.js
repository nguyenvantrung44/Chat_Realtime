$(document).ready(function() {
  $("#link-read-more-notif").bind("click", function() {
    let skipNumber = $("ul.list-notifications").find("li").length;

    $("#link-read-more-notif").css("display","none");
    $(".read-more-notif-loader").css("display","inline-block");

    setTimeout(() => {
      $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(notifications) {
        if(!notifications.length){
          alertify.notify("Bạn không còn thông báo.", "error", 7);
          $("#link-read-more-notif").css("display","inline-block");
          $(".read-more-notif-loader").css("display","none");
          return false;
        };
  
        notifications.forEach(function(notification) {
          $("ul.list-notifications").append(`<li>${notification}</li>`); // thêm thông báo ở modal notif khi read more
        });
  
        $("#link-read-more-notif").css("display","inline-block");
        $(".read-more-notif-loader").css("display","none");
      });
    }, 1000);
    
  });
});
