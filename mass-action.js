/*
 * Mass action extension for Chromium
 */

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


/*
 * Intialize the system after the trello page has loaded completly
 */
$(document).ready(function() {

  initialize_observers();

  authorize_trello();

  rename_callbacks();
  move_to_callbacks();
});
