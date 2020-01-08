$(document).ready(function() {
  // variables

  let $usersWrapper = $("#tableBody");
  let $totalUsers = $("#totalUsers");

  // get data from server

  $.getJSON("https://app2000.host/api/users", function(data) {
    data.data.forEach(el => renderUser(el));
    let numberOfUsers = data.data.length;
    $totalUsers.text(numberOfUsers);
  });

  // functions

  function renderUser(objOfUser) {
    let fragment = document.createDocumentFragment();
    let resArr = Object.values(objOfUser);
    let tr = $("<tr>").appendTo(fragment);

    for (let index = 0; index < resArr.length; index++) {
      $("<td>", { text: resArr[index] }).appendTo(tr);
    }

    $usersWrapper.append(fragment);
    return;
  }
});
