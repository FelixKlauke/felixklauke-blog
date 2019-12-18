$(".navbar-toggle").on("click", function () {

  var element = $("#navbarContent");

  if (element.css("display") === "none") {
    element.css("display", "flex");
  } else {
    element.css("display", "none");
  }
});