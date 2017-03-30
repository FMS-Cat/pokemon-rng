(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/pokemon-rng/src/script/main.js":[function(require,module,exports){
"use strict";

var _tinymt = require("./tinymt");

var _tinymt2 = _interopRequireDefault(_tinymt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ------

var natureE = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];

var natureM = ["A↑A↓", "A↑B↓", "A↑S↓", "A↑C↓", "A↑D↓", "B↑A↓", "B↑B↓", "B↑S↓", "B↑C↓", "B↑D↓", "S↑A↓", "S↑B↓", "S↑S↓", "S↑C↓", "S↑D↓", "C↑A↓", "C↑B↓", "C↑S↓", "C↑C↓", "C↑D↓", "D↑A↓", "D↑B↓", "D↑S↓", "D↑C↓", "D↑D↓"];

var hiddenE = ["Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Phychic", "Ice", "Dragon", "Dark"];

// ------

rngSeed.value = "A33C7D5B,A6D61F57,36D8C12D,1DA619EC";

for (var i = 0; i < 25; i++) {
  var op = document.createElement("option");
  op.setAttribute("value", natureE[i]);
  op.innerText = natureE[i] + " (" + natureM[i] + ")";
  filterNature.appendChild(op);
}

for (var _i = 0; _i < 16; _i++) {
  var _op = document.createElement("option");
  _op.setAttribute("value", hiddenE[_i]);
  _op.innerText = "" + hiddenE[_i];
  filterHidden.appendChild(_op);
}

// ------

var tinymt = new _tinymt2.default(rngSeed.value);

var initTable = function initTable() {
  while (eggTable.firstChild) {
    eggTable.removeChild(eggTable.firstChild);
  }

  var tr = document.createElement("tr");
  eggTable.appendChild(tr);
  ["Fr", "Acc", "H", "A", "B", "C", "D", "S", "Nature", "Ab", "Gd", "Bl", "Hidden", "*", "SV", "Seed"].map(function (v) {
    var th = document.createElement("th");
    th.innerText = v;
    th.style.background = "#f83";
    th.style.color = "#fff";
    tr.appendChild(th);
  });
};
initTable();

var genTd = function genTd(str, col) {
  var td = document.createElement("td");
  td.innerText = str;
  td.style.color = col || "#000";
  return td;
};

var appendTable = function appendTable(egg, matched) {
  var tr = document.createElement("tr");
  tr.style.background = matched ? "#fed" : "#fff";
  eggTable.appendChild(tr);

  tr.appendChild(genTd(egg.frame));
  tr.appendChild(genTd(egg.frames));
  for (var _i2 = 0; _i2 < 6; _i2++) {
    tr.appendChild(genTd(egg.iv[_i2], egg.inh[_i2] === 1 ? "#06f" : egg.inh[_i2] === 2 ? "#f06" : false));
  }
  tr.appendChild(genTd(egg.nature));
  tr.appendChild(genTd(egg.ability));
  tr.appendChild(genTd(egg.gender, egg.gender === "M" ? "#06f" : egg.gender === "F" ? "#f06" : false));
  tr.appendChild(genTd(egg.ball, egg.ball === "M" ? "#06f" : "#f06"));
  tr.appendChild(genTd(egg.hidden));
  tr.appendChild(genTd(egg.shiny));
  tr.appendChild(genTd(egg.sv));
  tr.appendChild(genTd(egg.seed));
};

var frame = 0;
var egg = function egg() {
  var frames = 0;
  var ret = {};
  ret.seed = tinymt.getStateString();

  // ------

  {
    var ratio = parseInt(parentGender.value);
    if (ratio === 6) {
      ret.gender = "-";
    } else if (ratio === 5) {
      ret.gender = "F";
    } else if (ratio === 4) {
      ret.gender = "M";
    } else {
      var r = ratio === 1 ? 32 : ratio === 2 ? 63 : ratio === 3 ? 189 : 126;
      ret.gender = tinymt.gen() % 252 + 1 < r ? "F" : "M";
      frames++;
    }
  }

  // ------

  {
    ret.nature = natureE[tinymt.gen() % 25];
    frames++;

    var M = parseInt(parentMItem.value);
    var F = parseInt(parentFItem.value);
    if (M === 1 && F === 1) {
      ret.nature = tinymt.gen() % 2 === 1 ? "F" : "M";
    } else if (M === 1 || F === 1) {
      ret.nature = "Ev";
    }
  }

  // ------

  {
    var ab = parseInt(parentFDitto.checked ? parentMAbility.value : parentFAbility.value);
    var dice = tinymt.gen() % 100;
    frames++;

    if (ab === 1) {
      ret.ability = dice < 80 ? "1" : "2";
    } else if (ab === 2) {
      ret.ability = dice < 20 ? "1" : "2";
    } else {
      ret.ability = dice < 20 ? "1" : dice < 40 ? "2" : "H";
    }
  }

  // ------

  {
    var _M = parseInt(parentMItem.value);
    var _F = parseInt(parentFItem.value);
    var knot = _M === 2 || _F === 2;
    var inhn = knot ? 5 : 3;
    var inhl = [0, 0, 0, 0, 0, 0];
    var inhi = 0;

    if (3 <= _M && _M <= 8) {
      inhl[_M - 3] = 1;
      inhi++;
    }

    if (3 <= _F && _F <= 8) {
      inhl[_F - 3] = 2;
      inhi++;
    }

    while (inhi < inhn) {
      var _dice = tinymt.gen() % 6;
      frames++;
      if (inhl[_dice] === 0) {
        inhl[_dice] = tinymt.gen() % 2 === 1 ? 2 : 1;
        frames++;
        inhi++;
      }
    }
    ret.inh = inhl;

    ret.iv = [];
    for (var _i3 = 0; _i3 < 6; _i3++) {
      ret.iv[_i3] = tinymt.gen() % 32;
    }
    frames += 6;

    for (var _i4 = 0; _i4 < 6; _i4++) {
      if (inhl[_i4] === 1) {
        ret.iv[_i4] = parseInt(document.getElementById("parentMIV" + _i4).value);
      } else if (inhl[_i4] === 2) {
        ret.iv[_i4] = parseInt(document.getElementById("parentFIV" + _i4).value);
      }
    }
  }

  // ------

  {
    var h = ret.iv[0] % 2 + ret.iv[1] % 2 * 2 + ret.iv[2] % 2 * 4 + ret.iv[5] % 2 * 8 + ret.iv[3] % 2 * 16 + ret.iv[4] % 2 * 32;
    ret.hidden = hiddenE[~~(h * 15 / 63)];
  }

  // ------

  {
    var pid = tinymt.gen();
    ret.sv = "-";
    ret.shiny = "-";
    frames++;

    var redices = (shinyCharm.checked ? 2 : 0) + (parentMasuda.checked ? 6 : 0);
    for (var _i5 = 0; _i5 < redices; _i5++) {
      pid = tinymt.gen();
      frames++;
      ret.sv = (pid >>> 16 ^ pid & 0xffff) >>> 4;
      ret.shiny = ret.sv === parseInt(shinyTSV.value) ? "*" : "";
      if (ret.shiny) {
        break;
      }
    }
  }

  // ------

  {
    ret.ball = "F";
    if (parentFDitto.checked) {
      ret.ball = "M";
    } else if (!parentDiff.checked) {
      ret.ball = tinymt.gen() % 100 < 50 ? "F" : "M";
      frames++;
    }
  }

  // ------

  tinymt.gen();
  tinymt.gen();
  frames += 2;

  ret.frame = frame;
  frame++;
  ret.frames = frames;
  ret.seedA = tinymt.getStateString();

  // ------

  tinymt.setState(ret.seed);
  tinymt.gen();
  ret.seedR = tinymt.getStateString();
  return ret;
};

// ------

var go = function go() {
  tinymt.setState(rngSeed.value);
  var start = parseInt(rangeS.value);
  var end = parseInt(rangeE.value);

  initTable();

  frame = start;
  for (var _i6 = 0; _i6 < start; _i6++) {
    tinymt.gen();
  }
  var target = parseInt(targetFrame.value);
  var targetAccI = 0;
  var targetAccP = start;
  var targetEnabled = false;
  if (target < start) {
    targetGuide.innerText = "🚀🚀🚀 Target frame exceeded! 🚀🚀🚀";
  } else if (end < target) {
    targetGuide.innerText = "👾👾👾 Target is too large! 👾👾👾";
  } else if (start === target) {
    targetGuide.innerText = "🐣🐣🐣 GRAB YOUR EGG NOW 🐣🐣🐣";
  } else {
    targetEnabled = true;
  }

  for (var _i7 = start; _i7 <= end; _i7++) {
    var e = egg();

    if (targetEnabled) {
      if (targetAccP === _i7) {
        var next = targetAccP + e.frames;
        if (target < next) {
          var rej = target - targetAccP;
          targetGuide.innerText = "Accept " + targetAccI + " then reject " + rej;
          targetEnabled = false;
        } else {
          targetAccI++;
          targetAccP = next;
        }
      }
    }

    var filtered = false;
    for (var dummy = 0; dummy < 1; dummy++) {
      for (var _i8 = 0; _i8 < 6; _i8++) {
        var ivs = parseInt(document.getElementById("filterIV" + _i8 + "S").value);
        var ive = parseInt(document.getElementById("filterIV" + _i8 + "E").value);
        if (e.iv[_i8] < ivs || ive < e.iv[_i8]) {
          filtered = true;break;
        }
      }
      if (filtered) {
        continue;
      }

      var nat = filterNature.value;
      if (nat !== "Any" && nat !== e.nature) {
        filtered = true;continue;
      }

      var ab = filterAbility.value;
      if (ab !== "Any" && ab !== e.ability) {
        filtered = true;continue;
      }

      var gd = filterGender.value;
      if (gd !== "Any" && gd !== e.gender) {
        filtered = true;continue;
      }

      var bl = filterBall.value;
      if (bl !== "Any" && bl !== e.ball) {
        filtered = true;continue;
      }

      var hidden = filterHidden.value;
      if (hidden !== "Any" && hidden !== e.hidden) {
        filtered = true;continue;
      }

      var shiny = filterShiny.checked;
      if (shiny && e.shiny !== "*") {
        filtered = true;continue;
      }
    }

    if (disableFilters.checked || !filtered) {
      appendTable(e, !filtered);
    }
  }
};

// ------

buttonGo.onclick = function () {
  go();
};

buttonRej.onclick = function () {
  rangeS.value = parseInt(rangeS.value) + 1;
  go();
};

buttonAcc.onclick = function () {
  var trs = eggTable.getElementsByTagName("tr");
  if (trs.length <= 1) {
    alert("nope");return;
  }
  var acc = trs[1].getElementsByTagName("td")[1].innerText;
  rangeS.value = parseInt(rangeS.value) + parseInt(acc);
  go();
};

// ------

var airhorn = document.createElement("audio");
airhorn.src = "airhorn.wav";

buttonAirhorn.onclick = function () {
  airhorn.currentTime = 0;
  airhorn.play();
};

},{"./tinymt":"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/pokemon-rng/src/script/tinymt.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/pokemon-rng/src/script/tinymt.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinyMT = function () {
  function TinyMT(stateString) {
    _classCallCheck(this, TinyMT);

    var tinymt = this;
    tinymt.state = new Uint32Array(4);
    tinymt.setState(stateString);
  }

  _createClass(TinyMT, [{
    key: "getState",
    value: function getState() {
      var tinymt = this;
      return new Uint32Array(tinymt.state);
    }
  }, {
    key: "setState",
    value: function setState(stateString) {
      var tinymt = this;
      var str = stateString.split(",");
      for (var i = 0; i < 4; i++) {
        tinymt.state[i] = parseInt(str[3 - i], 16);
      }
    }
  }, {
    key: "getStateString",
    value: function getStateString() {
      var tinymt = this;
      var ret = "";
      for (var i = 3; 0 <= i; i--) {
        var s = tinymt.state[i].toString(16).toUpperCase();
        var z = new Array(8 - s.length + 1).join('0');
        ret += z + s + (i !== 0 ? "," : "");
      }
      return ret;
    }
  }, {
    key: "nextState",
    value: function nextState() {
      var tinymt = this;
      var x = tinymt.state[0] & TinyMT.CONSTANT ^ tinymt.state[1] ^ tinymt.state[2];
      var y = tinymt.state[3];
      x ^= x << 1;
      y ^= y >>> 1 ^ x;
      tinymt.state[0] = tinymt.state[1];
      tinymt.state[1] = tinymt.state[2];
      tinymt.state[2] = x ^ y << 10 & 0xffffffff;
      tinymt.state[3] = y;
      if (y & 0x1) {
        tinymt.state[1] ^= TinyMT.MAT1;
        tinymt.state[2] ^= TinyMT.MAT2;
      }
    }
  }, {
    key: "gen",
    value: function gen() {
      var tinymt = this;
      tinymt.nextState();
      var t = tinymt.state[0] + (tinymt.state[2] >>> 8);
      return (t ^ tinymt.state[3] ^ -(t & 0x1) & TinyMT.TMAT) >>> 0;
    }
  }]);

  return TinyMT;
}();

TinyMT.CONSTANT = 0x7fffffff;
TinyMT.MAT1 = 0x8f7011ee;
TinyMT.MAT2 = 0xfc78ff1f;
TinyMT.TMAT = 0x3793fdff;

exports.default = TinyMT;

},{}]},{},["/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/pokemon-rng/src/script/main.js"]);
