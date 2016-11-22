"use strict";

/*
 * Mass action extension for Chromium
 */
let current_list = undefined;


/*
 * Initialize all observer used by this extension.
 */
function initialize_observers() {
  var menu_entries = [
    { match: ".js-add-card",      callback: rename_observer },
    { match: ".js-archive-cards", callback: move_to_observer }
  ];

  const Observer = window.MutationObserver || window.WebKitMutationObserver;

  let listObserver = new Observer(function(records) {
    records.forEach(function(rec) {
      $(rec.addedNodes).each(function() {
        if ($(rec.target).hasClass('pop-over')) {
          menu_entries.forEach(function (entry) {
            $(this).find(entry.match).each(function() {
              entry.callback.apply(this);
            });
          }, this);
        }
      });
    });
  });
  listObserver.observe(document.body, { childList: true, subtree: true });
}


/*
 * Authorize trello client with trello API.
 */
function authorize_trello() {
  Trello.authorize({
    type: 'popup',
    name: 'Trello Mass action extension',
    persist: true,
    interactive: true,
    scope: {
      read: true,
      write: true,
      account: false
    },
    expiration: 'never',
    error: function () {
      alert('Could not authentificate with Trello. MassTrello will not work correctly');
    }
  });
}

function basic_callbacks() {
  $(document).on('click', '.ma-list-select-all', function() {
    const $select = $($(this).parent().prev().children('option'));
    $select.prop('selected', true);
    $select.trigger('change');
  });

  $(document).on('click', '.ma-list-unselect-all', function() {
    const $select = $($(this).parent().prev().children('option'));
    $select.prop('selected', false);
    $select.trigger('change');
  });

  $('.js-open-list-menu').click(function() {
    current_list = $(this).closest(".list");
  });

  $(document).on('click', '.js-open-board', function() {
    /* Seems the only way to announce the set list functionality
     * after board change
     */
    window.setTimeout(function() {
      basic_callbacks();
    }, 1000);
    window.setTimeout(function() {
      basic_callbacks();
    }, 1800);
  });
}


/*
 * Intialize the system after the trello page has loaded completly
 */
$(document).ready(function() {
  initialize_observers();

  authorize_trello();

  rename_callbacks();
  move_to_callbacks();

  basic_callbacks();
});
