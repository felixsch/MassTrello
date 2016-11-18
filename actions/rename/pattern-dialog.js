var patternDialog = {
  _dialog_skel: undefined,
  _patterns: {},

  initialize: function() {
    $.get(chrome.extension.getURL("templates/pattern-dialog.html"), function(skeleton) {
      patternDialog._dialog_skel = skeleton;
    });

    // // load patterns from store
    // chrome.storage.local.get('patterns', function(result) {
    //   if (! $.isEmptyObject(result)) {
    //     patternDialog._patterns = result.patterns;
    //   }
    // });
  },

  populate: function(name, regex, replace, callback) {
    $dialog = $(this._dialog_skel);
    this._set_dialog_events($dialog);

    $dialog.find('#ma-pd-name').val(name);
    $dialog.find('#ma-pd-regex').val(regex);
    $dialog.find('#ma-pd-replace').val(replace);

    callback.apply($dialog);
  },


  modify: function(name, callback) {
    regex   = "";
    replace = "";
    modify  = false;

    if (name != "") {
      pattern = this.pattern(name);
      regex   = pattern.regex;
      replace = pattern.replace;
      modify  = true;
    }

    this.populate(name, regex, replace, function() {
      $('.pop-over').html(this);
      $('.pop-over').css({
        left: "40%",
        top: "40%",
        width: "20%"
      });
      $(this).find('.ma-pd-save').click(function() {
        console.log('save everything');
        name = $dialog.find('#ma-pd-name').val();
        reg  = $dialog.find('#ma-pd-regex').val();
        rep  = $dialog.find('#ma-pd-replace').val();

        patternDialog._patterns[name] = {regex: reg, replace: rep};
        patternDialog._save();

        callback.apply(patternDialog._patterns[name]);
      });
    });
  },

  delete: function(name) {
    if (patternDialog._patterns.hasOwnProperty(name)) {
      delete patternDialog._patterns[name];
    }
    patternDialog._save();
  },

  pattern: function(name) {
    if (patternDialog._patterns.hasOwnProperty(name)) {
      return patternDialog._patterns[name];
    }
    return undefined;
  },

  patterns: function() {
    return patternDialog._patterns;
  },

  _save: function() {
    chrome.storage.local.set({'patterns': this._patterns});
  },

  _set_dialog_events: function($dialog) {
  }
}
