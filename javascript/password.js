var Myinput = document.getElementById("pwd");
var min = document.getElementById("min");
var maj = document.getElementById("maj");
var num = document.getElementById("num");
var taille = document.getElementById("taille");

Myinput.onfocus = function () {
  document.getElementById("condition").style.display = "block";
};

Myinput.onblur = function () {
  document.getElementById("condition").style.display = "none";
};

Myinput.onkeyup = function () {
  var low = /[a-z]/;
  if (Myinput.value && Myinput.value.match(low)) {
    min.classList.remove("invalid");
    min.classList.add("valid");
  } else {
    min.classList.remove("valid");
    min.classList.add("invalid");
  }
};

Myinput.onkeyup = function () {
  var up = /[A-Z]/;
  if (Myinput.value && Myinput.value.match(up)) {
    maj.classList.remove("invalid");
    maj.classList.add("valid");
  } else {
    maj.classList.remove("valid");
    maj.classList.add("invalid");
  }
};

Myinput.onkeyup = function () {
  var n = /[0-9]/;
  if (Myinput.value && Myinput.value.match(n)) {
    num.classList.remove("invalid");
    num.classList.add("valid");
  } else {
    num.classList.remove("valid");
    num.classList.add("invalid");
  }
};

Myinput.onkeyup = function () {
  if (Myinput.value && Myinput.value.length >= 8) {
    taille.classList.remove("invalid");
    taille.classList.add("valid");
  } else {
    taille.classList.remove("valid");
    taille.classList.add("invalid");
  }
};
