/* よろず提案所：事務所の背景と手前のカウンター（SVG文字列を返す） */
(function (root) {
  "use strict";

  var PAL = {
    "朝": {
      ceil: "#ead9c3", ceilLine: "#dcc7ad", wall: "#f7ecdc", wallShade: "#efe0cb", floor: "#d9cbb6",
      sky: "#bfe5fa", cloud: "#ffffff", bldg: ["#d3dfea", "#c3d3e2", "#dbe6ef"], bwin: "#eef4f9",
      tree: "#8fc796", treeDark: "#78b583", lit: false
    },
    "昼": {
      ceil: "#ead9c3", ceilLine: "#dcc7ad", wall: "#f7ecdc", wallShade: "#efe0cb", floor: "#d9cbb6",
      sky: "#3f9be3", cloud: "#ffffff", bldg: ["#b9cde0", "#a8bfd6", "#c6d6e6"], bwin: "#e4eef7",
      tree: "#5fae6a", treeDark: "#4c9a58", lit: false
    },
    "夜": {
      ceil: "#c9b39a", ceilLine: "#b9a189", wall: "#e3cfb6", wallShade: "#d8c2a7", floor: "#bfae98",
      sky: "#1e2d5a", cloud: null, bldg: ["#2c3b66", "#33447a", "#28355c"], bwin: "#ffd76a",
      tree: "#2f5a46", treeDark: "#284d3c", lit: true
    }
  };

  function r(x, y, w, h, fill, rx, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' +
      (rx ? ' rx="' + rx + '"' : "") + ' fill="' + fill + '"' + (extra || "") + "/>";
  }
  function c(cx, cy, rr, fill, extra) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="' + fill + '"' + (extra || "") + "/>";
  }
  function p(d, fill, extra) {
    return '<path d="' + d + '" fill="' + fill + '"' + (extra || "") + "/>";
  }

  /* 窓の外の景色（窓ガラス領域 x0..96, y34..212） */
  function windowView(t, k) {
    var s = r(-20, 30, 120, 186, k.sky);
    if (k.cloud) {
      s += p("M14 70a9 9 0 0 1 16-6a11 11 0 0 1 20 4a7 7 0 0 1 2 14H16a8 8 0 0 1-2-12z", k.cloud);
      s += p("M58 104a7 7 0 0 1 12-4a8 8 0 0 1 15 3a6 6 0 0 1 1 11H60a6 6 0 0 1-2-10z", k.cloud);
      if (t === "朝") s += p("M-6 120a6 6 0 0 1 10-3a7 7 0 0 1 13 2a5 5 0 0 1 0 10H-6z", k.cloud);
    } else {
      // 月と星
      s += p("M36 58a14 14 0 1 0 14 18a11 11 0 1 1-14-18z", "#ffe28a");
      [[14, 48], [70, 50], [82, 86], [10, 96], [60, 112], [30, 128]].forEach(function (q, i) {
        s += c(q[0], q[1], i % 2 ? 1.2 : 1.6, "#fff6cf");
      });
    }
    // ビル群
    var B = [[-14, 140, 22, 72], [10, 150, 18, 62], [30, 132, 24, 80], [56, 158, 16, 54], [74, 142, 26, 70]];
    B.forEach(function (b, i) {
      s += r(b[0], b[1], b[2], b[3], k.bldg[i % 3]);
      for (var yy = b[1] + 8; yy < b[1] + b[3] - 18; yy += 11) {
        for (var xx = b[0] + 4; xx + 4 <= b[0] + b[2] - 3; xx += 7) {
          var on = !k.lit || ((xx * 7 + yy * 3 + i) % 5 < 3);
          s += r(xx, yy, 4, 6, on ? k.bwin : k.bldg[(i + 1) % 3]);
        }
      }
    });
    // 木々
    s += c(4, 196, 16, k.treeDark) + c(26, 190, 15, k.tree) + c(52, 198, 14, k.treeDark) +
      c(76, 192, 16, k.tree) + c(96, 200, 12, k.treeDark);
    s += r(-20, 200, 120, 16, k.treeDark);
    return s;
  }

  // 飾る場所（事務所の絵の座標。js/game.js の飾りつけ画面でも同じ位置にボタンを置く）
  // 棚：パンフレット棚の右の列の3段／壁：写真の額の上（天井のランプから離す）と、パンフレット棚の上（どちらも依頼者に隠れない）
  var DECO_SPOTS = {
    shelf: [{ x: 347, y: 125, w: 22, h: 23 }, { x: 347, y: 157, w: 22, h: 25 }, { x: 347, y: 189, w: 22, h: 25 }],
    wall: [{ x: 262, y: 38, w: 38, h: 38 }, { x: 324, y: 70, w: 42, h: 42 }]
  };
  // イベントの事務所（第2段フェーズ4・設計⑤）：パーティーの準備部屋。窓・地図・写真・観葉植物の代わりに、
  // 左の壁に催しの予定の黒板、天井の下に旗の飾り（ガーランド）、右に会場の模型をのせた棚。床の風船とプレゼントの箱
  // 依頼者・椅子・カウンターは旅行と同じ位置。棚の3か所は旅行と同じ座標（右の棚の右の列の3段）
  // 壁の2か所：黒板の下（黒板のすぐ横）と、旗の下（右の棚の左上）。どちらも依頼者の絵に重ならない（tests/rank.spec.js）
  var DECO_SPOTS_EVENT = {
    shelf: DECO_SPOTS.shelf,
    wall: [{ x: 30, y: 163, w: 40, h: 40 }, { x: 270, y: 58, w: 40, h: 40 }]
  };
  // ライフプランの事務所（第3段・設計6-2）：生成りの壁と木の床の相談室。左の壁に「未来の年表」、その下に相談用の丸テーブル、
  // 右に本棚（上に観葉植物）。ランク3でペンダントライトの右に街の見える窓
  // 棚の3か所は旅行と同じ座標（本棚の右の列の3段）。壁の2か所：年表の下（丸テーブルの上）と、ペンダントライトの左上。どちらも依頼者・家具に重ならない
  var DECO_SPOTS_LIFE = {
    shelf: DECO_SPOTS.shelf,
    wall: [{ x: 28, y: 138, w: 38, h: 38 }, { x: 128, y: 44, w: 40, h: 40 }]
  };
  // 投資の事務所（第4段・設計6-2）：生成りの壁の相談室。左の壁に「応援先の掲示板」（店のチラシと芽の絵）、その下に相談用の机、
  // 右に棚（上に芽の出た鉢）。ランク1・2はランプの右に店の絵の額、ランク3は同じ場所に窓
  // 飾る5か所はライフプランと同じ座標（棚＝右の棚の右の列の3段、壁＝掲示板の下と、ペンダントライトの左上）
  var DECO_SPOTS_INVEST = { shelf: DECO_SPOTS.shelf, wall: DECO_SPOTS_LIFE.wall };
  // 町おこしの事務所（第5段・設計6-2）：左の壁に町の地図（ピン）、その下に相談用の机。右の棚の上の壁に四季のカレンダー、
  // 棚の左にのぼり。ランク3でのぼりの左に窓。飾る5か所はライフプランと同じ座標
  var DECO_SPOTS_TOWN = { shelf: DECO_SPOTS.shelf, wall: DECO_SPOTS_LIFE.wall };
  function decoSpots(company) {
    return company === "event" ? DECO_SPOTS_EVENT : company === "life" ? DECO_SPOTS_LIFE :
      company === "invest" ? DECO_SPOTS_INVEST : company === "town" ? DECO_SPOTS_TOWN : DECO_SPOTS;
  }

  var EVENT_PAL = {
    "朝": { wall: "#efe3f6", wallShade: "#dcc5ea", wallDeep: "#c9addd", ceil: "#dccbe8", ceilLine: "#cbb5dc", floor: "#d6c6c2", board: "#3f5a4c" },
    "昼": { wall: "#efe3f6", wallShade: "#dcc5ea", wallDeep: "#c9addd", ceil: "#dccbe8", ceilLine: "#cbb5dc", floor: "#d6c6c2", board: "#3f5a4c" },
    "夜": { wall: "#d9c6e6", wallShade: "#c6acd9", wallDeep: "#b393cb", ceil: "#c3add6", ceilLine: "#b199c6", floor: "#b9a8a6", board: "#34493f" }
  };
  var PARTY = ["#e2574c", "#f2c94c", "#5cb87a", "#4a8fd8", "#b79ad8", "#f28fb0"];
  function garland(x0, x1, y, round) {
    var s = "", n = 0;
    s += p("M" + x0 + " " + y + "Q" + ((x0 + x1) / 2) + " " + (y + 16) + " " + x1 + " " + y, "none", ' stroke="#7a5a9a" stroke-width="1.6"');
    for (var x = x0 + 8; x < x1 - 4; x += 16) {
      var t = (x - x0) / (x1 - x0), yy = y + 16 * 2 * t * (1 - t);
      s += round ? p("M" + (x - 6) + " " + yy + "h12a6 6 0 0 1-12 0z", PARTY[n++ % PARTY.length]) : p("M" + (x - 6) + " " + yy + "h12l-6 12z", PARTY[n++ % PARTY.length]);
    }
    return s;
  }
  // 壁紙：ランク1 無地／ランク2 太い縦じま／ランク3 ひし形の柄（金の点）と腰板。どれも離れて見ても違いが分かる太さ
  function eventWall(k, rank) {
    var s = "";
    if (rank === 2) for (var sx = -36; sx < 440; sx += 24) s += r(sx, 32, 12, 204, k.wallShade);
    if (rank === 3) {
      for (var dy = 32, row = 0; dy < 236; dy += 28, row++) for (var dx = -40 + (row % 2) * 14; dx < 440; dx += 28) {
        s += p("M" + dx + " " + dy + "l14 14l-14 14l-14-14z", k.wallShade);
        s += c(dx, dy, 2.2, "#e8b93c");
      }
      s += r(-40, 196, 480, 40, k.wallDeep) + r(-40, 192, 480, 5, "#a988c4");
      for (var px = -30; px < 440; px += 40) s += r(px, 202, 30, 28, k.wallShade, 3);
    }
    return s;
  }
  // 催しの予定の黒板（文字は書かず、色チョークの印と線と、済みのチェック）
  function eventBoard(k) {
    var s = r(10, 64, 100, 92, "#8a6a4a", 3) + r(15, 69, 90, 82, k.board);
    s += r(24, 77, 42, 5, "#f4f1ec", 2.5) + p("M76 74l2.4 5 5.4.6-4 3.6 1.2 5.3-5-2.7-5 2.7 1.2-5.3-4-3.6 5.4-.6z", "#f2c94c");
    var rows = [[96, "#f28fb0", 1], [112, "#8fd0f0", 1], [128, "#f2c94c", 0], [144, "#a8e0b0", 0]];
    rows.forEach(function (q) {
      s += c(28, q[0] - 2, 4, q[1]) + r(38, q[0] - 3.5, 40, 3, "#cfe3d6", 1.5);
      s += q[2] ? p("M86 " + (q[0] - 3) + "l3 3l6-7", "none", ' stroke="#f2c94c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"')
        : r(85, q[0] - 6, 9, 8, "none", 1.5, ' stroke="#cfe3d6" stroke-width="1.6"');
    });
    s += r(8, 154, 104, 5, "#a8865e", 2) + r(26, 150, 12, 4, "#f4f1ec", 1.5) + r(42, 150, 9, 4, "#f28fb0", 1.5);
    return s;
  }
  // 右の棚（3段）と、上にのせた会場の模型
  function eventShelf() {
    var s = r(318, 118, 56, 124, "#b98ad0", 3) + r(322, 124, 48, 114, "#8f63ab");
    [150, 184, 216, 240].forEach(function (y) { s += r(318, y, 56, 5, "#c9a0dd"); });
    // 段1：紙皿の束 / 紙コップ
    s += r(325, 140, 20, 4, "#fff", 2) + r(325, 135, 20, 4, "#fff", 2) + r(325, 130, 20, 4, "#fff", 2);
    s += p("M350 148l2-14h14l2 14z", "#f28fb0") + r(350, 132, 18, 3, "#fff", 1.5);
    // 段2：リボンの巻き / プレゼントの箱
    s += c(335, 172, 8, "#f2c94c") + c(335, 172, 3, "#fff3c8");
    s += r(349, 166, 18, 16, "#5cb87a", 2) + r(356, 166, 4, 16, "#fff3c8") + r(349, 172, 18, 3, "#fff3c8");
    // 段3：ふくらます前の風船の袋 / ろうそく
    s += r(326, 194, 18, 20, "#fff", 2) + c(331, 202, 3, "#e2574c") + c(338, 206, 3, "#4a8fd8") + c(333, 209, 2.5, "#f2c94c");
    s += r(352, 200, 4, 14, "#8fd0f0", 1) + r(360, 198, 4, 16, "#f28fb0", 1) + p("M354 198q-2-3 0-5q2 2 0 5zM362 196q-2-3 0-5q2 2 0 5z", "#f2a23a");
    // 下の段：テーブルクロスのたたんだもの
    s += r(325, 222, 20, 16, "#e2574c", 2) + r(325, 228, 20, 3, "#fff", 0) + r(347, 222, 20, 16, "#4a8fd8", 2) + r(347, 228, 20, 3, "#fff", 0);
    // 会場の模型：台と、旗の立つ屋根の建物、小さな木
    s += r(320, 110, 52, 8, "#f4efe6", 2);
    s += r(332, 92, 30, 18, "#fff8ec") + p("M328 93l19-12l19 12z", "#8e5cc4") + r(343, 99, 8, 11, "#f2a65a", 1);
    s += r(346.4, 70, 1.4, 11, "#6b4e82") + p("M347.8 70l9 3l-9 3z", "#e2574c");
    s += c(326, 104, 5, "#5fae6a") + c(368, 104, 5, "#5fae6a") + r(325, 108, 2, 3, "#9b6a3e") + r(367, 108, 2, 3, "#9b6a3e");
    return s;
  }
  // 床の左：ふくらませた風船の束（重りつき）とプレゼントの箱
  function eventFloor() {
    var s = "";
    s += p("M90 230q-8-30-4-58M92 230q2-30 10-62M94 230q10-24 18-44", "none", ' stroke="#7a5a9a" stroke-width="1.2"');
    s += '<ellipse cx="86" cy="164" rx="10" ry="12" fill="#e2574c"/><ellipse cx="103" cy="158" rx="10" ry="12" fill="#f2c94c"/><ellipse cx="112" cy="178" rx="9" ry="11" fill="#4a8fd8"/>';
    s += c(82, 158, 2.5, "#fff", ' opacity="0.6"') + c(99, 152, 2.5, "#fff", ' opacity="0.6"');
    s += r(86, 228, 12, 8, "#6b4e82", 2);
    s += r(28, 214, 40, 28, "#f28fb0", 3) + r(44, 214, 8, 28, "#fff3c8") + r(24, 208, 48, 9, "#e9779c", 3) + r(44, 208, 8, 9, "#fff3c8");
    s += p("M48 208c-8-10-16-6-12 0zM48 208c8-10 16-6 12 0z", "#fff3c8");
    return s;
  }

  // ---- ライフプランの事務所 ----
  var LIFE_RED = "#d9534a", LIFE_GOLD = "#e8b93c";
  var LIFE_PAL = {
    "朝": { wall: "#fbf4e6", wallShade: "#f2e2cb", grid: "#ecc2b6", wallDeep: "#c98f62", ceil: "#efe1cd", ceilLine: "#e1cdb3", floor: "#d3a878", floorLine: "#bf915f" },
    "昼": { wall: "#fbf4e6", wallShade: "#f2e2cb", grid: "#ecc2b6", wallDeep: "#c98f62", ceil: "#efe1cd", ceilLine: "#e1cdb3", floor: "#d3a878", floorLine: "#bf915f" },
    "夜": { wall: "#eadcc5", wallShade: "#dfc9ab", grid: "#d9a597", wallDeep: "#b07a50", ceil: "#d3c0a6", ceilLine: "#c3ae93", floor: "#b88f63", floorLine: "#a07a50" }
  };
  // 壁紙：ランク1 無地／ランク2 はっきりした格子（ギンガム）／ランク3 格子に金の細線と、金のふちの腰板
  function lifeWall(k, rank) {
    var s = "", x, y;
    if (rank >= 2) {
      for (x = -34; x < 440; x += 28) s += r(x, 32, 12, 204, k.wallShade);
      for (y = 40; y < 236; y += 28) s += r(-40, y, 480, 12, k.wallShade);
      for (x = -34; x < 440; x += 28) for (y = 40; y < 236; y += 28) s += r(x, y, 12, 12, k.grid);
    }
    if (rank === 3) {
      for (x = -21; x < 440; x += 28) s += r(x - 0.6, 32, 1.2, 204, LIFE_GOLD, 0, ' opacity="0.7"');
      s += r(-40, 196, 480, 40, k.wallDeep) + r(-40, 192, 480, 5, LIFE_GOLD);
      for (x = -30; x < 440; x += 40) s += r(x, 202, 30, 28, "none", 3, ' stroke="#e3b88e" stroke-width="2"');
    }
    return s;
  }
  // 未来の年表：1年・5年・10年の3本の線（長さで年の差）。先に芽・木・家の絵。文字は書かない
  function lifeTimeline(rank) {
    var gold = rank === 3, s = "";
    s += r(10, 48, 108, 82, gold ? LIFE_GOLD : "#b98a5a", 3) + r(14, 52, 100, 74, "#fffdf6");
    if (gold) s += r(12, 50, 104, 78, "none", 2, ' stroke="#fff3c8" stroke-width="1"');
    s += r(14, 52, 100, 12, LIFE_RED) + r(20, 56, 30, 4, "#fff", 2) + r(54, 56, 12, 4, "#f7c6c0", 2);
    // 1年：短い線と芽
    s += r(24, 77, 26, 3, "#efb1a9", 1.5) + c(22, 78.5, 3.4, LIFE_RED);
    s += r(56.2, 74, 1.6, 8, "#5c9a52") + p("M57 76q-6-1-7-6q6 0 7 6zM57 75q5-1 6-6q-6 0-6 6z", "#6cbf5a");
    // 5年：中くらいの線と木
    s += r(24, 95, 52, 3, "#efb1a9", 1.5) + c(22, 96.5, 3.4, LIFE_RED);
    for (var t = 30; t < 76; t += 10) s += r(t, 93.5, 1.4, 6, "#e59a90");
    s += r(83, 94, 3, 8, "#9b6a3e") + c(84.5, 90, 7, "#5fae6a") + c(81, 92, 4, "#78c084");
    // 10年：長い線と家
    s += r(24, 113, 72, 3, "#efb1a9", 1.5) + c(22, 114.5, 3.4, LIFE_RED);
    for (t = 30; t < 96; t += 10) s += r(t, 111.5, 1.4, 6, "#e59a90");
    s += r(100, 110, 11, 10, "#fff3e0", 0, ' stroke="#b98a5a" stroke-width="1"') + p("M98 111l7.5-7l7.5 7z", LIFE_RED) + r(104, 114, 3.4, 6, "#b98a5a");
    s += c(64, 50, 3, gold ? LIFE_GOLD : LIFE_RED);
    return s;
  }
  // 相談用の丸テーブル（左の床）。上に資料と湯のみと小さな花
  function lifeTable() {
    var s = "";
    s += '<ellipse cx="64" cy="238" rx="20" ry="4" fill="#8f5c34"/>' + r(60, 206, 8, 32, "#a86d3a");
    s += '<ellipse cx="64" cy="206" rx="42" ry="8" fill="#b77b45"/><ellipse cx="64" cy="203" rx="42" ry="8" fill="#d9a066"/>';
    s += p("M36 202l18-5l14 4l-18 5z", "#ffffff") + p("M40 201l10-3M43 203l10-3", "none", ' stroke="#ecc2b6" stroke-width="1.2"');
    s += r(72, 194, 8, 8, "#fff3e0", 2) + r(72, 196, 8, 2, LIFE_RED);
    s += r(88, 190, 8, 12, "#f4efe6", 2) + p("M92 190v-8M92 186l-4-3M92 185l4-4", "none", ' stroke="#5c9a52" stroke-width="1.4" stroke-linecap="round"') +
      c(92, 181, 3.2, LIFE_RED) + c(87.5, 182.5, 2.4, "#f2c94c") + c(96.5, 180.5, 2.4, "#f6a8c8");
    return s;
  }
  // 本棚（右）と、上の観葉植物。右の列の本は飾ると台で隠れる
  function lifeShelf() {
    var s = r(318, 118, 56, 124, "#b07a4a", 3) + r(322, 124, 48, 114, "#8a5a34");
    [148, 182, 214, 240].forEach(function (y) { s += r(318, y, 56, 5, "#c99460"); });
    var cols = ["#d9534a", "#4a8fd8", "#f2c94c", "#5cb87a", "#f4efe6", "#b79ad8", "#e98a4f", "#3f6a8a"];
    function books(x0, x1, yb, hs, ci, lean) {
      var x = x0, i = 0, out = "";
      while (x + 4 <= x1 && i < hs.length) {
        var w = 4 + (i + ci) % 3, h = hs[i], col = cols[(i + ci) % cols.length];
        out += r(x, yb - h, w, h, col, 1) + r(x, yb - h + 3, w, 1.4, "#fff", 0, ' opacity="0.6"');
        x += w + 0.6; i++;
      }
      if (lean) out += p("M" + x + " " + yb + "l" + 8 + "-17l4 2l-8 15z", cols[(ci + 3) % cols.length]);
      return out;
    }
    s += books(324, 344, 148, [20, 17, 22, 18], 0, 0) + books(347, 369, 148, [19, 22, 16, 20], 3, 0);
    s += books(324, 338, 182, [24, 20, 22], 2, 1) + books(347, 369, 182, [22, 25, 19, 23], 5, 0);
    s += r(325, 206, 18, 8, "#f4efe6", 1) + r(326, 199, 16, 7, "#e98a4f", 1) + r(327, 193, 14, 6, "#4a8fd8", 1) + books(347, 369, 214, [20, 23, 18, 22], 1, 0);
    s += books(324, 344, 240, [18, 16, 19, 17], 4, 0) + books(347, 369, 240, [17, 19, 16, 18], 6, 0);
    // 観葉植物（本棚の上）
    s += p("M345 106c-10-4-18-14-17-28c9 4 15 14 17 28z", "#4f9c58") + p("M346 106c-3-14 0-28 10-38c4 12 1 26-10 38z", "#5fb36a") +
      p("M347 106c6-10 16-17 26-16c-4 10-14 16-26 16z", "#4f9c58") + p("M346 106c-8-1-16-6-20-14c10 0 17 5 20 14z", "#6cbf77");
    s += p("M336 104h20l-3 14h-14z", LIFE_RED) + r(334, 102, 24, 4, "#e57a70", 2);
    s += r(360, 110, 12, 4, "#4a8fd8", 1) + r(361, 106, 10, 4, "#f2c94c", 1);
    return s;
  }
  // ランク1・2：ペンダントライトの右に丸い時計／ランク3：同じ場所に街の見える窓（金のふちと赤いカーテン）
  function lifeClock() {
    var s = c(282, 74, 16, "#fffdf6", ' stroke="#b98a5a" stroke-width="3.5"');
    for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; s += c(+(282 + 11.5 * Math.cos(a)).toFixed(2), +(74 + 11.5 * Math.sin(a)).toFixed(2), i % 3 ? 0.9 : 1.6, "#8a6a4a"); }
    s += p("M282 74v-8M282 74l6 3", "none", ' stroke="#4a3a2a" stroke-width="1.8" stroke-linecap="round"') + c(282, 74, 1.6, LIFE_RED);
    return s;
  }
  function lifeWindow(t, k) {
    var s = r(244, 38, 72, 80, LIFE_GOLD, 3);
    s += '<svg x="248" y="42" width="64" height="72" viewBox="6 128 84 88" preserveAspectRatio="xMidYMid slice">' + windowView(t, k) + "</svg>";
    s += r(279, 42, 2, 72, "#fffaf0") + r(248, 77, 64, 2, "#fffaf0");
    s += r(240, 114, 80, 6, "#f4efe6", 2) + r(240, 118, 80, 2, LIFE_GOLD);
    // カーテン（左右）とタッセル
    s += p("M236 34h14c-2 20-1 36 3 52c-6 4-12 4-17 0z", LIFE_RED) + p("M310 34h14v52c-5 4-11 4-17 0c4-16 5-32 3-52z", LIFE_RED);
    s += r(234, 31, 92, 5, "#b03e36", 2) + c(236, 33.5, 3.2, LIFE_GOLD) + c(324, 33.5, 3.2, LIFE_GOLD);
    s += c(243, 84, 3, LIFE_GOLD) + c(317, 84, 3, LIFE_GOLD);
    return s;
  }
  // ランク3の金の飾り：天井の下の金の回り縁と、壁の金の星のつり飾り
  function lifeGold() {
    var s = r(-40, 32, 480, 3, LIFE_GOLD);
    [[176, 12], [194, 22]].forEach(function (q) {
      s += r(q[0] - 0.5, 35, 1, q[1], "#c99a2e");
      var x = q[0], y = 35 + q[1] + 6, d = "";
      for (var i = 0; i < 10; i++) { var a = Math.PI * i / 5 - Math.PI / 2, rr = i % 2 ? 2.6 : 6; d += (i ? "L" : "M") + (x + rr * Math.cos(a)).toFixed(2) + " " + (y + rr * Math.sin(a)).toFixed(2); }
      s += p(d + "Z", LIFE_GOLD);
    });
    return s;
  }
  // ---- 投資の事務所（第4段）：お金の絵（硬貨・グラフ）は描かない。店の夢と芽で「応援」を描く ----
  var IV_GOLD = "#e3a91c", IV_GOLD_D = "#b9851a", IV_GOLD_L = "#f6dc8c";
  var INVEST_PAL = {
    "朝": { wall: "#fcf7ea", wallShade: "#f4e7c4", dot: "#ecd082", wallDeep: "#c99c52", ceil: "#f1e6cf", ceilLine: "#e3d3b3", floor: "#e0c08e", floorLine: "#cba571" },
    "昼": { wall: "#fcf7ea", wallShade: "#f4e7c4", dot: "#ecd082", wallDeep: "#c99c52", ceil: "#f1e6cf", ceilLine: "#e3d3b3", floor: "#e0c08e", floorLine: "#cba571" },
    "夜": { wall: "#ece1c8", wallShade: "#e2d1a8", dot: "#d9b968", wallDeep: "#a98142", ceil: "#d6c6a8", ceilLine: "#c6b494", floor: "#c4a374", floorLine: "#ab8a5c" }
  };
  // 壁紙：ランク1 無地／ランク2 葉っぱの形の柄（ならんだ小さな双葉）／ランク3 双葉のあいだに金の点と、金のふちの腰板
  function investWall(k, rank) {
    var s = "", x, y, row;
    if (rank >= 2) for (y = 46, row = 0; y < 236; y += 26, row++) for (x = -34 + (row % 2) * 16; x < 440; x += 32) {
      s += p("M" + x + " " + y + "q-7-1-9-8q7 0 9 8z", k.dot) + p("M" + x + " " + y + "q7-1 9-8q-7 0-9 8z", k.dot) + r(x - 0.8, y, 1.6, 5, k.dot);
      if (rank === 3) s += c(x + 16, y - 13, 1.8, IV_GOLD);
    }
    if (rank === 3) {
      s += r(-40, 196, 480, 40, k.wallDeep) + r(-40, 192, 480, 5, IV_GOLD);
      for (x = -30; x < 440; x += 40) s += r(x, 202, 30, 28, "none", 3, ' stroke="#e9c77e" stroke-width="2"');
    }
    return s;
  }
  // 応援先の掲示板：コルクの板に、店のチラシ（日よけの店・パン・花）と、芽・鉢の芽・ハートの紙をピンでとめる。文字は書かない
  function investBoard(rank) {
    var gold = rank === 3, s = "";
    s += r(10, 48, 108, 82, gold ? IV_GOLD : "#b98a5a", 3) + r(14, 52, 100, 74, "#e6c697");
    if (gold) s += r(12, 50, 104, 78, "none", 2, ' stroke="#fff3c8" stroke-width="1"');
    for (var i = 0; i < 14; i++) s += c(18 + (i * 37) % 92, 58 + (i * 23) % 64, 0.9, "#cfa874");
    s += r(14, 52, 100, 10, IV_GOLD) + r(20, 55.5, 26, 3, "#fff8e0", 1.5) + r(50, 55.5, 10, 3, "#fbe7a8", 1.5);
    // 1：日よけのある店
    s += r(19, 66, 28, 28, "#fffdf6", 1, ' transform="rotate(-4 33 80)"');
    s += '<g transform="rotate(-4 33 80)">' + r(23, 78, 20, 12, "#f7e4c4") + r(30, 82, 6, 8, "#b98a5a");
    for (var a = 0; a < 4; a++) s += p("M" + (22 + a * 5.5) + " 72h5.5v5a2.75 2.75 0 0 1-5.5 0z", a % 2 ? "#fff" : "#e2574c");
    s += "</g>";
    // 2：パンのチラシ
    s += r(51, 65, 26, 27, "#fff3d6", 1) + '<ellipse cx="64" cy="79" rx="9" ry="6" fill="#d9944a"/>' +
      p("M59 76l2 5M64 75l0 6M69 76l-2 5", "none", ' stroke="#f3c98a" stroke-width="1.4" stroke-linecap="round"') + r(55, 87, 18, 2.4, "#e3a91c", 1.2);
    // 3：花屋のチラシ
    s += r(81, 66, 28, 28, "#fffdf6", 1, ' transform="rotate(5 95 80)"');
    s += '<g transform="rotate(5 95 80)">' + r(94.2, 80, 1.6, 9, "#5c9a52") + c(95, 78, 3, "#f2c94c");
    [[0, -4.5], [4.3, -1.4], [2.7, 3.6], [-2.7, 3.6], [-4.3, -1.4]].forEach(function (q) { s += c(95 + q[0], 78 + q[1], 2.6, "#f28fb0"); });
    s += c(95, 78, 2, "#f2c94c") + "</g>";
    // 4：芽の絵（大きめ）
    s += r(19, 99, 30, 23, "#f2f8e6", 1) + r(22, 115, 24, 3, "#b98a5a", 1.5) + r(33.2, 106, 1.6, 9, "#5c9a52") +
      p("M34 108q-7-1-8-7q7 0 8 7zM34 107q6-1 7-7q-7 0-7 7z", "#6cbf5a");
    // 5：鉢の芽
    s += r(54, 98, 24, 24, "#fffdf6", 1, ' transform="rotate(-3 66 110)"') + p("M60 110h12l-2 8h-8z", "#d9825a") + r(65.3, 103, 1.4, 7, "#5c9a52") +
      p("M66 105q-5 0-6-5q5 0 6 5zM66 104q5 0 6-5q-5 0-6 5z", "#6cbf5a");
    // 6：ハートの紙（お礼の気持ち）
    s += r(83, 100, 25, 21, "#fff7f4", 1) + p("M95.5 117c-6-4-8-8-5-10.5q3-1.5 5 1.5q2-3 5-1.5c3 2.5 1 6.5-5 10.5z", "#e2574c");
    // ピン
    [[33, 67, "#e2574c"], [64, 66, "#4a8fd8"], [95, 67, IV_GOLD], [34, 100, "#5cb87a"], [66, 99, IV_GOLD], [95.5, 101, "#4a8fd8"]].forEach(function (q) {
      s += c(q[0], q[1], 2.4, q[2], ' stroke="#7a5a3a" stroke-width="0.8"');
    });
    return s;
  }
  // 相談用の机（左の床）：四角い机に資料と湯のみ、小さな芽の鉢
  function investDesk() {
    var s = "";
    s += r(24, 204, 6, 36, "#9c6a3a") + r(100, 204, 6, 36, "#9c6a3a") + r(28, 214, 74, 4, "#a8753f");
    s += r(16, 198, 98, 8, "#c58a4e", 2) + r(16, 196, 98, 4, "#dba46a", 2);
    s += p("M30 195l20-6l16 4l-20 6z", "#ffffff") + p("M35 194l10-3M38 196l10-3", "none", ' stroke="#ecd082" stroke-width="1.2"');
    s += r(70, 186, 9, 10, "#fff3e0", 2) + r(70, 189, 9, 2.4, IV_GOLD);
    s += p("M86 184h14l-2 12h-10z", "#d9825a") + r(85, 182, 16, 3.4, "#e8a17a", 1.5) +
      r(92.3, 172, 1.6, 10, "#5c9a52") + p("M93 175q-7-1-8-7q7 0 8 7zM93 174q6-1 7-7q-7 0-7 7z", "#6cbf5a");
    return s;
  }
  // 右の棚：ファイル・小さな鉢・木箱。上に芽の出た大きな鉢
  function investShelf() {
    var s = r(318, 118, 56, 124, "#c49360", 3) + r(322, 124, 48, 114, "#94653c");
    [148, 182, 214, 240].forEach(function (y) { s += r(318, y, 56, 5, "#d8a874"); });
    // 段1：ファイル（金・生成り・緑）／小さな鉢
    s += r(325, 128, 5, 20, IV_GOLD, 1) + r(331, 130, 5, 18, "#f4efe6", 1) + r(337, 127, 5, 21, "#5cb87a", 1) + p("M343 148l4-18l3.5 1l-4 17z", "#e2574c");
    s += p("M350 136h14l-2 12h-10z", "#d9825a") + r(356.3, 128, 1.4, 8, "#5c9a52") + p("M357 131q-5 0-6-5q5 0 6 5zM357 130q5 0 6-5q-5 0-6 5z", "#6cbf5a");
    // 段2：木箱／たたんだ前かけ
    s += r(325, 164, 20, 18, "#d9a86a", 2) + r(325, 170, 20, 2, "#b98a5a") + r(347, 172, 20, 10, "#4a8fd8", 2) + r(347, 168, 20, 5, "#f4efe6", 2);
    // 段3：手紙の束（ハート）／じょうろ
    s += r(326, 202, 18, 12, "#fff7f4", 1) + r(326, 196, 18, 6, "#fbe7a8", 1) + p("M335 212c-3-2-4-4-2.5-5q1.5-.6 2.5.8q1-1.4 2.5-.8c1.5 1 .5 3-2.5 5z", "#e2574c");
    s += p("M350 200h12v14h-12z", "#8fc8e8") + p("M362 203l6-5", "none", ' stroke="#8fc8e8" stroke-width="2.4" stroke-linecap="round"') + p("M352 200q4-6 8 0", "none", ' stroke="#6aaed4" stroke-width="1.6"');
    // 下の段：植木ばさみの箱と、種の袋
    s += r(325, 224, 20, 16, "#f4efe6", 2) + r(325, 228, 20, 3, IV_GOLD) + r(348, 222, 18, 18, "#e8d0a0", 2) + c(357, 231, 3, "#6cbf5a");
    // 芽の出た鉢（棚の上）：大きな双葉と、つぼみ
    s += r(344.6, 74, 2.8, 30, "#4f9c58");
    s += p("M346 86q-18-2-22-18q18-1 22 18z", "#5fb36a") + p("M346 80q16-4 20-20q-17 0-20 20z", "#4f9c58") +
      p("M346 86q-14-3-19-14", "none", ' stroke="#3f8a4a" stroke-width="1.2"');
    s += c(346, 72, 4, IV_GOLD_L) + c(346, 72, 2, IV_GOLD);
    s += p("M332 104h28l-4 14h-20z", IV_GOLD) + r(330, 100, 32, 6, "#efc75a", 2) + r(338, 108, 16, 3, "#fff3c8", 1.5);
    return s;
  }
  // ランク1・2：ランプの右に、店と芽の絵の額
  function investPicture() {
    var s = r(250, 48, 60, 50, "#b98a5a", 3) + r(254, 52, 52, 42, "#fffdf6");
    s += r(254, 52, 52, 26, "#cfe9f5") + r(254, 78, 52, 16, "#bfe0a8");
    s += r(262, 66, 26, 18, "#f7e4c4") + r(272, 72, 6, 12, "#b98a5a");
    for (var a = 0; a < 5; a++) s += p("M" + (260 + a * 6) + " 60h6v5a3 3 0 0 1-6 0z", a % 2 ? "#fff" : IV_GOLD);
    s += r(293.3, 76, 1.4, 8, "#5c9a52") + p("M294 79q-6-1-7-6q6 0 7 6zM294 78q5-1 6-6q-6 0-6 6z", "#6cbf5a");
    s += c(298, 59, 4, "#ffe28a");
    return s;
  }
  // ランク3：同じ場所に街の見える窓（金のふちと、からし色のカーテン）
  function investWindow(t, k) {
    var s = r(244, 38, 72, 80, IV_GOLD, 3);
    s += '<svg x="248" y="42" width="64" height="72" viewBox="6 128 84 88" preserveAspectRatio="xMidYMid slice">' + windowView(t, k) + "</svg>";
    s += r(279, 42, 2, 72, "#fffaf0") + r(248, 77, 64, 2, "#fffaf0");
    s += r(240, 114, 80, 6, "#f4efe6", 2) + r(240, 118, 80, 2, IV_GOLD);
    s += p("M236 34h14c-2 20-1 36 3 52c-6 4-12 4-17 0z", "#e9b949") + p("M310 34h14v52c-5 4-11 4-17 0c4-16 5-32 3-52z", "#e9b949");
    s += p("M240 40v40M246 40c-1 14 0 28 2 40M320 40v40M314 40c1 14 0 28-2 40", "none", ' stroke="#c48f17" stroke-width="1.2"');
    s += r(234, 31, 92, 5, IV_GOLD_D, 2) + c(236, 33.5, 3.2, "#fff3c8") + c(324, 33.5, 3.2, "#fff3c8");
    s += c(243, 84, 3, "#fff3c8") + c(317, 84, 3, "#fff3c8");
    return s;
  }
  // ランク3の金の飾り：金の回り縁と、金の双葉のつり飾り
  function investGold() {
    var s = r(-40, 32, 480, 3, IV_GOLD);
    [[176, 12], [194, 22]].forEach(function (q) {
      var x = q[0], y = 35 + q[1];
      s += r(x - 0.5, 35, 1, q[1], IV_GOLD_D) + r(x - 0.8, y, 1.6, 9, IV_GOLD_D);
      s += p("M" + x + " " + (y + 3) + "q-8-1-10-9q8 0 10 9zM" + x + " " + (y + 3) + "q8-1 10-9q-8 0-10 9z", IV_GOLD);
    });
    return s;
  }

  // ---- 町おこしの事務所（第5段）----
  var TW_GREEN = "#3f9a56", TW_GREEN_D = "#2f7a42", TW_GREEN_L = "#8fcf9a", TW_GOLD = "#e8b93c";
  var TOWN_PAL = {
    "朝": { wall: "#f9f6e6", wallShade: "#e3eed3", wallDot: "#c9e0b4", wallDeep: "#6f9e6a", ceil: "#ece5cf", ceilLine: "#ddd3b6", floor: "#d6c08e", floorLine: "#bfa673" },
    "昼": { wall: "#f9f6e6", wallShade: "#e3eed3", wallDot: "#c9e0b4", wallDeep: "#6f9e6a", ceil: "#ece5cf", ceilLine: "#ddd3b6", floor: "#d6c08e", floorLine: "#bfa673" },
    "夜": { wall: "#e7e2c8", wallShade: "#d1dfbd", wallDot: "#b3cd9c", wallDeep: "#57834f", ceil: "#d1c8ab", ceilLine: "#c1b693", floor: "#b9a372", floorLine: "#a08a5c" }
  };
  // 壁紙：ランク1 無地／ランク2 横の太いしま（若草色）と白い点／ランク3 しまに金のひし形と、緑の腰板に金のふち
  function townWall(k, rank) {
    var s = "", x, y;
    if (rank >= 2) for (y = 44; y < 236; y += 30) {
      s += r(-40, y, 480, 13, k.wallShade);
      for (x = -30 + ((y / 30) % 2) * 14; x < 440; x += 28) s += c(x, y + 21.5, 2, k.wallDot);
    }
    if (rank === 3) {
      for (y = 44; y < 236; y += 30) for (x = -26; x < 440; x += 28) s += p("M" + x + " " + (y + 3) + "l3.5 3.5l-3.5 3.5l-3.5-3.5z", TW_GOLD);
      s += r(-40, 196, 480, 40, k.wallDeep) + r(-40, 192, 480, 5, TW_GOLD);
      for (x = -30; x < 440; x += 40) s += r(x, 202, 30, 28, "none", 3, ' stroke="#a9cf98" stroke-width="2"');
    }
    return s;
  }
  // 町の地図：川・道・家・山・森を描いた紙に、色のピン。文字は書かない
  function townMap(rank) {
    var gold = rank === 3, s = "";
    s += r(10, 48, 108, 82, gold ? TW_GOLD : "#b98a5a", 3) + r(14, 52, 100, 74, "#fbf3dc");
    if (gold) s += r(12, 50, 104, 78, "none", 2, ' stroke="#fff3c8" stroke-width="1"');
    s += r(14, 52, 100, 10, TW_GREEN) + r(20, 55.5, 26, 3, "#ffffff", 1.5) + r(50, 55.5, 10, 3, TW_GREEN_L, 1.5);
    // 山と森
    s += p("M14 86l12-16l9 10l7-7l10 13z", "#a9d49a") + p("M26 70l4 5h-8z", "#ffffff");
    s += c(92, 72, 7, "#7fc08a") + c(102, 76, 6, "#6cb07a") + c(86, 78, 5, "#8fcf9a");
    // 川（左下から右上へ）
    s += p("M14 116q22-4 34-18t36-24q12-4 30-6", "none", ' stroke="#8fcbef" stroke-width="6" stroke-linecap="round"');
    // 道（白い線）と橋
    s += p("M14 100h100M60 62v64", "none", ' stroke="#ffffff" stroke-width="4"') + p("M14 100h100M60 62v64", "none", ' stroke="#e3d3b3" stroke-width="1" stroke-dasharray="3 3"');
    s += r(56, 84, 8, 6, "#c9a070", 1);
    // 家（商店街）と駅
    [[66, 104, "#e2574c"], [76, 106, "#4a8fd8"], [86, 104, "#f2c94c"], [96, 106, "#e98a4f"]].forEach(function (q) {
      s += r(q[0], q[1], 8, 7, "#fffdf6", 0, ' stroke="#b98a5a" stroke-width="0.8"') + p("M" + (q[0] - 1) + " " + q[1] + "l5-4.5l5 4.5z", q[2]);
    });
    s += r(24, 104, 18, 9, "#f4efe6", 1, ' stroke="#b98a5a" stroke-width="0.8"') + r(22, 102, 22, 3, TW_GREEN, 1);
    s += c(40, 120, 3.5, "#f6a8c8") + c(46, 119, 3, "#f6a8c8");
    // ピン（頭は丸、下に小さな影）
    [[30, 84, "#e2574c"], [64, 74, TW_GREEN], [96, 98, TW_GOLD], [36, 104, "#4a8fd8"], [82, 116, "#e2574c"]].forEach(function (q) {
      s += '<ellipse cx="' + (q[0] + 2) + '" cy="' + (q[1] + 4) + '" rx="2.4" ry="1" fill="#000" opacity="0.15"/>';
      s += r(q[0] - 0.5, q[1], 1, 4, "#7a6a5a") + c(q[0], q[1], 3, q[2], ' stroke="#5a4a3a" stroke-width="0.8"') + c(q[0] - 1, q[1] - 1, 0.9, "#fff", ' opacity="0.8"');
    });
    return s;
  }
  // 四季のカレンダー（棚の上の壁）：2×2のます目に、春＝桜・夏＝ひまわり・秋＝もみじ・冬＝雪だるま
  function townCalendar(rank) {
    var x0 = 322, y0 = 44, s = "";
    s += p("M347 36l-14 10M347 36l14 10", "none", ' stroke="#8a6a4a" stroke-width="1.2"') + c(347, 36, 2, rank === 3 ? TW_GOLD : "#8a6a4a");
    s += r(x0, y0, 50, 58, "#fffdf6", 2, ' stroke="#b98a5a" stroke-width="1.6"') + r(x0, y0, 50, 8, TW_GREEN, 2) + r(x0 + 6, y0 + 3, 16, 2.4, "#fff", 1.2);
    var cx = [x0 + 3, x0 + 26], cy = [y0 + 11, y0 + 34];
    // 春
    s += r(cx[0], cy[0], 21, 21, "#fde3ea", 1.5);
    [[0, -4], [3.8, -1.2], [2.4, 3.3], [-2.4, 3.3], [-3.8, -1.2]].forEach(function (q) { s += c(cx[0] + 10.5 + q[0], cy[0] + 10.5 + q[1], 3, "#f6a8c8"); });
    s += c(cx[0] + 10.5, cy[0] + 10.5, 1.8, "#f2c94c");
    // 夏
    s += r(cx[1], cy[0], 21, 21, "#d9effa", 1.5) + r(cx[1] + 9.8, cy[0] + 11, 1.4, 9, "#5c9a52");
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; s += c(+(cx[1] + 10.5 + 4.6 * Math.cos(a)).toFixed(2), +(cy[0] + 9 + 4.6 * Math.sin(a)).toFixed(2), 2.2, "#f2c94c"); }
    s += c(cx[1] + 10.5, cy[0] + 9, 3, "#a0683c");
    // 秋
    s += r(cx[0], cy[1], 21, 21, "#fdf0d6", 1.5);
    s += p("M" + (cx[0] + 10.5) + " " + (cy[1] + 3) + "l2 4l4-2l-1 4.5l4 .5l-3.5 3l1.5 3l-5-1l-.5 4h-3l-.5-4l-5 1l1.5-3l-3.5-3l4-.5l-1-4.5l4 2z", "#e98a3a");
    // 冬
    s += r(cx[1], cy[1], 21, 21, "#eaf2fb", 1.5) + c(cx[1] + 10.5, cy[1] + 14, 5, "#ffffff", ' stroke="#a8c4dc" stroke-width="1"') +
      c(cx[1] + 10.5, cy[1] + 7, 3.6, "#ffffff", ' stroke="#a8c4dc" stroke-width="1"') + r(cx[1] + 8, cy[1] + 9.6, 5, 1.6, "#e2574c", 0.8) +
      c(cx[1] + 4, cy[1] + 4, 0.9, "#a8c4dc") + c(cx[1] + 17, cy[1] + 6, 0.9, "#a8c4dc") + c(cx[1] + 16, cy[1] + 16, 0.9, "#a8c4dc");
    return s;
  }
  // のぼり（棚の左に立てる）：緑の布に白いふちと、家とハートの印。ランク3は竿の先が金
  function townNobori(rank) {
    var s = "";
    s += r(309, 54, 3.4, 188, "#8a6a4a", 1.5) + r(302, 236, 18, 6, "#6a5040", 2);
    s += r(286, 62, 23, 3, "#8a6a4a", 1.5);
    s += r(288, 64, 20, 132, TW_GREEN);
    s += r(291, 67, 14, 126, "none", 0, ' stroke="#bfe3c6" stroke-width="1.2"');
    [72, 98, 124, 150, 176].forEach(function (y) { s += r(306, y, 5, 4, "#ffffff", 1.5); });
    s += c(298, 92, 8, "#ffffff") + r(293, 92, 10, 7, TW_GREEN) + p("M291.5 93l6.5-6l6.5 6z", "#e2574c") + r(296.5, 95, 3, 4, "#ffffff");
    s += p("M298 128c-5-3.5-6.5-7-4-9q2.4-1.2 4 1.2q1.6-2.4 4-1.2c2.5 2 1 5.5-4 9z", "#f6a8c8");
    s += r(292, 140, 12, 3, "#ffffff", 1.5) + r(292, 148, 12, 3, "#ffffff", 1.5) + r(292, 156, 9, 3, "#ffffff", 1.5);
    s += p("M288 196l5 6l5-6l5 6l5-6z", TW_GREEN);
    s += rank === 3 ? c(310.7, 52, 4, TW_GOLD) : c(310.7, 53, 3, "#a8865e");
    return s;
  }
  // 相談用の机（左の床）：低い木の机に緑の布、チラシと湯のみとメガホン
  function townDesk() {
    var s = "";
    s += r(24, 204, 6, 36, "#9c6a3a") + r(100, 204, 6, 36, "#9c6a3a");
    s += r(16, 198, 98, 8, "#b77b45", 2) + r(16, 196, 98, 4, "#d9a066", 2) + r(46, 195, 38, 13, TW_GREEN, 1) + r(46, 205, 38, 3, TW_GREEN_D);
    s += p("M24 194l18-4l10 5l-18 4z", "#ffffff") + p("M28 193l10-2M30 195l10-2", "none", ' stroke="#bfe3c6" stroke-width="1.2"');
    s += r(58, 186, 8, 9, "#fff3e0", 2) + r(58, 188.5, 8, 2.2, TW_GREEN);
    s += p("M80 192l14-9v14z", "#f2c94c") + r(76, 189, 5, 6, "#e98a3a", 1.5) + r(93, 182, 3, 16, "#d9a32a", 1.5);
    return s;
  }
  // 右の棚：丸めたポスター・ちょうちん・びん・チラシの束・はっぴ
  function townShelf() {
    var s = r(318, 118, 56, 124, "#b88452", 3) + r(322, 124, 48, 114, "#8a5d36");
    [148, 182, 214, 240].forEach(function (y) { s += r(318, y, 56, 5, "#cf9c66"); });
    // 段1：丸めたポスター（立てる）／小さなちょうちん
    s += r(325, 128, 5, 20, "#f4efe6", 2.5) + r(331, 126, 5, 22, "#f6a8c8", 2.5) + r(337, 129, 5, 19, "#8fcbef", 2.5);
    s += r(354, 130, 8, 2, "#3b3f46") + '<ellipse cx="358" cy="139" rx="7" ry="8" fill="#e2574c"/>' + r(354, 146, 8, 2, "#3b3f46") +
      p("M352 136h12M351.5 140h13M352 144h12", "none", ' stroke="#b8402f" stroke-width="0.8"');
    // 段2：たたんだはっぴ／チラシの束
    s += r(325, 166, 20, 16, TW_GREEN, 2) + r(325, 166, 20, 4, "#ffffff", 2) + r(333, 166, 4, 16, "#ffffff");
    s += r(348, 174, 18, 8, "#fffdf6", 1) + r(349, 170, 17, 5, "#fde3ea", 1) + r(348, 166, 18, 5, "#d9effa", 1);
    // 段3：びん（どんぐり・豆）／木の箱
    s += r(326, 198, 8, 16, "#e3f0f6", 2) + c(330, 208, 2.4, "#a0683c") + c(330, 203, 2, "#a0683c") + r(325.5, 196, 9, 3, "#b98a5a", 1);
    s += r(336, 200, 8, 14, "#e3f0f6", 2) + c(340, 209, 2, "#5cb87a") + c(340, 204, 2, "#5cb87a") + r(335.5, 198, 9, 3, "#b98a5a", 1);
    s += r(348, 200, 18, 14, "#d9a86a", 2) + r(348, 205, 18, 2, "#b98a5a");
    // 下の段：花の鉢と、たたんだのぼり
    s += p("M326 230h16l-2 10h-12z", "#d9825a") + c(330, 227, 3, "#f6a8c8") + c(336, 226, 3, "#f2c94c") + c(339, 229, 2.6, "#f6a8c8") + r(332.5, 226, 1.2, 4, "#5c9a52");
    s += r(348, 222, 18, 18, TW_GREEN_D, 2) + r(348, 228, 18, 2, "#ffffff");
    // 棚の上：丸めた地図と小さなかご
    s += r(322, 110, 22, 6, "#fbf3dc", 3, ' stroke="#b98a5a" stroke-width="0.8"') + c(322, 113, 3, "#efe2c0");
    s += p("M350 106h18l-2 12h-14z", "#c8955a") + p("M352 110h14M352 114h14", "none", ' stroke="#a8753f" stroke-width="1"') + c(355, 105, 3, "#e2574c") + c(361, 104, 3, "#f2a23a") + c(358, 102, 2.6, "#5cb87a");
    return s;
  }
  // ランク3：のぼりの左に窓（金のふち、緑ののれん風のカーテン）。外は街と木々
  function townWindow(t, k) {
    var s = r(224, 54, 56, 64, TW_GOLD, 3);
    s += '<svg x="228" y="58" width="48" height="56" viewBox="10 128 72 84" preserveAspectRatio="xMidYMid slice">' + windowView(t, k) + "</svg>";
    s += r(251, 58, 2, 56, "#fffaf0") + r(228, 85, 48, 2, "#fffaf0");
    s += r(220, 114, 64, 6, "#f4efe6", 2) + r(220, 118, 64, 2, TW_GOLD);
    // 上の短いのれん（3枚）
    s += r(222, 50, 60, 3, "#8a6a4a", 1.5);
    for (var i = 0; i < 3; i++) s += r(223 + i * 19.6, 52, 18.4, 14, TW_GREEN, 1) + r(223 + i * 19.6, 61, 18.4, 2, "#ffffff");
    return s;
  }
  // ランク3の金の飾り：金の回り縁と、小さな金のちょうちんのつり飾り
  function townGold() {
    var s = r(-40, 32, 480, 3, TW_GOLD);
    [[176, 10], [194, 20]].forEach(function (q) {
      var x = q[0], y = 35 + q[1];
      s += r(x - 0.5, 35, 1, q[1], "#c99a2e") + r(x - 3, y, 6, 2, "#8a6a2a") + '<ellipse cx="' + x + '" cy="' + (y + 8) + '" rx="6" ry="7" fill="' + TW_GOLD + '"/>' +
        p("M" + (x - 5.5) + " " + (y + 6) + "h11M" + (x - 5.5) + " " + (y + 10) + "h11", "none", ' stroke="#c99a2e" stroke-width="0.9"') + r(x - 3, y + 14, 6, 2, "#8a6a2a");
    });
    return s;
  }

  // opts = { rank: 1〜3, company: "travel"|"event"|"life"|"invest"|"town", deco: { shelf: [svg|null ×3], wall: [svg|null ×2] }, fit: "meet" }
  //   deco の中身は品の絵（viewBox 0 0 64 64 の <svg>）。棚の段にはそのまま、壁は額に入れて飾る
  function office(time, opts) {
    opts = opts || {};
    var rank = opts.rank === 2 || opts.rank === 3 ? opts.rank : 1, deco = opts.deco || {};
    var t = PAL[time] ? time : "昼";
    var k = PAL[t], ev = opts.company === "event", life = opts.company === "life", spots = decoSpots(opts.company);
    var iv = opts.company === "invest", tw = opts.company === "town", own = life || iv || tw; // own：生成りの壁と木の床の相談室（第3段〜）
    if (ev) k = Object.assign({}, k, EVENT_PAL[t]);
    if (life) k = Object.assign({}, k, LIFE_PAL[t]);
    if (iv) k = Object.assign({}, k, INVEST_PAL[t]);
    if (tw) k = Object.assign({}, k, TOWN_PAL[t]);
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid ' + (opts.fit === "meet" ? "meet" : "slice") + '" aria-hidden="true" focusable="false">';

    // 天井・壁・床
    s += r(-40, -40, 480, 380, k.wall);
    // 壁紙（ランク2：細いしま模様／ランク3：小さな花柄）。均一な塗りの細い線と小さな丸だけ
    if (ev) s += eventWall(k, rank);
    else if (life) s += lifeWall(k, rank);
    else if (iv) s += investWall(k, rank);
    else if (tw) s += townWall(k, rank);
    else if (rank === 2) for (var sx = -36; sx < 440; sx += 18) s += r(sx, 32, 7, 204, k.wallShade); // 縦じまの壁紙（ランク1の無地と見分けがつく太さ）
    if (!ev && !own && rank === 3) for (var fy = 44; fy < 232; fy += 26) for (var fx = -30 + ((fy / 26) % 2) * 13; fx < 440; fx += 26) {
      s += c(fx, fy - 3, 2.2, k.wallShade) + c(fx + 3, fy, 2.2, k.wallShade) + c(fx, fy + 3, 2.2, k.wallShade) + c(fx - 3, fy, 2.2, k.wallShade) + c(fx, fy, 1.6, "#f2c94c");
    }
    s += r(-40, -40, 480, 70, k.ceil);
    s += r(-40, 28, 480, 4, k.ceilLine);
    s += r(-40, 236, 480, 6, k.wallShade);
    s += r(-40, 242, 480, 100, k.floor);
    if (life || iv) { // 木の床の板目（投資は板を短く）
      var bw = iv ? 44 : 68;
      for (var fl = 252; fl < 300; fl += 12) s += r(-40, fl, 480, 1.4, k.floorLine);
      for (var fb = 0; fb < 5; fb++) for (var fx2 = -30 + (fb % 2) * (bw / 2); fx2 < 440; fx2 += bw) s += r(fx2, 242 + fb * 12, 1.4, 10, k.floorLine);
    }
    if (tw) { // 町おこし：幅の広い板の床（ライフプラン・投資より板が大きい）
      for (var tl = 0; tl < 3; tl++) s += r(-40, 254 + tl * 18, 480, 2, k.floorLine);
      for (var tb = 0; tb < 4; tb++) for (var tx = -30 + (tb % 2) * 40; tx < 440; tx += 80) s += r(tx, 242 + tb * 18, 2, 12, k.floorLine);
    }
    // ダウンライト
    s += '<ellipse cx="128" cy="14" rx="12" ry="3.5" fill="' + (k.lit ? "#fff1c4" : "#fbf6ee") + '"/>';
    s += '<ellipse cx="318" cy="14" rx="12" ry="3.5" fill="' + (k.lit ? "#fff1c4" : "#fbf6ee") + '"/>';

    // 夜のライトの光（円の塗り分けのみ）
    if (k.lit) {
      s += '<ellipse cx="214" cy="60" rx="78" ry="34" fill="#fff3c8" opacity="0.3"/>';
      s += '<ellipse cx="214" cy="52" rx="44" ry="18" fill="#fff3c8" opacity="0.4"/>';
    }
    if (ev) {
      // イベント：旗の飾り（ランク3は丸い旗をもう1本）・黒板・右の棚と会場の模型・床の風船とプレゼント
      s += garland(-10, 210, 36) + garland(220, 380, 36);
      if (rank === 3) s += garland(-10, 120, 50, 1) + garland(240, 316, 50, 1);
      s += eventBoard(k) + eventShelf() + eventFloor();
    } else if (life) {
      // ライフプラン：年表・丸テーブル・本棚と観葉植物。ランク1・2は時計、ランク3は窓と金の飾り
      if (rank === 3) s += lifeGold() + lifeWindow(t, k);
      else s += lifeClock();
      s += '<g transform="translate(8 0)">' + lifeTimeline(rank) + "</g>" + lifeTable() + lifeShelf(); // 年表はスマホで左が切れないよう少し右へ
    } else if (iv) {
      // 投資：応援先の掲示板・相談用の机・棚と芽の出た鉢。ランク1・2は店の絵の額、ランク3は窓と金の飾り
      if (rank === 3) s += investGold() + investWindow(t, k);
      else s += investPicture();
      s += '<g transform="translate(8 0)">' + investBoard(rank) + "</g>" + investDesk() + investShelf();
    } else if (tw) {
      // 町おこし：町の地図・相談用の机・棚・四季のカレンダー・のぼり。ランク3は窓と金の飾り
      if (rank === 3) s += townGold() + townWindow(t, k);
      s += '<g transform="translate(8 0)">' + townMap(rank) + "</g>" + townDesk() + townShelf() + townCalendar(rank) + townNobori(rank);
    } else {
      // 窓（左）
      s += '<g>' + windowView(t, k) + '</g>';
      s += r(-20, 30, 122, 6, "#59616d") + r(-20, 210, 122, 8, "#59616d");
      s += r(96, 30, 7, 188, "#59616d") + r(44, 36, 5, 174, "#59616d");
      s += r(-20, 216, 126, 5, "#868e99");

      // 観葉植物
      s += p("M74 214c-14-6-26-22-24-44c12 6 22 20 24 44z", "#4f9c58");
      s += p("M76 214c-4-20 0-44 14-58c6 18 2 40-14 58z", "#5fb36a");
      s += p("M78 214c8-16 24-28 42-28c-6 16-22 26-42 28z", "#4f9c58");
      s += p("M76 214c-16-2-32-12-38-28c18 0 32 10 38 28z", "#6cc077");
      s += p("M77 214c2-14 12-26 26-32c-2 14-12 26-26 32z", "#5fb36a");
      s += p("M62 212h30l-4 30h-22z", "#f4efe6") + r(60, 210, 34, 6, "#e6ded1", 2);

      // 模型の飛行機の棚
      {
        s += r(144, 70, 56, 5, "#b87a45", 1.5) + r(150, 75, 4, 5, "#9c6334") + r(190, 75, 4, 5, "#9c6334");
        s += r(166, 64, 3, 6, "#8b939e");
        s += p("M150 60c0-4 4-6 10-6h30c5 0 9 2 11 5c-2 3-6 4-11 4h-34c-4 0-6-1-6-3z", "#ffffff", ' stroke="#3e6fb5" stroke-width="1.2"');
        s += p("M170 59l-10-12h7l15 12z", "#3e6fb5");
        s += p("M172 61l-6 9h6l10-9z", "#3e6fb5");
        s += p("M151 58l-5-8h5l6 7z", "#3e6fb5");
        s += r(178, 56, 3, 2.5, "#3e6fb5") + r(184, 56, 3, 2.5, "#3e6fb5") + r(190, 56, 3, 2.5, "#3e6fb5");
        s += p("M196 56h4c1.5 1 1.5 2 0 3h-5z", "#3e6fb5");
      }

      // 世界地図（控えめ・淡い青緑）
      s += r(110, 84, 140, 80, "#d9b996", 3);
      s += r(114, 88, 132, 72, "#f6faf8");
      s += r(118, 92, 124, 64, "#d6ebe8");
      var land = "#b9dcd0";
      s += p("M124 104c4-6 14-8 22-6c6 2 8 6 4 10c-4 4-10 2-12 8c-2 5-6 4-8 0c-3-4-8-6-6-12z", land);
      s += p("M140 124c4-2 8 0 9 5c1 6-2 12-5 18c-2 3-4 1-4-2c0-6-4-10-3-15c0-3 1-5 3-6z", land);
      s += p("M170 100c3-3 8-3 10 0c2 2-1 5-4 5c-3 1-7-2-6-5z", land);
      s += p("M171 110c4-2 10-1 12 3c2 6 0 14-4 20c-2 3-5 2-6-1c-1-6-5-10-4-16c0-3 1-5 2-6z", land);
      s += p("M182 100c8-5 24-6 36-3c8 2 12 6 8 10c-4 3-10 1-12 6c-2 4-8 4-12 2c-4-2-8 2-12 0c-6-3-12-8-8-15z", land);
      s += p("M206 116c3 0 5 2 4 5c-1 2-4 2-5 0c-1-2-1-4 1-5z", land);
      s += p("M218 132c5-2 12-1 14 3c1 4-3 6-8 6c-5 0-9-2-8-5c0-2 1-3 2-4z", land);
      s += p("M150 150h60c-4 3-16 4-30 4s-26-1-30-4z", "#e4f2ef");

      // 写真の額（海とヤシ）
      s += r(266, 82, 46, 52, "#4a7fc0", 2) + r(270, 86, 38, 44, "#ffffff");
      s += r(272, 88, 34, 24, "#a9dcf3") + r(272, 108, 34, 10, "#5fb5e0") + p("M272 118h34v10h-34z", "#f3dfa8");
      s += p("M278 96a3 3 0 0 1 5-1a4 4 0 0 1 7 1a3 3 0 0 1 0 5h-12a3 3 0 0 1 0-5z", "#ffffff");
      s += p("M296 122c0-8 1-14 3-20", "none", ' stroke="#9b6a3e" stroke-width="2" stroke-linecap="round"');
      s += p("M299 102c-4-3-8-3-10 0c4-1 7 0 10 0zM299 102c3-4 7-5 10-3c-4 0-7 2-10 3zM299 102c-2 3-2 6 0 8c0-3 1-6 0-8zM299 102c4-1 7 1 8 4c-3-2-6-3-8-4z", "#4f9c58");

      // パンフレット棚（右）
      s += r(318, 118, 56, 124, "#c98a4b", 3);
      s += r(322, 124, 48, 114, "#b3763d");
      [148, 182, 214, 240].forEach(function (y) { s += r(318, y, 56, 5, "#d89a5a"); });
      // 段1：山 / 雲
      s += r(325, 126, 20, 22, "#5d9ad8") + p("M325 148l7-10l5 5l4-4l4 9z", "#5fae6a") + c(340, 131, 2.5, "#ffe08a");
      s += r(347, 126, 20, 22, "#3f7fc8") + p("M350 136a3 3 0 0 1 5-1a3 3 0 0 1 6 1a2 2 0 0 1 0 4h-11a2 2 0 0 1 0-4z", "#ffffff") + r(349, 142, 16, 3, "#a9cdf0");
      // 段2：塔 / ヤシ
      s += r(325, 157, 20, 25, "#f4d9bf") + p("M330 180v-8h10v8zM328 172l7-5l7 5zM331 167l4-4l4 4z", "#e2603f") + r(325, 157, 20, 4, "#e98a4f");
      s += r(347, 157, 20, 25, "#a8dcef") + r(347, 174, 20, 8, "#f1dc9e") + p("M357 178v-12", "none", ' stroke="#9b6a3e" stroke-width="1.6"') + p("M357 166c-3-2-6-1-7 1zM357 166c3-2 6-2 7 0zM357 166c0 3-1 4-2 5z", "#4f9c58");
      // 段3
      s += r(325, 190, 20, 24, "#f2a65a") + r(328, 194, 14, 3, "#fff3e0") + r(328, 200, 10, 3, "#fff3e0");
      s += r(347, 190, 20, 24, "#e7eef3") + r(350, 194, 14, 3, "#8fb8de") + r(350, 200, 10, 3, "#8fb8de");
      s += r(325, 220, 20, 20, "#f3c94f") + r(347, 220, 20, 20, "#9ccfe8");

    }

    // 飾った品：棚は段の右の列（もとの冊子の上に台を置いて飾る）、壁は額に入れて
    (deco.shelf || []).forEach(function (art, i) {
      var q = spots.shelf[i];
      if (!q || !art) return;
      s += r(q.x, q.y, q.w, q.h, "#b3763d");
      s += nest(art, q.x - 1, q.y - 2, q.w + 2, q.h + 2);
    });
    (deco.wall || []).forEach(function (art, i) {
      var q = spots.wall[i];
      if (!q || !art) return;
      s += r(q.x, q.y, q.w, q.h, "#b98a5a", 3) + r(q.x + 3, q.y + 3, q.w - 6, q.h - 6, "#fffaf0", 2);
      s += nest(art, q.x + 4, q.y + 4, q.w - 8, q.h - 8);
    });

    // ドア（右端・切れてもよい）
    s += r(378, 40, 40, 202, "#8d949c") + r(382, 46, 36, 196, "#a7aeb6") + r(386, 132, 3, 16, "#e3e6ea", 1.5);

    // ペンダントライト
    var lx = 214;
    s += r(lx - 1, -40, 2, 66, "#3b3f46");
    s += r(lx - 5, 22, 10, 6, "#3b3f46", 2);
    s += p("M" + (lx - 26) + " 46c0-12 11-20 26-20s26 8 26 20z", "#3b4048");
    s += '<ellipse cx="' + lx + '" cy="46" rx="24" ry="3.5" fill="' + (k.lit ? "#ffe9a6" : "#f4ead6") + '"/>';
    if (k.lit) s += c(lx, 47, 6, "#fff8dc");

    // 椅子（大：中心160、小：中心250、座面 y≈230）
    var cc = life ? LIFE_CHAIR : iv ? INVEST_CHAIR : tw ? TOWN_CHAIR : null;
    s += chair(160, 1, cc);
    s += chair(250, 0.78, cc);

    // 夜は部屋全体を少し落ち着かせる
    if (k.lit) s += r(-40, -40, 480, 380, "#2a2350", "", ' opacity="0.08"');

    return s + "</svg>";
  }

  // 品の絵（<svg viewBox="0 0 64 64">）を、指定の場所の大きさに入れる
  function nest(svgText, x, y, w, h) {
    return String(svgText).replace(/^<svg\b([^>]*)>/, function (m, attrs) {
      return '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + attrs.replace(/\s(x|y|width|height)="[^"]*"/g, "") + ">";
    });
  }

  var LIFE_CHAIR = { seat: "#c4544a", hi: "#df8073", base: "#a8443b" };
  var INVEST_CHAIR = { seat: "#d9a124", hi: "#efc75a", base: "#b07f14" };
  var TOWN_CHAIR = { seat: "#3f9a56", hi: "#6cbf7c", base: "#2f7a42" };
  function chair(cx, sc, col) {
    var w = 64 * sc, h = 52 * sc, top = 236 - h;
    var x0 = cx - w / 2;
    var d = "M" + x0 + " 242V" + (top + 18 * sc) + "c0-" + (14 * sc) + " " + (10 * sc) + "-" + (18 * sc) + " " + (w / 2) + "-" + (18 * sc) +
      "s" + (w / 2) + " " + (4 * sc) + " " + (w / 2) + " " + (18 * sc) + "V242z";
    var s = p(d, col ? col.seat : "#3f68a8");
    s += p("M" + (x0 + 6 * sc) + " " + (top + 16 * sc) + "c2-" + (8 * sc) + " " + (10 * sc) + "-" + (11 * sc) + " " + (w / 2 - 6 * sc) + "-" + (11 * sc),
      "none", ' stroke="' + (col ? col.hi : "#5a84c4") + '" stroke-width="' + (4 * sc) + '" stroke-linecap="round"');
    s += r(cx - w / 2 - 4 * sc, 226, w + 8 * sc, 10 * sc, col ? col.base : "#355a93", 4 * sc);
    return s;
  }

  // company："life" は赤（ランク2は薄い赤、ランク3はホームの建物の赤 #d9534a に金のひし形）
  // rank：2 前に青い布／3 前に看板と同じオレンジの布（ふち飾りつき）
  // company："event" のときは布をイベントの紫に（ランク2は薄い紫の布、ランク3は濃い紫の布に金の丸と色の旗。docs/第2段_設計.md ⑤）
  function counter(rank, company) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">';
    s += r(-40, 0, 480, 16, "#eaa962");
    s += r(-40, 0, 480, 3, "#f3c286");
    s += r(-40, 16, 480, 4, "#c47a3c");
    s += r(-40, 20, 480, 40, "#dc944f");
    s += r(-40, 50, 480, 10, "#b8703a");
    // 木目（線数本）
    var g = ' fill="none" stroke="#d6904d" stroke-width="1.4" stroke-linecap="round"';
    s += p("M20 7c40-2 80 2 120 0", "none", g) + p("M190 10c50 1 90-2 140 0", "none", g) +
      p("M70 12c30 1 50 0 80 1", "none", g) + p("M300 6c25-1 50 1 80 0", "none", g);
    var g2 = ' fill="none" stroke="#cd8746" stroke-width="1.4" stroke-linecap="round"';
    s += p("M10 32c60-2 110 2 170 0", "none", g2) + p("M230 38c50 2 100-1 150 1", "none", g2) +
      p("M60 43c40 1 80-1 120 0", "none", g2);
    if (rank === 2 || rank === 3) {
      var cloth = rank === 3 ? "#f7a933" : "#4a8fd8", edge = rank === 3 ? "#e08a14" : "#2f6fb6";
      if (company === "event") { cloth = rank === 3 ? "#8e5cc4" : "#b79ad8"; edge = rank === 3 ? "#6a3f9e" : "#8e6cbc"; }
      // ランク2は落ち着いた緑（年表の芽・木の緑とそろえる。2026-11-21 持ち主の指示でピンクから変更）
      if (company === "life") { cloth = rank === 3 ? "#d9534a" : "#78a86a"; edge = rank === 3 ? "#ad3c34" : "#5c9a52"; }
      // 投資：ランク2は淡い金、ランク3はホームの建物の金色 #e3a91c／町おこし：ランク2は若草色、ランク3はホームの建物の緑 #3f9a56
      if (company === "invest") { cloth = rank === 3 ? "#e3a91c" : "#efd27a"; edge = rank === 3 ? "#b9851a" : "#d4ad48"; }
      if (company === "town") { cloth = rank === 3 ? "#3f9a56" : "#9ccf8a"; edge = rank === 3 ? "#2f7a42" : "#6fae62"; }
      s += r(-40, 20, 480, 34, cloth) + r(-40, 50, 480, 4, edge);
      for (var bx = -36; bx < 440; bx += 24) s += p("M" + bx + " 54h16l-8 6z", edge);
      if (rank === 3) s += r(-40, 26, 480, 3, "#fff7e6") + r(-40, 44, 480, 3, "#fff7e6");
      // イベントのランク3：布に金の丸の飾りと、すその下に小さな色の旗
      if (rank === 3 && company === "event") {
        for (var gx = -28; gx < 440; gx += 24) s += c(gx, 36.5, 3.2, "#f2c94c");
        for (var fx = -36, n = 0; fx < 440; fx += 24, n++) s += p("M" + (fx + 2) + " 54h12l-6 6z", ["#f2c94c", "#f28fb0", "#8fd0f0", "#a8e0b0"][n % 4]);
      }
      // 投資のランク3：布に白い双葉の飾り／町おこしのランク3：布に金の丸と、すその金の三角
      if (rank === 3 && company === "invest") {
        for (var ix = -28; ix < 440; ix += 24) s += p("M" + ix + " 40q-5-1-6-6q5 0 6 6zM" + ix + " 40q5-1 6-6q-5 0-6 6z", "#fff7e6");
      }
      if (rank === 3 && company === "town") {
        for (var tx2 = -28; tx2 < 440; tx2 += 24) s += c(tx2, 36.5, 3.2, "#f2c94c");
        for (var tf = -36; tf < 440; tf += 24) s += p("M" + (tf + 4) + " 54h8l-4 4z", "#f2c94c");
      }
      // ライフプランのランク3：布に金のひし形の飾りと、すその金の三角
      if (rank === 3 && company === "life") {
        for (var lx2 = -28; lx2 < 440; lx2 += 24) s += p("M" + lx2 + " 32.5l4 4l-4 4l-4-4z", "#f2c94c");
        for (var lf = -36; lf < 440; lf += 24) s += p("M" + (lf + 4) + " 54h8l-4 4z", "#f2c94c");
      }
    }
    return s + "</svg>";
  }

  root.YorozuArt = Object.assign(root.YorozuArt || {}, { office: office, counter: counter, DECO_SPOTS: DECO_SPOTS, DECO_SPOTS_LIFE: DECO_SPOTS_LIFE, DECO_SPOTS_INVEST: DECO_SPOTS_INVEST, DECO_SPOTS_TOWN: DECO_SPOTS_TOWN, decoSpots: decoSpots });
})(typeof globalThis !== "undefined" ? globalThis : this);
