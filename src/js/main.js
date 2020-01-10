$(document).ready(function() {
  // load svg sprite

  $("#sprite").load("/sprite.html");

  // variables

  let $usersWrapper = $("#tableBody");
  let $totalUsers = $("#totalUsers");
  let $loader = $("#loader");
  let $paginatorBox = $("#pagination");
  let popupWrapper = $("#popup");

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

  popupWrapper.on("click", function(e) {
    if (e.target.id === "popup" || e.target.className === "show-user_close") {
      popupWrapper.fadeOut(100);
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

      for (let index = 0; index < resArr.length; index++) {
        //for each value create element <td></td>
        if (resArr[index] == undefined) {
          $("<td>", { text: "unknown" }).appendTo(tr);
          continue;
        }
        $("<td>", { text: resArr[index] }).appendTo(tr);
      }
      $(
        '<td><a href="#" class="show-btn"><svg class="show-btn_icon"><use xlink:href="#profile_icon"></use></svg></a></td>'
      ).appendTo(tr);
    } else {
      console.log("error: objOfUser not typeof object");
    }

    $usersWrapper.append(fragment);
    return;
  }

  // pagination

  function createPagination(data, numberOfUsers) {
    let usersOnPage = data.pagination.per_page;

    $paginatorBox.pagination({
      items: numberOfUsers,
      itemsOnPage: usersOnPage,
      cssStyle: "light-theme",
      displayedPages: 13,

      // This is the actual page changing functionality.

      onPageClick: function(pageNumber) {
        $paginatorBox.fadeTo(100, 0);
        $loader.fadeTo(100, 1);
        $.getJSON(`https://app2000.host/api/users?page=${pageNumber}`).done(
          function(data) {
            setTimeout(function() {
              let newArrayOfUsers = data.data;
              $usersWrapper.children().remove();
              newArrayOfUsers.forEach(el => renderUser(el));
              $paginatorBox.fadeTo(100, 1);
              $loader.fadeTo(100, 0);
            }, 500);
          }
        );
      }
    });
  }

  // show event

  $usersWrapper.on("click", ".show-btn", function(e) {
    e.preventDefault();
    let idOfUser = $(this)
      .parent()
      .siblings()[0].textContent;
    $.getJSON(`https://app2000.host/api/users/${idOfUser}`).done(function(
      data
    ) {
      const userId = data.id === null ? "unknown" : data.id;
      const userEmail = data.email === null ? "unknown" : data.email;
      const userStatus = data.status === null ? "unknown" : data.status;
      const userBirthday = data.birth_day === null ? "unknown" : data.birth_day;
      const userName = data.first_name === null ? "" : data.first_name;
      const lastName = data.last_name === null ? "" : data.last_name;
      const userFullName = `${userName} ${lastName}`;
      popupWrapper
        .children()
        .children()
        .remove();
      popupWrapper.children().load("user-show.html", function() {
        $("#userName").text(userFullName);
        $("#userID").text(userId);
        $("#userEmail").text(userEmail);
        $("#userStatus").text(userStatus);
        $("#userBirthday").text(userBirthday);
      });
      popupWrapper.fadeIn(100);
    });
  });
});
