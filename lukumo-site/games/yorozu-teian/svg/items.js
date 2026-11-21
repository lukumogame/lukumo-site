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

  // 色を白に少し寄せる（ふたやポケットの色）
  var mix = function (hex) {
    var v = parseInt(hex.slice(1), 16), f = function (x) { return Math.round(x + (255 - x) * 0.28); };
    return "#" + [f(v >> 16 & 255), f(v >> 8 & 255), f(v & 255)].map(function (x) { return (x < 16 ? "0" : "") + x.toString(16); }).join("");
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
    },

    // ---- イベント会社の品（第2段）----
    // パーティー帽：とんがりの帽子に水玉とぽんぽん
    partyhat: function (k) {
      return G(p("M32 8L51 50Q32 58 13 50Z", k) +
        c(27, 26, 2.6, WHITE, NS) + c(37, 34, 2.6, WHITE, NS) + c(25, 43, 2.6, WHITE, NS) + c(41, 46, 2.6, WHITE, NS) + c(33, 18, 2, WHITE, NS) +
        p("M12 49Q32 58 52 49L53 54Q32 63 11 54Z", GOLD) +
        c(32, 7, 5.5, GOLD));
    },
    // ミラーボール：台にのせた光る玉
    mirrorball: function (k) {
      return G(e(32, 58, 13, 3.5, "#6b7a8f") + p("M26 57L29 44H35L38 57Z", "#6b7a8f") +
        c(32, 26, 19, k) +
        l("M13 26H51M15.5 16.5H48.5M15.5 35.5H48.5", 1.2) +
        e(32, 26, 8, 19, "none", ' stroke-width="1.2"') + l("M32 7V45", 1.2) +
        r(20, 13, 5, 4, WHITE, 0, NS) + r(36, 21, 5, 4, WHITE, 0, NS) + r(24, 29, 4, 4, WHITE, 0, NS + ' opacity="0.7"') +
        star(54, 9, 5, 1.8, WHITE) + star(9, 40, 4, 1.5, WHITE));
    },
    // 紙の花かざり：ひもにつるした紙の花3つ
    paperflower: function (k) {
      var fl = function (x, y, R) {
        var s = "", i, a;
        for (i = 0; i < 8; i++) { a = i * Math.PI / 4; s += c(n(x + R * 0.62 * Math.cos(a)), n(y + R * 0.62 * Math.sin(a)), n(R * 0.5), k); }
        return s + c(x, y, n(R * 0.5), k, NS) + c(x, y, n(R * 0.3), GOLD);
      };
      return G(l("M3 12Q32 26 61 12", 1.8) + fl(13, 25, 10) + fl(32, 33, 12) + fl(51, 25, 10) +
        l("M13 35V44M32 45V56M51 35V44", 1.4) + p("M11 44H15L13 49Z", k) + p("M30 56H34L32 61Z", k) + p("M49 44H53L51 49Z", k));
    },
    // 花びらのリボン：花びら4まいの蝶ネクタイ
    petalbow: function (k) {
      return G(e(18, 25, 13, 7.5, k, rot(-22, 18, 25)) + e(18, 39, 13, 7.5, k, rot(22, 18, 39)) +
        e(46, 25, 13, 7.5, k, rot(22, 46, 25)) + e(46, 39, 13, 7.5, k, rot(-22, 46, 39)) +
        l("M8 23Q16 27 26 29M8 41Q16 37 26 35M56 23Q48 27 38 29M56 41Q48 37 38 35", 1.2) +
        c(32, 32, 7, GOLD) + c(32, 32, 3, "#f08a3a", NS));
    },
    // ホタルのランプ：びんの中で光るホタル
    fireflylamp: function (k) {
      return G(l("M22 12Q32 0 42 12", 2) +
        p("M18 18H46Q50 22 50 30V50Q50 58 42 58H22Q14 58 14 50V30Q14 22 18 18Z", "#eaf6f8") +
        c(32, 40, 13, k, NS + ' opacity="0.55"') + c(32, 40, 7, k, NS) +
        e(27, 35, 4.5, 2.6, WHITE, NS + rot(-30, 27, 35) + ' opacity="0.9"') + e(37, 35, 4.5, 2.6, WHITE, NS + rot(30, 37, 35) + ' opacity="0.9"') +
        e(32, 37, 2.6, 4.6, INK, NS) + c(32, 31.6, 2.2, INK, NS) + c(32, 43, 3.2, "#fbff9e", NS) +
        r(16, 30, 3.5, 18, WHITE, 1.5, NS + ' opacity="0.8"') +
        r(18, 10, 28, 9, WOOD, 3));
    },
    // 葉っぱの旗：ひもにならべた葉っぱの三角旗
    leafflags: function (k) {
      var f = function (x, y, a) { return p("M" + (x - 7) + " " + y + "Q" + x + " " + (y - 3) + " " + (x + 7) + " " + y + "Q" + (x + 4) + " " + (y + 14) + " " + x + " " + (y + 22) + "Q" + (x - 4) + " " + (y + 14) + " " + (x - 7) + " " + y + "Z", k, rot(a, x, y)) + l("M" + x + " " + (y - 1) + "V" + (y + 18), 1.2, null, rot(a, x, y)); };
      return G(l("M2 10Q32 24 62 10", 1.8) + f(10, 14, 8) + f(24, 19, 3) + f(40, 19, -3) + f(54, 14, -8) +
        c(17, 17, 2.4, GOLD) + c(32, 20, 2.4, RED) + c(47, 17, 2.4, GOLD));
    },
    // 木の実マラカス：どんぐりの形のマラカスを2本
    acornmaracas: function (k) {
      var one = function (x, y, a) {
        return '<g transform="rotate(' + a + " " + x + " " + y + ')">' + T("M" + x + " " + (y + 12) + "V" + (y + 34), DARKWOOD, 4) +
          e(x, y + 2, 11, 12, k) + p("M" + (x - 12) + " " + (y - 3) + "Q" + (x - 12) + " " + (y - 14) + " " + x + " " + (y - 14) + "Q" + (x + 12) + " " + (y - 14) + " " + (x + 12) + " " + (y - 3) + "Z", "#7a4a2a") +
          l("M" + (x - 8) + " " + (y - 8) + "L" + (x - 2) + " " + (y - 12) + "M" + (x - 3) + " " + (y - 5) + "L" + (x + 5) + " " + (y - 11) + "M" + (x + 3) + " " + (y - 4) + "L" + (x + 9) + " " + (y - 8), 1.2) +
          T("M" + x + " " + (y - 14) + "V" + (y - 18), DARKWOOD, 2.5) + "</g>";
      };
      return G(one(20, 20, -20) + one(44, 20, 20) + l("M5 10L1 7M59 10L63 7M32 4V0", 2));
    },
    // 木の実のケーキ：クリームと木の実をのせたケーキ
    nutcake: function (k) {
      return G(e(32, 55, 27, 6, WHITE) +
        r(10, 28, 44, 25, "#c58a52", 4) + l("M10 41H54", 2, CREAM) +
        p("M9 31Q9 22 32 22Q55 22 55 31V34Q51 38 47 34Q43 39 39 34Q35 39 31 34Q27 39 23 34Q19 39 15 34Q11 38 9 34Z", k) +
        e(22, 22, 4, 4.5, "#a0683c") + p("M17.5 20Q22 14 26.5 20Z", "#6a4a32") +
        e(42, 22, 4, 4.5, "#a0683c") + p("M37.5 20Q42 14 46.5 20Z", "#6a4a32") +
        c(32, 18, 4, RED) + l("M32 14Q34 10 37 10", 1.5));
    },
    // きのこの看板：きのこの形の板
    mushroomsign: function (k) {
      return G(l("M24 9L32 2L40 9", 1.6) +
        r(20, 30, 24, 28, CREAM, 6) + l("M26 40H38M26 46H35", 2.2, DARKWOOD) +
        p("M5 32Q5 8 32 8Q59 8 59 32Q32 38 5 32Z", k) +
        c(20, 20, 4, WHITE, NS) + c(36, 15, 3.5, WHITE, NS) + c(46, 24, 4.5, WHITE, NS) + c(29, 27, 2.5, WHITE, NS));
    },
    // 光る輪っか：頭の上にうかぶ光の輪
    halo: function (k) {
      var ring = "M5 34A27 11 0 1 0 59 34A27 11 0 1 0 5 34";
      return G(l(ring, 14, k, ' opacity="0.35"') + T(ring, k, 5) +
        star(14, 14, 6, 2.2, WHITE) + star(50, 12, 5, 1.8, k) + star(33, 7, 3.5, 1.4, WHITE) + star(54, 52, 3.5, 1.4, k));
    },
    // 星くずのくす玉：星もようのくす玉と飾りひも
    starkusudama: function (k) {
      return G(l("M32 2V10", 2) + c(32, 4, 3, GOLD) +
        l("M24 38Q20 48 24 60M32 40V61M40 38Q44 48 40 60", 2.4, GOLD) +
        l("M28 39Q26 50 28 58M36 39Q38 50 36 58", 2, RED) +
        c(32, 25, 16, k) + l("M16 25H48", 1.2) +
        star(25, 18, 4, 1.7, WHITE) + star(39, 17, 3.2, 1.3, GOLD) + star(36, 31, 4, 1.7, GOLD) + star(23, 31, 2.8, 1.2, WHITE) + star(44, 26, 2.6, 1.1, WHITE));
    },
    // 流れ星の幕：流れ星をえがいた幕
    shootingcurtain: function (k) {
      return G(p("M9 10H55V54Q49 50 43.5 54Q38 50 32 54Q26 50 20.5 54Q15 50 9 54Z", k) +
        l("M14 18L32 30M18 34L38 44", 3, CREAM, ' opacity="0.8"') +
        star(34, 31, 6, 2.6, GOLD) + star(40, 45, 5, 2.2, GOLD) + star(46, 18, 3, 1.3, WHITE) + star(16, 46, 2.6, 1.1, WHITE) + star(50, 34, 2.6, 1.1, WHITE) +
        r(5, 6, 54, 6, WOOD, 3));
    },
    // コック帽（みのりさん）
    cookhat: function (k) {
      return G(p("M18 42C4 40 5 20 18 21C17 8 32 5 34 14C39 5 56 10 48 23C60 22 60 41 46 42Z", k) +
        l("M24 26V40M32 23V40M40 26V40", 1.4) +
        r(16, 40, 32, 14, k, 3) + l("M16 46H48", 1.2) + c(25, 47, 2, RED, NS));
    },
    // 花のエプロン（みのりさん）
    apron: function (k) {
      return G(l("M22 14Q32 2 42 14M14 30L5 34M50 30L59 34", 2) +
        p("M21 12H43V28H21Z", k) + p("M13 27H51L55 58H9Z", k) +
        r(25, 38, 14, 10, CREAM, 2) +
        c(18, 33, 2.4, WHITE, NS) + c(45, 34, 2.4, WHITE, NS) + c(17, 50, 2.4, WHITE, NS) + c(47, 51, 2.4, WHITE, NS) + c(32, 19, 2.4, WHITE, NS) +
        c(32, 54, 2, GOLD, NS));
    },
    // おにぎりの皿（みのりさん）
    onigiriplate: function (k) {
      var oni = function (x, y) { return p("M" + x + " " + (y - 15) + "Q" + (x + 4) + " " + (y - 15) + " " + (x + 12) + " " + (y + 1) + "Q" + (x + 14) + " " + (y + 6) + " " + (x + 8) + " " + (y + 6) + "H" + (x - 8) + "Q" + (x - 14) + " " + (y + 6) + " " + (x - 12) + " " + (y + 1) + "Q" + (x - 4) + " " + (y - 15) + " " + x + " " + (y - 15) + "Z", WHITE) + r(x - 5, y - 2, 10, 8, "#2f3a3a", 1); };
      return G(e(32, 46, 28, 10, k) + e(32, 44, 21, 6, WHITE, NS + ' opacity="0.35"') +
        oni(22, 38) + oni(42, 38) + c(32, 46, 2.5, "#e8a0b0", NS));
    },
    // つゆのかんむり（ともりさん）：葉のつるとしずく
    dewcrown: function (k) {
      var drop = function (x, y, s) { return p("M" + x + " " + (y - 9 * s) + "Q" + (x + 6 * s) + " " + y + " " + (x + 6 * s) + " " + (y + 3 * s) + "A" + (6 * s) + " " + (6 * s) + " 0 0 1 " + (x - 6 * s) + " " + (y + 3 * s) + "Q" + (x - 6 * s) + " " + y + " " + x + " " + (y - 9 * s) + "Z", k); };
      return G(T("M6 46Q32 36 58 46", "#6cbf5a", 4) +
        e(12, 40, 6, 3, "#8fcf6a", rot(-30, 12, 40)) + e(52, 40, 6, 3, "#8fcf6a", rot(30, 52, 40)) + e(32, 40, 6, 3, "#8fcf6a") +
        drop(19, 30, 0.9) + drop(32, 22, 1.3) + drop(45, 30, 0.9) +
        r(29, 19, 2.5, 4, WHITE, 1, NS) + star(54, 14, 4, 1.5, WHITE));
    },
    // 光る花たば（ともりさん）
    glowbouquet: function (k) {
      return G(l("M26 30L30 50M32 28V50M38 30L34 50", 2, "#5cb87a") +
        c(22, 22, 10, k, NS + ' opacity="0.45"') + c(42, 22, 10, k, NS + ' opacity="0.45"') + c(32, 14, 10, k, NS + ' opacity="0.45"') +
        c(22, 24, 6, k) + c(42, 24, 6, k) + c(32, 16, 6, k) + c(22, 24, 2.2, WHITE, NS) + c(42, 24, 2.2, WHITE, NS) + c(32, 16, 2.2, WHITE, NS) +
        p("M20 36H44L36 60H28Z", CREAM) + p("M32 44L24 40V50ZM32 44L40 40V50Z", "#f08aa0") + c(32, 44, 2.5, "#f08aa0"));
    },
    // ふたりの光の絵（ともりさん）：夜の川と光るふたり
    riverpainting: function (k) {
      return G(r(5, 9, 54, 46, WOOD, 4) + r(11, 15, 42, 34, k, 1) +
        p("M11 38Q24 32 32 38T53 36V49H11Z", "#4a8fd8") + l("M16 43H24M36 44H46", 1.2, "#9cd0f0") +
        l("M14 30Q18 22 21 25M50 22Q46 30 43 29", 1.2, "#fbff9e") +
        c(21, 25, 5.5, "#f2e27a", NS + ' opacity="0.45"') + c(43, 29, 5.5, "#f2e27a", NS + ' opacity="0.45"') + c(21, 25, 2.2, "#fbff9e", NS) + c(43, 29, 2.2, "#fbff9e", NS) + c(32, 20, 1.2, "#fbff9e", NS) +
        star(48, 19, 2.4, 1, WHITE) + star(15, 19, 2, 0.9, WHITE) + l("M14 9L32 2L50 9", 1.6));
    },
    // もみじのピン（もみじさん）
    maplepin: function (k) {
      return G(r(6, 41, 44, 6, "#6b7a8f", 3, rot(-35, 28, 44)) + maple(38, 26, 1.45, k, 12) + c(14, 52, 3, GOLD));
    },
    // 木の実リュック（もみじさん）
    nutbackpack: function (k) {
      return G(T("M20 14Q20 4 32 4Q44 4 44 14", DARKWOOD, 3) +
        r(12, 12, 40, 46, k, 10) + p("M12 22Q12 12 22 12H42Q52 12 52 22V30Q32 38 12 30Z", mix(k)) +
        r(20, 38, 24, 14, mix(k), 4) + c(32, 33, 2.5, GOLD) +
        e(32, 46, 4.5, 5, "#c58a52") + p("M27 44Q27 39 32 39Q37 39 37 44Z", "#6a4a32"));
    },
    // どんぐりの家（もみじさん）
    acornhouse: function (k) {
      return G(e(32, 58, 22, 4, "#8fcf6a") +
        p("M14 30H50V44Q50 58 32 58Q14 58 14 44Z", k) +
        p("M10 32Q10 12 32 12Q54 12 54 32Z", "#7a4a2a") + l("M16 24L24 16M22 30L36 16M32 30L46 16M42 30L50 22", 1.4) +
        T("M32 12V5", DARKWOOD, 3) +
        p("M26 58V46Q26 40 32 40Q38 40 38 46V58Z", DARKWOOD) + c(22, 40, 3.5, CREAM) + c(42, 40, 3.5, CREAM) + c(35.5, 50, 1.2, GOLD, NS));
    },

    // ---- ライフプランの品（第3段）----
    // あみかけの帽子：編みかけのニット帽と、ささったままの編み棒
    knithat: function (k) {
      return G(T("M38 26L58 5", WOOD, 2.5) + c(58.5, 4.5, 2.2, GOLD) +
        p("M12 42Q10 14 32 14Q54 14 52 42Z", k) +
        l("M18 24L22 29L26 24L30 29L34 24L38 29L42 24L46 29M15 33L19 38L23 33L27 38L31 33L35 38L39 33L43 38L47 33L50 37", 1.3) +
        r(8, 40, 48, 12, mix(k), 5) + l("M15 42V50M22 42V50M29 42V50M36 42V50M43 42V50M50 42V50", 1.3) +
        c(32, 11, 6, mix(k)) + l("M52 40Q60 46 56 54Q53 60 58 62", 1.8, k));
    },
    // 小さな鉢植え：受け皿にのせた鉢と葉っぱ
    smallpot: function (k) {
      return G(p("M32 34Q20 30 15 15Q29 15 32 34Z", "#6cbf5a") + p("M32 34Q44 28 50 13Q35 15 32 34Z", "#5cb87a") + p("M32 34Q28 19 33 6Q40 19 32 34Z", "#8fcf6a") +
        l("M31 32L21 19M33 32L45 17M32 32V12", 1.2) +
        e(32, 57, 18, 3.5, mix(k)) + p("M18 38H46L42 57H22Z", k) + r(15, 32, 34, 8, k, 3) +
        c(32, 47, 3.2, WHITE, NS + ' opacity="0.8"'));
    },
    // 家族の時計：家の形の振り子時計（屋根にハート）
    familyclock: function (k) {
      return G(l("M32 46V53", 2) + c(32, 56, 4, GOLD) +
        p("M32 4L55 21V46H9V21Z", k) +
        p("M32 15.5C27 11.5 27.5 7.5 30 7.5Q31.6 7.5 32 9.3Q32.4 7.5 34 7.5C36.5 7.5 37 11.5 32 15.5Z", RED, ' stroke-width="1.3"') +
        c(32, 31, 11, CREAM) + c(32, 22.8, 1.3, INK, NS) + c(40.2, 31, 1.3, INK, NS) + c(32, 39.2, 1.3, INK, NS) + c(23.8, 31, 1.3, INK, NS) +
        l("M32 31V24.5M32 31L37 33.5", 2) + c(32, 31, 1.8, INK, NS));
    },
    // 葉っぱのマント：葉っぱを重ねたマントと花の留め具
    leafmantle: function (k) {
      var lf = function (x, y, a) { return e(x, y, 6.5, 3.6, mix(k), rot(a, x, y) + ' stroke-width="1.3"') + l("M" + (x - 5) + " " + y + "H" + (x + 5), 1, null, rot(a, x, y)); };
      return G(p("M23 10H41Q45 30 57 54Q32 61 7 54Q19 30 23 10Z", k) +
        lf(27, 24, 60) + lf(37, 24, 120) + lf(22, 36, 70) + lf(32, 38, 90) + lf(42, 36, 110) + lf(17, 49, 75) + lf(27, 51, 85) + lf(37, 51, 95) + lf(47, 49, 105) +
        p("M32 12L20 6Q17 13 22 17Z", "#8fcf6a") + p("M32 12L44 6Q47 13 42 17Z", "#8fcf6a") +
        c(29, 10, 2.4, "#f6a8c8", ' stroke-width="1.2"') + c(35, 10, 2.4, "#f6a8c8", ' stroke-width="1.2"') + c(32, 13, 2.4, "#f6a8c8", ' stroke-width="1.2"') + c(32, 10.5, 1.8, GOLD, NS));
    },
    // 花の種の貯金つぼ：ふたに入れ口、芽が出たつぼ
    seedjar: function (k) {
      return G(p("M32 8Q26 2 21 5Q26 11 32 8Z", "#8fcf6a") + p("M32 8Q38 1 44 4Q38 11 32 8Z", "#8fcf6a") + l("M32 8V14", 2, "#5cb87a") +
        p("M20 21H44Q54 27 54 40Q54 58 32 58Q10 58 10 40Q10 27 20 21Z", k) +
        r(15, 31, 4, 15, WHITE, 2, NS + ' opacity="0.7"') +
        r(19, 13, 26, 9, WOOD, 3) + l("M27 17.5H37", 2.6) +
        r(22, 33, 20, 15, CREAM, 3) + e(28, 40.5, 2.4, 3.6, "#a0683c", rot(-20, 28, 40.5) + ' stroke-width="1"') + e(36, 40.5, 2.4, 3.6, "#a0683c", rot(20, 36, 40.5) + ' stroke-width="1"') +
        c(32, 37, 1.6, GOLD, NS));
    },
    // 枝のブランコ：枝からさげたブランコ（ひもに小さな花）
    branchswing: function (k) {
      return G(l("M18 9V44M46 10V44", 1.8) +
        T("M3 10Q32 3 61 12", DARKWOOD, 4) +
        e(12, 5, 5, 2.6, "#8fcf6a", rot(-25, 12, 5)) + e(54, 6, 5, 2.6, "#8fcf6a", rot(25, 54, 6)) + e(33, 3.5, 4, 2.2, "#6cbf5a") +
        c(18, 24, 2.6, "#f6a8c8", ' stroke-width="1.2"') + c(46, 30, 2.6, WHITE, ' stroke-width="1.2"') + c(18, 34, 2.2, GOLD, ' stroke-width="1.2"') +
        r(11, 43, 42, 7, k, 3) + l("M15 46.5H49", 1.2, mix(k)));
    },
    // 木のつえ：曲がった持ち手と、芽の出たつえ
    woodcane: function (k) {
      return G(T("M22 60L35 20Q38 8 48 7Q57 7 57 16Q57 20 54 22", k, 5) +
        c(31, 34, 3.6, GOLD) + c(22, 60, 3, DARKWOOD) +
        p("M34 25Q24 20 19 27Q27 32 34 25Z", "#6cbf5a") + l("M33 25.5L22 26.5", 1.1) +
        p("M41 10Q44 2 51 2Q49 9 41 10Z", "#8fcf6a"));
    },
    // ちいさな家の模型：芝の台にのせた家
    minihouse: function (k) {
      return G(r(6, 52, 52, 7, "#8fcf6a", 3) +
        r(39, 11, 6, 14, mix(k)) +
        r(15, 30, 32, 23, CREAM) + p("M9 32L31 11L53 32Z", k) +
        p("M26 53V43Q26 38 31 38Q36 38 36 43V53Z", WOOD) + c(33.8, 46, 1, GOLD, NS) +
        r(18, 36, 6, 6, "#bfe5fa", 1, ' stroke-width="1.5"') + r(39, 36, 6, 6, "#bfe5fa", 1, ' stroke-width="1.5"') +
        T("M53 52V47", WOOD, 2) + c(53, 42, 5, "#5cb87a"));
    },
    // 川の地図：額に入れた、川と橋と家の地図
    rivermap: function (k) {
      return G(r(6, 6, 52, 52, WOOD, 4) + r(12, 12, 40, 40, k, 1) +
        T("M24 12Q14 24 28 31Q40 37 34 52", "#6aaee8", 5) +
        r(23, 27, 12, 5, DARKWOOD, 1, ' stroke-width="1.5"') +
        p("M42 23L45.5 16L49 23Z", "#5cb87a", ' stroke-width="1.5"') + p("M15 46L18.5 39L22 46Z", "#5cb87a", ' stroke-width="1.5"') + p("M44 33L47 27L50 33Z", "#5cb87a", ' stroke-width="1.5"') +
        r(41, 42, 8, 6, CREAM, 0, ' stroke-width="1.5"') + p("M40 42.5L45 38L50 42.5Z", RED, ' stroke-width="1.5"') +
        l("M15 16L19 20M19 16L15 20", 1.6, RED));
    },
    // 星のバッジ：リボンつきの丸いバッジ
    starbadge: function (k) {
      return G(p("M24 40L18 58L24 55L28 60L32 44Z", RED) + p("M40 40L46 58L40 55L36 60L32 44Z", RED) +
        c(32, 27, 20, k) + c(32, 27, 15, mix(k), ' stroke-width="1.5"') +
        star(32, 27, 10, 4.5, GOLD) + c(22, 18, 2, WHITE, NS + ' opacity="0.7"') +
        star(54, 9, 4, 1.6, WHITE) + star(9, 12, 3, 1.2, WHITE));
    },
    // 未来の写真立て：丘の上の家と惑星の絵が入った写真立て
    futureframe: function (k) {
      return G(l("M40 48L48 60", 3) +
        r(8, 6, 48, 48, k, 5) + r(14, 12, 36, 36, "#fff3d6", 1) +
        p("M14 38Q28 28 50 36V48H14Z", "#8fcf6a", ' stroke-width="1.5"') +
        r(30, 31, 10, 8, CREAM, 0, ' stroke-width="1.5"') + p("M28.5 31.5L35 26L41.5 31.5Z", RED, ' stroke-width="1.5"') +
        c(22, 21, 4.5, "#b79ad8", ' stroke-width="1.5"') + l("M15 22.5Q22 18 29 19.5", 1.4, GOLD) +
        star(43, 19, 3.5, 1.5, GOLD) + c(33, 16, 1.2, GOLD, NS));
    },
    // 星の暦：月の満ち欠けと星の印のある壁かけのこよみ
    starcalendar: function (k) {
      var s = r(10, 10, 44, 48, k, 3) + r(10, 10, 44, 11, mix(k), 3) + T("M22 5V14", "#c9d6e3", 2) + T("M42 5V14", "#c9d6e3", 2), i, j;
      s += c(18, 28, 3, CREAM, NS) + moon(27, 28, 3, 1.6, -0.6, 2.6, CREAM, NS) + moon(37, 28, 3, 3, 0, 3, CREAM, NS) + c(46, 28, 3, "none", ' stroke="' + CREAM + '" stroke-width="1"');
      for (j = 0; j < 3; j++) for (i = 0; i < 4; i++) if (!(j === 1 && i === 2)) s += c(18 + i * 9.4, 38 + j * 7, 1.6, CREAM, NS + ' opacity="0.75"');
      s += star(36.8, 45, 4.2, 1.8, GOLD);
      return G(s);
    },
    // よだれかけ（めぐみさん）
    bib: function (k) {
      return G(l("M20 14Q12 6 6 11M44 14Q52 6 58 11", 2) +
        p("M32 22A10 10 0 0 1 22 13Q12 16 12 33Q12 55 32 57Q52 55 52 33Q52 16 42 13A10 10 0 0 1 32 22Z", k) +
        l("M17 46Q32 56 47 46", 1.4, WHITE, ' stroke-dasharray="2 3"') +
        p("M32 44C24 38 23 31 28 30Q31 30 32 33Q33 30 36 30C41 31 40 38 32 44Z", WHITE, ' stroke-width="1.5"'));
    },
    // 家族の手形（めぐみさん）：大・中・小の手形を額に
    handprints: function (k) {
      var hand = function (x, y, s) {
        return '<g transform="translate(' + x + " " + y + ")scale(" + s + ')" stroke-width="' + n(1.3 / s) + '">' +
          e(-4.6, -4.5, 1.6, 3.2, k, rot(-15, -4.6, -4.5)) + e(-1.6, -6.6, 1.6, 3.6, k) + e(1.6, -6.6, 1.6, 3.6, k) + e(4.5, -5, 1.5, 3.2, k, rot(15, 4.5, -5)) +
          e(6.4, 1, 1.5, 3, k, rot(50, 6.4, 1)) + e(0, 2, 5.2, 5.6, k) + "</g>";
      };
      return G(r(6, 8, 52, 48, WOOD, 4) + r(12, 14, 40, 36, CREAM, 1) +
        hand(22, 34, 1.4) + hand(39, 27, 1.05) + hand(42, 44, 0.7) +
        p("M33 47C30 45 29.5 43 31 42.5Q32.4 42.3 33 43.4Q33.6 42.3 35 42.5C36.5 43 36 45 33 47Z", RED, NS));
    },
    // ベビーベッド（めぐみさん）：模型のベッドと、上のモビール
    babycrib: function (k) {
      return G(l("M32 3V9M20 9H44M22 9V13M32 9V14M42 9V13", 1.4) + star(22, 16, 3.2, 1.4, GOLD) + c(32, 17, 2.6, "#f6a8c8", ' stroke-width="1.2"') + moon(42, 16, 3.2, 1.6, -1, 2.6, GOLD, ' stroke-width="1.2"') +
        r(11, 28, 42, 18, WHITE, 2, NS) + r(11, 38, 42, 8, mix(k), 0, NS) +
        l("M18 29V46M25 29V46M32 29V46M39 29V46M46 29V46", 2.6) +
        r(7, 18, 6, 41, k, 2) + r(51, 18, 6, 41, k, 2) + r(9, 25, 46, 5, k, 2) + r(9, 45, 46, 6, k, 2));
    },
    // ギターのピック（そうたさん）
    guitarpick: function (k) {
      return G(p("M32 58C20 46 8 30 10 18Q12 8 32 8Q52 8 54 18C56 30 44 46 32 58Z", k) +
        e(21, 17, 5, 2.6, WHITE, NS + ' opacity="0.45"' + rot(-20, 21, 17)) +
        p("M35 15L25 32H32L28 47L40 28H33L37 15Z", GOLD, ' stroke-width="1.6"'));
    },
    // バンドのポスター（そうたさん）：ギターと星の絵
    bandposter: function (k) {
      return G(r(10, 6, 44, 52, k, 1) +
        T("M34 32L47 13", DARKWOOD, 3) + r(44, 9, 6, 6, DARKWOOD, 1, rot(35, 47, 12)) +
        c(32, 33, 6.5, GOLD) + c(26, 41, 8.5, GOLD) + c(26, 41, 8.5, GOLD, NS) + c(32, 33, 6.5, GOLD, NS) + c(28, 38.5, 2.6, INK, NS) +
        star(17, 15, 3.6, 1.6, WHITE) + star(45, 30, 2.8, 1.2, WHITE) + star(18, 28, 2.4, 1, WHITE) +
        r(16, 51, 32, 3, CREAM, 1.5, NS) +
        r(6, 3, 10, 6, "#f6e7a8", 1, NS + ' opacity="0.9"' + rot(-25, 11, 6)) + r(48, 3, 10, 6, "#f6e7a8", 1, NS + ' opacity="0.9"' + rot(25, 53, 6)));
    },
    // はじめての鍵（そうたさん）：赤いクッションにのせた鍵
    firstkey: function (k) {
      return G(p("M7 50Q7 42 32 42Q57 42 57 50Q57 58 32 58Q7 58 7 50Z", RED) + c(13, 50, 1.6, GOLD, NS) + c(51, 50, 1.6, GOLD, NS) +
        r(27, 26, 27, 6, k, 2) + r(43, 31, 4, 6, k, 1) + r(49, 31, 4, 5, k, 1) +
        c(20, 29, 10, k) + c(20, 29, 4, CREAM) + l("M13 22Q9 15 15 10", 1.5) +
        star(54, 15, 4, 1.6, WHITE) + star(40, 13, 2.6, 1.1, GOLD));
    },
    // 大工の帽子（ばん太さん）：かたいヘルメットと、耳にはさんだえんぴつ
    carpenterhat: function (k) {
      return G('<g transform="rotate(-35 50 22)">' + r(36, 19, 22, 5, "#f2c94c", 1) + p("M58 19L63 21.5L58 24Z", "#f4d9bf") + "</g>" +
        p("M12 41Q12 14 32 14Q52 14 52 41Z", k) + r(28.5, 12, 7, 29, mix(k), 3) +
        p("M5 40Q32 46 59 40L58 46Q32 53 6 46Z", mix(k)) +
        e(20, 31, 4, 2.4, "#6cbf5a", rot(-35, 20, 31) + ' stroke-width="1.3"'));
    },
    // 木の巣の看板（ばん太さん）：ひもでさげた板に、水べの巣の絵
    nestsign: function (k) {
      return G(l("M14 19L27 5H37L50 19", 1.8) + c(32, 5, 2.2, DARKWOOD) +
        r(6, 18, 52, 34, k, 4) + l("M11 25H24M42 46H53", 1.2) +
        p("M18 45Q20 29 32 27Q44 29 46 45Z", "#7a4a2a") +
        l("M22 40L30 31M27 44L38 31M35 44L42 36M24 34L36 42", 1.3, "#c58a52") +
        p("M29 45Q29 39 32 39Q35 39 35 45Z", "#3a2a1a", ' stroke-width="1.2"') +
        l("M11 47Q15 45 19 47T27 47M37 47Q41 45 45 47T53 47", 1.6, "#4a8fd8"));
    },
    // 木くずの置物（ばん太さん）：木くずのくるくるで作った木と、切り株の台
    woodchip: function (k) {
      return G(p("M12 50H52V54Q52 59 32 59Q12 59 12 54Z", "#a0683c") + e(32, 50, 20, 4, "#c58a52") + e(32, 50, 10, 2, "none", ' stroke-width="1.2"') +
        p("M32 26L52 48H12Z", k) + p("M32 16L47 33H17Z", k) + p("M32 6L43 21H21Z", k) +
        l("M18 44q3-4 6 0q3-4 6 0q3-4 6 0q3-4 6 0M22 30q3-4 6 0q3-4 6 0q3-4 6 0M27 18q2.5-3 5 0q2.5-3 5 0", 1.3) +
        c(32, 5, 2.4, GOLD) +
        l("M8 54q-4-3-1-6q4-1 3 3M55 56q4-3 1-6q-4-1-3 3", 1.5, "#c58a52"));

    }
  };

  function item(art, color) {
    var f = ART[art];
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">' +
      (f ? f(color) : '<circle cx="32" cy="32" r="20" fill="' + color + '"/>') + "</svg>";
  }

  root.YorozuArt = Object.assign(root.YorozuArt || {}, { item: item, ITEM_ARTS: Object.keys(ART) });
})(typeof globalThis !== "undefined" ? globalThis : this);
