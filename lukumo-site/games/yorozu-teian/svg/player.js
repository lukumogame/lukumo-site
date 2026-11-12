// よろず提案所：自分のキャラ（所長）のSVG。2.5頭身のデフォルメで、依頼者（svg/characters.js）と同じ描き方
// 使い方：YorozuArt.player(p, "normal"|"great") → viewBox 0 0 200 260 のSVG文字列（足元は y≈252）
//         YorozuArt.playerIcon(p, "#f7a933") → viewBox 0 0 100 100 の丸いアイコン
//         YorozuArt.wearItem(art, color) → 身につけた品の絵（<svg>なしの部品。下の共通の骨組みの座標で描く）
// p = { body, color, hair, eyes, mouth, wear: { head, body, hand } }
//   color/hair/eyes/mouth は PLAYER_OPTIONS の番号。wear.* は null か { art, color }（art は data/items.json の art）
(function (root) {
  "use strict";

  // ---- 共通の骨組み（4種類の体すべてで同じ。品はこの座標に一度だけ描く）----
  // HEAD       頭の円。中心(100,88) 半径54 → 頭のてっぺん y=34、左右 x=46〜154、あご y=142
  // TORSO      胴。x 66〜134、y 140〜226（上は頭の下にかくれる）。ズボンは y 204〜230
  // SHOULDER_* 腕のつけ根（胴のうしろ）。腕はつけ根から手まで、太さ ARM_W のまっすぐな棒
  // HAND_*     手の中心（半径 HAND_R）。RIGHT は見る人から見て右。手に持つ品は右手で持つ
  // LEG_*      脚の左上。FEET は靴の底の高さ
  // HAT_BRIM   帽子のつばの高さ（頭のてっぺんから少し下）
  var HEAD = { cx: 100, cy: 88, r: 54 };
  var TORSO = { x1: 66, x2: 134, y1: 140, y2: 226 };
  var SHOULDER_L = { x: 78, y: 152 }, SHOULDER_R = { x: 122, y: 152 };
  var HAND_L = { x: 50, y: 195 }, HAND_R = { x: 150, y: 195 }, HAND_R_SIZE = 10;
  var ARM_W = 17, HAND_R2 = HAND_R_SIZE;
  var LEG_L = { x: 76, y: 212 }, LEG_R = { x: 104, y: 212 }, LEG_W = 20;
  var FEET = 252;
  var HAT_BRIM = 52;

  var INK = "#34414f";
  var LW = 4.5; // 輪郭線の太さ（依頼者と同じ）
  var SKIN = "#fde2cc"; // 虫の顔の色
  var CHEEK = "#f6a1a6";
  var MOUTH = "#e5545b";
  var TONGUE = "#ff9c9c";
  var WHITE = "#ffffff", CREAM = "#fff7e6", GOLD = "#f2c94c", RED = "#e2574c", WOOD = "#c58a52", DARKWOOD = "#7a4a2a";
  var SHIRT = "#8cc4e0", PANTS = "#3d4f7c", SHOES = "#6b4a3a", WING = "#e3f3fb";
  var NS = ' stroke="none"';
  // 人の髪の色（肌の色の番号ごと。濃い肌には濃い髪で輪郭がまぎれないように）
  var HAIR_COLORS = ["#6b4430", "#6b4430", "#4a3226", "#2f2a2e", "#2f2a2e"];

  var PLAYER_OPTIONS = {
    bodies: [{ key: "human", label: "人" }, { key: "animal", label: "動物" }, { key: "bug", label: "虫" }, { key: "alien", label: "宇宙人" }],
    colors: {
      human: ["#fde2cc", "#f2c9a4", "#d9a47a", "#a8724c", "#7a5038"],
      animal: ["#a8693a", "#e8c08a", "#f4f1ec", "#8f939c", "#e08a4a"],
      bug: ["#e2574c", "#f2c94c", "#5cb87a", "#4a8fd8", "#b79ad8"],
      alien: ["#7fd0a0", "#b9a3e3", "#8fd0e8", "#f2a8c3", "#e3d76a"]
    },
    hair: {
      human: [{ key: "short", label: "ショート" }, { key: "spiky", label: "ツンツン" }, { key: "bob", label: "ボブ" }, { key: "long", label: "ロング" }],
      animal: [{ key: "round", label: "まる耳" }, { key: "long", label: "ながい耳" }, { key: "pointy", label: "とがり耳" }, { key: "floppy", label: "たれ耳" }],
      bug: [{ key: "ball", label: "まる触角" }, { key: "curl", label: "くるん触角" }, { key: "spots", label: "水玉もよう" }, { key: "stripes", label: "しまもよう" }],
      alien: [{ key: "one", label: "1本アンテナ" }, { key: "two", label: "2本アンテナ" }, { key: "fins", label: "とがり耳" }, { key: "dots", label: "おでこもよう" }]
    },
    eyes: [{ key: "round", label: "まる目" }, { key: "dot", label: "てん目" }, { key: "smile", label: "にこにこ目" }, { key: "sleepy", label: "ねむそう目" }],
    mouth: [{ key: "smile", label: "にっこり" }, { key: "open", label: "あけた口" }, { key: "cat", label: "ねこ口" }, { key: "small", label: "おちょぼ口" }],
    iconBg: ["#f7a933", "#4a8fd8", "#5cb87a", "#e2574c", "#b79ad8", "#fbe7b5"],
    // 髪の色（人と宇宙人だけ。動物と虫は毛の色＝肌の色）。人の1つ目は前の決まりの色と同じ
    hairColors: {
      human: ["#6b4430", "#4a3226", "#2f2a2e", "#c98a3a", "#a8b0ba"],
      alien: ["#f2c94c", "#f28fb0", "#6cc0e0", "#9a7ad8", "#f4f1ec"]
    }
  };

  // ---- 描く道具 ----
  var n = function (v) { return +(+v).toFixed(2); };
  function p(d, fill, extra) { return '<path d="' + d + '" fill="' + (fill || "none") + '"' + (extra || "") + "/>"; }
  function c(x, y, r, fill, extra) { return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="' + fill + '"' + (extra || "") + "/>"; }
  function e(x, y, rx, ry, fill, extra) { return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + fill + '"' + (extra || "") + "/>"; }
  function r(x, y, w, h, fill, rx, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + (rx ? ' rx="' + rx + '"' : "") + ' fill="' + fill + '"' + (extra || "") + "/>"; }
  // 線だけ
  function l(d, w, s, extra) { return '<path d="' + d + '" fill="none"' + (w ? ' stroke-width="' + w + '"' : "") + (s ? ' stroke="' + s + '"' : "") + (extra || "") + "/>"; }
  // 輪郭つきの太い棒（腕・柄など）
  function T(d, fill, w) { return l(d, w + LW * 2) + l(d, w, fill); }
  function rot(a, x, y) { return ' transform="rotate(' + a + " " + x + " " + y + ')"'; }
  // 拡大縮小した部品でも線の太さを揃える
  function g(x, y, s, body, a) {
    return '<g transform="translate(' + x + " " + y + ")" + (a ? " rotate(" + a + ")" : "") + " scale(" + s + ')" stroke-width="' + n(LW / s) + '">' + body + "</g>";
  }
  function star(x, y, R, ri, f, a) {
    var d = "", i, t, q;
    for (i = 0; i < 10; i++) { t = Math.PI * i / 5 - Math.PI / 2 + (a || 0) * Math.PI / 180; q = i % 2 ? ri : R; d += (i ? "L" : "M") + n(x + q * Math.cos(t)) + " " + n(y + q * Math.sin(t)); }
    return p(d + "Z", f, R < 7 ? ' stroke-width="2"' : "");
  }
  // 三日月：円(x,y,R)から円(x+dx,y+dy,ri)をくりぬいた形
  function moon(x, y, R, dx, dy, ri, f) {
    var D = Math.sqrt(dx * dx + dy * dy), a = (R * R - ri * ri + D * D) / (2 * D), h = Math.sqrt(R * R - a * a),
      ux = dx / D, uy = dy / D, mx = x + ux * a, my = y + uy * a,
      p1 = [n(mx - uy * h), n(my + ux * h)], p2 = [n(mx + uy * h), n(my - ux * h)];
    return p("M" + p1 + "A" + R + " " + R + " 0 1 1 " + p2 + "A" + ri + " " + ri + " 0 1 0 " + p1 + "Z", f);
  }
  // 2色を混ぜる（透明度を使わずに、淡い色・濃い色をつくる）
  function mix(a, b, t) {
    var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), out = "#", i, x, y;
    for (i = 16; i >= 0; i -= 8) {
      x = (A >> i) & 255; y = (B >> i) & 255;
      out += ("0" + Math.round(x + (y - x) * t).toString(16)).slice(-2);
    }
    return out;
  }
  var dark = function (k) { return mix(k, INK, 0.28); };
  var light = function (k) { return mix(k, "#ffffff", 0.55); };
  // 頭の円を y1〜y2 で横に切った帯（虫のしまもよう）
  function headBand(y1, y2, fill) {
    var h1 = Math.sqrt(HEAD.r * HEAD.r - Math.pow(y1 - HEAD.cy, 2)), h2 = Math.sqrt(HEAD.r * HEAD.r - Math.pow(y2 - HEAD.cy, 2));
    return p("M" + n(100 - h1) + "," + y1 + " L" + n(100 + h1) + "," + y1 + " A" + HEAD.r + "," + HEAD.r + " 0 0 1 " + n(100 + h2) + "," + y2 +
      " L" + n(100 - h2) + "," + y2 + " A" + HEAD.r + "," + HEAD.r + " 0 0 1 " + n(100 - h1) + "," + y1 + "Z", fill, NS);
  }
  // 腕に沿った点（t=0 つけ根、t=1 手）
  function armPt(side, t) {
    var S = side < 0 ? SHOULDER_L : SHOULDER_R, H = side < 0 ? HAND_L : HAND_R;
    return n(S.x + (H.x - S.x) * t) + "," + n(S.y + (H.y - S.y) * t);
  }
  function armPath(side, t0, t1) { return "M" + armPt(side, t0) + " L" + armPt(side, t1); }

  // ---- 体（4種類共通）----
  var TORSO_D = "M65,226 L68,156 Q70,140 100,140 Q130,140 132,156 L135,226Z";
  var SHIRT_D = "M65,212 L68,156 Q70,140 100,140 Q130,140 132,156 L135,212Z";
  function bodyBase(k) {
    var s = "";
    s += T(armPath(-1, 0, 0.9), k, ARM_W) + T(armPath(1, 0, 0.9), k, ARM_W);
    s += r(LEG_L.x, LEG_L.y, LEG_W, 34, k, 8) + r(LEG_R.x, LEG_R.y, LEG_W, 34, k, 8);
    s += e(85, FEET - 7, 15, 7.5, SHOES) + e(115, FEET - 7, 15, 7.5, SHOES);
    s += p(TORSO_D, k);
    s += p("M65,204 L135,204 L136,231 L104,231 L100,223 L96,231 L64,231Z", PANTS);
    return s;
  }
  function hands(k) { return c(HAND_L.x, HAND_L.y, HAND_R2, k) + c(HAND_R.x, HAND_R.y, HAND_R2, k); }
  // ふだんの服（何も着ていないとき・マントやオーバーオールの下）
  function shirt(sleeves) {
    var s = "";
    if (sleeves) s += T(armPath(-1, 0, 0.42), SHIRT, ARM_W + 3) + T(armPath(1, 0, 0.42), SHIRT, ARM_W + 3);
    s += p(SHIRT_D, SHIRT);
    s += p("M86,141 L100,160 L114,141Z", WHITE);
    return s;
  }

  // ---- 身につける品（骨組みの座標で一度だけ描く）----
  // 各品は { part, back?, front }。back は体よりうしろ（マントの背中など）
  var WEAR = {
    // 麦わら帽子：つばは HAT_BRIM の高さ、山は頭のてっぺんより上
    strawhat: {
      part: "head", color: "#e8c36a",
      front: function (k) {
        return e(100, HAT_BRIM, 74, 15, k) + l("M40," + (HAT_BRIM + 7) + " Q100," + (HAT_BRIM + 24) + " 160," + (HAT_BRIM + 7), 2.5) +
          p("M66,50 C62,4 138,4 134,50 Q100,58 66,50Z", k) +
          p("M66.6,38 Q100,46 133.4,38 L134,49 Q100,57 66,49Z", "#3d4f8a") +
          l("M78,22 Q100,15 122,22", 2.5);
      }
    },
    // 月のヘアピン：頭の右上の横
    moonpin: {
      part: "head", color: "#f2c94c",
      front: function (k) {
        return r(122, 55, 34, 7, "#6b7a8f", 3.5, rot(-40, 139, 58.5)) +
          moon(142, 52, 13, 6, -5, 10.5, k) + star(128, 66, 5, 2.4, WHITE);
      }
    },
    // 水玉のリボン：頭の左上
    dotribbon: {
      part: "head", color: "#e2574c",
      front: function (k) {
        var b = p("M-2,2 L-12,22 L-6,20 L-3,25 L3,4Z", k) + p("M2,2 L12,22 L6,20 L3,25 L-3,4Z", k) +
          p("M0,0 C-8,-15 -27,-19 -27,-2 C-27,15 -8,13 0,0Z", k) + p("M0,0 C8,-15 27,-19 27,-2 C27,15 8,13 0,0Z", k) +
          c(-19, -6, 2.6, WHITE, NS) + c(-18, 5, 2.2, WHITE, NS) + c(-10, -1, 2.2, WHITE, NS) +
          c(19, -6, 2.6, WHITE, NS) + c(18, 5, 2.2, WHITE, NS) + c(10, -1, 2.2, WHITE, NS) +
          r(-6, -7, 12, 14, k, 5);
        return g(66, 46, 1, b, -22);
      }
    },
    // どんぐり帽子：頭の上半分にかぶる
    acornhat: {
      part: "head", color: "#a0683c",
      front: function (k) {
        return T("M100,16 Q99,7 106,3", DARKWOOD, 5) +
          p("M42,66 Q40,16 100,14 Q160,16 158,66Z", k) +
          l("M52,40 Q60,34 66,41 Q72,34 78,41 Q84,34 90,41 Q96,34 100,41 Q104,34 110,41 Q116,34 122,41 Q128,34 134,41 Q140,34 148,40" +
            "M48,54 Q56,48 62,55 Q68,48 74,55 Q80,48 87,55 Q94,48 100,55 Q106,48 113,55 Q120,48 126,55 Q132,48 138,55 Q144,48 152,54" +
            "M64,27 Q72,22 78,28 Q84,22 90,28 Q96,22 100,28 Q104,22 110,28 Q116,22 122,28 Q128,22 136,27", 2) +
          p("M38,62 Q100,80 162,62 L162,70 Q100,88 38,70Z", k) +
          p("M104,8 Q114,-2 126,4 Q118,14 104,8Z", "#8fcf6a");
      }
    },
    // 木の実ポンチョ：肩から腕をおおう。手は下から出る
    poncho: {
      part: "body", color: "#b9784a",
      front: function (k) {
        return shirt(false) +
          p("M82,140 L118,140 Q142,150 152,186 Q100,208 48,186 Q58,150 82,140Z", k) +
          p("M57,168 Q100,186 143,168 L148,178 Q100,198 52,178Z", CREAM) +
          c(66, 178, 3.2, RED) + c(82, 184, 3.2, DARKWOOD) + c(100, 187, 3.2, RED) + c(118, 184, 3.2, DARKWOOD) + c(134, 178, 3.2, RED) +
          l("M56,191 V200 M70,196 V205 M85,199 V208 M100,200 V209 M115,199 V208 M130,196 V205 M144,191 V200", 3) +
          e(100, 144, 22, 8, DARKWOOD);
      }
    },
    // 星空の上着：長そでのカーディガン
    starcardigan: {
      part: "body", color: "#3d4f8a",
      front: function (k) {
        return T(armPath(-1, 0, 0.8), k, ARM_W + 3) + T(armPath(1, 0, 0.8), k, ARM_W + 3) +
          p("M65,214 L68,156 Q70,140 100,140 Q130,140 132,156 L135,214Z", k) +
          p("M86,141 L100,178 L114,141Z", WHITE) +
          l("M100,178 V214 M65,206 H135", 2.5) + c(100, 188, 2.6, WHITE) + c(100, 200, 2.6, WHITE) +
          star(80, 160, 5, 2.3, GOLD) + star(122, 172, 5, 2.3, GOLD) + star(78, 190, 4, 1.9, GOLD) + star(120, 196, 3.6, 1.7, GOLD) +
          star(63, 170, 3.6, 1.7, GOLD, -30) + star(137, 170, 3.6, 1.7, GOLD, 30);
      }
    },
    // 水玉のマント：背中にマント、前は首元の留め具
    dotcape: {
      part: "body", color: "#e2574c",
      back: function (k) {
        return p("M74,142 Q100,134 126,142 L166,234 Q100,246 34,234Z", k) +
          c(46, 224, 3.5, WHITE, NS) + c(154, 224, 3.5, WHITE, NS) + c(58, 196, 3.2, WHITE, NS) + c(142, 196, 3.2, WHITE, NS) +
          c(42, 208, 2.6, WHITE, NS) + c(158, 208, 2.6, WHITE, NS) + c(66, 230, 3, WHITE, NS) + c(134, 230, 3, WHITE, NS);
      },
      front: function (k) {
        return shirt(true) +
          p("M100,147 L80,140 Q72,150 80,158Z", k) + p("M100,147 L120,140 Q128,150 120,158Z", k) +
          c(86, 149, 2, WHITE, NS) + c(114, 149, 2, WHITE, NS) +
          c(100, 147, 6, GOLD);
      }
    },
    // オーバーオール：シャツの上に胸当てとズボン
    overalls: {
      part: "body", color: "#4a7fb8",
      front: function (k) {
        return shirt(true) +
          T("M84,170 L82,141 M116,170 L118,141", k, 6) +
          p("M80,166 L120,166 L122,204 L78,204Z", k) +
          p("M64,200 L136,200 L137,234 L104,234 L100,224 L96,234 L63,234Z", k) +
          r(92, 176, 16, 12, k, 2) + l("M78,200 H122", 2.5) + l("M100,214 V224", 2.5) +
          c(84, 171, 3, GOLD) + c(116, 171, 3, GOLD) +
          r(64, 228, 34, 6, CREAM, 2) + r(102, 228, 34, 6, CREAM, 2);
      }
    },
    // 葉っぱの傘：右手で持ち、頭の右上にさす
    leafumbrella: {
      part: "hand", color: "#6cbf5a",
      front: function (k) {
        return T("M163,50 L150,203 Q149,212 141,211", DARKWOOD, 5) +
          p("M128,52 Q131,18 162,18 Q193,18 196,52 Q191,47 185,52 Q179,47 173,52 Q168,47 162,52 Q156,47 151,52 Q145,47 139,52 Q133,47 128,52Z", k) +
          l("M162,19 V51 M162,32 L148,24 M162,32 L176,24 M162,42 L138,35 M162,42 L186,35", 2) +
          l("M162,18 V11", 4);
      }
    },
    // 星のかけらの杖
    starwand: {
      part: "hand", color: "#8fd0c8",
      front: function (k) {
        return T("M144,206 L168,158", CREAM, 6) + l("M146,201 L149,195", 6, "#8a96a8") +
          star(172, 146, 19, 8.5, k, 15) + c(168, 145, 1.9, INK, NS) + c(176, 146, 1.9, INK, NS);
      }
    },
    // 星座早見盤：右手で円盤を持つ
    starwheel: {
      part: "hand", color: "#4a8fd8",
      front: function (k) {
        var x = 164, y = 178, s = c(x, y, 24, k) + c(x, y, 18.5, CREAM), i, a, t = "";
        for (i = 0; i < 16; i++) {
          a = i * 22.5 * Math.PI / 180;
          t += "M" + n(x + 19.5 * Math.cos(a)) + " " + n(y + 19.5 * Math.sin(a)) + "L" + n(x + 22 * Math.cos(a)) + " " + n(y + 22 * Math.sin(a));
        }
        return s + l(t, 1.6) + e(x, y - 1, 13, 10.5, "#2b3a66") +
          l("M155,178 L160,173 L167,177 L173,174", 1.5, CREAM) +
          star(155, 178, 3, 1.3, GOLD) + star(167, 177, 3.2, 1.4, GOLD) + star(173, 174, 2.6, 1.2, GOLD) + c(164, 193, 2.2, INK, NS);
      }
    },
    // 四つ葉のうちわ
    cloverfan: {
      part: "hand", color: "#5cb87a",
      front: function (k) {
        var x = 166, y = 142, lobes = function (t) { return c(x - 10, y - 10, 11, k, t) + c(x + 10, y - 10, 11, k, t) + c(x - 10, y + 10, 11, k, t) + c(x + 10, y + 10, 11, k, t); };
        return T("M150,200 L164,156", WOOD, 6) +
          lobes(' stroke-width="' + LW * 2 + '"') + lobes(NS) +
          l("M" + x + "," + y + " L" + (x - 15) + "," + (y - 15) + " M" + x + "," + y + " L" + (x + 15) + "," + (y - 15) +
            " M" + x + "," + y + " L" + (x - 15) + "," + (y + 15) + " M" + x + "," + y + " L" + (x + 15) + "," + (y + 15), 2) +
          c(x, y, 3, k);
      }
    },
    // 魚とりの網：右手で長い柄を持ち、網は右上
    fishnet: {
      part: "hand", color: "#e8c36a",
      front: function (k) {
        return T("M146,214 L172,84", k, 6) +
          p("M156,64 Q158,94 174,102 Q190,94 192,64Z", WHITE) +
          l("M164,68 Q165,88 171,99 M174,68 V102 M184,68 Q183,88 177,99 M158,76 Q174,84 190,76 M161,88 Q174,94 187,88", 1.8) +
          T("M174,56 A18,8 0 1 1 173.9,56", k, 4);
      }
    }
  };
  var WEAR_ARTS = Object.keys(WEAR);
  var HATS = { strawhat: 1, acornhat: 1 }; // 頭の上をおおう品（耳・触角・アンテナを帽子の中にしまう）

  function wear(art, color, layer) {
    var w = WEAR[art];
    if (!w) return "";
    var k = /^#[0-9a-fA-F]{6}$/.test(color || "") ? color : w.color;
    var s = "";
    if (layer !== "front" && w.back) s += w.back(k);
    if (layer !== "back") s += w.front(k);
    return s;
  }

  // ---- 顔（中心0,0の局所座標。依頼者の face() と同じ作り）----
  function face(mood, eyes, mouth, o, skin) {
    var ex = o.ex || 20, ey = o.ey, my = o.my, chx = o.cx || 32, chy = ey + 13, s = "", i, x;
    var ch = mix(skin, CHEEK, 0.6);
    s += e(-chx, chy, 8, 5, ch, NS) + e(chx, chy, 8, 5, ch, NS);
    if (mood === "great") {
      for (i = -1; i <= 1; i += 2) { x = i * ex; s += l("M" + (x - 8) + "," + (ey + 3) + " Q" + x + "," + (ey - 10) + " " + (x + 8) + "," + (ey + 3)); }
      s += p("M-12," + my + " Q0," + (my + 3) + " 12," + my + " Q11," + (my + 16) + " 0," + (my + 16) + " Q-11," + (my + 16) + " -12," + my + "Z", MOUTH);
      s += p("M-6," + (my + 12.5) + " Q0," + (my + 7) + " 6," + (my + 12.5) + " Q3," + (my + 14.5) + " 0," + (my + 14.5) + " Q-3," + (my + 14.5) + " -6," + (my + 12.5) + "Z", TONGUE, NS);
      return s;
    }
    for (i = -1; i <= 1; i += 2) {
      x = i * ex;
      if (eyes === "dot") s += c(x, ey + 1, 3.6, INK, NS);
      else if (eyes === "smile") s += l("M" + (x - 6) + "," + (ey + 3) + " Q" + x + "," + (ey - 6) + " " + (x + 6) + "," + (ey + 3));
      else if (eyes === "sleepy") s += p("M" + (x - 6.5) + "," + ey + " L" + (x + 6.5) + "," + ey + " A6.5,5 0 0 1 " + (x - 6.5) + "," + ey + "Z", INK, ' stroke-width="2.5"');
      else s += e(x, ey, 4, 5, INK, NS) + c(x + 1.4, ey - 1.8, 1.4, WHITE, NS);
    }
    if (mouth === "open") s += p("M-8," + my + " Q0," + (my + 2) + " 8," + my + " Q7," + (my + 11) + " 0," + (my + 11) + " Q-7," + (my + 11) + " -8," + my + "Z", MOUTH);
    else if (mouth === "cat") s += l("M-9," + (my + 1) + " Q-4.5," + (my + 7) + " 0," + (my + 1) + " Q4.5," + (my + 7) + " 9," + (my + 1));
    else if (mouth === "small") s += e(0, my + 3, 3.6, 4.2, MOUTH, ' stroke-width="3"');
    else s += l("M-8," + (my + 1) + " Q0," + (my + 8) + " 8," + (my + 1));
    return s;
  }

  // ---- 種類ごとの上乗せ（頭の円・胴・腕は共通）----
  var HUMAN_HAIR = {
    short: { front: "M46,96 C40,44 72,28 100,28 C130,28 160,44 154,96 C150,76 143,64 131,60 Q116,66 104,54 Q90,66 70,60 C58,64 50,76 46,96Z" },
    spiky: {
      front: "M46,96 C42,66 48,50 58,44 L52,26 L72,34 L78,14 L94,28 L106,10 L114,28 L132,18 L132,36 L148,38 C156,52 160,72 154,96 C150,78 142,66 130,60 Q118,68 102,56 Q86,68 70,62 C58,68 50,80 46,96Z",
      hat: "M46,96 C40,44 72,28 100,28 C130,28 160,44 154,96 C150,78 142,66 130,60 Q118,68 102,56 Q86,68 70,62 C58,68 50,80 46,96Z"
    },
    bob: {
      back: "M40,96 C36,38 70,28 100,28 C130,28 164,38 160,96 L162,130 Q146,140 132,128 L68,128 Q54,140 38,130Z",
      front: "M46,102 C40,46 70,30 100,30 C130,30 160,46 154,102 C152,86 150,76 146,68 Q100,76 54,68 C50,76 48,86 46,102Z"
    },
    long: {
      back: "M40,96 C36,38 70,28 100,28 C130,28 164,38 160,96 L166,170 C150,180 130,176 124,168 L120,124 L80,124 L76,168 C70,176 50,180 34,170Z",
      front: "M46,102 C40,46 70,30 100,30 C132,30 160,48 154,102 C150,86 142,74 130,66 C118,70 98,66 86,56 C80,68 66,76 54,80 C50,86 47,94 46,102Z"
    }
  };

  // 戻り値 { back, head, ears, front }
  //   back=体よりうしろ、head=頭の円の直前、front=顔の上（前髪・模様）
  //   ears=耳・触角・アンテナ。頭の品がないときは頭の円の直前、頭の品があるときは品より手前に描く（帽子の上に出す）
  //   帽子（hat）のときは、帽子の形は変えずに耳・触角の位置を少し上・外へずらす
  // hairColor：人の髪と、宇宙人のアンテナの先・ひれ・おでこの模様の色（null のときは前の決まり：人は肌の色に合わせた色）
  function species(body, k, style, hat, hairColor) {
    var o = { back: "", head: "", ears: "", front: "", face: { ey: 6, my: 20 }, faceSkin: k }, IN = light(k), D = dark(k);
    if (body === "human") {
      var h = HUMAN_HAIR[style] || HUMAN_HAIR.short;
      if (h.back) o.back += p(h.back, hairColor);
      else o.head += c(47, 98, 9, k) + c(153, 98, 9, k);
      o.front += p(hat && h.hat ? h.hat : h.front, hairColor);
    } else if (body === "animal") {
      o.face = { ey: 2, my: 22, cx: 36 };
      if (style === "long") {
        // ながい耳：帽子のときは、帽子の山の左右から上へ
        // 帽子のときは少し短くして外へかたむけ、絵の上の端で切れないようにする
        var lx = hat === "acornhat" ? 62 : hat ? 68 : 78, ly = hat ? 24 : 22, lr = hat ? 21 : 26, la = hat ? 24 : 10;
        o.ears += e(lx, ly, 12, lr, k, rot(-la, lx, ly)) + e(200 - lx, ly, 12, lr, k, rot(la, 200 - lx, ly)) +
          e(lx, ly + 2, 5.5, lr - 8, IN, NS + rot(-la, lx, ly + 2)) + e(200 - lx, ly + 2, 5.5, lr - 8, IN, NS + rot(la, 200 - lx, ly + 2));
        o.back += c(140, 214, 13, light(IN));
      } else if (style === "pointy") {
        // とがり耳：帽子のときは、山の外側に少し小さく立てる
        if (hat === "strawhat") o.ears += p("M58,44 L48,6 L80,28Z", k) + p("M142,44 L152,6 L120,28Z", k) + p("M61,36 L54,16 L72,28Z", IN, NS) + p("M139,36 L146,16 L128,28Z", IN, NS);
        else if (hat) o.ears += p("M44,40 L34,4 L70,20Z", k) + p("M156,40 L166,4 L130,20Z", k) + p("M47,32 L40,14 L60,22Z", IN, NS) + p("M153,32 L160,14 L140,22Z", IN, NS);
        else o.ears += p("M50,66 L52,16 L90,40Z", k) + p("M150,66 L148,16 L110,40Z", k) + p("M58,56 L58,30 L80,44Z", IN, NS) + p("M142,56 L142,30 L120,44Z", IN, NS);
        o.back += p("M128,214 Q156,222 168,194 Q170,176 160,168 Q160,196 132,202Z", k) + p("M168,194 Q170,176 160,168 Q158,182 162,190Z", WHITE, NS);
      } else if (style === "floppy") {
        o.front += e(48, 84, 13, 28, D, rot(16, 48, 84)) + e(152, 84, 13, 28, D, rot(-16, 152, 84));
        o.back += T("M132,214 Q150,214 152,198", k, 6);
      } else {
        // まる耳：帽子のときは、山の外側の少し上
        var rx = hat === "acornhat" ? 44 : hat ? 52 : 58, ry = hat === "acornhat" ? 26 : hat ? 30 : 44;
        o.ears += c(rx, ry, 16, k) + c(200 - rx, ry, 16, k) + c(rx, ry, 8, IN, NS) + c(200 - rx, ry, 8, IN, NS);
        o.back += c(140, 216, 11, k);
      }
      o.front += e(100, 112, 24, 16, mix(k, "#fff7e6", 0.7)) + e(100, 104, 7.5, 5.5, INK, NS);
      o.faceSkin = k;
    } else if (body === "bug") {
      o.face = { ey: 6, my: 21 };
      o.faceSkin = SKIN;
      o.back += e(60, 156, 20, 30, WING, rot(-30, 60, 156)) + e(140, 156, 20, 30, WING, rot(30, 140, 156));
      // 触角：帽子のときは、帽子の山の横から外へ出す
      var a0 = hat === "acornhat" ? [64, 32] : hat ? [72, 28] : [86, 40];
      var ax = 100 - a0[0];
      if (style === "curl") {
        o.ears += hat
          ? l("M" + a0[0] + "," + a0[1] + " Q54,6 42,10 Q32,14 36,22 Q40,28 46,22") + l("M" + (200 - a0[0]) + "," + a0[1] + " Q146,6 158,10 Q168,14 164,22 Q160,28 154,22")
          : l("M86,40 Q78,20 66,22 Q56,24 60,32 Q64,38 70,32") + l("M114,40 Q122,20 134,22 Q144,24 140,32 Q136,38 130,32");
      } else {
        o.ears += hat
          ? l("M" + a0[0] + "," + a0[1] + " Q" + (a0[0] - 8) + "," + (a0[1] - 12) + " " + (a0[0] - 20) + "," + (a0[1] - 18)) + l("M" + (200 - a0[0]) + "," + a0[1] + " Q" + (208 - a0[0]) + "," + (a0[1] - 12) + " " + (220 - a0[0]) + "," + (a0[1] - 18)) +
            c(a0[0] - 22, a0[1] - 19, 6.5, INK) + c(222 - a0[0], a0[1] - 19, 6.5, INK)
          : l("M86,40 Q82,24 72,14") + l("M114,40 Q118,24 128,14") + c(70, 12, 6.5, INK) + c(130, 12, 6.5, INK);
      }
      void ax;
      o.front += e(100, 100, 42, 34, SKIN, NS);
      if (style === "spots") o.front += c(70, 56, 6, INK, NS) + c(130, 56, 6, INK, NS) + c(100, 44, 5, INK, NS);
      if (style === "stripes") o.front += headBand(46, 54, INK) + headBand(36, 41, INK);
    } else {
      o.face = { ey: 6, my: 22 };
      var tip = hairColor || null;
      if (style === "fins") o.ears += p("M52,94 L24,74 L32,112Z", tip || k) + p("M148,94 L176,74 L168,112Z", tip || k);
      else if (style === "two") {
        o.ears += hat
          ? l("M72,28 Q62,18 52,12") + l("M128,28 Q138,18 148,12") + c(50, 11, 7, tip || light(k)) + c(150, 11, 7, tip || light(k))
          : l("M86,40 Q80,22 68,12") + l("M114,40 Q120,22 132,12") + c(66, 10, 7, tip || light(k)) + c(134, 10, 7, tip || light(k));
      } else if (style !== "dots") {
        // 1本アンテナ：帽子のときは、山の右上からななめに
        o.ears += hat ? l("M120,28 Q130,18 138,12") + c(140, 11, 7, tip || GOLD) : l("M100,36 L100,14") + c(100, 10, 7, tip || GOLD);
      }
      if (style === "dots") { var dc = tip || D; o.front += c(100, 58, 5, dc, NS) + c(86, 64, 3.5, dc, NS) + c(114, 64, 3.5, dc, NS); }
    }
    return o;
  }

  function pick(list, i) { i = Number(i) || 0; return list[i] != null ? list[i] : list[0]; }
  function wearArt(v) { return v && WEAR[v.art] ? v : null; }

  // 全身の中身（<svg>なし）。noHand=true で手に持つ品を描かない（アイコン用）
  function figure(pl, mood, noHand) {
    pl = pl || {};
    var bodyKey = PLAYER_OPTIONS.colors[pl.body] ? pl.body : "human";
    var k = pick(PLAYER_OPTIONS.colors[bodyKey], pl.color);
    var style = pick(PLAYER_OPTIONS.hair[bodyKey], pl.hair).key;
    var eyes = pick(PLAYER_OPTIONS.eyes, pl.eyes).key, mouth = pick(PLAYER_OPTIONS.mouth, pl.mouth).key;
    var w = pl.wear || {}, items = [wearArt(w.head), wearArt(w.body), wearArt(w.hand)];
    var head = null, bodyW = null, hand = null;
    items.forEach(function (v) {
      if (!v) return;
      var part = WEAR[v.art].part;
      if (part === "head") head = v; else if (part === "body") bodyW = v; else hand = v;
    });
    var hat = head && HATS[head.art] ? head.art : null;
    // 髪の色：選んだ色（人・宇宙人）。選んでいない古い保存データは、前の決まり（人は肌の色に合わせた色）
    var hc = PLAYER_OPTIONS.hairColors[bodyKey] && pl.hairColor != null ? pick(PLAYER_OPTIONS.hairColors[bodyKey], pl.hairColor) : null;
    if (!hc && bodyKey === "human") hc = pick(HAIR_COLORS, PLAYER_OPTIONS.colors[bodyKey].indexOf(k));
    var sp = species(bodyKey, k, style, hat, hc), s = "";
    // うしろ → 体 → 服 → 手 → 頭 → 顔 → 前髪・模様 → 頭の品 → 手の品
    if (bodyW) s += wear(bodyW.art, bodyW.color, "back");
    s += sp.back;
    s += bodyBase(k);
    s += bodyW ? wear(bodyW.art, bodyW.color, "front") : shirt(true);
    s += hands(k);
    s += sp.head + (head ? "" : sp.ears) + c(HEAD.cx, HEAD.cy, HEAD.r, k);
    s += sp.front;
    s += g(HEAD.cx, HEAD.cy, 1, face(mood, eyes, mouth, sp.face, sp.faceSkin));
    if (head) s += wear(head.art, head.color, "front") + sp.ears; // 耳・触角は頭の品より手前
    if (hand && !noHand) s += wear(hand.art, hand.color, "front") + c(HAND_R.x, HAND_R.y, HAND_R2, k);
    return s;
  }

  function joy() {
    return '<g stroke="#ffcc33" stroke-width="6.5" stroke-linecap="round">' +
      l("M10,58 L27,62") + l("M16,28 L31,42") + l("M42,10 L47,29") + "</g>";
  }

  function player(pl, mood) {
    if (mood !== "great") mood = "normal";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" aria-hidden="true">' +
      '<g stroke="' + INK + '" stroke-width="' + LW + '" stroke-linejoin="round" stroke-linecap="round">' +
      figure(pl, mood) + "</g>" + (mood === "great" ? joy() : "") + "</svg>";
  }

  var iconSeq = 0;
  function playerIcon(pl, bg) {
    bg = /^#[0-9a-fA-F]{3,8}$/.test(bg || "") ? bg : PLAYER_OPTIONS.iconBg[0];
    var id = "yz-pi-" + (++iconSeq);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">' +
      '<defs><clipPath id="' + id + '"><circle cx="50" cy="50" r="48" fill="#ffffff"/></clipPath></defs>' +
      c(50, 50, 48, bg) +
      '<g clip-path="url(#' + id + ')"><g transform="translate(50 58) scale(0.54) translate(-100 -88)" stroke="' + INK + '" stroke-width="' + LW + '" stroke-linejoin="round" stroke-linecap="round">' +
      figure(pl, "normal", true) + "</g></g>" +
      c(50, 50, 48, "none", ' stroke="' + INK + '" stroke-width="3"') + "</svg>";
  }

  // 前の決まりの宇宙人のアンテナ・ひれ・模様の色（髪の色を選ぶ前の保存データを、いちばん近い色で補うため）
  function legacyTip(pl) {
    var k = pick(PLAYER_OPTIONS.colors.alien, pl && pl.color), st = pick(PLAYER_OPTIONS.hair.alien, pl && pl.hair).key;
    return st === "two" ? light(k) : st === "fins" ? k : st === "dots" ? dark(k) : GOLD;
  }
  root.YorozuArt = Object.assign(root.YorozuArt || {}, {
    player: player, playerIcon: playerIcon, wearItem: wear, PLAYER_OPTIONS: PLAYER_OPTIONS, WEAR_ARTS: WEAR_ARTS, playerLegacyTip: legacyTip
  });
  if (typeof module !== "undefined") module.exports = { player: player, playerIcon: playerIcon, wear: wear, PLAYER_OPTIONS: PLAYER_OPTIONS, WEAR_ARTS: WEAR_ARTS };
})(typeof globalThis !== "undefined" ? globalThis : this);
