"use strict";

const renameDialog = {
  _dialog_skel: undefined,

  initialize: function() {
    $.get(chrome.extension.getURL("templates/rename-dialog.html"), function(skeleton) {
      renameDialog._dialog_skel = skeleton;
    });
  },

  populate: function(listobj, callback) {
    const $dialog = $(this._dialog_skel);
    this._set_dialog_events($dialog);
    this.refresh_pattern($dialog);

    trello_get_list_by_obj(listobj, function () {
      const selection = this.cards.map(card => mk_option(card.name, card.id));
      const preview = this.cards.map(card =>
        mk_option(card.name, card.id, "card-" + card.id));

      $dialog.find('#rd-selection').html(selection);
      $dialog.find('#rd-preview').html(preview);

      callback.apply($dialog);
    });
  },

  update_preview: function(regex, replace) {
    let re;
    $('#rd-selection option').each(function() {
      const $pcard   = $($('#card-' + $(this).val()));
      $pcard.removeClass("ma-bold");
      $pcard.text($(this).text());
    });

    try {
      re = new RegExp($(regex).val());
    } catch(e) {
      $(regex).css("background-color", "#de9a8f");
      $(replace).css("background-color", "#de9a8f");
      return false;
    }

    $(replace).css("background-color", "#96d48a");
    $(regex).css("background-color", "#96d48a");

    $('#rd-selection option:checked').each(function(i) {
      const pcard   = $('#card-' + $(this).val());
      const preview = renameDialog._replace(i, $(this).text(), re, $(replace).val());

      pcard.addClass("ma-bold");
      pcard.text(preview);
    });
  },

  apply_changes: function(regex, replace, callback) {
    $('#rd-selection option:checked').each(function(i) {
      const re       = RegExp(regex);
      const new_name = renameDialog._replace(i, $(this).text(), re, replace);

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
    const patterns = patternDialog.patterns();

    const $select = $dialog.find('#rd-select-pattern');
    $select.find('option').remove();

    const options = Object.keys(patterns).map(name => {
      const text = name + ' <i>(' + patterns[name].regex + ')';
      return mk_option(text, name);
    });
    $select.html(options);
  },

  _replace: function(index, text, regex, replace) {
    const repl = replace.replace(/\$i/, index + 1);
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
      const replace = $dialog.find('#rd-replace').val();
      const regex   = $dialog.find('#rd-regex').val();
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
      const replace = $dialog.find('#rd-replace');
      const regex   = $dialog.find('#rd-regex');
      renameDialog.update_preview(regex, replace);
    });

    $(document).on('click', '#rd-select-pattern', function() {
      const name = $(this).val();
      const pattern = patternDialog.pattern(name);

      if (pattern) {
        $dialog.find('#rd-replace').val(pattern.replace);
        $dialog.find('#rd-regex').val(pattern.regex);
        $dialog.find('#rd-replace').trigger('keyup');
      }
    });

    $(document).on('click', '.pd-delete', function() {
      const name = $dialog.find('#rd-select-pattern').val();
      patternDialog.delete(name);
      renameDialog.refresh_pattern($dialog);
    });
  }
};
