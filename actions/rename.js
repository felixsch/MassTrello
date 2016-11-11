
function rename_observer() {
  $(this.parentNode).after('<li><a class="ma-rd-show">Rename Cards...</a></li>');
}

function rename_callbacks() {
  var current_list = undefined;
  renameDialog.initialize();
  patternDialog.initialize();

  $('.js-open-list-menu').click(function() {
    current_list = $(this).closest(".list");
    return true;
  });

  $(document).on('click', '.ma-rd-show', function() {
    renameDialog.show(current_list);
  });

  $(document).on('click', '.ma-pd-show', function() {
    patternDialog.show();
    return false;
  });

  $(document).on('click', '.ma-rd-btn-close', function() {
    renameDialog.hide();
  });
}
