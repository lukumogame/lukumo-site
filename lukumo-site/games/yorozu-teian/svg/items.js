/* よろず提案所：もらえる品の絵。item(art, color) は viewBox 0 0 64 64 の完結したSVG文字列 */
(function (root) {
  "use strict";

  var INK = "#34414f"; // 輪郭線（キャラと同じ色）
  var LW = 2.5; // 輪郭線の太さ（64×64基準）
  var WHITE = "#ffffff", CREAM = "#fff7e6", WOOD = "#c58a52", DARKWOOD = "#7a4a2a", GOLD = "#f2c94c", RED = "#e2574c";
  var NS = ' stroke="none"';
  var n = function (v) { return +v.toFixed(2); };

  var r = function (x, y, w, h, f, rx, t) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + (rx ? ' rx="' + rx + '"' : "") + ' fill="' + f + '"' + (t || "") + "/>"; },
    c = function (x, y, R, f, t) { return '<circle cx="' + x + '" cy="' + y + '" r="' + R + '" fill="' + f + '"' + (t || "") + "/>"; },
    e = function (x, y, rx, ry, f, t) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (t || "") + "/>"; },
    p = function (d, f, t) { return '<path d="' + d + '" fill="' + f + '"' + (t || "") + "/>"; },
    // 線だけ（塗りなし）
    l = function (d, w, s, t) { return '<path d="' + d + '" fill="none"' + (w ? ' stroke-width="' + w + '"' : "") + (s ? ' stroke="' + s + '"' : "") + (t || "") + "/>"; },
    // 輪郭つきの太い棒（柄・輪など）
    T = function (d, f, w) { return l(d, w + LW * 2) + l(d, w, f); },
    // 星形（n角、外径R・内径ri）
    star = function (x, y, R, ri, f, k, t) {
      k = k || 5; var d = "", i, a, q;
      for (i = 0; i < k * 2; i++) { a = Math.PI * i / k - Math.PI / 2; q = i % 2 ? ri : R; d += (i ? "L" : "M") + n(x + q * Math.cos(a)) + " " + n(y + q * Math.sin(a)); }
      return p(d + "Z", f, (R < 6 ? ' stroke-width="' + (R < 4 ? 0.9 : 1.2) + '"' : "") + (t || ""));
    },
    // 三日月：円(x,y,R)から円(x+dx,y+dy,ri)をくりぬいた形
    moon = function (x, y, R, dx, dy, ri, f, t) {
      var D = Math.sqrt(dx * dx + dy * dy), a = (R * R - ri * ri + D * D) / (2 * D), h = Math.sqrt(R * R - a * a),
        ux = dx / D, uy = dy / D, mx = x + ux * a, my = y + uy * a,
        p1 = [n(mx - uy * h), n(my + ux * h)], p2 = [n(mx + uy * h), n(my - ux * h)];
      return p("M" + p1 + "A" + R + " " + R + " 0 1 1 " + p2 + "A" + ri + " " + ri + " 0 1 0 " + p1 + "Z", f, t);
    },
    rot = function (a, x, y) { return ' transform="rotate(' + a + " " + x + " " + y + ')"'; },
    G = function (b) { return '<g stroke="' + INK + '" stroke-width="' + LW + '">' + b + "</g>"; };

  // もみじの葉（中心0,0、半径およそ14）
  var MAPLE = "M0 -15L3.5 -8L9 -11.5L7.5 -4L14 -4.5L10.5 0.5L13 5L5 4.5L6 9L0 6.5L-6 9L-5 4.5L-13 5L-10.5 0.5L-14 -4.5L-7.5 -4L-9 -11.5L-3.5 -8Z";
  var maple = function (x, y, k, f, a) {
    return '<g transform="translate(' + x + " " + y + ")rotate(" + (a || 0) + ")scale(" + k + ')" stroke-width="' + n(LW / k) + '">' + l("M0 5V15", 3) + p(MAPLE, f) + l("M0 4V-9M0 1L8 -2M0 1L-8 -2", 1.4) + "</g>";
  };

  var ART = {
    // 旅人の麦わら帽子
    strawhat: function (k) {
      return G(e(32, 45, 29, 12, k) + l("M10 49Q32 59 54 49", 1.5) +
        p("M15 45C13 13 51 13 49 45Q32 51 15 45Z", k) +
        p("M15.4 35Q32 41 48.6 35L49 43Q32 49 15 43Z", "#3d4f8a") +
        l("M21 22Q32 18 43 22", 1.5));
    },
    // ミニ地球儀
    globe: function (k) {
      return G(e(32, 56, 14, 4.5, WOOD) + r(29.5, 46, 5, 9, WOOD) +
        c(32, 27, 18, k) +
        p("M22 16Q28 13 31 18Q29 23 24 24Q19 27 17 23Q17 18 22 16Z", "#f4e3b0") +
        p("M36 27Q42 24 46 30Q45 38 39 42Q35 38 37 34Q33 31 36 27Z", "#f4e3b0") +
        p("M34 11Q39 11 41 14Q38 16 34 14Z", "#f4e3b0") +
        l("M14 27H50", 1.5) +
        T("M18 12A21 21 0 0 0 46 44", GOLD, 3) + c(32, 6, 2, GOLD) + c(32, 48, 2, GOLD));
    },
    // 街の古い地図
    oldmap: function (k) {
      return G(r(9, 12, 46, 40, k) +
        l("M24.3 12V52M39.7 12V52", 1.5) +
        e(18, 22, 5, 3.5, "#4a8fd8") +
        l("M15 44Q22 36 30 40T44 26", 2.5, RED, ' stroke-dasharray="3 4"') +
        l("M43 21L49 27M49 21L43 27", 3, RED) +
        p("M17 35L20 30L23 35Z", "#5cb87a") + p("M44 46L47 41L50 46Z", "#5cb87a") +
        r(5, 7, 54, 8, WOOD, 4) + r(5, 49, 54, 8, WOOD, 4));
    },
    // 葉っぱの傘
    leafumbrella: function (k) {
      return G(T("M32 30V51Q32 58 25 57Q21 56 21 52", DARKWOOD, 3.5) +
        p("M5 32Q8 6 32 6Q56 6 59 32Q54 28 48.5 32Q43.5 28 38 32Q32 28 26 32Q20.5 28 15.5 32Q10 28 5 32Z", k) +
        l("M32 7V31M32 18L20 12M32 18L44 12M32 25L14 20M32 25L50 20", 1.6) +
        l("M32 6V2", 3));
    },
    // 花のみつのびん
    honeyjar: function (k) {
      return G(r(21, 14, 22, 8, k, 2) +
        p("M20 22H44Q53 26 53 38V50Q53 58 44 58H20Q11 58 11 50V38Q11 26 20 22Z", k) +
        r(16, 30, 4, 18, WHITE, 2, NS) +
        r(18, 8, 28, 9, WOOD, 3) + l("M18 12.5H46", 1.5) +
        r(23, 33, 18, 16, CREAM, 3) +
        c(32, 37.5, 3, RED) + c(36.5, 41, 3, RED) + c(34.5, 45.5, 3, RED) + c(29.5, 45.5, 3, RED) + c(27.5, 41, 3, RED) +
        c(32, 41.5, 2.5, GOLD));
    },
    // 朝つゆのリース
    dewwreath: function (k) {
      var s = l("M32 11A19 19 0 1 1 31.9 11", 3, DARKWOOD), i, a, x, y;
      for (i = 0; i < 12; i++) {
        a = i * 30; x = n(32 + 19 * Math.cos(a * Math.PI / 180)); y = n(30 + 19 * Math.sin(a * Math.PI / 180));
        if (i === 3) continue; // 下はリボン
        s += e(x, y, 7.5, 4, k, rot(a + 60, x, y));
      }
      s += p("M32 8Q35.5 13 35.5 15.5A3.5 3.5 0 0 1 28.5 15.5Q28.5 13 32 8Z", "#cdeefa") +
        p("M13 32Q16.5 37 16.5 39.5A3.5 3.5 0 0 1 9.5 39.5Q9.5 37 13 32Z", "#cdeefa") +
        p("M51 24Q54.5 29 54.5 31.5A3.5 3.5 0 0 1 47.5 31.5Q47.5 29 51 24Z", "#cdeefa");
      s += p("M31 50L25 61L29 60L31 63L33 51Z", "#f08aa0") + p("M33 50L39 61L35 60L33 63L31 51Z", "#f08aa0") +
        p("M32 49Q24 42 20 46Q18 53 32 51Z", "#f08aa0") + p("M32 49Q40 42 44 46Q46 53 32 51Z", "#f08aa0") + c(32, 50, 3, "#f08aa0");
      return G(s);
    },
    // 木の実のポンチョ
    poncho: function (k) {
      return G(p("M22 10H42L59 45Q32 55 5 45Z", k) +
        p("M13 31Q32 37 51 31L55 39Q32 47 9 39Z", CREAM) +
        c(17, 36.5, 2.4, RED) + c(25, 39, 2.4, DARKWOOD) + c(32, 39.8, 2.4, RED) + c(39, 39, 2.4, DARKWOOD) + c(47, 36.5, 2.4, RED) +
        l("M9 47V54M16 49.5V57M24 51V58M32 51.5V59M40 51V58M48 49.5V57M55 47V54", 2.5) +
        e(32, 11, 9, 4.5, "#5a3a2a") + l("M27 15L25 22M37 15L39 22", 2) + c(25, 23.5, 2, GOLD) + c(39, 23.5, 2, GOLD));
    },
    // 松ぼっくりの置物
    pinecone: function (k) {
      return G(e(32, 57, 18, 4.5, "#e9d8a6") +
        p("M32 9C46 11 51 30 45 44Q39 54 32 56Q25 54 19 44C13 30 18 11 32 9Z", k) +
        l("M23 17Q27.5 22 32 17Q36.5 22 41 17M18.5 26Q23 31 27.5 26Q32 31 36.5 26Q41 31 45.5 26M17 35Q21 40 25 35Q29 40 32 35Q35 40 39 35Q43 40 47 35M19.5 44Q24 49 28.5 44Q32 49 35.5 44Q40 49 44.5 44", 2) +
        l("M32 9V5", 3, DARKWOOD) + p("M32 7Q38 0 45 3Q40 10 32 7Z", "#6cbf5a"));
    },
    // 紅葉の額ぶち
    leafframe: function (k) {
      return G(r(7, 7, 50, 50, WOOD, 4) + r(15, 15, 34, 34, CREAM, 1) +
        maple(32, 31, 1.1, k) +
        maple(13, 13, 0.55, k, -30) + maple(51, 51, 0.55, k, 150));
    },
    // 星のかけらの杖
    starwand: function (k) {
      return G(T("M13 55L33 31", CREAM, 5) + l("M15.5 52L18 49", 5, "#8a96a8") +
        star(39, 23, 19, 8.5, k, 5, rot(15, 39, 23)) +
        c(36, 22, 1.8, INK, NS) + c(43, 23, 1.8, INK, NS));
    },
    // ちいさな惑星
    planet: function (k) {
      var back = "M8 30Q32 17 56 30", front = "M8 30Q32 47 56 30";
      return G(r(26, 48, 12, 6, WOOD, 2) + e(32, 56, 16, 4, WOOD) +
        T(back, GOLD, 4) +
        c(32, 30, 17, k) +
        e(25, 22, 4, 3, WHITE, NS + ' opacity="0.45"') + c(39, 37, 2.5, WHITE, NS + ' opacity="0.45"') +
        T(front, GOLD, 4));
    },
    // 星座のタペストリー
    constellation: function (k) {
      return G(l("M12 9L32 2L52 9", 1.8) +
        p("M11 9H53V54L42.5 48L32 54L21.5 48L11 54Z", k) +
        l("M18 20L28 16L35 25L46 21M35 25L31 37L42 42M31 37L20 41", 1.4, CREAM) +
        star(18, 20, 4, 1.8, GOLD) + star(28, 16, 3.5, 1.6, GOLD) + star(35, 25, 4.5, 2, GOLD) + star(46, 21, 3.5, 1.6, GOLD) +
        star(31, 37, 4, 1.8, GOLD) + star(42, 42, 3.5, 1.6, GOLD) + star(20, 41, 3.5, 1.6, GOLD) +
        r(6, 6, 52, 6, WOOD, 3));
    },
    // 月のヘアピン
    moonpin: function (k) {
      return G(r(5, 37, 54, 7, "#6b7a8f", 3.5, rot(-40, 32, 40.5)) +
        moon(35, 26, 19, 9, -7, 15, k) +
        star(17, 44, 5, 2.3, WHITE));
    },
    // 星空のカーディガン
    starcardigan: function (k) {
      return G(p("M22 8L32 24L42 8L53 12L61 45L52 48L47 29V57H17V29L12 48L3 45L11 12Z", k) +
        p("M24 8Q32 11 40 8L32 23Z", WHITE) +
        l("M32 23V57M17 51H47M5 42L13 44.5M59 42L51 44.5", 1.5) +
        c(32, 32, 1.8, WHITE) + c(32, 41, 1.8, WHITE) +
        star(23, 22, 3.5, 1.6, GOLD) + star(41, 38, 3.5, 1.6, GOLD) + star(24, 40, 2.8, 1.3, GOLD) + star(42, 22, 2.6, 1.2, GOLD) + star(10, 26, 2.8, 1.3, GOLD) + star(54, 26, 2.8, 1.3, GOLD));
    },
    // 星座早見盤
    starwheel: function (k) {
      var s = c(32, 32, 27, k) + c(32, 32, 21, CREAM), i, a, x1, y1, x2, y2, t = "";
      for (i = 0; i < 24; i++) {
        a = i * 15 * Math.PI / 180;
        x1 = n(32 + 23 * Math.cos(a)); y1 = n(32 + 23 * Math.sin(a)); x2 = n(32 + (i % 2 ? 25 : 26) * Math.cos(a)); y2 = n(32 + (i % 2 ? 25 : 26) * Math.sin(a));
        t += "M" + x1 + " " + y1 + "L" + x2 + " " + y2;
      }
      s += l(t, 1.4) +
        e(32, 31, 15, 12, "#2b3a66") +
        l("M22 30L28 25L35 29L42 26", 1.2, CREAM) +
        star(22, 30, 2.6, 1.1, GOLD) + star(28, 25, 2.2, 1, GOLD) + star(35, 29, 2.8, 1.2, GOLD) + star(42, 26, 2.2, 1, GOLD) + star(31, 37, 2.2, 1, GOLD) +
        c(32, 48, 2.2, INK, NS);
      return G(s);
    },
    // 水玉のリボン
    dotribbon: function (k) {
      return G(p("M29 34L19 55L25 53L28 58L34 36Z", k) + p("M35 34L45 55L39 53L36 58L30 36Z", k) +
        p("M32 31C23 16 5 12 5 29C5 46 23 44 32 31Z", k) + p("M32 31C41 16 59 12 59 29C59 46 41 44 32 31Z", k) +
        c(13, 25, 2.6, WHITE, NS) + c(14, 35, 2.2, WHITE, NS) + c(22, 29, 2.2, WHITE, NS) +
        c(51, 25, 2.6, WHITE, NS) + c(50, 35, 2.2, WHITE, NS) + c(42, 29, 2.2, WHITE, NS) + c(39, 50, 1.8, WHITE, NS) + c(25, 50, 1.8, WHITE, NS) +
        r(26, 24, 12, 14, k, 5));
    },
    // 水玉のマント
    dotcape: function (k) {
      return G(p("M23 11H41Q45 30 57 54Q32 61 7 54Q19 30 23 11Z", k) +
        l("M27 17Q24 36 18 54M37 17Q40 36 46 54", 1.5) +
        c(32, 30, 2.6, WHITE, NS) + c(22, 40, 2.6, WHITE, NS) + c(42, 40, 2.6, WHITE, NS) + c(32, 47, 2.6, WHITE, NS) + c(15, 51, 2.2, WHITE, NS) + c(49, 51, 2.2, WHITE, NS) + c(27, 22, 2, WHITE, NS) + c(37, 22, 2, WHITE, NS) +
        p("M32 13L19 7Q16 14 21 18Z", WHITE) + p("M32 13L45 7Q48 14 43 18Z", WHITE) +
        c(32, 13, 3.5, GOLD));
    },
    // 四つ葉のうちわ
    cloverfan: function (k) {
      var lobes = function (f, t) { return c(23, 15, 10.5, f, t) + c(41, 15, 10.5, f, t) + c(23, 33, 10.5, f, t) + c(41, 33, 10.5, f, t); };
      return G(T("M32 36V56", WOOD, 5) + e(32, 58, 5, 3, WOOD) +
        lobes(k, ' stroke-width="' + LW * 2 + '"') + lobes(k, NS) +
        l("M32 24L17 9M32 24L47 9M32 24L17 39M32 24L47 39", 1.5) + c(32, 24, 2.5, k));
    },
    // どんぐり帽子
    acornhat: function (k) {
      return G(p("M9 42Q8 15 32 15Q56 15 55 42Z", k) +
        l("M14 30Q20 26 24 31Q28 26 32 31Q36 26 40 31Q44 26 50 30M12 37Q17 33 21 38Q26 33 32 38Q38 33 43 38Q47 33 52 37M19 22Q24 19 28 23Q32 19 36 23Q40 19 45 22", 1.5) +
        p("M6 41Q32 50 58 41L58 46Q32 56 6 46Z", k) +
        T("M32 15Q31 8 36 4", DARKWOOD, 3) +
        p("M35 10Q42 3 50 7Q44 14 35 10Z", "#8fcf6a") + l("M36 9.5L46 7", 1.2));
    },
    // 木登りのオーバーオール
    overalls: function (k) {
      return G(T("M22 20L17 5M42 20L47 5", k, 4) +
        p("M20 17H44V32H50L53 59H36L32 42L28 59H11L14 32H20Z", k) +
        r(26, 21, 12, 8, k, 1.5) +
        l("M14 32H50M32 42V35", 1.5) +
        c(22.5, 20.5, 2.4, GOLD) + c(41.5, 20.5, 2.4, GOLD) +
        r(13, 54, 14, 5, CREAM, 1) + r(37, 54, 14, 5, CREAM, 1));
    },
    // 魚とりの網
    fishnet: function (k) {
      return G(T("M38 24L57 57", k, 5) +
        p("M7 19Q8 44 23 51Q38 44 39 19Z", WHITE) +
        l("M15 23Q15 39 21 49M23 25V51M31 23Q31 39 25 49M9 31Q23 37 37 31M12 40Q23 45 34 40", 1.3) +
        T("M23 11A16 8 0 1 1 22.9 11", k, 3.5));
    }
  };

  function item(art, color) {
    var f = ART[art];
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">' +
      (f ? f(color) : '<circle cx="32" cy="32" r="20" fill="' + color + '"/>') + "</svg>";
  }

  root.YorozuArt = Object.assign(root.YorozuArt || {}, { item: item, ITEM_ARTS: Object.keys(ART) });
})(typeof globalThis !== "undefined" ? globalThis : this);
