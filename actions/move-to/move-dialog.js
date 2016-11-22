var moveDialog = {
  _dialog_skel: undefined,

  initialize: function() {
    $.get(chrome.extension.getURL("templates/move-to-dialog.html"), function(skeleton) {
      moveDialog._dialog_skel = skeleton;
    });
  },

  populate: function(list, callback) {
    $dialog = $(this._dialog_skel);
    this._set_dialog_events($dialog);

    trello_find_list_by_obj(list, function () {
      cards = this.cards.map(function (card) {
        return mk_option(card.name, card.id);
      });
      console.log(cards);
      $dialog.find('#mt-selection').html(cards);

      trello_get_boards(function () {
        boards = ['<option value="">Select Board...</option>'];
        boards += this.map(function (board) {
          return mk_option(board.name, board.id);
        });
        $dialog.find('#mt-dest-board').html(boards);
        callback.apply($dialog);
      });
    });
  },

  show: function(list) {
    this.populate(list, function() {
      $('.pop-over').html(this);
      $('.pop-over').css({
        left: "10%",
        top: "10%",
        width: "40%"
      });
    });
  },

  hide: function() {
    $('.pop-over').empty().toggleClass('is-shown');
  },

  apply_changes: function(board, list, callback) {
    $('#mt-selection option:checked').each(function() {
      card = $(this).val();
      Trello.put('cards/' + card + '/idBoard', {value: board, idList: list});
    }).promise().done( function() {
        callback();
    });
  },

  _set_dialog_events: function($dialog) {
    $dialog.find('#mt-dest-board').change(function() {
      board = $(this).val();
      trello_get_lists_by_board(board, function() {
        lists = ['<option value="">Select List...</option>'];
        lists += this.map(function(list) {
          return mk_option(list.name, list.id);
        });
        $dialog.find('#mt-dest-list').html(lists);
      });
    });

    $dialog.find('.mt-btn-close').click(function() {
      moveDialog.hide();
    });

    $dialog.find('.mt-apply').click(function() {
      board = $dialog.find('#mt-dest-board').val();
      list  = $dialog.find('#mt-dest-list').val();
      if (board == "" | list == "")
        return;
      $(this).text("Moving cards...");
      $(this).prop('disabled', true);
      moveDialog.apply_changes(board, list, function() {
        moveDialog.hide();
      });
    });
  }
};
