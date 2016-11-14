
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

  $(document).on('click', '.ma-pd-add', function() {
    patternDialog.modify("", function() {
      console.log('new pattern saved');
      renameDialog.show(current_list);
    });
  });

  $(document).on('click', '.ma-pd-modify', function() {
    name = $('#ma-rd-select-pattern').val();
    patternDialog.modify(name, function() {
      console.log('pattern modified')
      renameDialog.show(current_list);
    });
  });

  $(document).on('click', '.ma-rd-btn-close', function() {
    renameDialog.hide();
  });

  $(document).on('click', '.ma-pd-btn-close', function() {
    console.log("close. show rename dialog");
    renameDialog.show(current_list);
  });
}
