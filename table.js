function makeAjaxCall(url, methodType, callback) {
  return $.ajax({
    url: url,
    type: methodType,
    dataType: "json",
  });
}

var tabledata;
var currentState;
var entry = "";
var tableCallAPI = "https://jsonplaceholder.typicode.com/users";
makeAjaxCall(tableCallAPI, "GET")
  .then(function (res) {
    $("#userList").html = "";
    tabledata = res;
    var state = {
      querySet: tabledata,
      page: 1,
      rows: 6,
      window: 5,
    };
    currentState = state;
    // console.log(currentState);
    var entries = buildTable(state);
    $("#userList").html(entries);
    pageButtons(tableDataShow.pages);
  })
  .fail(function (reason) {
    console.log("error in processing your request", reason);
  });

// console.log(currentState);

function pagination(querySet, page, rows) {
  var trimStart = (page - 1) * rows;
  var trimEnd = trimStart + rows;

  var trimedData = querySet.slice(trimStart, trimEnd);
  var pages = Math.ceil(querySet.length / rows);
  // console.log(state);

  return {
    querySet: trimedData,
    pages: pages,
  };
}

function pageButtons(pages) {
  let wrapper = document.querySelector(".pagination-wrapper");
  wrapper.innerHTML = "";
  console.log(currentState);
  var maxLeft = currentState.page - Math.floor(currentState.window / 2);
  var maxRight = currentState.page + Math.floor(currentState.window / 2);

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = currentState.window;
  }
  if (maxRight > pages) {
    maxLeft = pages - (currentState.window - 1);
    maxRight = pages;
    if (maxLeft < 1) {
      maxLeft = 1;
    }
  }

  for (var page = maxLeft; page <= maxRight; page++) {
    wrapper.innerHTML += `<button type="button" class="btn btn-info page m-1" value="${page}">${page}</button>`;
  }
  if (currentState.page != 1) {
    wrapper.innerHTML =
      `<button value=${1} class="btn btn-sm btn-info page">&#171; First</button>` +
      wrapper.innerHTML;
  }
  if (currentState.page != pages) {
    console.log(pages);
    wrapper.innerHTML += `<button value=${pages} class="btn btn-sm btn-info page">&#187; Last</button>`;
  }
  $(".page").on("click", function () {
    $("#userList").empty();
    // console.log(this.value);
    // console.log(currentState);
    currentState.page = Number(this.value);
    entries = buildTable(currentState);
    $("#userList").html(entries);
    pageButtons(tableDataShow.pages);
  });
}

var tableDataShow;
function buildTable(state) {
  var data = pagination(state.querySet, state.page, state.rows);
  tableDataShow = data;
  var list = data.querySet;
  entry = "";
  for (let i = 0; i < list.length; i++) {
    entry += `<tr>
            <td>${list[i].name}</td>
            <td>${list[i].username}</td>
            <td>${list[i].email}</td>
            <td>${
              list[i].address.street +
              ", " +
              list[i].address.suite +
              ", " +
              list[i].address.city +
              ", " +
              list[i].address.zipcode
            }</td>
            <td>${list[i].phone}</td>
            <td>${list[i].website}</td>
            <td>${list[i].company.name}</td>
          </tr>`;
  }
  return entry;
}

var searchContent = document.getElementById("search_text").value;
console.log(searchContent);

function sortTable(n) {
  var table = document.querySelector(".userDetailTable");
  // console.log(userTable);
  let x,
    i,
    y,
    switching,
    dir = "asc",
    switchCount = 0,
    shouldSwitch,
    rows;
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "des") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchCount++;
    } else {
      if (switchCount == 0 && dir == "asc") {
        dir = "des";
        switching = true;
      }
    }
  }
}

$("#search_text").keyup(function () {
  var regex = new RegExp($("#search_text").val(), "i");
  var item = $(tabledata);
  let searchedRow = "";
  item.each(function (i) {
    if (
      item[i].name.search(regex) != -1 ||
      item[i].username.search(regex) != -1 ||
      item[i].email.search(regex) != -1 ||
      item[i].website.search(regex) != -1 ||
      item[i].company.name.search(regex) != -1
    ) {
      //-1 is for if no match found
      searchedRow += `<tr>
                        <td>${item[i].name}</td>
                        <td>${item[i].username}</td>
                        <td>${item[i].email}</td>
                        <td>${
                          item[i].address.street +
                          ", " +
                          item[i].address.suite +
                          ", " +
                          item[i].address.city +
                          ", " +
                          item[i].address.zipcode
                        }</td>
                        <td>${item[i].phone}</td>
                        <td>${item[i].website}</td>
                        <td>${item[i].company.name}</td>
                      </tr>`;
      console.log("match found");
      $("#userList").html(searchedRow);
    }
    if ($("#search_text").val() == "") {
      var tableForEmptySearch = buildTable(currentState);
      $("#userList").html(tableForEmptySearch);
    } else {
      console.log("not found");
    }
  });
});

$(".userDetailTable").on("click", "#userList tr", function () {
  var modalCallAPI = "https://jsonplaceholder.typicode.com/posts";
  fetch(modalCallAPI)
    .then((res) => res.json())
    .then((data) => {
      for (let x = 0; x <= 9; x++) {
        if (tabledata[x].id == data[x].id) {
          $("#myModal").modal("show");
          $("#userName").val($(this).closest("tr").children()[0].textContent);
          $("#emailID").val($(this).closest("tr").children()[1].textContent);
          // $("#userAddress").val(
          //   $(this).closest("tr").children()[3].textContent
          // );
          $("#userContact").val(
            $(this).closest("tr").children()[4].textContent
          );
          document.getElementById("userAddress").innerHTML =
            tabledata[x].address.street +
            tabledata[x].address.suite +
            tabledata[x].address.city +
            tabledata[x].address.zipcode;
          document.getElementById("userTitle").innerHTML = data[x].title;
          document.getElementById("userBody").innerHTML = data[x].body;
          // $("#userBody").innerHTML = data[x].body;
        }
      }
    });
});
