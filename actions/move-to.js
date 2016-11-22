

function move_to_observer() {
  $(this.parentNode).after('<li><a class="ma-action-move">Move Cards to another Board...</a></li>');
}


function move_to_callbacks() {
  moveDialog.initialize();

  $(document).on('click', '.ma-action-move', function() {
    moveDialog.show(current_list);
  });
}
