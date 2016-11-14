/*
 * renameDialog implementes the complete behavior of the renaming functionality
 */
var renameDialog = {
  _dialog_skel: undefined,

  /*
   * Load rename dialog only once
   */
  initialize: function() {
    $.get(chrome.extension.getURL("templates/rename-dialog.html"), function(skeleton) {
      renameDialog._dialog_skel = skeleton;
    });
  },

  /*
   * fill card selection and preview area
   */
  populate: function(listobj, callback) {
    $dialog = $(this._dialog_skel);
    this._set_dialog_events($dialog);
    this.refresh_pattern();

    trello_find_list_by_obj(listobj, function () {
      selection = this.cards.map(function (card) {
        return '<option class="ma-rd-opt" value="' + card.id + '">'
              + card.name
              + '</option>';
      });

      preview = this.cards.map(function(card) {
        return '<option class="ma-rd-opt" id="card-' + card.id + '">'
              + card.name
              + '</option>';
      });
      $dialog.find('#ma-rd-selection').html(selection);
      $dialog.find('#ma-rd-preview').html(preview);


      callback.apply($dialog);
    });
  },

  /*
   * Run the preview with given regex, match
   */
  update_preview: function(regex, replace) {
    $('#ma-rd-selection option').each(function(i) {
      $pcard   = $($('#card-' + $(this).val()))
      $pcard.removeClass("ma-rd-bold");
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

    $('#ma-rd-selection option:checked').each(function(i) {
      pcard   = $('#card-' + $(this).val())
      preview = renameDialog._replace(i, $(this).text(), re, $(replace).val());

      pcard.addClass("ma-rd-bold");
      pcard.text(preview);
    });
  },

  apply_changes: function(regex, replace) {
    $('#ma-rd-selection option:checked').each(function(i) {
      re       = RegExp(regex);
      new_name = renameDialog._replace(i, $(this).text(), re, replace);

      Trello.put("cards/" + $(this).val() + "/name", {value: new_name}, function() {
        console.log("Updated card!");
      });
    });
    renameDialog.hide();
  },

  refresh_pattern: function() {
    patterns = patternDialog.patterns();

    $select = $('#ma-rd-select-pattern');
    $select.find('option').remove();

    options = Object.keys(patterns).map(function(name) {
      return '<option value="'
        + name + '">'
        + name
        + ' <i>(' + patterns[name].regex + ')'
        + '</option>';
    });
    console.log(options)
    $select.html(options);
  },

  /*
   * Show the dialog (by adding it to pop-over)
   */
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

  _replace: function(index, text, regex, replace) {
      repl = replace.replace(/\$i/, index + 1);
      return text.replace(RegExp(regex), repl);
  },

  _set_dialog_events: function($dialog) {
    // make scrollbars synchron
    $dialog.find('#ma-rd-selection').scroll(function(){
      $('#ma-rd-preview').scrollTop($(this).scrollTop());
    });
    $dialog.find('#ma-rd-preview').scroll(function(){
      $('#ma-rd-selection').scrollTop($(this).scrollTop());
    });

    // apply changes
    $dialog.find(".ma-rd-apply").click(function () {
      replace = $dialog.find('#ma-rd-replace').val();
      regex   = $dialog.find('#ma-rd-regex').val();
      renameDialog.apply_changes(regex, replace);
    });

    // select all link
    $dialog.find('.ma-rd-select-all').click(function() {
      $dialog.find('#ma-rd-selection option').prop('selected', true);
    });

    // unselect all link
    $dialog.find('.ma-rd-unselect-all').click(function() {
      $dialog.find('#ma-rd-selection option').prop('selected', false);
      $dialog.find('#ma-rd-replace').trigger('keyup');
    });

    // update preview
    $dialog.find('#ma-rd-selection').change(function() {
      $dialog.find('#ma-rd-replace').trigger('keyup');
    });
    $dialog.find('#ma-rd-regex').keyup(function() {
      $dialog.find('#ma-rd-replace').trigger('keyup');
    });

    $dialog.find('#ma-rd-replace').keyup(function() {
      replace = $dialog.find('#ma-rd-replace');
      regex   = $dialog.find('#ma-rd-regex');

      renameDialog.update_preview(regex, replace);
    });

    // pattern dialog functionality
    $dialog.find('#ma-pd-add').click(function () {

    });

    $dialog.find('#ma-pd-modify').click(function () {

    });

    $dialog.find('#ma-pd-delete').click(function () {

    });
  }
}
