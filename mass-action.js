/*
 * Mass action extension for Chromium
 */
var current_list = undefined

/*
 * Initialize all observer used by this extension.
 */
function initialize_observers() {
  var menu_entries = [
    { match: '.js-add-card',      callback: rename_observer },
    { match: '.js-archive-cards', callback: move_to_observer }
  ];

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver

  var listObserver = new MutationObserver(function(records) {
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
    success: function () { console.log('authorized with Trello API') },
    error: function() { console.log('authentification with Trello API failed') }
  });
}

function basic_callbacks() {
  $(document).on('click', '.ma-list-select-all', function() {
    $select = $($(this).parent().prev().children('option'));
    $select.prop('selected', true);
    $select.trigger('change');
  });

  $(document).on('click', '.ma-list-unselect-all', function() {
    $select = $($(this).parent().prev().children('option'));
    $select.prop('selected', false);
    $select.trigger('change');
  });

  $('.js-open-list-menu').click(function() {
    console.log('set current_list');
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
  console.log("ready");

  initialize_observers();

  authorize_trello();

  rename_callbacks();
  move_to_callbacks();

  basic_callbacks();
});
