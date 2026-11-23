// よろず提案所：セーブ（ブラウザの localStorage に1つだけ保存する）
// 画面を触らない計算だけのファイル。ゲーム本体と node のテストの両方で使う
// 形を変えるときは VERSION を上げ、MIGRATE に「古い版 → 1つ新しい版」に直す関数を足す
(function (root) {
  const KEY = "yorozu-teian.save";
  const BROKEN_KEY = KEY + ".broken";
  const VERSION = 2;
  // 会社ごとに記録を持つ会社（第2段：旅行・デートとイベント）。会社を足すときはここに足す
  const COMPANIES = ["travel", "event", "life", "invest", "town"];
  const WEEK_REQUESTS = 21; // 1社の順番待ちの件数（7日分×3件）
  const PER_DAY = 3;

  // 会社ごとの記録のひな形（docs/第2段_設計.md「⑧ 保存データ v2」）
  // queue：依頼の順番待ち。order の前から pos 件が遊び終えた件、残りがこれから来る順。
  //        after は順番待ちを遊び終えたあと（8日目以降の決まり）に来た依頼
  //        plan は8日目以降の決まりで選んだ「その日の候補」{ day, ids }（js/schedule.js の nextFor）
  // dayAverages：{ 日: その日その会社で遊んだ件の平均 }
  // welcomed：その会社を初めて開いたときの案内を読んだか
  function blankCompany() {
    return {
      history: {}, regulars: [], met: [], perfect: [], rank: { level: 1, streak: 0 },
      queue: { seed: 0, order: [], pos: 0, after: [], plan: null },
      dayAverages: {}, welcomed: false
    };
  }
  const blankDeco = () => ({ shelf: [null, null, null], wall: [null, null] });
  const perCompany = f => Object.fromEntries(COMPANIES.map(c => [c, f()]));

  // 保存する中身のひな形（v2）
  function blank() {
    return {
      v: VERSION,
      savedAt: null,
      game: {
        // day・timeIdx・today・dayAverages は全体（会社をまたいだ1日3件）
        day: 1, timeIdx: 0, today: [], dayAverages: [],
        tutorial: { done: [], firstDone: false }, playedOnce: false,
        // spot：自分のキャラが今立っている場所（会社のキー）。null は道の上の最初の場所
        spot: null,
        // news：新しくもらった品の赤い丸（js/game.js の「新しい品の印」）
        news: { menu: { zukan: false, dress: false, deco: false }, zukan: [], fresh: [] },
        companies: perCompany(blankCompany)
      },
      // hairColor：髪の色（人と宇宙人）。null は「前の決まり（肌の色に合わせた色）」。読み込むときに js/game.js が番号に直す
      player: { name: "所長", body: "human", color: 0, hair: 0, hairColor: null, eyes: 0, mouth: 0, iconBg: 0, wear: { head: null, body: null, hand: null } },
      // 品は会社をまたいで1つ（品IDで旅行 it-・イベント ev- が分かれる）
      items: {},
      deco: perCompany(blankDeco)
    };
  }

  const isObj = x => x !== null && typeof x === "object" && !Array.isArray(x);
  const isInt = (x, min) => Number.isInteger(x) && x >= (min ?? 0);
  const isIds = a => Array.isArray(a) && a.every(x => typeof x === "string");

  // v1 → v2：旅行・デートしかなかった記録を、companies.travel に移す
  // - history・regulars・met・perfect・rank → companies.travel
  // - 予定 schedule { seed, days:{日:[3件]} } → 順番待ち queue。1〜7日目を日の順につなげて order、遊び終えた件数を pos
  //   8日目以降に来た（遊んだ）依頼は after。その日のまだ遊んでいない分は plan（v1 で決まっていた、その日の3件）
  // - 日ごとの平均は、全体の dayAverages のまま残し、companies.travel.dayAverages にも日ごとに写す
  // - today の各件に company:"travel"、deco は deco.travel。イベントは空の記録で始まる
  // 型が違う項目はそのまま移し、normalize で「読めない」と判定させる（直しようのないものを黙って消さない）
  function v1to2(d) {
    if (!isObj(d.game)) return d;
    const g = Object.assign({}, d.game);
    const t = blankCompany();
    ["history", "regulars", "met", "perfect", "rank"].forEach(k => { if (k in g) { t[k] = g[k]; delete g[k]; } });
    if ("schedule" in g) {
      const S = g.schedule;
      delete g.schedule;
      if (!isObj(S) || !isObj(S.days)) t.queue = null;
      else {
        const day = isInt(g.day, 1) ? g.day : 1;
        const todayN = Array.isArray(g.today) ? g.today.length : 0;
        const days = S.days, week = [];
        let full = true;
        for (let n = 1; n <= 7; n++) { if (isIds(days[n]) && days[n].length === PER_DAY) week.push(...days[n]); else full = false; }
        const q = { seed: typeof S.seed === "number" ? S.seed : 0, order: full ? week : [], pos: 0, after: [], plan: null };
        q.pos = Math.min((day - 1) * PER_DAY + todayN, WEEK_REQUESTS);
        if (day > 7) {
          for (let n = 8; n < day; n++) if (isIds(days[n])) q.after.push(...days[n]);
          if (isIds(days[day])) {
            q.after.push(...days[day].slice(0, todayN));
            q.plan = { day, ids: days[day].slice() };
          }
        }
        t.queue = q;
      }
    }
    if (Array.isArray(g.dayAverages)) g.dayAverages.forEach((a, i) => { if (typeof a === "number") t.dayAverages[i + 1] = a; });
    if (Array.isArray(g.today)) g.today = g.today.map(x => isObj(x) ? Object.assign({ company: "travel" }, x) : x);
    const ev = blankCompany();
    g.companies = { travel: t, event: ev };
    const out = Object.assign({}, d, { game: g });
    if (isObj(d.deco)) out.deco = { travel: d.deco, event: blankDeco() };
    else delete out.deco;
    return out;
  }

  const MIGRATE = {
    2: v1to2
  };

  // 会社1つ分の記録を確かめる。足りない項目はひな形で補う
  function normalizeCompany(c, name) {
    if (c !== undefined && !isObj(c)) throw new Error(name + "の記録が読めません");
    const x = Object.assign(blankCompany(), c || {});
    if (!isObj(x.history) || !Object.values(x.history).every(Array.isArray)) throw new Error("来店の記録が読めません");
    if (!Array.isArray(x.regulars) || !Array.isArray(x.met) || !Array.isArray(x.perfect)) throw new Error("常連・図鑑の記録が読めません");
    if (!isObj(x.rank) || !isInt(x.rank.level, 1) || !isInt(x.rank.streak)) throw new Error("ランクが読めません");
    if (!isObj(x.queue)) throw new Error("依頼の順番待ちが読めません");
    const q = x.queue = Object.assign(blankCompany().queue, x.queue);
    if (typeof q.seed !== "number" || !isIds(q.order) || !isInt(q.pos) || !isIds(q.after)) throw new Error("依頼の順番待ちが読めません");
    if (q.plan !== null && !(isObj(q.plan) && isInt(q.plan.day, 1) && isIds(q.plan.ids))) throw new Error("依頼の順番待ちが読めません");
    if (!isObj(x.dayAverages) || !Object.values(x.dayAverages).every(a => typeof a === "number")) throw new Error("会社ごとの平均が読めません");
    x.welcomed = x.welcomed === true;
    return x;
  }

  // 形を確かめる。足りない項目はひな形で補い、型が違うものは読めないデータとして扱う
  function normalize(d) {
    if (!isObj(d) || !isObj(d.game)) throw new Error("形が違います");
    const b = blank();
    const g = Object.assign(b.game, d.game);
    if (!isInt(g.day, 1)) throw new Error("日付が読めません");
    if (!isInt(g.timeIdx)) throw new Error("時間帯が読めません");
    if (!Array.isArray(g.today) || !g.today.every(t => isObj(t) && typeof t.reqId === "string" && typeof t.total === "number")) throw new Error("今日の結果が読めません");
    g.today = g.today.map(t => Object.assign({ company: "travel" }, t));
    if (!g.today.every(t => COMPANIES.includes(t.company))) throw new Error("今日の結果の会社が読めません");
    if (!Array.isArray(g.dayAverages) || !g.dayAverages.every(a => a === null || typeof a === "number")) throw new Error("日ごとの平均が読めません");
    const cs = d.game.companies;
    if (cs !== undefined && !isObj(cs)) throw new Error("会社ごとの記録が読めません");
    g.companies = Object.fromEntries(COMPANIES.map(c => [c, normalizeCompany((cs || {})[c], c)]));
    if (g.tutorial !== null && !(isObj(g.tutorial) && Array.isArray(g.tutorial.done))) throw new Error("案内の記録が読めません");
    if (typeof g.spot !== "string") g.spot = null;
    // 新しい品の印は、読めなければ印なしで続ける（遊びには関わらないので、読めないデータにはしない）
    const n = isObj(g.news) ? g.news : {}, nm = isObj(n.menu) ? n.menu : {};
    g.news = { menu: { zukan: nm.zukan === true, dress: nm.dress === true, deco: nm.deco === true }, zukan: isIds(n.zukan) ? n.zukan : [], fresh: isIds(n.fresh) ? n.fresh : [] };
    // 時間帯は、今日すでに終えた件数と同じにそろえる（提出のあと閉じる前に保存された時のため）
    g.timeIdx = g.today.length;
    const p = Object.assign(b.player, isObj(d.player) ? d.player : {});
    p.wear = Object.assign(blank().player.wear, isObj(p.wear) ? p.wear : {});
    const items = isObj(d.items) ? d.items : {};
    if (!Object.values(items).every(c => Array.isArray(c) && c.every(n => isInt(n)))) throw new Error("品の記録が読めません");
    const src = isObj(d.deco) ? d.deco : {};
    const deco = Object.fromEntries(COMPANIES.map(c => {
      const x = Object.assign(blankDeco(), isObj(src[c]) ? src[c] : {});
      if (!Array.isArray(x.shelf) || !Array.isArray(x.wall)) throw new Error("飾りつけが読めません");
      return [c, x];
    }));
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
        const v = d.v;
        d = step(d); d.v = v + 1;
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

  const api = { KEY, BROKEN_KEY, VERSION, COMPANIES, blank, blankCompany, blankDeco, parse, stringify, normalize, storageOf, load, write, clear, MIGRATE };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YorozuSave = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
