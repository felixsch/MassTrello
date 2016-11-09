function trello_find_list_by_obj(obj, callback) {
  name = $(obj).find('.list-header-name').text();
  board = trello_extract_board_from_url();

  if (board == undefined || name.length < 1)
    return undefined;

  console.log("search name = " + name);
  Trello.get("boards/" + board + "/lists", { cards: "all" }, function(lists) {
    list = lists.find(function(l) {
      console.log(l.name);
      return l.name == name;
    });
    callback.apply(list);
  });
}


function trello_extract_board_from_url() {
  current = window.location.pathname.split("/");

  if (current.length != 4 || current[1] != "b")
    return undefined;

  return current[2];
}
