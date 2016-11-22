"use strict";

function mk_option(text, value, id) {
  let option = "<option";

  if (value != undefined)
    option += ' value="' + value + '"';
  if (id != undefined)
    option += ' id="' + id + '"';

  return option + ">" + text + "</option>";
}
