// カードの名前の「折り返してよい場所」を決める（ゲーム本体の js/game.js から使う。確かめ用：node js/name-breaks.js で全部の名前の分け方を出す）
// 決まり：
//  1. 「の・で・と・や・を・に・へ・な・から・まで」のあと（前の言葉が2文字以上、または漢字・カタカナで終わるとき。名前の最初と最後は除く）
//  2. カタカナとそれ以外の境目（両側とも2文字以上のとき）
//  1文字だけのかたまりは作らない（前か後ろとつなげる）。「の・で…」の前では折り返さない（行の先頭に来ないように）。ほかの場所（言葉の途中）でも折り返さない。折り返せないまま入らない名前は、文字を少し小さくして1行に収める
(function (root) {
  const PART = new Set(["の", "で", "と", "や", "を", "に", "へ", "な", "から", "まで"]);
  const isKata = ch => /[ァ-ヿー]/.test(ch);
  const isHira = s => /^[ぁ-ゖ]+$/.test(s);
  // loose（true か 1）：最小の文字でも入らない名前のための予備。文字の種類（漢字・ひらがな・カタカナ）の境目（両側2文字以上）でも折り返してよい
  //   例「自己紹介すごろく」→「自己紹介／すごろく」
  const kind = ch => /[ァ-ヿー]/.test(ch) ? "k" : /[ぁ-ゖ]/.test(ch) ? "h" : /[一-龯々]/.test(ch) ? "c" : "o";
  function breakParts(name, loose) {
    let seg;
    try { seg = [...new Intl.Segmenter("ja", { granularity: "word" }).segment(name)].map(x => x.segment); } catch (e) { return [name]; }
    const cut = new Set(); // 文字の位置（この位置の前で折り返してよい）
    const partStart = new Set(); // 「の・で…」が始まる位置（この前では折り返さない。行の先頭に「の」などが来ないように）
    const segEdge = new Set(); // 言葉の切れ目（予備の折り返し場所は、ここと重なるときだけ）
    let pos = 0;
    seg.forEach((g, i) => {
      if (i > 0) segEdge.add(pos);
      const end = pos + [...g].length;
      if (PART.has(g) && i > 0) partStart.add(pos);
      if (PART.has(g) && i > 0 && i < seg.length - 1) {
        const prev = seg[i - 1];
        if ([...prev].length >= 2 || !isHira(prev)) cut.add(end);
      }
      pos = end;
    });
    const chars = [...name];
    // カタカナとそれ以外の境目（両側とも2文字以上続くとき）
    for (let k = 2; k <= chars.length - 2; k++) {
      if (isKata(chars[k - 1]) !== isKata(chars[k])) {
        const runL = (() => { let n = 0; for (let j = k - 1; j >= 0 && isKata(chars[j]) === isKata(chars[k - 1]); j--) n++; return n; })();
        const runR = (() => { let n = 0; for (let j = k; j < chars.length && isKata(chars[j]) === isKata(chars[k]); j++) n++; return n; })();
        if (runL >= 2 && runR >= 2) cut.add(k);
      }
    }
    if (loose) for (let k = 2; k <= chars.length - 2; k++) {
      const a1 = kind(chars[k - 1]), b1 = kind(chars[k]);
      if (a1 === b1 || a1 === "o" || b1 === "o") continue;
      if (kind(chars[k - 2]) !== a1 || kind(chars[k + 1]) !== b1) continue;
      // 漢字のあとのひらがなは、3文字以上続くときだけ（「流行／り」のような送りがなで切らない）
      //   「っ」をふくむひらがな（「泊／まった」のような動詞の形）でも切らない
      if (a1 === "c" && b1 === "h") { let n = 0, sm = false; for (let j = k; j < chars.length && kind(chars[j]) === "h"; j++) { n++; if (chars[j] === "っ") sm = true; } if (n < 3 || sm) continue; }
      if (segEdge.has(k)) cut.add(k);
    }
    // loose が 2：さらに、言葉の切れ目ならどこでも（「ゲーム／センター」「花火／大会」）。それでも入らない長い1語だけが、言葉の途中で折り返す
    if (loose === 2) segEdge.forEach(k => cut.add(k));
    partStart.forEach(k => cut.delete(k));
    // 1文字だけのかたまり（例「…海辺の／宿」の「宿」）は前とつなげる。1文字だけが次の行に残らないように
    const sorted = [...cut].sort((x, y) => x - y), edges = [0, ...sorted, chars.length];
    for (let j = 1; j < edges.length; j++) if (edges[j] - edges[j - 1] === 1) cut.delete(edges[j] === chars.length ? edges[j - 1] : edges[j]);
    const parts = []; let cur = "";
    chars.forEach((ch, k) => { if (cut.has(k) && cur) { parts.push(cur); cur = ""; } cur += ch; });
    parts.push(cur);
    return parts;
  }
  const api = { breakParts };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YorozuNameBreaks = api;
  if (typeof require !== "undefined" && require.main === module) {
    const D = require("../data/requests.json");
    const names = new Set();
    for (const r of D.requests) for (const k in r.slots) for (const c of r.slots[k]) names.add(c.name.replace(/（〜[^）]*）$/, ""));
    const long = [...names].filter(n => [...n].length > 6);
    console.log(long.map(n => breakParts(n).join("／")).join("  "));
    console.log("\n長い名前", long.length, "／折り返し場所なし", long.filter(n => breakParts(n).length === 1).length);
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
