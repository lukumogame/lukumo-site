// よろず提案所：依頼者キャラクターのSVG（viewBox 0 0 200 200、足元は y=200）
// 使い方：YorozuArt.character("sakura", "great") → SVG文字列
(function (root) {
  "use strict";

  var INK = "#34414f";
  var LW = 4.5; // 輪郭線の太さ（200×200基準）
  var SKIN = "#fde2cc";
  var CHEEK = "#f6a1a6";
  var MOUTH = "#e5545b";
  var TONGUE = "#ff9c9c";

  function p(d, fill, extra) {
    return '<path d="' + d + '" fill="' + (fill || "none") + '"' + (extra || "") + "/>";
  }
  function c(x, y, r, fill, extra) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '"' + (extra || "") + "/>";
  }
  function e(x, y, rx, ry, fill, extra) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' + (extra || "") + "/>";
  }
  var NS = ' stroke="none"';
  // 拡大縮小した部品でも線の太さを揃える
  function g(x, y, s, body) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')" stroke-width="' + +(LW / s).toFixed(2) + '">' + body + "</g>";
  }

  // ---- 顔（頭の半径50を基準にした局所座標。中心0,0）----
  // o: ex=目の左右, ey=目の高さ, my=口の高さ, cy=頬の高さ, cx=頬の左右
  function face(mood, o) {
    o = o || {};
    var ex = o.ex || 18, ey = o.ey == null ? 4 : o.ey, my = o.my == null ? 18 : o.my;
    var chx = o.cx || 30, chy = o.cy == null ? ey + 13 : o.cy;
    var s = "";
    s += e(-chx, chy, 8, 5, CHEEK, NS + ' opacity="0.6"') + e(chx, chy, 8, 5, CHEEK, NS + ' opacity="0.6"');
    var i, x;
    if (mood === "great") {
      for (i = -1; i <= 1; i += 2) {
        x = i * ex;
        s += p("M" + (x - 8) + "," + (ey + 3) + " Q" + x + "," + (ey - 10) + " " + (x + 8) + "," + (ey + 3));
      }
      s += p("M-12," + my + " Q0," + (my + 3) + " 12," + my + " Q11," + (my + 16) + " 0," + (my + 16) + " Q-11," + (my + 16) + " -12," + my + "Z", MOUTH);
      s += p("M-6," + (my + 12.5) + " Q0," + (my + 7) + " 6," + (my + 12.5) + " Q3," + (my + 14.5) + " 0," + (my + 14.5) + " Q-3," + (my + 14.5) + " -6," + (my + 12.5) + "Z", TONGUE, NS);
    } else if (mood === "poor") {
      for (i = -1; i <= 1; i += 2) {
        x = i * ex;
        s += e(x, ey + 1, 3.6, 4.4, INK, NS);
        s += p("M" + (x + i * 9) + "," + (ey - 7) + " L" + (x - i * 5) + "," + (ey - 13));
      }
      s += p("M-9," + (my + 6) + " Q0," + (my - 4) + " 9," + (my + 6));
    } else {
      for (i = -1; i <= 1; i += 2) {
        x = i * ex;
        s += e(x, ey, 4, 5, INK, NS) + c(x + 1.4, ey - 1.8, 1.4, "#fff", NS);
      }
      s += p("M-8," + (my + 1) + " Q0," + (my + 8) + " 8," + (my + 1));
    }
    return s;
  }

  // ---- 補助記号 ----
  function joy() {
    return '<g stroke="#ffcc33" stroke-width="6.5" stroke-linecap="round">' +
      p("M10,58 L27,62") + p("M16,28 L31,42") + p("M42,10 L47,29") + "</g>";
  }
  var SPIRAL = (function () {
    var d = "", t, r, cx = 176, cy = 30;
    for (t = 0; t <= 6 * Math.PI; t += 0.35) {
      r = 1 + t * 0.85;
      d += (d ? " L" : "M") + (cx + r * Math.cos(t)).toFixed(1) + "," + (cy + r * Math.sin(t) * 0.85).toFixed(1);
    }
    return d;
  })();
  function gloom() {
    return '<g stroke="#9aa5ae" stroke-width="3.5">' + p(SPIRAL) + p("M168,52 Q176,48 184,52") + "</g>";
  }

  // ---- 人 ----
  var BODY_M = "M24,200 C24,158 50,138 100,138 C150,138 176,158 176,200Z";
  var BODY_F = "M32,200 C32,160 56,140 100,140 C144,140 168,160 168,200Z";
  var NECK = p("M88,124 L88,144 Q100,150 112,144 L112,124Z", SKIN);
  var EARS = c(51, 99, 9, SKIN) + c(149, 99, 9, SKIN);
  var HEAD = e(100, 92, 50, 46, SKIN);

  var COLLAR = {
    vneck: function (k) { return p("M84,141 L100,162 L116,141", SKIN); },
    hood: function (k) {
      return p("M56,154 C66,134 134,134 144,154 C132,146 68,146 56,154Z", k.dark) +
        p("M92,150 L90,178") + p("M108,150 L110,178") + c(90, 180, 3, "#fff") + c(110, 180, 3, "#fff");
    },
    polo: function (k) {
      return p("M86,141 Q100,152 114,141", SKIN) + p("M100,149 L100,172") + c(100, 162, 2, INK, NS) +
        p("M86,140 L76,156 L99,149Z", k.dark) + p("M114,140 L124,156 L101,149Z", k.dark);
    },
    jacket: function (k) {
      return p("M82,140 L100,176 L118,140Z", "#fff") + p("M90,141 L100,152 L110,141", SKIN) +
        p("M82,140 L72,160 L86,164 L100,184") + p("M118,140 L128,160 L114,164 L100,184") + c(108, 192, 2.6, INK, NS);
    },
    tee: function (k) { return p("M84,140 Q100,156 116,140", SKIN) + p("M70,170 L130,170", "none", ' stroke="#fff" stroke-width="5"'); },
    sweater: function (k) {
      return p("M82,140 Q100,160 118,140", "#fff") + p("M88,140 Q100,150 112,140", SKIN) +
        p("M84,141 L92,156 L100,150 L108,156 L116,141", "#fff") + p("M60,186 L140,186", "none", ' stroke="' + k.dark + '" stroke-width="5"');
    },
    vest: function (k) {
      return p("M80,140 L100,182 L120,140Z", "#fff") + p("M90,141 L100,152 L110,141", SKIN) +
        p("M86,138 L99,152 L86,158Z", "#fff") + p("M114,138 L101,152 L114,158Z", "#fff") +
        c(100, 188, 2.6, k.dark, NS) + c(100, 198, 2.6, k.dark, NS);
    },
    cardigan: function (k) {
      return p("M86,141 L100,170 L114,141Z", "#fff") + p("M90,141 L100,152 L110,141", SKIN) +
        p("M84,140 L100,176 L116,140") + p("M100,176 L100,200") + c(94, 186, 2.6, "#fff") + c(106, 186, 2.6, "#fff");
    }
  };

  var HAIR = {
    yuto: {
      front: "M46,100 C38,50 68,34 100,34 C136,34 162,50 154,100 C152,82 146,72 138,68 C128,74 112,74 104,62 C96,74 76,76 62,70 C54,78 49,88 46,100Z",
      extra: "M96,36 C94,26 104,22 110,26 C104,28 102,32 104,36Z"
    },
    shota: {
      front: "M46,98 C42,68 48,52 58,46 L54,30 L72,38 L78,18 L94,32 L106,14 L114,32 L132,22 L132,40 L148,40 C156,54 160,74 154,98 C150,80 142,68 130,62 Q118,70 102,58 Q86,70 70,64 C58,70 50,82 46,98Z"
    },
    kenta: {
      front: "M46,98 C40,50 72,38 100,38 C134,38 160,52 154,98 C151,80 147,70 142,64 C120,66 96,60 80,50 C76,62 64,68 56,72 C51,80 48,88 46,98Z"
    },
    daiki: {
      front: "M49,92 C46,52 74,42 100,42 C126,42 154,52 151,92 C147,74 140,64 130,61 Q100,55 70,61 C60,64 53,74 49,92Z"
    },
    sakura: {
      back: "M42,96 C38,40 70,34 100,34 C130,34 162,40 158,96 L164,158 C150,166 130,164 124,156 L120,112 L80,112 L76,156 C70,164 50,166 36,158Z",
      front: "M46,102 C40,48 70,36 100,36 C132,36 160,50 154,102 C150,86 142,74 130,66 C118,70 98,66 86,56 C80,68 66,76 54,80 C50,86 47,94 46,102Z"
    },
    miyuki: {
      back: "M44,100 C40,44 70,36 100,36 C130,36 160,44 156,100 L158,128 C150,134 140,132 134,126 L66,126 C60,132 50,134 42,128Z",
      front: "M46,106 C40,50 70,38 100,38 C130,38 160,50 154,106 C152,90 150,78 146,70 Q100,78 54,70 C50,78 48,90 46,106Z",
      extra: "M128,58 L144,52"
    },
    akira: {
      front: "M48,96 C44,56 72,42 100,42 C130,42 156,56 152,96 C150,80 146,70 140,64 C128,58 114,60 104,52 C96,60 78,58 66,64 C57,70 51,82 48,96Z"
    },
    fumie: {
      back: "M84,40 C82,20 118,20 116,40Z",
      front: "M47,98 C40,54 70,42 100,42 C130,42 160,54 153,98 C150,80 142,70 130,66 Q116,60 100,68 Q84,60 70,66 C58,70 50,80 47,98Z",
      extra: "M100,46 L100,64"
    }
  };

  var PEOPLE = {
    sakura: { hair: "#8b5a3c", shirt: "#ee8a99", collar: "vneck", female: 1 },
    yuto: { hair: "#7a4e2d", shirt: "#4a90d9", dark: "#3a73b0", collar: "hood" },
    kenta: { hair: "#3b3530", shirt: "#5aa36b", dark: "#468553", collar: "polo", glasses: 1 },
    miyuki: { hair: "#3a2e2e", shirt: "#3d4f7c", collar: "jacket", female: 1 },
    fumie: { hair: "#e9ebf0", shirt: "#a58bc9", collar: "cardigan", female: 1, bun: 1 },
    shota: { hair: "#2f3140", shirt: "#e05a4f", collar: "tee" },
    daiki: { hair: "#4a3528", shirt: "#e3b23c", dark: "#c4952a", collar: "sweater", beard: 1 },
    akira: { hair: "#a3a8b2", shirt: "#8f7350", dark: "#6e573b", collar: "vest", mustache: 1 }
  };

  function human(id, mood) {
    var k = PEOPLE[id], h = HAIR[id], s = "";
    s += p(k.female ? BODY_F : BODY_M, k.shirt) + NECK;
    s += COLLAR[k.collar](k);
    if (h.back && !k.bun) s += p(h.back, k.hair);
    if (k.bun) s += c(100, 38, 17, k.hair) + p("M90,32 Q100,26 110,32", "none", ' stroke="#b9bec8" stroke-width="3"');
    if (!h.back || k.bun) s += EARS;
    s += HEAD;
    if (k.beard) s += p("M52,104 C58,132 80,140 100,140 C120,140 142,132 148,104 C146,118 136,128 126,128 Q112,132 100,130 Q88,132 74,128 C64,128 54,118 52,104Z", k.hair);
    s += p(h.front, k.hair);
    if (h.extra) s += p(h.extra, k.hair, id === "fumie" ? ' stroke="#b9bec8" stroke-width="3"' : id === "miyuki" ? ' stroke="#ffcc33" stroke-width="5"' : "");
    s += g(100, 92, 1, face(mood, { ey: 6, my: 20 }));
    if (k.mustache) s += p("M88,107 Q94,101 100,104.5 Q106,101 112,107 Q106,109.5 100,108 Q94,109.5 88,107Z", k.hair);
    if (k.glasses) {
      s += '<g fill="none" stroke-width="3">' +
        '<rect x="70" y="88" width="24" height="18" rx="6"/><rect x="106" y="88" width="24" height="18" rx="6"/>' +
        p("M94,96 L106,96") + "</g>";
    }
    return s;
  }

  // ---- テントウムシ ----
  function ladybug(x, mood, wife) {
    var s = "";
    // 体（赤い殻）
    s += e(0, 82, 46, 52, "#e2493b");
    s += p("M0,40 L0,134");
    s += c(-24, 70, 8, INK, NS) + c(24, 70, 8, INK, NS) + c(-30, 100, 7, INK, NS) + c(30, 100, 7, INK, NS) + c(-14, 122, 6, INK, NS) + c(14, 122, 6, INK, NS);
    if (!wife) s += p("M-20,38 L0,52 L20,38 L14,30 L-14,30Z", "#4a90d9") + c(0, 46, 3, "#fff");
    // 触角
    s += p("M-12,-36 Q-16,-50 -20,-58") + p("M12,-36 Q16,-50 20,-58") + c(-21, -60, 6, INK) + c(21, -60, 6, INK);
    // 頭
    s += c(0, 0, 42, INK);
    s += p("M-35,8 C-35,-16 -12,-20 0,-9 C12,-20 35,-16 35,8 C35,30 18,38 0,38 C-18,38 -35,30 -35,8Z", SKIN, NS);
    s += g(0, 10, 0.68, face(mood, { ey: 0, my: 16, ex: 19 }));
    if (wife) {
      var R = "#e23b3b";
      s += p("M20,-38 L0,-54 L-2,-26Z", R) + p("M20,-38 L42,-50 L40,-22Z", R) + c(20, -38, 6.5, R);
    }
    return g(x, 110, 0.92, s);
  }

  // ---- クマ ----
  function bear(x, y, s, mood) {
    var b = "";
    b += p("M-58,140 C-60,80 -40,46 0,46 C40,46 60,80 58,140Z", "#a8693a");
    b += e(0, 98, 30, 40, "#e8c79a", NS);
    b += c(-36, -34, 15, "#a8693a") + c(36, -34, 15, "#a8693a") + c(-36, -34, 7, "#e8c79a", NS) + c(36, -34, 7, "#e8c79a", NS);
    b += c(0, 0, 50, "#a8693a");
    b += e(0, 22, 23, 18, "#e8c79a");
    b += face(mood, { ey: -6, ex: 20, my: 23, cy: 12, cx: 33 });
    b += e(0, 12, 7.5, 5.5, INK, NS);
    return g(x, y, s, b);
  }

  // ---- 宇宙人 ----
  function alien(mood) {
    var s = "";
    s += p("M86,66 Q80,46 68,32") + p("M114,66 Q120,46 132,32") + c(66, 28, 8, "#a8e6c0") + c(134, 28, 8, "#a8e6c0");
    s += p("M34,200 C34,140 40,62 100,60 C160,62 166,140 166,200Z", "#7fd0a0");
    s += e(100, 178, 34, 24, "#a8e6c0", NS);
    s += g(100, 110, 1.05, face(mood, { ey: 0, my: 16 }));
    return s;
  }

  // ---- ミツバチ（頭に作業用の三角きん）----
  function bee(mood) {
    var s = "", Y = "#f7c23a", WING = "#e3f3fb";
    s += e(54, 140, 24, 34, WING, ' transform="rotate(-28 54 140)"') + e(146, 140, 24, 34, WING, ' transform="rotate(28 146 140)"');
    s += e(100, 176, 44, 40, Y);
    s += p("M59,158 Q100,166 141,158 L144,168 Q100,176 56,168Z", INK, NS) + p("M58,184 Q100,192 142,184 L137,194 Q100,202 63,194Z", INK, NS);
    s += p("M86,46 Q80,28 70,20") + p("M114,46 Q120,28 130,20") + c(68, 18, 6.5, INK) + c(132, 18, 6.5, INK);
    s += c(100, 90, 50, Y);
    s += e(100, 100, 38, 31, SKIN, NS);
    s += p("M54,72 C62,38 138,38 146,72 C130,62 70,62 54,72Z", "#4a90d9") + c(140, 50, 5, "#4a90d9");
    s += g(100, 94, 1, face(mood, { ey: 4, my: 19 }));
    return s;
  }

  // ---- ウサギ（おばあちゃんは肩かけと丸めがね）----
  function rabbit(x, y, sc, mood, fur, granny) {
    var b = "", IN = "#f6b8c4";
    b += p("M-56,140 C-58,82 -38,48 0,48 C38,48 58,82 56,140Z", fur);
    b += e(0, 100, 28, 36, "#fff", NS);
    if (granny) b += p("M-48,66 Q0,96 48,66 L54,90 Q0,122 -54,90Z", "#a58bc9") + c(0, 96, 5, "#ffcc33");
    b += e(-20, -64, 12, 32, fur) + e(20, -64, 12, 32, fur) + e(-20, -60, 5.5, 22, IN, NS) + e(20, -60, 5.5, 22, IN, NS);
    b += c(0, 0, 48, fur);
    b += face(mood, { ey: 0, my: 18, ex: 19, cx: 31 });
    b += e(0, 11, 4.5, 3.2, "#e88a9a", NS);
    if (granny) b += '<g fill="none" stroke-width="3">' + c(-19, 0, 11, "none") + c(19, 0, 11, "none") + p("M-8,0 L8,0") + "</g>";
    return g(x, y, sc, b);
  }

  // ---- 宇宙からの研究者（白衣・丸めがね・アンテナ1本）----
  function scholar(mood) {
    var s = "", SKN = "#b9a3e3";
    s += p("M50,200 C50,154 70,138 100,138 C130,138 150,154 150,200Z", "#fff");
    s += p("M86,140 L100,170 L114,140Z", "#8f78c8");
    s += p("M86,140 L100,178 L100,200") + p("M114,140 L100,178") + p("M118,170 L134,170 L134,190 L118,190Z", "#fff") + p("M124,170 L124,160", "none", ' stroke="#4a90d9" stroke-width="4"');
    s += p("M100,42 L100,20") + c(100, 15, 7, "#ffcc33");
    s += p("M52,90 L26,72 L34,108Z", SKN) + p("M148,90 L174,72 L166,108Z", SKN);
    s += c(100, 92, 52, SKN);
    s += g(100, 92, 1, face(mood, { ey: 6, my: 24, cy: 22 }));
    s += '<g fill="none" stroke-width="3">' + c(82, 98, 12, "none") + c(118, 98, 12, "none") + p("M94,98 L106,98") + "</g>";
    return s;
  }

  function draw(id, mood) {
    switch (id) {
      case "hoshina": return ladybug(58, mood, 0) + ladybug(145, mood, 1);
      case "kumada": return bear(76, 106, 0.88, mood) + bear(154, 140, 0.6, mood);
      case "pururu": return alien(mood);
      case "mitsue": return bee(mood);
      case "fuwari": return rabbit(80, 116, 0.86, mood, "#f4f1ec", 1) + rabbit(158, 150, 0.55, mood, "#e3c9a8", 0);
      case "miru": return scholar(mood);
      default: return PEOPLE[id] ? human(id, mood) : human("sakura", mood);
    }
  }

  var CHARACTER_IDS = ["sakura", "yuto", "kenta", "hoshina", "miyuki", "fumie", "kumada", "shota", "pururu", "daiki", "akira", "mitsue", "fuwari", "miru"];

  function character(clientId, mood) {
    if (mood !== "great" && mood !== "poor") mood = "normal";
    var mark = mood === "great" ? joy() : mood === "poor" ? gloom() : "";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true">' +
      '<g stroke="' + INK + '" stroke-width="' + LW + '" stroke-linejoin="round" stroke-linecap="round">' +
      draw(clientId, mood) + "</g>" + mark + "</svg>";
  }

  root.YorozuArt = Object.assign(root.YorozuArt || {}, { character: character, CHARACTER_IDS: CHARACTER_IDS });
})(typeof globalThis !== "undefined" ? globalThis : this);
