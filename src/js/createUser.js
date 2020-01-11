$("#datepicker").datepicker({
  dateFormat: "dd-mm-yyyy"
});
$("#createUser").validate({
  rules: {
    firstName: {
      required: true,
      minlength: 2,
      maxlength: 180
    },
    lastName: {
      required: false,
      minlength: 2,
      maxlength: 180
    },
    email: {
      required: true,
      email: true
    },
    statusSelect: {
      required: true
    },
    datepicker: {
      required: true
    }
  }
});

// create user

$("#createUser").on("submit", function(e) {
  e.preventDefault();
  let userData = {};
  userData.email = $("#email").val();
  userData.first_name = $("#firstName").val();
  userData.last_name =
    $("#lastName").val() === "" ? null : $("#lastName").val();
  userData.status = $("#statusSelect").val();
  userData.birth_day =
    $("#datepicker").val() === "" ? null : $("#datepicker").val();
  console.log(JSON.stringify(userData));
  $.ajax({
    url: "https://app2000.host/api/users",
    method: "POST",
    data: JSON.stringify(userData),
    contentType: "application/json",
    complete: function(xhr, textStatus) {
      console.log(xhr, textStatus);
    }
  });
});
