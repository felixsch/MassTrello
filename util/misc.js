function mk_option(text, value, id) {
  option = "<option";

  if (value != undefined)
    option += ' value="' + value + '"';
  if (id != undefined)
    option += ' id="' + id + '"';

  return option + ">" + text + "</option>";
}
