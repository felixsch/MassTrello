function trello_find_list_by_obj(obj, callback) {
  name = $(obj).find('.list-header-name').text();
  board = trello_extract_board_from_url();

  if (board == undefined || name.length < 1)
    return undefined;

  Trello.get("boards/" + board + "/lists", { cards: "all" }, function(lists) {
    list = lists.find(function(l) {
      return l.name == name;
    });
    callback.apply(list);
  });
}


function trello_get_lists_by_board(board, callback) {
  Trello.get('boards/' + board + '/lists', function(lists) {
    callback.apply(lists);
  });
}


function trello_get_boards(callback) {
  Trello.get('members/me/boards', function(boards) {
    callback.apply(boards);
  });
}


function trello_extract_board_from_url() {
  current = window.location.pathname.split("/");

  if (current.length != 4 || current[1] != "b")
    return undefined;

  return current[2];
}
