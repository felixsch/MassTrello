function get_current_list(obj) {
  console.log($(obj));
  console.log($(obj).parent().parent().find('.list-header-name').text());
  console.log($(obj).parents('.list-header-name').text());
  console.log($(obj).prev('.list-header-name').text());
  console.log($(obj).parent('.list-header-name').text());
  console.log($(obj).parent().parent().parent());
  console.log($(obj).parents('.js-list-content'));
  console.log($(obj).closest('textarea .list-header-name').text());
  return $(obj).parents('.list-header-name').text();
}


function mk_option(text, value, id) {
  option = "<option";

  if (value != undefined)
    option += ' value="' + value + '"';
  if (id != undefined)
    option += ' id="' + id + '"';

  return option + ">" + text + "</option>";
}
