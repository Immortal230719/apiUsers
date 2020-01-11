$(document).ready(function() {
  // load svg sprite

  $("#sprite").load("/sprite.html");

  // variables

  const $usersWrapper = $("#tableBody");
  const $totalUsers = $("#totalUsers");
  const $loader = $("#loader");
  const $paginatorBox = $("#pagination");
  const $popupWrapper = $("#modal");
  const $modalCreate = $("#modalCreate");
  const $createUserBtn = $("#create");
  const $createUserForm = $("#createUser");
  const $submitCreateFormBtn = $("#createDiasabledBtn");
  const $successWrapper = $("#success");
  const $updateUserBtn = $("#updateUser");
  const $deletePopup = $("#deleteUser");
  const $deleteDoneWrap = $("#deleteDone");

  // get data from server

  $.getJSON("https://app2000.host/api/users?page=1", function(data) {
    let numberOfUsers = data.pagination.total;

    // render data

    let arrayOfUsers = data.data;
    arrayOfUsers.forEach(el => renderUser(el));

    $totalUsers.text(numberOfUsers);

    createPagination(data, numberOfUsers);
  });

  // events

  $popupWrapper.parent().on("click", function(e) {
    if (
      e.target.className === "modal-background" ||
      e.target.className === "modal-close is-large"
    ) {
      $popupWrapper.parent().removeClass("is-active is-clipped");
      return;
    } else {
      return;
    }
  });

  $modalCreate.parent().on("click", function(e) {
    if (
      e.target.className === "modal-background" ||
      e.target.className === "modal-close is-large"
    ) {
      $modalCreate.parent().removeClass("is-active is-clipped");
      return;
    } else {
      return;
    }
  });

  $deletePopup.parent().on("click", function(e) {
    if (
      e.target.className === "modal-background" ||
      e.target.className === "modal-close is-large"
    ) {
      $deletePopup.parent().removeClass("is-active is-clipped");
      return;
    } else {
      return;
    }
  });

  // functions

  function renderUser(objOfUser) {
    let fragment = document.createDocumentFragment();

    if (typeof objOfUser === "object") {
      let resArr = Object.values(objOfUser); //create array of values from user
      let tr = $("<tr>").appendTo(fragment);
      $("<th id=" + objOfUser.id + ">")
        .text(objOfUser.id)
        .appendTo(tr);
      for (let index = 1; index < resArr.length; index++) {
        //for each value create element <td></td>
        if (resArr[index] == undefined) {
          $("<td>", { text: "unknown" }).appendTo(tr);
          continue;
        }
        if (typeof resArr[index] === "number") {
          switch (resArr[index]) {
            case 1: {
              $("<td>", { text: "NOT_VERIFIED" }).appendTo(tr);
              break;
            }
            case 2: {
              $("<td>", { text: "ACTIVE" }).appendTo(tr);
              break;
            }
            case 3: {
              $("<td>", { text: "BANNED" }).appendTo(tr);
              break;
            }
            default:
              break;
          }
          continue;
        }
        $("<td>", { text: resArr[index] }).appendTo(tr);
      }
      $(
        '<td><a href="#" class="show-btn"><svg class="show-btn_icon"><use xlink:href="#profile_icon"></use></svg></a></td>'
      ).appendTo(tr);
      $(
        '<td><a href="#" class="update-btn"><svg class="show-btn_icon"><use xlink:href="#update_icon"></use></svg></a></td>'
      ).appendTo(tr);
      $(
        '<td><a href="#" class="delete-btn"><svg class="show-btn_icon"><use xlink:href="#delete_icon"></use></svg></a></td>'
      ).appendTo(tr);
    } else {
      console.log("error: objOfUser not typeof object");
    }

    $usersWrapper.append(fragment);
    return;
  }

  // validate input data

  let validator = $createUserForm.validate({
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
        required: false
      }
    }
  });

  // create user

  $createUserBtn.on("click", function(e) {
    e.preventDefault();
    $createUserForm.each(function() {
      this.reset();
    });
    $updateUserBtn.fadeOut(0);
    $modalCreate.fadeIn(0);
    $submitCreateFormBtn.parent().fadeIn(0);
    $deletePopup;
    validator.invalid.firstName = true;
    validator.invalid.email = true;
  });

  $("#datepicker").datepicker({
    dateFormat: "yyyy-mm-dd"
  });

  // enabled createBtn if required data is entered

  $("#firstName").on("focusout", function() {
    setTimeout(function() {
      if (!validator.invalid.firstName && !validator.invalid.email) {
        $submitCreateFormBtn.prop("disabled", false);
      } else {
        $submitCreateFormBtn.prop("disabled", true);
      }
    }, 0);
  });

  $("#email").on("focusout", function() {
    setTimeout(function() {
      if (!validator.invalid.firstName && !validator.invalid.email) {
        $submitCreateFormBtn.prop("disabled", false);
      } else {
        $submitCreateFormBtn.prop("disabled", true);
      }
    }, 0);
  });

  //on create form submit handler

  $createUserForm.on("submit", function(e) {
    e.preventDefault();
    let userData = {};
    createObjOfUser(userData);
    $.post("https://app2000.host/api/users", userData).done(function(data) {
      $modalCreate.fadeOut(0);
      $("#successText").text("User Created Successfully");
      $successWrapper.fadeIn(100);
    });
    $(this).each(function() {
      this.reset();
    });
  });

  $successWrapper.on("click", "#successOkBtn", function(e) {
    e.preventDefault();
    $modalCreate.parent().removeClass("is-active is-clipped");
    $successWrapper.fadeOut(100);
  });

  // delete success modal

  $deleteDoneWrap.on("click", "#deleteOkBtn", function(e) {
    e.preventDefault();
    $deletePopup.parent().removeClass("is-active is-clipped");
    $deleteDoneWrap.fadeOut(100);
  });

  // pagination

  function createPagination(data, numberOfUsers) {
    let usersOnPage = data.pagination.per_page;

    $paginatorBox.pagination({
      items: numberOfUsers,
      itemsOnPage: usersOnPage,
      cssStyle: "light-theme",
      displayedPages: 6,

      // This is the actual page changing functionality.

      onPageClick: function(pageNumber) {
        $paginatorBox.fadeOut(0);
        $loader.fadeTo(0, 1);
        $.getJSON(`https://app2000.host/api/users?page=${pageNumber}`).done(
          function(data) {
            setTimeout(function() {
              let newArrayOfUsers = data.data;
              $usersWrapper.children().remove();
              newArrayOfUsers.forEach(el => renderUser(el));
              $loader.fadeOut(100);
              $paginatorBox.fadeIn(100);
            }, 500);
          }
        );
      }
    });
  }

  // show user event

  $usersWrapper.on("click", ".show-btn", function(e) {
    e.preventDefault();
    let idOfUser = $(this)
      .parent()
      .siblings()[0].textContent;
    $.getJSON(`https://app2000.host/api/users/${idOfUser}`).done(function(
      data
    ) {
      $popupWrapper.children().remove();
      showUserObj(data, $popupWrapper);
      $popupWrapper.parent().addClass("is-active is-clipped");
    });
  });

  //insert response obj in show html data

  function showUserObj(data, $wrapper) {
    const userId = data.id === null ? "unknown" : data.id;
    const userEmail = data.email === null ? "unknown" : data.email;
    const userStatus = data.status === null ? "unknown" : data.status;
    const userBirthday = data.birth_day === null ? "unknown" : data.birth_day;
    const userName = data.first_name === null ? "" : data.first_name;
    const lastName = data.last_name === null ? "" : data.last_name;
    const userFullName = `${userName} ${lastName}`;
    $wrapper.load("user-show.html", function() {
      $("#userName").text(userFullName);
      $("#userID").text(userId);
      $("#userEmail").text(userEmail);
      $("#userStatus").text(userStatus);
      $("#userBirthday").text(userBirthday);
    });
    return;
  }

  //create objOfUser with data to ajax

  function createObjOfUser(emptyObj) {
    emptyObj.email = $("#email").val();
    emptyObj.first_name = $("#firstName").val();
    emptyObj.last_name =
      $("#lastName").val() === "" ? null : $("#lastName").val();
    emptyObj.status = parseInt($("#statusSelect").val());
    emptyObj.birth_day =
      $("#datepicker").val() === "" ? null : $("#datepicker").val();
    return emptyObj;
  }

  // update user

  $usersWrapper.on("click", ".update-btn", function(e) {
    e.preventDefault();
    let idOfUser = $(this)
      .parent()
      .siblings()[0].textContent;
    $.getJSON(`https://app2000.host/api/users/${idOfUser}`)
      .done(function(data) {
        $modalCreate.fadeIn(0);
        $submitCreateFormBtn.parent().fadeOut(0);
        $modalCreate.parent().addClass("is-active is-clipped");
        $updateUserBtn.fadeIn(0);
        $("#email")
          .parent()
          .parent()
          .fadeOut(0);
        $("#firstName").val(data.first_name);
        $("#lastName").val(data.last_name);
        $("#statusSelect").val(data.status);
        $("#datepicker").val(data.birth_day);
      })
      .fail(function(error) {
        console.log(error);
      });
    $updateUserBtn.on("click", function(e) {
      e.preventDefault();
      let userData = {};
      createObjOfUser(userData);
      delete userData.email;
      $.ajax({
        type: "Patch",
        url: `https://app2000.host/api/users/${idOfUser}`,
        data: userData
      })
        .done(function(data) {
          $modalCreate.fadeOut(0);
          $("#successText").text("User Updated Successfully");
          $successWrapper.fadeIn(100);
        })
        .fail(function(error) {
          console.log(error);
        });
    });
  });

  // delete user

  $usersWrapper.on("click", ".delete-btn", function(e) {
    e.preventDefault();
    let $wrapperData = $deletePopup.children("#containerForUserData");
    let idOfUser = $(this)
      .parent()
      .siblings()[0].textContent;
    $.getJSON(`https://app2000.host/api/users/${idOfUser}`).done(function(
      data
    ) {
      ("#containerForUserData");
      showUserObj(data, $wrapperData);
      $deletePopup.parent().addClass("is-active is-clipped");
    });

    $("#no").on("click", function(e) {
      e.preventDefault();
      $deletePopup.parent().removeClass("is-active is-clipped");
    });

    $("#yes").on("click", function(e) {
      e.preventDefault();
      $.ajax({
        type: "DELETE",
        url: `https://app2000.host/api/users/${idOfUser}`
      })
        .done(function(data) {
          $deletePopup.fadeOut(0);
          $deleteDoneWrap.fadeIn(100);
          $usersWrapper
            .find(`#${idOfUser}`)
            .parent()
            .remove();
        })
        .fail(function(error) {
          console.log(error);
        });
    });
  });
});
