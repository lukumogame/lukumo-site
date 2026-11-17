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
  function decoSpots(company) { return company === "event" ? DECO_SPOTS_EVENT : DECO_SPOTS; }

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
  // opts = { rank: 1〜3, company: "travel"|"event", deco: { shelf: [svg|null ×3], wall: [svg|null ×2] }, fit: "meet" }
  //   deco の中身は品の絵（viewBox 0 0 64 64 の <svg>）。棚の段にはそのまま、壁は額に入れて飾る
  function office(time, opts) {
    opts = opts || {};
    var rank = opts.rank === 2 || opts.rank === 3 ? opts.rank : 1, deco = opts.deco || {};
    var t = PAL[time] ? time : "昼";
    var k = PAL[t], ev = opts.company === "event", spots = decoSpots(opts.company);
    if (ev) k = Object.assign({}, k, EVENT_PAL[t]);
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid ' + (opts.fit === "meet" ? "meet" : "slice") + '" aria-hidden="true" focusable="false">';

    // 天井・壁・床
    s += r(-40, -40, 480, 380, k.wall);
    // 壁紙（ランク2：細いしま模様／ランク3：小さな花柄）。均一な塗りの細い線と小さな丸だけ
    if (ev) s += eventWall(k, rank);
    else if (rank === 2) for (var sx = -36; sx < 440; sx += 18) s += r(sx, 32, 7, 204, k.wallShade); // 縦じまの壁紙（ランク1の無地と見分けがつく太さ）
    if (!ev && rank === 3) for (var fy = 44; fy < 232; fy += 26) for (var fx = -30 + ((fy / 26) % 2) * 13; fx < 440; fx += 26) {
      s += c(fx, fy - 3, 2.2, k.wallShade) + c(fx + 3, fy, 2.2, k.wallShade) + c(fx, fy + 3, 2.2, k.wallShade) + c(fx - 3, fy, 2.2, k.wallShade) + c(fx, fy, 1.6, "#f2c94c");
    }
    s += r(-40, -40, 480, 70, k.ceil);
    s += r(-40, 28, 480, 4, k.ceilLine);
    s += r(-40, 236, 480, 6, k.wallShade);
    s += r(-40, 242, 480, 100, k.floor);
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
    s += chair(160, 1);
    s += chair(250, 0.78);

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

  function chair(cx, sc) {
    var w = 64 * sc, h = 52 * sc, top = 236 - h;
    var x0 = cx - w / 2;
    var d = "M" + x0 + " 242V" + (top + 18 * sc) + "c0-" + (14 * sc) + " " + (10 * sc) + "-" + (18 * sc) + " " + (w / 2) + "-" + (18 * sc) +
      "s" + (w / 2) + " " + (4 * sc) + " " + (w / 2) + " " + (18 * sc) + "V242z";
    var s = p(d, "#3f68a8");
    s += p("M" + (x0 + 6 * sc) + " " + (top + 16 * sc) + "c2-" + (8 * sc) + " " + (10 * sc) + "-" + (11 * sc) + " " + (w / 2 - 6 * sc) + "-" + (11 * sc),
      "none", ' stroke="#5a84c4" stroke-width="' + (4 * sc) + '" stroke-linecap="round"');
    s += r(cx - w / 2 - 4 * sc, 226, w + 8 * sc, 10 * sc, "#355a93", 4 * sc);
    return s;
  }

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
      s += r(-40, 20, 480, 34, cloth) + r(-40, 50, 480, 4, edge);
      for (var bx = -36; bx < 440; bx += 24) s += p("M" + bx + " 54h16l-8 6z", edge);
      if (rank === 3) s += r(-40, 26, 480, 3, "#fff7e6") + r(-40, 44, 480, 3, "#fff7e6");
      // イベントのランク3：布に金の丸の飾りと、すその下に小さな色の旗
      if (rank === 3 && company === "event") {
        for (var gx = -28; gx < 440; gx += 24) s += c(gx, 36.5, 3.2, "#f2c94c");
        for (var fx = -36, n = 0; fx < 440; fx += 24, n++) s += p("M" + (fx + 2) + " 54h12l-6 6z", ["#f2c94c", "#f28fb0", "#8fd0f0", "#a8e0b0"][n % 4]);
      }
    }
    return s + "</svg>";
  }

  root.YorozuArt = Object.assign(root.YorozuArt || {}, { office: office, counter: counter, DECO_SPOTS: DECO_SPOTS, decoSpots: decoSpots });
})(typeof globalThis !== "undefined" ? globalThis : this);
