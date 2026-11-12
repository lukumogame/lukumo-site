/* よろず提案所：画面部品・ロゴ（SVG文字列を返す） */
(function (root) {
  "use strict";

  var BLUE = "#4a8fd8", ORANGE = "#f5a623", CREAM = "#fff8ec";

  function svg(vb, body, extra) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" ' +
      (extra || 'aria-hidden="true" focusable="false"') + ">" + body + "</svg>";
  }
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
  function ln(d, color, w) {
    return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + (w || 2) +
      '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function starShape(cx, cy, R, fill) {
    var d = "";
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.45 : R;
      d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1);
    }
    return p(d + "Z", fill, ' stroke="#34414f" stroke-width="2" stroke-linejoin="round"');
  }
  /* ---------- ロゴ ---------- */
  // rank：1 街の提案所（今の看板）／2 評判の提案所（星1つの飾り板）／3 街いちばんの提案所（星3つの飾り板・看板が少し大きい）
  function logo(rank) {
    rank = rank === 2 || rank === 3 ? rank : 1;
    var b = "";
    // ランク3：看板のまわりにオレンジのふちを足して、ひとまわり大きく見せる
    if (rank === 3) b += r(1, 37, 398, 94, ORANGE, 20);
    // 看板
    b += r(8, 44, 384, 80, BLUE, 16);
    b += r(15, 51, 370, 66, CREAM, 10);
    // 日よけ（枠・縞・青帯・波形の下端）
    b += r(22, 6, 356, 42, BLUE, 10);
    for (var i = 0; i < 8; i++) {
      var x = 28 + i * 43, col = i % 2 ? CREAM : ORANGE;
      b += r(x, 12, 43, 26, col);
      b += p("M" + (x + 1.5) + " 46a20 11 0 0 0 40 0z", col, ' stroke="' + BLUE + '" stroke-width="3"');
    }
    // 文字と下線
    b += '<text x="200" y="102" text-anchor="middle" font-family="\'M PLUS Rounded 1c\', sans-serif" font-weight="800" font-size="42" fill="' + BLUE + '" letter-spacing="2">よろず提案所</text>';
    b += r(120, 110, 160, 5, ORANGE, 2.5);
    if (rank === 1) return svg("0 0 400 130", b, 'role="img" aria-label="よろず提案所"');
    // 飾り板：看板の下につるす（星は均一な塗り）
    var n = rank === 3 ? 3 : 1, w = rank === 3 ? 132 : 64, x0 = 200 - w / 2;
    b += r(150, 122, 4, 12, BLUE) + r(246, 122, 4, 12, BLUE);
    b += r(x0, 130, w, 34, ORANGE, 10) + r(x0 + 4, 134, w - 8, 26, CREAM, 7);
    for (var k = 0; k < n; k++) b += starShape(200 + (k - (n - 1) / 2) * 38, 147, 11, ORANGE);
    var vb = "0 0 400 170";
    return svg(vb, b, 'role="img" aria-label="よろず提案所（' + (rank === 3 ? "街いちばんの提案所" : "評判の提案所") + '）"');
  }

  /* ---------- アイコン ---------- */
  function icon() {
    var b = r(0, 0, 120, 120, BLUE, 28);
    b += r(26, 50, 68, 46, CREAM, 6);
    b += r(22, 26, 76, 22, ORANGE, 5);
    for (var i = 0; i < 5; i++) b += c(29.6 + i * 15.2, 48, 7.6, CREAM);
    b += r(22, 46, 76, 3, BLUE);
    b += r(33, 62, 14, 14, BLUE, 2) + r(73, 62, 14, 14, BLUE, 2);
    b += r(52, 62, 16, 34, BLUE, 2);
    b += r(20, 95, 80, 4, "#3a78bd", 2);
    return svg("0 0 120 120", b);
  }

  /* ---------- 欄のアイコン（線は currentColor） ---------- */
  var SLOT = {
    destination: '<circle cx="12" cy="12" r="9"/><path d="M12 6.5l2.6 6.6H9.4z" fill="currentColor"/><path d="M9.4 13.1h5.2L12 17.5z"/>',
    activity: '<circle cx="13.5" cy="4.5" r="2" fill="currentColor"/><path d="M12.5 8l-2 6 3.5 3 0.5 4.5M10.5 14l-2.5 7M12.5 8l3.5 3 3-1M12.5 8l-4 2.5-1.5 3.5"/>',
    food: '<circle cx="12" cy="13" r="6"/><circle cx="12" cy="13" r="3"/><path d="M3 4v5.5M2 4v3.5c0 1.2 0.5 2 1 2s1-0.8 1-2V4M3 9.5V21M21 4c-1.6 1-2 3.5-2 6.5h2V21"/>',
    surprise: '<rect x="3.5" y="10" width="17" height="11" rx="1.5"/><rect x="2.5" y="7" width="19" height="3.5" rx="1"/><path d="M12 7v14M12 7c-1.5-3.5-5.5-4-5.5-1.8S10 7 12 7zM12 7c1.5-3.5 5.5-4 5.5-1.8S14 7 12 7z"/>'
  };
  function slotIcon(slot) {
    var body = '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      (SLOT[slot] || SLOT.destination) + "</g>";
    return svg("0 0 24 24", body);
  }

  /* ---------- 候補カードの絵（80×48） ---------- */
  var ART = {
    destination: [
      function () { // 山
        return r(0, 0, 80, 48, "#d9eef8") + c(62, 12, 6, "#ffd36b") +
          p("M2 40L24 12l10 12 8-8 20 24z", "#5d86a8") + p("M24 12l-5 6.5 3-1 2 2 2-2.5 2.5 1.5z", "#ffffff") +
          p("M42 16l-4 4 3 0 1.5 1.5 2-2z", "#ffffff") + p("M0 36c20-6 50-6 80 0v12H0z", "#8fbf7f");
      },
      function () { // 海とヤシ
        return r(0, 0, 80, 48, "#bfe6f7") + c(20, 12, 6, "#ffd36b") +
          r(0, 24, 80, 14, "#3f9fd6") + ln("M8 30c4-2 8 2 12 0M40 33c4-2 8 2 12 0", "#bfe6f7", 1.6) +
          p("M0 38c20-4 50-4 80 0v10H0z", "#f3dca0") +
          ln("M62 40c0-10 1-18 4-24", "#9b6a3e", 2.6) +
          p("M66 16c-6-5-12-4-15 0c5-2 10-1 15 0zM66 16c4-6 10-7 14-3c-5-1-10 1-14 3zM66 16c-1 5 0 9 3 11c-1-4-1-7-3-11z", "#4f9c58");
      },
      function () { // 街
        var s = r(0, 0, 80, 48, "#e3eef6");
        [[6, 18, 14, 30, "#8fb0cc"], [22, 8, 14, 40, "#6f93b6"], [38, 22, 12, 26, "#a9c3d9"], [52, 12, 16, 36, "#7ea2c3"], [70, 26, 10, 22, "#9ab8d2"]]
          .forEach(function (b) {
            s += r(b[0], b[1], b[2], b[3], b[4]);
            for (var y = b[1] + 4; y < 42; y += 7) s += r(b[0] + 3, y, 3, 4, "#fff4c9") + r(b[0] + b[2] - 6, y, 3, 4, "#fff4c9");
          });
        return s + r(0, 43, 80, 5, "#9cb08f");
      },
      function () { // 森
        return r(0, 0, 80, 48, "#e6f3e2") + p("M0 30c20-10 50-12 80-4v22H0z", "#a7cf96") +
          r(17, 26, 3, 16, "#8a6a4a") + c(18, 22, 10, "#5fa06a") +
          r(39, 22, 3, 20, "#8a6a4a") + c(40, 16, 12, "#4c8f5a") +
          r(61, 28, 3, 14, "#8a6a4a") + c(62, 24, 9, "#6cb178") +
          r(0, 42, 80, 6, "#86b876");
      }
    ],
    activity: [
      function () { // くつろぐ：湯気の立つカップ
        return r(0, 0, 80, 48, "#fdebd9") + '<ellipse cx="40" cy="40" rx="22" ry="4" fill="#f0cfae"/>' +
          p("M26 18h28v12c0 7-6 11-14 11s-14-4-14-11z", "#ffffff", ' stroke="#e08a55" stroke-width="2"') +
          ln("M54 22c6 0 7 8 0 8", "#e08a55", 2.2) + r(29, 22, 22, 3, "#f2b07a") +
          ln("M34 13c-2-3 2-5 0-8M40 13c-2-3 2-5 0-8M46 13c-2-3 2-5 0-8", "#d7a27e", 1.8);
      },
      function () { // 体を動かす：自転車
        return r(0, 0, 80, 48, "#dcf1e4") + r(0, 40, 80, 8, "#a9d6b8") +
          c(22, 32, 10, "none", ' stroke="#2f5d74" stroke-width="3"') + c(58, 32, 10, "none", ' stroke="#2f5d74" stroke-width="3"') +
          ln("M22 32l12-14h16l8 14M34 18l6 14 10-14M40 32h-18M48 13l2 5M44 13h7M32 15h6", "#e2603f", 2.6);
      },
      function () { // 見て楽しむ：カメラ
        return r(0, 0, 80, 48, "#e4e9fb") +
          r(18, 14, 44, 28, "#4a5a7a", 5) + r(30, 9, 14, 7, "#4a5a7a", 2) +
          c(40, 28, 10, "#ffffff") + c(40, 28, 6.5, "#5d9ad8") + c(38, 26, 2, "#ffffff") +
          r(52, 18, 6, 3, "#ffc21a", 1);
      },
      function () { // 体験する：絵の具パレットと筆
        return r(0, 0, 80, 48, "#fff3cc") +
          p("M40 8c14 0 26 7 26 17c0 6-5 6-9 6c-3 0-5 3-3 6c2 4-4 6-14 6C26 43 14 35 14 25S26 8 40 8z", "#e9c79a") +
          c(28, 20, 4, "#e2603f") + c(39, 15, 4, "#4a8fd8") + c(51, 18, 4, "#5cb87a") + c(25, 31, 4, "#ffc21a") + c(36, 34, 3.5, "#ffffff") +
          ln("M58 40l14-24", "#8a6a4a", 3) + p("M72 16l3-6 1 7z", "#e2603f");
      }
    ],
    food: [
      function () { // オムライス
        return r(0, 0, 80, 48, "#fdf0dc") + '<ellipse cx="40" cy="30" rx="32" ry="13" fill="#ffffff" stroke="#d9cdbd" stroke-width="2"/>' +
          p("M18 30c0-10 10-15 22-15s22 5 22 15c-6 3-14 4-22 4s-16-1-22-4z", "#ffcc33") +
          ln("M26 22c6 4 10-2 16 2s10-2 14 1", "#e2443a", 2.6) + c(60, 34, 4, "#e2443a") + p("M58 31l3-4 2 4z", "#5fae6a");
      },
      function () { // 麺どんぶり
        return r(0, 0, 80, 48, "#fbe7d6") + p("M14 22h52c0 12-10 20-26 20S14 34 14 22z", "#e2603f") +
          r(14, 20, 52, 5, "#f7d27a", 2.5) + ln("M26 21c4-3 6 3 10 0s6 3 10 0 6 3 10 0", "#fff3c0", 1.6) +
          c(30, 18, 5, "#ffffff") + c(30, 18, 2.2, "#ffc21a") + p("M44 15h10l-2 6h-8z", "#5fae6a") +
          ln("M54 4l-8 16M62 6l-12 15", "#9b6a3e", 2.4) + r(30, 32, 20, 3, "#ffffff", 1.5);
      },
      function () { // 寿司
        var s = r(0, 0, 80, 48, "#e3f1ee") + r(8, 30, 64, 10, "#9ccfc0", 3) + r(10, 40, 4, 4, "#7db8a7") + r(66, 40, 4, 4, "#7db8a7");
        [16, 36, 56].forEach(function (x, i) {
          s += r(x - 7, 22, 16, 9, "#ffffff", 4);
          s += r(x - 8, 16, 18, 8, ["#f2785a", "#ffcc33", "#e2443a"][i], 4);
          if (i === 1) s += r(x - 1, 16, 3, 15, "#2f4a3a");
        });
        return s;
      },
      function () { // ケーキ
        return r(0, 0, 80, 48, "#fde3ea") + '<ellipse cx="40" cy="40" rx="26" ry="5" fill="#ffffff"/>' +
          p("M22 38V22l36-6v22z", "#fff6e3") + p("M22 22l36-6-6-6-30 12z", "#ffffff") +
          r(22, 27, 36, 4, "#f28aa3") + p("M58 16v22l-4 0V20z", "#f6d9b0") +
          c(40, 12, 4.5, "#e2443a") + ln("M40 8c1-3 3-4 5-4", "#5fae6a", 1.6);
      }
    ],
    surprise: [
      function () { // プレゼント箱
        return r(0, 0, 80, 48, "#eef3fb") + r(24, 20, 32, 24, "#e2603f", 3) + r(21, 14, 38, 9, "#f27a55", 3) +
          r(37, 14, 6, 30, "#ffc21a") + p("M40 14c-4-8-14-10-14-4s10 4 14 4zM40 14c4-8 14-10 14-4s-10 4-14 4z", "#ffc21a");
      },
      function () { // 花束
        return r(0, 0, 80, 48, "#fff0f3") + ln("M40 42L34 24M40 42l0-20M40 42l7-18", "#5fae6a", 2.2) +
          c(32, 18, 7, "#f28aa3") + c(32, 18, 2.5, "#ffcc33") + c(48, 18, 7, "#ffcc33") + c(48, 18, 2.5, "#e2603f") +
          c(40, 11, 7, "#9a7fe0") + c(40, 11, 2.5, "#ffffff") +
          p("M30 28h20l-6 18h-8z", "#5d9ad8") + p("M36 34l4 3 4-3-4 5z", "#ffffff");
      },
      function () { // 手紙とハート
        return r(0, 0, 80, 48, "#fff8e0") + r(18, 12, 44, 30, "#ffffff", 3, ' stroke="#e0c58a" stroke-width="2"') +
          ln("M19 14l21 15 21-15", "#e0c58a", 2) +
          p("M40 27c-3-5-10-4-10 1 0 4 6 7 10 10 4-3 10-6 10-10 0-5-7-6-10-1z", "#e2443a");
      },
      function () { // 風船
        return r(0, 0, 80, 48, "#e7f6f4") +
          ln("M28 26c2 8-2 12 10 20M52 24c-2 8 2 12-12 22M40 22c0 10 0 16 0 24", "#8a96a3", 1.4) +
          '<ellipse cx="28" cy="16" rx="9" ry="11" fill="#e2603f"/><ellipse cx="52" cy="14" rx="9" ry="11" fill="#4a8fd8"/><ellipse cx="40" cy="12" rx="8" ry="10" fill="#ffcc33"/>' +
          p("M26 9c1-2 3-3 5-3", "none", ' stroke="#ffffff" stroke-width="2" stroke-linecap="round"');
      }
    ]
  };
  function cardArt(slot, index) {
    var list = ART[slot] || ART.destination;
    var i = Math.abs(Math.floor(Number(index) || 0)) % list.length;
    return svg("0 0 80 48", list[i]());
  }

  /* ---------- 小物 ---------- */
  function star(on) {
    return svg("0 0 24 24", p("M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z",
      on ? "#ffc21a" : "#cfd6db", ' stroke="' + (on ? "#f0a500" : "#b9c2c8") + '" stroke-width="1.2" stroke-linejoin="round"'));
  }
  function check() {
    return svg("0 0 24 24", c(12, 12, 11, "#5cb87a") + ln("M6.8 12.4l3.4 3.4 7-7.2", "#ffffff", 2.8));
  }
  function sun(cx, cy, rr) {
    var s = "";
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4, x1 = cx + Math.cos(a) * (rr + 2), y1 = cy + Math.sin(a) * (rr + 2),
        x2 = cx + Math.cos(a) * (rr + 4.5), y2 = cy + Math.sin(a) * (rr + 4.5);
      s += ln("M" + x1.toFixed(1) + " " + y1.toFixed(1) + "L" + x2.toFixed(1) + " " + y2.toFixed(1), "#f5a623", 2);
    }
    return s + c(cx, cy, rr, "#ffc21a");
  }
  function timeIcon(time) {
    var b;
    if (time === "夜") {
      b = p("M14 3.5a8.5 8.5 0 1 0 6.5 13A7 7 0 1 1 14 3.5z", "#4a6fc8") +
        p("M19 3l.8 1.8 1.8.8-1.8.8L19 8.2l-.8-1.8-1.8-.8 1.8-.8z", "#ffc21a");
    } else if (time === "昼") {
      b = sun(10, 9, 4.5) + p("M8 20h11a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.4 1.2A3 3 0 0 0 8 20z", "#ffffff", ' stroke="#9aa8b6" stroke-width="1.4"');
    } else {
      b = sun(12, 12, 5);
    }
    return svg("0 0 24 24", b);
  }
  function joy() {
    return svg("0 0 40 40", ln("M8 26L18 20M14 10l7 8M28 6l-2 11", "#ffcc33", 4));
  }
  function gloom() {
    return svg("0 0 40 40",
      ln("M20 21c0-2 3-2 3 0s-3 4-5 3-4-4-2-6 6-3 8-1 4 5 1 8-8 3-10 1-5-6-3-9 7-5 11-3", "#9aa5ae", 2.4) +
      ln("M30 32c2 0 2-2 0-2s-2 2 0 2M8 12c2 0 2-2 0-2s-2 2 0 2", "#b4bdc4", 2));
  }

  var ui = {
    logo: logo, icon: icon, slotIcon: slotIcon, cardArt: cardArt,
    star: star, check: check, timeIcon: timeIcon, joy: joy, gloom: gloom
  };
  root.YorozuArt = Object.assign(root.YorozuArt || {}, { ui: ui });
})(typeof globalThis !== "undefined" ? globalThis : this);
