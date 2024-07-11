//Input number max length
const percentageFrame = $("#discount");
const quantityFrame = $("#quantity");
const extraPointFrame = $("#extraPoint");

percentageFrame.on("input", function () {
  const value = $(this).val();
  if (value.length > 2) {
    $(this).val(value.slice(0, 2));
  }
});

quantityFrame.on("input", function () {
  const value = $(this).val();
  if (value.length > 3) {
    $(this).val(value.slice(0, 3));
  }
});

extraPointFrame.on("input", function () {
  const value = $(this).val();
  if (value.length > 5) {
    $(this).val(value.slice(0, 5));
  }
});

//Switch radio
const radioButton = $('input[type="radio"]');
const discount = $(".discount");
const free = $(".free");
const extra = $(".extra");

radioButton.change(function () {
  discount.addClass("d-none").attr("required", false);
  free.addClass("d-none").attr("required", false);
  extra.addClass("d-none").attr("required", false);

  if (radioButton[0].checked) {
    discount.removeClass("d-none").attr("required", true);
  } else if (radioButton[1].checked) {
    free.removeClass("d-none").attr("required", true);
  } else {
    extra.removeClass("d-none").attr("required", true);
  }
});
