"use strict";

function rename_observer() {
  $(this.parentNode).after('<li><a class="ma-action-rename">Rename Cards...</a></li>');
}

function rename_callbacks() {
  renameDialog.initialize();
  patternDialog.initialize();

  $(document).on('click', '.ma-action-rename', function() {
    renameDialog.show(current_list);
  });

  $(document).on('click', '.pd-add', function() {
    patternDialog.modify("", function(name) {
      renameDialog.show(current_list);
      $('#rd-select-pattern option[value="' + name + '"]').attr('selected', 'selected');
    });
  });

  $(document).on('click', '.pd-modify', function() {
    const name = $('#ma-rd-select-pattern').val();
    patternDialog.modify(name, function() {
      renameDialog.show(current_list);
    });
  });

  $(document).on('click', '.rd-btn-close', function() {
    renameDialog.hide();
  });

  $(document).on('click', '.pd-btn-close', function() {
    renameDialog.show(current_list);
  });

}
