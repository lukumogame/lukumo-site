/* よろず提案所：ホーム画面の街（SVG）。city(time, opts) が SVG 文字列を返す。
   opts.wide === true のときは周りまで描いた引きの絵（viewBox -161 0 922 1000）。 */
(function (root) {
  "use strict";

  var CITY_COMPANIES = {
    travel: { x: 140, y: 290 },
    life: { x: 450, y: 400 },
    invest: { x: 300, y: 610 },
    town: { x: 130, y: 480 },
    event: { x: 470, y: 640 }
  };
  // [キー, 色, 看板アイコン, 選べるか]
  var CO = [
    ["travel", "#3f7fd6", "plane", 1],
    ["life", "#d9534a", "house", 0],
    ["invest", "#e3a91c", "coin", 0],
    ["town", "#3f9a56", "flag", 0],
    ["event", "#8e5cc4", "balloon", 0]
  ];

  // ---- 色 ----
  function hx(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function toHex(a) { return "#" + a.map(function (c) { c = Math.max(0, Math.min(255, Math.round(c))); return (c < 16 ? "0" : "") + c.toString(16); }).join(""); }
  function mix(a, b, t) { var x = hx(a), y = hx(b); return toHex(x.map(function (c, i) { return c + (y[i] - c) * t; })); }
  function dim(h) { // 選べない会社用：彩度を落として薄く
    var x = hx(h), l = x[0] * 0.3 + x[1] * 0.59 + x[2] * 0.11;
    return mix(toHex([l, l, l].map(function (g, i) { return g + (x[i] - g) * 0.42; })), "#e4e4e4", 0.3);
  }

  var TH = {
    "朝": { sky: "#aee0f5", tc: "#fff1d9", t: 0.16, cloud: "#ffffff", win: "#cfe8f6" },
    "昼": { sky: "#3d97e0", tc: "#000000", t: 0, cloud: "#ffffff", win: "#a9d3ef" },
    "夜": { sky: "#1b2a55", tc: "#131c3f", t: 0.6, cloud: "#2e3d6a", win: "#2f3c5e" }
  };

  // ---- 乱数（種固定） ----
  function rng(s) {
    return function () {
      s = (s + 0x6d2b79f5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---- 投影：地面(u,v)と高さz → 画面 ----
  var Y0 = 140;
  function S(u, v, z) { return [300 + u - v, Y0 + (u + v) / 2 - (z || 0)]; }
  function f(n) { return Math.round(n * 10) / 10; }
  function pts(a) { return a.map(function (p) { return f(p[0]) + "," + f(p[1]); }).join(" "); }
  function poly(a, c, x) { return '<polygon points="' + pts(a) + '" fill="' + c + '"' + (x || "") + "/>"; }
  function quad(u0, v0, u1, v1, c, z, x) { z = z || 0; return poly([S(u0, v0, z), S(u1, v0, z), S(u1, v1, z), S(u0, v1, z)], c, x); }
  function circ(x, y, r, c, e) { return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="' + c + '"' + (e || "") + "/>"; }
  function ell(x, y, rx, ry, c, e) { return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="' + c + '"' + (e || "") + "/>"; }
  function line(a, b, c, w, e) { return '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="' + c + '" stroke-width="' + w + '"' + (e || "") + "/>"; }

  // 地図の骨組み
  var UR = [-150, 180, 425, 550];          // u 方向の道路（中心）
  var VR = [-320, -100, 120, 340, 560, 780, 1000];
  var RW = 24, RAIL = [7, 33], RIV = [680, 750];
  var CU = {}; // 会社の地面座標（足元中心）
  CO.forEach(function (c) {
    var p = CITY_COMPANIES[c[0]], d = p.x - 300, s = (p.y + 20 - Y0) * 2;
    CU[c[0]] = { u: (s + d) / 2, v: (s - d) / 2 };
  });
  var UW = 990, PARK2 = [806, 632, 958, 760]; // 引きの絵だけ：川向こうの道路・公園
  var PARK = [318, 455, 410, 546], SCHOOL = [45, -78, 128, -24], FIELD = [45, -6, 165, 102], STATION = [-52, 118, -4, 200];

  function city(time, opts) {
    var T = TH[time] || TH["昼"], night = time === "夜", wide = !!(opts && opts.wide === true);
    var R = rng(20240611), W = rng(777);
    function C(h) { return T.t ? mix(h, T.tc, T.t) : h; }
    function sh(h, k) { return mix(h, "#4a5368", k); }
    var LIT = "#ffd45a", LIT2 = "#f6c143";
    var OL = ' stroke="' + (night ? "#0c1330" : "#33404f") + '" stroke-opacity="' + (night ? ".6" : ".32") + '" stroke-width=".8" stroke-linejoin="round"';

    var objs = []; // {k:並び順, s:SVG}
    function add(layer, d, s) { objs.push({ k: layer * 1e5 + d, s: s }); }
    function layerOf(u) { return u < RAIL[0] ? 0 : u > RIV[1] ? 3 : 2; }

    // 窓を面に並べる
    function wins(A, B, z0, z1, cols, rows, pl, dayc) {
      var s = "", dx = B[0] - A[0], dy = B[1] - A[1], zz = (z1 - z0) / rows;
      function p(t, z) { return [A[0] + dx * t, A[1] + dy * t - z]; }
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var lit = W() < pl, w2 = W(), t0 = (c + 0.24) / cols, t1 = (c + 0.76) / cols, za = z0 + r * zz + zz * 0.24, zb = z0 + r * zz + zz * 0.8;
        s += poly([p(t0, za), p(t1, za), p(t1, zb), p(t0, zb)], night ? (lit ? (w2 < 0.5 ? LIT : LIT2) : T.win) : C(dayc));
      }
      return s;
    }

    // 建物（箱＋屋根）
    function bld(u, v, a, b, h, o) {
      var u1 = u + a, v1 = v + b, w = o.wall, s = "", e = 2.5;
      var L = C(w), Rr = C(sh(w, 0.2));
      s += poly([S(u, v1, 0), S(u1, v1, 0), S(u1, v1, h), S(u, v1, h)], L);
      s += poly([S(u1, v, 0), S(u1, v1, 0), S(u1, v1, h), S(u1, v, h)], Rr);
      var wz = o.gable ? h - 3 : h - 4, rows = o.rows || Math.max(1, Math.floor((wz - 2) / 11));
      var ws = '<g stroke="none">' +
        wins(S(u, v1), S(u1, v1), 3, wz, Math.max(1, Math.round(a / 13)), rows, o.pl, "#a9d3ef") +
        wins(S(u1, v1), S(u1, v), 3, wz, Math.max(1, Math.round(b / 13)), rows, o.pl, "#8fbfe0");
      if (o.door) ws += poly([S(u + a * 0.42, v1, 0), S(u + a * 0.58, v1, 0), S(u + a * 0.58, v1, 9), S(u + a * 0.42, v1, 9)], night ? "#e0a83a" : C("#6b5646"));
      if (o.awn) { var A = C(o.awn); ws += poly([S(u - 1, v1 + 4, h * 0.45), S(u1 + 1, v1 + 4, h * 0.45), S(u1 + 1, v1, h * 0.62), S(u - 1, v1, h * 0.62)], A); }
      s += ws + "</g>";
      var rf = C(o.roof), rd = C(sh(o.roof, 0.25)), r = o.rr || 10;
      if (o.gable === "v") {
        var um = u + a / 2;
        s += poly([S(u - e, v - e, h), S(u - e, v1 + e, h), S(um, v1 + e, h + r), S(um, v - e, h + r)], rf);
        s += poly([S(u, v1, h), S(u1, v1, h), S(um, v1, h + r)], L);
        s += poly([S(u1 + e, v - e, h), S(u1 + e, v1 + e, h), S(um, v1 + e, h + r), S(um, v - e, h + r)], rd);
      } else if (o.gable === "u") {
        var vm = v + b / 2;
        s += poly([S(u - e, v - e, h), S(u1 + e, v - e, h), S(u1 + e, vm, h + r), S(u - e, vm, h + r)], rd);
        s += poly([S(u1, v, h), S(u1, v1, h), S(u1, vm, h + r)], Rr);
        s += poly([S(u - e, v1 + e, h), S(u1 + e, v1 + e, h), S(u1 + e, vm, h + r), S(u - e, vm, h + r)], rf);
      } else {
        s += quad(u, v, u1, v1, rf, h);
        s += quad(u + 3, v + 3, u1 - 3, v1 - 3, C(mix(o.roof, "#ffffff", 0.18)), h);
        if (o.ac) s += quad(u + a * 0.25, v + b * 0.2, u + a * 0.5, v + b * 0.45, C("#b9c0c8"), h + 4);
      }
      return "<g" + OL + ">" + s + "</g>";
    }

    function tree(u, v, k) {
      var p = S(u, v), r = 7 + k * 4, dk = C(k > 0.5 ? "#3d8a45" : "#47994a"), lt = C(k > 0.5 ? "#5fb257" : "#6cbf58");
      return '<g' + OL + ">" + poly([[p[0] - 1.5, p[1]], [p[0] + 1.5, p[1]], [p[0] + 1.5, p[1] - 8], [p[0] - 1.5, p[1] - 8]], C("#8a6243")) +
        circ(p[0], p[1] - 8 - r * 0.8, r, dk) + '</g>' + circ(p[0] - r * 0.28, p[1] - 9 - r, r * 0.55, lt);
    }

    // ---- 空・山・雲 ----
    var out = [];
    out.push(wide ? '<rect x="-200" width="1000" height="1000" fill="' + T.sky + '"/>' : '<rect width="600" height="800" fill="' + T.sky + '"/>');
    if (night) {
      var SR = rng(99);
      for (var i = 0; i < 34; i++) out.push(circ(SR() * 600, SR() * 115, SR() < 0.25 ? 1.6 : 1, "#fff6d0"));
      if (wide) { SR = rng(98); for (i = 0; i < 22; i++) out.push(circ((SR() < 0.5 ? -200 : 600) + SR() * 200, SR() * 115, SR() < 0.25 ? 1.6 : 1, "#fff6d0")); }
      out.push(circ(498, 58, 19, "#fff1b8") + circ(507, 51, 16, T.sky));
    } else if (time === "朝") {
      out.push(circ(190, 62, 24, "#fff6dc"));
    }
    [[70, 72, 1], [420, 50, 0.8], [535, 108, 0.7], [250, 30, 0.6]].concat(wide ? [[-140, 46, 0.9], [-60, 104, 0.55], [660, 64, 0.85], [760, 22, 0.6]] : []).forEach(function (c) {
      var x = c[0], y = c[1], k = c[2] * 1.2;
      out.push('<g fill="' + T.cloud + '">' + circ(x, y, 13 * k, T.cloud) + circ(x + 16 * k, y - 6 * k, 16 * k, T.cloud) + circ(x + 34 * k, y + 1 * k, 11 * k, T.cloud) +
        '<rect x="' + f(x - 12 * k) + '" y="' + f(y) + '" width="' + f(56 * k) + '" height="' + f(12 * k) + '" rx="' + f(6 * k) + '"/></g>');
    });
    if (wide) {
      out.push('<path d="M-200 98 Q-150 66 -90 90 Q-40 110 0 118 V150 H-200Z M600 90 Q630 104 670 92 Q720 58 800 80 V150 H600Z" fill="' + C("#7cae86") + '"/>');
      out.push('<path d="M-200 124 Q-120 100 -50 120 Q-20 128 0 132 V150 H-200Z M600 118 Q660 98 720 114 Q760 120 800 108 V150 H600Z" fill="' + C("#5f9c5f") + '"/>');
    }
    out.push('<path d="M0 118 Q60 74 130 104 Q190 70 260 100 Q330 62 410 96 Q480 66 540 92 Q575 80 600 90 V150 H0Z" fill="' + C("#7cae86") + '"/>');
    out.push('<path d="M0 132 Q70 104 150 126 Q230 100 310 124 Q400 104 470 122 Q540 104 600 118 V150 H0Z" fill="' + C("#5f9c5f") + '"/>');

    // ---- 地面 ----
    var g = [];
    g.push(wide ? '<rect x="-200" y="' + (Y0 - 4) + '" width="1000" height="' + (1004 - Y0) + '" fill="' + C("#86c763") + '"/>' : '<rect y="' + (Y0 - 4) + '" width="600" height="' + (804 - Y0) + '" fill="' + C("#86c763") + '"/>');
    var UG = wide ? UR.concat([UW]) : UR;
    var BIG = 1500, rd = C("#a9b0ba"), sw = C("#d9dde2"), dash = night ? "#c8c08a" : C("#f4f4f4");
    UG.forEach(function (c) { g.push(quad(c - RW / 2 - 4, -BIG, c + RW / 2 + 4, BIG, sw)); });
    VR.forEach(function (c) { g.push(quad(-BIG, c - RW / 2 - 4, BIG, c + RW / 2 + 4, sw)); });
    UG.forEach(function (c) { g.push(quad(c - RW / 2, -BIG, c + RW / 2, BIG, rd)); });
    VR.forEach(function (c) { g.push(quad(-BIG, c - RW / 2, BIG, c + RW / 2, rd)); });
    var DA = ' stroke-dasharray="8 8"';
    UG.forEach(function (c) { g.push(line(S(c, -BIG), S(c, BIG), dash, 1.4, DA)); });
    VR.forEach(function (c) { g.push(line(S(-BIG, c), S(BIG, c), dash, 1.4, DA)); });
    // 横断歩道
    UG.forEach(function (a) {
      VR.forEach(function (b) {
        g.push(line(S(a - RW / 2 + 2, b + RW / 2 + 5), S(a + RW / 2 - 2, b + RW / 2 + 5), C("#f2f2f2"), 6, ' stroke-dasharray="2.2 2.2"'));
        g.push(line(S(a + RW / 2 + 5, b - RW / 2 + 2), S(a + RW / 2 + 5, b + RW / 2 - 2), C("#f2f2f2"), 6, ' stroke-dasharray="2.2 2.2"'));
      });
    });
    // 線路
    g.push(quad(RAIL[0], -BIG, RAIL[1], BIG, C("#a99d90")));
    g.push(line(S(20, -BIG), S(20, BIG), C("#7d6a58"), 13, ' stroke-dasharray="2 3"'));
    [13, 17, 23, 27].forEach(function (u) { g.push(line(S(u, -BIG), S(u, BIG), C("#5b5f66"), 1.2)); });
    g.push(quad(RAIL[1], 112, RAIL[1] + 9, 206, C("#d7d0c4"), 2) + quad(RAIL[1] + 9, 112, RAIL[1] + 10, 206, C("#b7ad9e"), 1));
    // 学校の校庭・公園
    g.push(quad(FIELD[0], FIELD[1], FIELD[2], FIELD[3], C("#e5c98e")));
    var fc = S((FIELD[0] + FIELD[2]) / 2, (FIELD[1] + FIELD[3]) / 2);
    g.push(ell(fc[0], fc[1], 62, 30, "none", ' stroke="' + C("#ffffff") + '" stroke-width="2"'));
    g.push(quad(PARK[0], PARK[1], PARK[2], PARK[3], C("#9bd472")));
    var pc = S((PARK[0] + PARK[2]) / 2, (PARK[1] + PARK[3]) / 2);
    g.push(line(S(PARK[0], (PARK[1] + PARK[3]) / 2), S(PARK[2], (PARK[1] + PARK[3]) / 2), C("#e8d6ae"), 6));
    g.push(line(S((PARK[0] + PARK[2]) / 2, PARK[1]), S((PARK[0] + PARK[2]) / 2, PARK[3]), C("#e8d6ae"), 6));
    g.push(ell(pc[0], pc[1], 44, 22, C("#e8d6ae")));
    // 川
    g.push(quad(RIV[0] - 7, -BIG, RIV[1] + 7, BIG, C("#9aa3a8")));
    g.push(quad(RIV[0], -BIG, RIV[1], BIG, C("#4a9ee0")));
    if (wide) {
      g.push(quad(PARK2[0], PARK2[1], PARK2[2], PARK2[3], C("#9bd472")));
      var p2 = [(PARK2[0] + PARK2[2]) / 2, (PARK2[1] + PARK2[3]) / 2];
      g.push(line(S(PARK2[0], p2[1]), S(PARK2[2], p2[1]), C("#e8d6ae"), 6) + line(S(p2[0], PARK2[1]), S(p2[0], PARK2[3]), C("#e8d6ae"), 6));
      var pp = S(p2[0], p2[1]);
      g.push(ell(pp[0], pp[1], 34, 17, C("#e8d6ae")) + ell(pp[0], pp[1], 24, 12, C("#5fb3ec")));
      for (i = 0; i < 26; i++) { if (i > 3 && i < 18) continue; var wu2 = RIV[0] + 10 + (i * 17) % 38, wv2 = -20 + i * 45; g.push(line(S(wu2, wv2), S(wu2, wv2 + 18), C("#8cc8f2"), 2, ' stroke-linecap="round"')); }
    }
    for (i = 0; i < 9; i++) { var wu = RIV[0] + 10 + (i * 17) % 38, wv = 300 + i * 45; g.push(line(S(wu, wv), S(wu, wv + 18), C("#8cc8f2"), 2, ' stroke-linecap="round"')); }

    // ---- 予約地（建物を置かない所） ----
    var RES = [PARK, SCHOOL, FIELD, STATION, [RAIL[1], 105, RAIL[1] + 12, 210]];
    CO.forEach(function (c) { var p = CU[c[0]]; RES.push([p.u - 36, p.v - 36, p.u + 36, p.v + 36]); });
    function hit(a, b) { return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]; }
    var CR = []; // 会社の画面上の範囲（看板を隠さない）
    CO.forEach(function (c) { var p = CITY_COMPANIES[c[0]]; CR.push({ r: [p.x - 60, p.y - 95, p.x + 60, p.y + 50], d: CU[c[0]].u + CU[c[0]].v }); });
    function blocks(u0, v0, u1, v1, h) {
      var A = S(u0, v1), B = S(u1, v0), top = S(u0, v0, h)[1], bot = S(u1, v1)[1], r = [A[0], top, B[0], bot], d = u0 + u1 / 2 + v0 + v1 / 2;
      d = (u0 + u1 + v0 + v1) / 2;
      for (var i = 0; i < CR.length; i++) if (hit(r, CR[i].r) && d > CR[i].d - 30) return true;
      return r[2] < -10 || r[0] > 610 || bot < Y0 + 6 || r[1] > 820;
    }

    // ---- 区画ごとに家・マンション・店・木を並べる ----
    var UB = [-420, UR[0], RAIL, UR[1], UR[2], UR[3], RIV, 960];
    var ub = [];
    for (i = 0; i < UB.length - 1; i++) {
      var a0 = UB[i], a1 = UB[i + 1];
      ub.push([(a0.length ? a0[1] + 4 : a0 + RW / 2 + 6), (a1.length ? a1[0] - 4 : a1 - RW / 2 - 6)]);
    }
    ub[0][0] = -420; ub[ub.length - 1][1] = 960;
    var vb = [];
    for (i = 0; i < VR.length - 1; i++) vb.push([VR[i] + RW / 2 + 6, VR[i + 1] - RW / 2 - 6]);
    var ROOFS = ["#d9644e", "#4f7fc4", "#5b8f5b", "#8a6a55", "#6c7a8c", "#c9814a"], WALLS = ["#f4ecda", "#f7f3ea", "#eadcc2", "#e2e9ef", "#f1e2d3"];
    var MW = ["#e9edf1", "#dde3ea", "#cad4df", "#efe6d6", "#d5dde3"], AWN = ["#e0604f", "#3f8fd0", "#f0b33c", "#5aa865", "#e27fa6"];
    function lot(u, v, U, V, q, q2, q3, q4, res, blocks) {
      var a = Math.min(40, U[1] - u), b = Math.min(40, V[1] - v);
      var lot = [u, v, u + a, v + b], L = layerOf(u + a);
      for (var j = 0; j < res.length; j++) if (hit(lot, res[j])) return;
      if (u < RIV[1] && u + a > RIV[0]) return;
      var shop = Math.abs(v + b - (VR[3] - RW / 2 - 6)) < 2 && u > 180 && u < 560;
      var kind = shop ? "shop" : q < 0.16 ? "trees" : q < 0.34 ? "tall" : "house";
      if (L === 0 && kind === "tall" && q2 < 0.5) kind = "house";
      var aa = a - q2 * 8, bb = b - q3 * 8, ou = u + (a - aa) / 2, ov = v + (b - bb) / 2;
      if (kind === "tall") {
        var h = 46 + Math.floor(q4 * 4) * 12;
        if (blocks(ou, ov, ou + aa, ov + bb, h)) kind = "house";
        else return add(L, ou + ov + aa / 2 + bb / 2, bld(ou, ov, aa, bb, h, { wall: MW[Math.floor(q2 * 5)], roof: "#9aa4ae", pl: 0.6, ac: 1, door: 1 }));
      }
      if (kind === "shop") {
        if (blocks(ou, ov, ou + aa, ov + bb, 26)) return;
        return add(L, ou + ov + aa / 2 + bb / 2, bld(ou, ov, aa, bb, 22, { wall: WALLS[Math.floor(q4 * 5)], roof: "#c8b9a6", pl: 0.85, rows: 1, awn: AWN[Math.floor(q2 * 5)], door: 1 }));
      }
      if (kind === "house") {
        aa = Math.min(aa, 34); bb = Math.min(bb, 34);
        if (!blocks(ou, ov, ou + aa, ov + bb, 30)) {
          add(L, ou + ov + aa / 2 + bb / 2, bld(ou, ov, aa, bb, 16 + Math.floor(q4 * 3) * 3, { wall: WALLS[Math.floor(q3 * 5)], roof: ROOFS[Math.floor(q2 * 6)], gable: q4 < 0.5 ? "u" : "v", rr: 10, rows: 1, pl: 0.75, door: 1 }));
          if (q > 0.6 && !blocks(u + a - 2, v + 2, u + a + 2, v + 6, 20)) add(L, u + a + v + 4, tree(u + a - 2, v + 4, q3));
          return;
        }
      }
      if (!blocks(u, v, u + a, v + b, 22)) {
        add(L, u + v + 12, tree(u + 10, v + 10, q2));
        add(L, u + v + 46, tree(u + 26, v + 22, q3));
        if (q4 > 0.4) add(L, u + v + 40, tree(u + 12, v + 30, q4));
      }
    }
    var DONE = {};
    ub.forEach(function (U) {
      vb.forEach(function (V) {
        for (var u = U[0]; u + 30 <= U[1]; u += 48) for (var v = V[0]; v + 30 <= V[1]; v += 48) {
          var n0 = objs.length;
          lot(u, v, U, V, R(), R(), R(), R(), RES, blocks);
          if (objs.length > n0) DONE[u + "," + v] = 1;
        }
      });
    });

    // 公園の木と噴水
    [[324, 462], [324, 538], [404, 462], [404, 538], [340, 470], [392, 532], [326, 500]].forEach(function (t, i) { add(2, t[0] + t[1], tree(t[0], t[1], (i % 3) / 3)); });
    (function () {
      var x = pc[0], y = pc[1], s = "";
      s += ell(x, y + 2, 20, 10, C("#b9bfc6")) + ell(x, y, 20, 10, C("#d6dbe0")) + ell(x, y, 16, 8, C("#5fb3ec"));
      s += '<rect x="' + f(x - 2.5) + '" y="' + f(y - 16) + '" width="5" height="16" fill="' + C("#d6dbe0") + '"/>';
      s += ell(x, y - 16, 8, 3.5, C("#d6dbe0")) + ell(x, y - 16, 6, 2.5, C("#5fb3ec"));
      s += '<path d="M' + f(x - 1.5) + " " + f(y - 17) + " Q" + f(x) + " " + f(y - 30) + " " + f(x + 1.5) + " " + f(y - 17) + 'Z" fill="' + C("#bfe3fb") + '"/>';
      add(2, PARK[0] + PARK[1] + 92, "<g" + OL + ">" + s + "</g>");
    })();

    // 学校
    (function () {
      var u = SCHOOL[0], v = SCHOOL[1], a = SCHOOL[2] - u, b = SCHOOL[3] - v, s = bld(u, v, a, b, 34, { wall: "#f3ede0", roof: "#a6aeb6", pl: 0.6, door: 1 });
      s += bld(u + a / 2 - 9, v + b - 18, 18, 18, 52, { wall: "#f3ede0", roof: "#c25a4a", gable: "u", rr: 8, rows: 1, pl: 0.8 });
      var c = S(u + a / 2, v + b, 44);
      s += circ(c[0] - 4, c[1] - 2, 5, C("#ffffff"), ' stroke="' + C("#5b6470") + '" stroke-width="1"') + line([c[0] - 4, c[1] - 2], [c[0] - 4, c[1] - 5.5], C("#5b6470"), 1);
      add(2, u + v + a / 2 + b / 2, s);
    })();

    // 駅と電車
    add(0, STATION[0] + STATION[1] + 60, bld(STATION[0], STATION[1], STATION[2] - STATION[0], STATION[3] - STATION[1], 24, { wall: "#efe9dd", roof: "#3f6fc4", gable: "v", rr: 12, rows: 1, pl: 0.9, door: 1 }));
    function train(v, i) {
      var u = 13, a = 14, b = 42, h = 13, s = "";
      s += poly([S(u, v + b, 0), S(u + a, v + b, 0), S(u + a, v + b, h), S(u, v + b, h)], C("#dfe5ea"));
      s += poly([S(u + a, v, 0), S(u + a, v + b, 0), S(u + a, v + b, h), S(u + a, v, h)], C("#f4f7f9"));
      s += poly([S(u + a, v, 2.5), S(u + a, v + b, 2.5), S(u + a, v + b, 5.5), S(u + a, v, 5.5)], C("#3f6fd0"), ' stroke="none"');
      s += '<g stroke="none">' + wins(S(u + a, v + 2), S(u + a, v + b - 2), 6, 12, 5, 1, 0.95, "#5b6b80") + "</g>";
      s += quad(u, v, u + a, v + b, C("#c3cad2"), h);
      add(1, i, "<g" + OL + ">" + s + "</g>");
    }
    [-26, 20, 66].forEach(train);

    // 橋
    function bridge(vc) {
      var v0 = vc - RW / 2 - 2, v1 = vc + RW / 2 + 2, u0 = RIV[0] - 10, u1 = RIV[1] + 10, s = "";
      s += poly([S(u0, v1, 0), S(u1, v1, 0), S(u1, v1, 5), S(u0, v1, 5)], C("#c3c9cf"));
      s += quad(u0, v0, u1, v1, C("#d6dade"), 5) + quad(u0, v0 + 5, u1, v1 - 5, rd, 5);
      s += line(S(u0, v1, 11), S(u1, v1, 11), C("#eef1f4"), 2) + line(S(u0, v0, 11), S(u1, v0, 11), C("#eef1f4"), 2);
      for (var k = 0; k <= 4; k++) { var uu = u0 + (u1 - u0) * k / 4; s += line(S(uu, v1, 5), S(uu, v1, 11), C("#eef1f4"), 1.6); }
      add(2, u1 + v1, "<g" + OL + ">" + s + "</g>");
    }
    bridge(VR[4]);

    // 車
    var CARS = [[UR[1] - 6, 230, "#e0604f"], [UR[2] + 6, 470, "#f0c33c"], [UR[3] - 6, 330, "#ffffff"], [-40, VR[3] + 6, "#3f8fd0"], [250, VR[4] - 6, "#f0c33c"], [520, VR[2] + 6, "#e0604f"], [UR[2] - 6, 690, "#3f8fd0"], [120, VR[5] + 6, "#ffffff"]];
    function car(c) {
      var alongV = UR.indexOf(c[0] + 6) >= 0 || UR.indexOf(c[0] - 6) >= 0, u = c[0], v = c[1];
      var a = alongV ? 7 : 13, b = alongV ? 13 : 7, s = bld(u - a / 2, v - b / 2, a, b, 5, { wall: c[2], roof: c[2], rows: 1, pl: 0 });
      s = s.replace(/<g stroke="none">.*?<\/g>/, "");
      s += bld(u - a / 4, v - b / 4, a / 2, b / 2, 9, { wall: "#e9eef2", roof: c[2], rows: 1, pl: 0 }).replace(/<g stroke="none">.*?<\/g>/, "");
      add(layerOf(u), u + v + 8, s);
    }
    CARS.forEach(car);

    // 街灯
    function lamp(u, v) {
      var p = S(u, v), on = night;
      return line(p, [p[0], p[1] - 16], C("#5e6670"), 1.4) + circ(p[0], p[1] - 17, on ? 3 : 2.2, on ? "#ffe27a" : C("#8a929c"), on ? ' stroke="#fff3c0" stroke-width="1"' : "");
    }
    UR.forEach(function (c) { for (var v = -300; v < 1100; v += 110) { var u = c + RW / 2 + 3, p = S(u, v); if (p[1] > Y0 + 10 && p[0] > 0 && p[0] < 600 && p[1] < 810) add(layerOf(u), u + v, lamp(u, v)); } });
    VR.forEach(function (c) { for (var u = -260; u < 680; u += 110) { var v = c + RW / 2 + 3, p = S(u, v); if (u > RAIL[0] - 3 && u < RAIL[1] + 3) continue; if (p[1] > Y0 + 10 && p[0] > 0 && p[0] < 600 && p[1] < 810) add(layerOf(u), u + v, lamp(u, v)); } });

    // ---- 会社 ----
    // ---- 引きの絵：外側に描き足す（元の枠の中には何も足さない） ----
    function inOrig(r) { return !(r[2] < -10 || r[0] > 610 || r[3] < Y0 + 6 || r[1] > 820); }
    function inWide(r) { return !(r[2] < -175 || r[0] > 775 || r[3] < Y0 + 6 || r[1] > 1010); }
    function addWide() {
      W = rng(4243);
      var R2 = rng(4242), RES2 = RES.concat([PARK2]);
      function blocksW(u0, v0, u1, v1, h) {
        var r = [S(u0, v1)[0], S(u0, v0, h)[1], S(u1, v0)[0], S(u1, v1)[1]], d = (u0 + u1 + v0 + v1) / 2;
        for (var i = 0; i < CR.length; i++) if (hit(r, CR[i].r) && d > CR[i].d - 30) return true;
        return inOrig(r) || !inWide(r);
      }
      ub.concat([[UW + RW / 2 + 6, 1250]]).forEach(function (U) {
        vb.concat([[VR[6] + RW / 2 + 6, 1202]]).forEach(function (V) {
          for (var u = U[0]; u + 30 <= U[1]; u += 48) for (var v = V[0]; v + 30 <= V[1]; v += 48) {
            var q = R2(), q2 = R2(), q3 = R2(), q4 = R2();
            if (!DONE[u + "," + v]) lot(u, v, U, V, q, q2, q3, q4, RES2, blocksW);
          }
        });
      });
      [[812, 640], [812, 752], [950, 640], [950, 752], [830, 700], [930, 700], [882, 648], [882, 750], [840, 660], [920, 742]].forEach(function (t, i) { add(3, t[0] + t[1], tree(t[0], t[1], (i % 3) / 3)); });
      bridge(VR[3]); bridge(VR[5]);
      [384, 430, 476].forEach(function (v, i) { train(v, 3 + i); });
      [[UR[0] + 6, 300, "#e0604f"], [UR[1] - 6, -150, "#ffffff"], [UR[3] + 6, -120, "#3f8fd0"], [-120, VR[4] + 6, "#f0c33c"], [300, VR[6] - 6, "#e0604f"], [UR[3] - 6, 900, "#ffffff"],
        [UW - 6, 600, "#3f8fd0"], [860, VR[3] + 6, "#f0c33c"], [820, VR[5] - 6, "#e0604f"], [UR[2] + 6, 1050, "#3f8fd0"], [-60, VR[1] - 6, "#ffffff"], [480, VR[1] + 6, "#f0c33c"]].forEach(function (c) {
        var p = S(c[0], c[1]), r = [p[0] - 12, p[1] - 12, p[0] + 12, p[1] + 6];
        if (!inOrig(r) && inWide(r)) car(c);
      });
      function lampW(u, v) { var p = S(u, v), r = [p[0] - 4, p[1] - 21, p[0] + 4, p[1]]; if (!inOrig(r) && inWide(r)) add(layerOf(u), u + v, lamp(u, v)); }
      UG.forEach(function (c) { for (var v = -300; v < 1400; v += 110) lampW(c + RW / 2 + 3, v); });
      VR.forEach(function (c) { for (var u = -260; u < 1300; u += 110) { if ((u > RAIL[0] - 3 && u < RAIL[1] + 3) || (u > RIV[0] - 14 && u < RIV[1] + 14)) continue; lampW(u, c + RW / 2 + 3); } });
    }

    var signs = [];
    CO.forEach(function (c) {
      var key = c[0], on = c[3], col = on ? c[1] : dim(c[1]), p = CU[key], P = CITY_COMPANIES[key];
      var wall = on ? "#f6eedb" : dim("#efe6cf"), h = 40, a = 55;
      var s = bld(p.u - a / 2, p.v - a / 2, a, a, h, { wall: wall, roof: col, rows: 2, pl: 1, door: 1, awn: col });
      add(2, p.u + p.v, s);
      var sc = night ? mix(col, "#131c3f", 0.12) : C(col), y = P.y - 68;
      var g2 = line([P.x, P.y - 22], [P.x, y + 10], C("#6b7480"), 3);
      g2 += circ(P.x, y + 1.5, 21.5, night ? "#0c1330" : "#2d3a4b", ' opacity=".28"');
      g2 += circ(P.x, y, 20, sc, ' stroke="#ffffff" stroke-width="3"');
      g2 += '<g transform="translate(' + P.x + " " + y + ')" fill="#ffffff">' + ICON[c[2]](sc) + "</g>";
      signs.push("<g>" + g2 + "</g>");
    });

    if (wide) addWide();
    objs.sort(function (a, b) { return a.k - b.k; });
    var cid = wide ? "yzCityGroundWide" : "yzCityGround";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (wide ? "-161 0 922 1000" : "0 0 600 800") + '" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="街">' +
      '<defs><clipPath id="' + cid + '">' + (wide ? '<rect x="-200" y="' + (Y0 - 4) + '" width="1000" height="' + (1004 - Y0) + '"/>' : '<rect y="' + (Y0 - 4) + '" width="600" height="' + (804 - Y0) + '"/>') + '</clipPath></defs>' +
      out.join("") + '<g clip-path="url(#' + cid + ')">' + g.join("") + "</g>" +
      objs.map(function (o) { return o.s; }).join("") + signs.join("") + "</svg>";
  }

  var ICON = {
    plane: function () {
      return '<path transform="rotate(-35)" d="M13 0C13-1.8 11-2.4 9-2.4H4L-2.5-12H-6L-2-2.4H-8L-11-6.5H-13.5L-11.5 0-13.5 6.5H-11L-8 2.4H-2L-6 12H-2.5L4 2.4H9C11 2.4 13 1.8 13 0Z"/>';
    },
    house: function (c) {
      return '<path d="M0-12L13 0H9V11H-9V0H-13Z"/><rect x="-3" y="3" width="6" height="8" fill="' + c + '"/>';
    },
    coin: function (c) {
      return '<ellipse cx="0" cy="7" rx="10" ry="4"/><rect x="-10" y="1" width="20" height="6"/><ellipse cx="0" cy="1" rx="10" ry="4" fill="' + c + '" stroke="#fff" stroke-width="1.5"/>' +
        '<ellipse cx="0" cy="-4" rx="10" ry="4"/><rect x="-10" y="-10" width="20" height="6"/><ellipse cx="0" cy="-10" rx="10" ry="4" fill="#fff"/><ellipse cx="0" cy="-10" rx="5" ry="1.8" fill="' + c + '"/>';
    },
    flag: function () {
      return '<rect x="-8" y="-12" width="3" height="25" rx="1.5"/><path d="M-5-11Q2-14 11-9V2Q2-3-5 0Z"/>';
    },
    balloon: function (c) {
      return '<path d="M-3 4Q-1 9 1 13M5 5Q3 9 1 13" fill="none" stroke="#fff" stroke-width="1.3"/>' +
        '<ellipse cx="-4" cy="-4" rx="7" ry="8.5"/><ellipse cx="5.5" cy="-2" rx="6" ry="7.5" stroke="' + c + '" stroke-width="1.2"/>' +
        '<path d="M-5.5 4.2L-2.5 4.2L-4 6.5Z M4 5.3L7 5.3L5.5 7.5Z"/>';
    }
  };

  root.YorozuArt = Object.assign(root.YorozuArt || {}, { city: city, CITY_COMPANIES: CITY_COMPANIES });
})(typeof globalThis !== "undefined" ? globalThis : this);
