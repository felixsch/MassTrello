var patternDialog = {
  _dialog_skel: undefined,
  _patterns: {},

  initialize: function() {
    $.get(chrome.extension.getURL("templates/pattern-dialog.html"), function(skeleton) {
      patternDialog._dialog_skel = skeleton;
    });

    // load patterns from store
    chrome.storage.local.get('patterns', function(result) {
      patternDialog._patterns = result.patterns;
    });
  },

  populate: function(callback) {
    $dialog = $(this._dialog_skel);
    this._set_dialog_events($dialog);

    callback.apply($dialog);

  },

  show: function() {
    this.populate(function() {
      $('.pop-over').html(this);
      $('.pop-over').css({
        left: "10%",
        top: "10%",
        width: "80%"
      });
    });

  },

  hide: function() {

  },

  save: function() {
    chrome.storage.local.set({'patterns': this._patterns});
  },

  _set_dialog_events: function($dialog) {

  }

}
