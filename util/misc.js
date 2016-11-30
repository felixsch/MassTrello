"use strict";

function mk_option(text, value, id, labels, all_labels) {
  let option = '<option data-text="' + text + '"';

  if (value != undefined)
    option += ' value="' + value + '"';

  if (id != undefined)
    option += ' id="' + id + '"';

  if (labels == undefined || labels.length == 0)
    return option + '>' + text + '</option>';

  let html = all_labels[labels.pop()].name;

  labels.forEach(label =>
    html += ' | ' + all_labels[label].name);

  return option + '>[ ' + html + ' ] ' + text + '</option>';
}

