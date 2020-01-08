$(document).ready(function() {
  // variables

  let $usersWrapper = $("#tableBody");
  let $totalUsers = $("#totalUsers");
  let $loader = $("#loader");
  let $paginatorBox = $("#pagination");

  // get data from server

  $.getJSON("https://app2000.host/api/users?page=1", function(data) {
    let numberOfUsers = data.pagination.total;

    // render data

    let arrayOfUsers = data.data;
    arrayOfUsers.forEach(el => renderUser(el));

    $totalUsers.text(numberOfUsers);

    createPagination(data, numberOfUsers);
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
    } else {
      console.log("error");
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
});
