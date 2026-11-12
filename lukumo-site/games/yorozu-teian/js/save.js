// よろず提案所：セーブ（ブラウザの localStorage に1つだけ保存する）
// 画面を触らない計算だけのファイル。ゲーム本体と node のテストの両方で使う
// 形を変えるときは VERSION を上げ、MIGRATE に「古い版 → 1つ新しい版」に直す関数を足す
(function (root) {
  const KEY = "yorozu-teian.save";
  const BROKEN_KEY = KEY + ".broken";
  const VERSION = 1;

  // 保存する中身のひな形（docs/第1段_設計.md「1. セーブ」）
  function blank() {
    return {
      v: VERSION,
      savedAt: null,
      game: {
        day: 1, timeIdx: 0, today: [], dayAverages: [], history: {}, regulars: [], met: [],
        schedule: { seed: 0, days: {} }, perfect: [], rank: { level: 1, streak: 0 },
        tutorial: { done: [], firstDone: false }, playedOnce: false
      },
      // hairColor：髪の色（人と宇宙人）。null は「前の決まり（肌の色に合わせた色）」。読み込むときに js/game.js が番号に直す
      player: { name: "所長", body: "human", color: 0, hair: 0, hairColor: null, eyes: 0, mouth: 0, iconBg: 0, wear: { head: null, body: null, hand: null } },
      items: {},
      deco: { shelf: [null, null, null], wall: [null, null] }
    };
  }

  const MIGRATE = {
    // 例：2: d => { d.game.newField = 0; return d; }
  };

  const isObj = x => x !== null && typeof x === "object" && !Array.isArray(x);
  const isInt = (x, min) => Number.isInteger(x) && x >= (min ?? 0);

  // 形を確かめる。足りない項目はひな形で補い、型が違うものは読めないデータとして扱う
  function normalize(d) {
    if (!isObj(d) || !isObj(d.game)) throw new Error("形が違います");
    const b = blank();
    const g = Object.assign(b.game, d.game);
    if (!isInt(g.day, 1)) throw new Error("日付が読めません");
    if (!isInt(g.timeIdx)) throw new Error("時間帯が読めません");
    if (!Array.isArray(g.today) || !g.today.every(t => isObj(t) && typeof t.reqId === "string" && typeof t.total === "number")) throw new Error("今日の結果が読めません");
    if (!Array.isArray(g.dayAverages) || !g.dayAverages.every(a => a === null || typeof a === "number")) throw new Error("日ごとの平均が読めません");
    if (!isObj(g.history) || !Object.values(g.history).every(Array.isArray)) throw new Error("来店の記録が読めません");
    if (!Array.isArray(g.regulars) || !Array.isArray(g.met) || !Array.isArray(g.perfect)) throw new Error("常連・図鑑の記録が読めません");
    if (!isObj(g.schedule) || !isObj(g.schedule.days)) throw new Error("予定が読めません");
    if (!isObj(g.rank) || !isInt(g.rank.level, 1) || !isInt(g.rank.streak)) throw new Error("ランクが読めません");
    if (g.tutorial !== null && !(isObj(g.tutorial) && Array.isArray(g.tutorial.done))) throw new Error("案内の記録が読めません");
    // 時間帯は、今日すでに終えた件数と同じにそろえる（提出のあと閉じる前に保存された時のため）
    g.timeIdx = g.today.length;
    const p = Object.assign(b.player, isObj(d.player) ? d.player : {});
    p.wear = Object.assign(blank().player.wear, isObj(p.wear) ? p.wear : {});
    const items = isObj(d.items) ? d.items : {};
    if (!Object.values(items).every(c => Array.isArray(c) && c.every(n => isInt(n)))) throw new Error("品の記録が読めません");
    const deco = Object.assign(b.deco, isObj(d.deco) ? d.deco : {});
    if (!Array.isArray(deco.shelf) || !Array.isArray(deco.wall)) throw new Error("飾りつけが読めません");
    return { v: VERSION, savedAt: d.savedAt || null, game: g, player: p, items, deco };
  }

  // 文字列 → { ok:true, data } または { ok:false, reason }。どんな文字列でも例外を投げない
  function parse(text) {
    if (text == null) return { ok: false, reason: "none" };
    let d;
    try { d = JSON.parse(text); } catch (e) { return { ok: false, reason: "broken", detail: "JSONではありません" }; }
    if (!isObj(d) || !isInt(d.v, 1)) return { ok: false, reason: "broken", detail: "版番号がありません" };
    if (d.v > VERSION) return { ok: false, reason: "newer", detail: "新しい版の保存データです" };
    try {
      while (d.v < VERSION) {
        const step = MIGRATE[d.v + 1];
        if (!step) throw new Error(d.v + "版から直せません");
        d = step(d); d.v++;
      }
      return { ok: true, data: normalize(d) };
    } catch (e) { return { ok: false, reason: "broken", detail: e.message }; }
  }

  function stringify(data) {
    return JSON.stringify(Object.assign({}, data, { v: VERSION, savedAt: new Date().toISOString() }));
  }

  // storage は localStorage と同じ形（getItem/setItem/removeItem）。使えない時は null
  function storageOf(w) {
    try {
      const s = w.localStorage, k = KEY + ".test";
      s.setItem(k, "1"); s.removeItem(k);
      return s;
    } catch (e) { return null; }
  }
  // 読み込み。壊れていた時は消さずに .broken へ移す（新しく保存しても上書きされないように）
  function load(storage) {
    if (!storage) return { ok: false, reason: "unavailable" };
    let text;
    try { text = storage.getItem(KEY); } catch (e) { return { ok: false, reason: "unavailable" }; }
    const r = parse(text);
    if (!r.ok && r.reason !== "none") {
      try { storage.setItem(BROKEN_KEY, text); storage.removeItem(KEY); } catch (e) { /* 移せなくても続ける */ }
    }
    return r;
  }
  function write(storage, data) {
    if (!storage) return false;
    try { storage.setItem(KEY, stringify(data)); return true; } catch (e) { return false; }
  }
  function clear(storage) {
    if (!storage) return;
    try { storage.removeItem(KEY); } catch (e) { /* 何もしない */ }
  }

  const api = { KEY, BROKEN_KEY, VERSION, blank, parse, stringify, normalize, storageOf, load, write, clear, MIGRATE };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YorozuSave = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
