var renameDialog = {
  _dialog_skel: undefined,

  initialize: function() {
    $.get(chrome.extension.getURL("templates/rename-dialog.html"), function(skeleton) {
      renameDialog._dialog_skel = skeleton;
    });
  },

  populate: function(listobj, callback) {
    $dialog = $(this._dialog_skel);
    this._set_dialog_events($dialog);
    this.refresh_pattern($dialog);

    trello_find_list_by_obj(listobj, function () {
      selection = this.cards.map(function (card) {
        return mk_option(card.name, card.id);
      });

      preview = this.cards.map(function(card) {
        return mk_option(card.name, card.id, "card-" + card.id);
      });
      $dialog.find('#rd-selection').html(selection);
      $dialog.find('#rd-preview').html(preview);

      callback.apply($dialog);
    });
  },

  update_preview: function(regex, replace) {
    $('#rd-selection option').each(function(i) {
      $pcard   = $($('#card-' + $(this).val()))
      $pcard.removeClass("ma-bold");
      $pcard.text($(this).text());
    });

    try {
      var re = new RegExp($(regex).val());
    } catch(e) {
      $(regex).css("background-color", "#de9a8f");
      $(replace).css("background-color", "#de9a8f");
      return false;
    }

    $(replace).css("background-color", "#96d48a");
    $(regex).css("background-color", "#96d48a");

    $('#rd-selection option:checked').each(function(i) {
      pcard   = $('#card-' + $(this).val())
      preview = renameDialog._replace(i, $(this).text(), re, $(replace).val());

      pcard.addClass("ma-bold");
      pcard.text(preview);
    });
  },

  apply_changes: function(regex, replace, callback) {
    $('#rd-selection option:checked').each(function(i) {
      re       = RegExp(regex);
      new_name = renameDialog._replace(i, $(this).text(), re, replace);

      Trello.put("cards/" + $(this).val() + "/name", {value: new_name});
    }).promise().done(function () {
      callback();
    });
  },

  show: function(list) {
    this.populate(list, function() {
      $('.pop-over').html(this);
      $('.pop-over').css({
        left: "10%",
        top: "10%",
        width: "80%"
      });
    });
  },

  hide: function() {
    $('.pop-over').empty().toggleClass('is-shown');
  },

  refresh_pattern: function($dialog) {
    patterns = patternDialog.patterns();

    $select = $dialog.find('#rd-select-pattern');
    $select.find('option').remove();

    options = Object.keys(patterns).map(function(name) {
      text = name + ' <i>(' + patterns[name].regex + ')';
      return mk_option(text, name);
    });
    $select.html(options);
  },

  _replace: function(index, text, regex, replace) {
      repl = replace.replace(/\$i/, index + 1);
      return text.replace(RegExp(regex), repl);
  },

  _set_dialog_events: function($dialog) {
    // make scrollbars synchron
    $dialog.find('#rd-selection').scroll(function(){
      $('#rd-preview').scrollTop($(this).scrollTop());
    });
    $dialog.find('#rd-preview').scroll(function(){
      $('#rd-selection').scrollTop($(this).scrollTop());
    });

    // apply changes
    $dialog.find(".rd-apply").click(function () {
      replace = $dialog.find('#rd-replace').val();
      regex   = $dialog.find('#rd-regex').val();
      renameDialog.apply_changes(regex, replace, function() {
        renameDialog.hide();
      });
    });

    // update preview
    $dialog.find('#rd-selection').change(function() {
      $dialog.find('#rd-replace').trigger('keyup');
    });
    $dialog.find('#rd-regex').keyup(function() {
      $dialog.find('#rd-replace').trigger('keyup');
    });

    $dialog.find('#rd-replace').keyup(function() {
      replace = $dialog.find('#rd-replace');
      regex   = $dialog.find('#rd-regex');
      renameDialog.update_preview(regex, replace);
    });

    $(document).on('click', '#rd-select-pattern', function() {
      name = $(this).val();
      pattern = patternDialog.pattern(name);

      if (pattern) {
        $dialog.find('#rd-replace').val(pattern.replace);
        $dialog.find('#rd-regex').val(pattern.regex);
        $dialog.find('#rd-replace').trigger('keyup');
      }
    });

    $(document).on('click', '.pd-delete', function() {
      name = $dialog.find('#rd-select-pattern').val();
      patternDialog.delete(name);
      renameDialog.refresh_pattern($dialog);
    });
  }
}
