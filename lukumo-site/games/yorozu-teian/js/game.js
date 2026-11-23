// よろず提案所：画面の進行（ホーム→事務所→提案書→結果→…→1日の集計→次の日へ。日付は終わりなく続く）
(function () {
  "use strict";
  const { SLOTS, SLOT_NAMES, scoreProposal, reactionOf, dayAverage, condOk, isHonne } = window.YorozuScore;
  const DATA = window.YOROZU_DATA;
  const $ = id => document.getElementById(id);
  // 絵（svg/*.js）。読み込めなかった時は仮の図形のまま遊べる
  const ART = window.YorozuArt || {};
  const UI = ART.ui || null;
  const clientIdOf = c => Object.keys(DATA.clients).find(k => DATA.clients[k] === c);
  // ライフプランの欄のアイコン（家・かばん・コインの入ったびん・星。docs/第3段_設計.md 6-3）。ほかの会社は今までのアイコン
  const LIFE_ICON = {
    destination: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11L12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/></g></svg>',
    activity: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="8" width="17" height="11" rx="2"/><path d="M9 8V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2M3.5 13h17"/></g></svg>',
    food: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3.5h8M9 3.5v3L6.5 9.5V19a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5V9.5L15 6.5v-3"/><circle cx="10.5" cy="16" r="1.8"/><circle cx="13.8" cy="12.8" r="1.8"/></g></svg>',
    surprise: '<svg viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8L3.6 9.6l5.8-.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
  };
  // 投資・町おこしの欄のアイコンは svg/ui.js（docs/第4段_第5段_設計.md 6-3）
  const COMPANY_ICONS = () => ({ life: LIFE_ICON, invest: ART.SLOT_ICONS_INVEST, town: ART.SLOT_ICONS_TOWN });
  const slotIcon = s => { const set = COMPANY_ICONS()[state.company]; return set && set[s] ? set[s] : UI ? UI.slotIcon(s) : SLOT_ICON[s]; };
  // カードの絵：カードごとの art（svg/cards-*.js のモチーフ）→ なければ欄ごとの絵
  const cardArt = (s, i, card) => {
    const m = card && card.art && ART.cardMotifs && ART.cardMotifs[card.art];
    return m || (UI ? UI.cardArt(s, i) : SLOT_ICON[s]);
  };
  const checkMark = () => `<span class="check" aria-label="選択済み">${UI ? UI.check() : ""}</span>`;
  const TIMES = ["朝", "昼", "夜"];
  const REACTION_LABEL = { great: "大喜び！", ok: "まあまあ", poor: "いまいち…" };
  const RANK_DAYS = 5, RANK_AVG = 70;
  // セーブ（js/save.js）。読み込めない時や保存できない時も、止まらずに遊べる
  const SAVE = window.YorozuSave || null;
  // もらえる品（js/rewards.js と data/items.js）
  const RW = window.YorozuRewards;
  const RK = window.YorozuRank;
  const ITEMS = window.YOROZU_ITEMS || { items: [], speciesGroups: {}, groupNames: {} };
  const STORE = SAVE ? SAVE.storageOf(window) : null;
  const NO_TUTORIAL = new URLSearchParams(location.search).get("tutorial") === "off";
  const NO_SAVE = Number(new URLSearchParams(location.search).get("day")) >= 1;
  const PC = window.matchMedia("(min-width: 900px) and (orientation: landscape)");
  const SLOT_ICON = {
    destination: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6l3.5 10L12 14l-3.5 2z" fill="currentColor"/></svg>',
    activity: '<svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="2.4" fill="currentColor"/><path d="M8 10l-3 4m3-4l4 2 3-3m-7 1l1 6-3 4m3-4l5 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    food: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 4v7m0-7v16M21 4c-2 2-2 6 0 7v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    surprise: '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M12 10v10M12 10c-3-5-7-3-4-1m4 1c3-5 7-3 4-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  // 依頼の順番は js/schedule.js で作り、会社ごとの保存データ（state.companies[会社].queue）に入れる
  // 会社ごとに21件の順番待ち（最初の3件は固定・あとは乱数）。その会社を選ぶたびに次の1件が来る。21件のあとは8日目以降の決まり
  // 開発用：?schedule=fixed でデータの day・time どおりの順（テストと試遊の再現用。8日目以降は乱数の種0で決める）
  const SCHED = window.YorozuSchedule;
  const FIXED = new URLSearchParams(location.search).get("schedule") === "fixed";
  const DAYS = [...new Set(DATA.requests.map(r => r.day))].sort((a, b) => a - b);
  const PER_DAY = SCHED.PER_DAY;
  const reqById = id => DATA.requests.find(r => r.id === id);
  const newSeed = () => FIXED ? 0 : 1 + Math.floor(Math.random() * 2147483646);
  // 会社（第2段）。記録は会社ごと（ランク・常連・図鑑・順番待ち・飾りつけ）。品の持ち物と日付・1日3件は全体で1つ
  // 遊べるのは旅行・デートとイベント。1件ごとにホームで会社を選ぶ（1日の中で混ぜてよい）
  const COMPANIES = SAVE ? SAVE.COMPANIES : ["travel", "event"];
  const COMPANY_NAMES = { travel: "旅行・デート", event: "イベント", life: "ライフプラン", invest: "投資", town: "町おこし" };
  // 投資の印は芽（応援して育てる。2026-11-22 持ち主の指示で ¥ から替えた。文字にない形なので小さな絵）
  const SPROUT = '<svg class="mk-svg" viewBox="-14 -14 28 28" aria-hidden="true" fill="currentColor"><path d="M-1.6 12V-2h3.2V12Z"/><path d="M-1-1C-5-1-11-4-12-11C-5-12-1-7-1-1Z"/><path d="M1-3C1-9 5-14 12-13C12-6 7-3 1-3Z"/><ellipse cx="0" cy="12" rx="9" ry="2.5"/></svg>';
  const COMPANY_MARK = { travel: "✈", event: "◎", life: "⌂", invest: SPROUT, town: "⚑" };
  // イベントは2日目から選べる（1日目は旅行・デートの案内のため。docs/第2段_設計.md ⑦）。前の記録で2日目以降なら、つづきからすぐ選べる
  const EVENT_FROM_DAY = 2;
  // ライフプランは3日目から（第3段。1日に1社ずつ増やす。docs/第3段_設計.md 2章）
  const LIFE_FROM_DAY = 3;
  // 投資は4日目から、町おこしは5日目から（第4段・第5段。1日に1社ずつ増やす）
  const OPEN_FROM = { travel: 1, event: EVENT_FROM_DAY, life: LIFE_FROM_DAY, invest: 4, town: 5 };
  // 依頼データのない会社は開かない（作りかけの会社を押しても止まらないように）
  const isOpen = c => state.day >= (OPEN_FROM[c] || Infinity) && requestsFor(c).length > 0;
  // 欄の名前は会社ごと（欄のキーと点数の決まりは全社同じ）。イベント：会場・出し物・料理・サプライズ
  const SLOT_LABELS = { travel: SLOT_NAMES, event: { destination: "会場", activity: "出し物", food: "料理", surprise: "サプライズ" },
    life: { destination: "住まい", activity: "はたらき方", food: "たくわえ", surprise: "たのしみ" },
    invest: { destination: "応援先", activity: "お金の分け方", food: "見守り方", surprise: "お礼" },
    town: { destination: "場所", activity: "呼びもの", food: "広め方", surprise: "つづけ方" } };
  const slotName = (s, c) => (SLOT_LABELS[c || state.company] || SLOT_NAMES)[s];
  // その会社を初めて開いたときの案内（事務所の中に1回だけ。companies.*.welcomed に残す）
  const WELCOME = { event: "イベント会社へようこそ。会場・出し物・料理・サプライズの4つを選ぶよ。人数にも気をつけてね",
    life: "ライフプランの会社へようこそ。住まい・はたらき方・たくわえ・たのしみの4つを選ぶよ。何年先の計画かにも気をつけてね",
    invest: "投資の会社へようこそ。町の店や人の夢を応援するよ。応援先・お金の分け方・見守り方・お礼の4つを選んでね。応援する相手の数にも気をつけてね",
    town: "町おこしの会社へようこそ。場所・呼びもの・広め方・つづけ方の4つを選ぶよ。季節にも気をつけてね" };
  // 会社だけの条件（js/score.js の CONDS と同じキー）の見せ方：期間（ライフプラン）・応援する相手の数（投資）・季節（町おこし）
  //   cond：予算の横の文／cap：カードの名前の下の1行（幅360pxのスマホでもカードに収まる長さ）／miss：結果の △ の理由／legend：凡例の △
  //   label：予算の見出し／help：「点数について」の1行の id
  const SPREAD = { one: { long: "1つに集中して応援", short: "1つ" }, few: { long: "2〜3に分けて応援", short: "2〜3" }, many: { long: "たくさんに少しずつ応援", short: "多く" } };
  const SEASONS = ["春", "夏", "秋", "冬"];
  const COND_UI = {
    period: { cond: b => `${b.period}年後までの計画`, cap: c => `${c.periods.join("・")}年`, miss: "期間に合わない", legend: "本音とは別・期間に合わない", label: "毎月の予算", help: "help-period" },
    spread: { cond: b => SPREAD[b.spread].long, cap: c => c.spreads.length >= 3 ? "どれでも" : Object.keys(SPREAD).filter(k => c.spreads.includes(k)).map(k => SPREAD[k].short).join("・"),
      miss: "相手の数に合わない", legend: "本音とは別・相手の数に合わない", label: "応援に出せるお金", help: "help-spread" },
    season: { cond: b => `${b.season}の町おこし`, cap: c => c.seasons.length >= 4 ? "一年中" : SEASONS.filter(k => c.seasons.includes(k)).join("・"),
      miss: "季節に合わない", legend: "本音とは別・季節に合わない", label: "予算", help: "help-season" }
  };
  const CARD_KEY = window.YorozuScore.CONDS;
  const condKeyOf = r => r && r.budget ? Object.keys(COND_UI).find(k => r.budget[k] != null) : null;
  // 予算の横の条件：旅行・デートは日数（budget.duration）、イベントは人数（budget.people。例「10人の会」）、ほかは会社だけの条件
  const conditionOf = b => { const k = condKeyOf({ budget: b }); return k ? COND_UI[k].cond(b) : b.people ? `${b.people}${b.peopleUnit || "人"}の会` : (b.duration || ""); };
  // カードの向いている○○（名前の下の1行。会場の広さと同じ場所）
  const condCap = (c, r) => { const k = condKeyOf(r); return k && Array.isArray(c[CARD_KEY[k]]) ? COND_UI[k].cap(c) : ""; };
  // 本音のタグに合うのに、条件に向かないカード（結果の △ の理由）
  const condMiss = (card, req) => !!condKeyOf(req) && card.tags.some(t => req.honneTags.includes(t)) && !condOk(card, req);
  // ---- 新しい品の印（赤い丸。2026-11-19 持ち主の指示） ----
  // menu：メニューの中の「図鑑・着せ替え・飾る」の丸。その画面を開いたら消える。メニューのボタンの丸は、このどれかがあるとき
  // zukan：図鑑で丸を付ける品（品ID:色）。図鑑を閉じたら消える（図鑑の品は押せないため）
  // fresh：着せ替え・飾るで丸を付ける品（品ID:色）。その品を選んだら消える。品のあるタブ・飾る場所にも丸
  function blankNews() { return { menu: { zukan: false, dress: false, deco: false }, zukan: [], fresh: [] }; }
  const ND = (id, label) => `<span class="nd"${id ? ` data-testid="${id}"` : ""} role="img" aria-label="${label || "新しい品"}"></span>`;
  const isFresh = v => state.news.fresh.includes(v);
  function markNewItem(got) {
    const it = got.item, v = it.id + ":" + got.color, n = state.news;
    n.menu.zukan = true; n.menu[it && it.use === "wear" ? "dress" : "deco"] = true;
    if (!n.zukan.includes(v)) n.zukan.push(v);
    if (!n.fresh.includes(v)) n.fresh.push(v);
  }
  function drawMenuDots() {
    const m = state.news.menu;
    $("menu-new").hidden = !(m.zukan || m.dress || m.deco);
    ["zukan", "dress", "deco"].forEach(k => { $("menu-" + k + "-new").hidden = !m[k]; });
  }
  // 会場の広さ（名前の「（〜10人）」）が依頼の人数より小さいか。人数が入りきらない会場は、データで本音のタグを持たない
  const tooSmall = (card, req) => { const m = req.budget.people && /（〜(\d+)[^）]*）$/.exec(card.name); return !!m && +m[1] < req.budget.people; };
  const companyOfReq = r => r.company || "travel";
  const companyOfItem = i => i.company || "travel";
  const requestsFor = c => DATA.requests.filter(r => companyOfReq(r) === c);
  function newCompany() {
    return SAVE ? SAVE.blankCompany() : { history: {}, regulars: [], met: [], perfect: [], rank: { level: 1, streak: 0 }, queue: { seed: 0, order: [], pos: 0, after: [], plan: null }, dayAverages: {}, welcomed: false };
  }
  const newDeco = () => SAVE ? SAVE.blankDeco() : { shelf: [null, null, null], wall: [null, null] };
  // その会社の順番待ち。まだ作っていなければ（新しく始めた時・依頼が増えた会社）、種から作る
  function queueOf(c) {
    const q = state.companies[c].queue;
    if (!q.order.length) {
      const reqs = requestsFor(c);
      if (reqs.length) {
        try { q.order = FIXED ? SCHED.fixedQueue(reqs) : SCHED.buildQueue(reqs, q.seed); }
        catch (e) { q.order = SCHED.fixedQueue(reqs); }
      }
    }
    return q;
  }
  // 次にその会社に来る依頼（来た日と時間帯は今のものに置きかえる）。来る依頼がなければ null
  // 8日目以降の決まりで選んだその日の候補（plan）は、すぐ順番待ちに入れておく（その日のうちに選び直さないため）
  function nextRequest(c) {
    const q = queueOf(c), C = state.companies[c];
    const res = SCHED.nextFor({
      company: c, requests: requestsFor(c), queue: q, day: state.day,
      today: state.today.map(t => ({ company: t.company || "travel", reqId: t.req.id, clientId: t.req.clientId })),
      regulars: C.regulars, perfect: C.perfect,
      // どの会社でも遊び終えた依頼（イベントの依頼の needs を確かめるため）
      played: COMPANIES.flatMap(k => { const Q = queueOf(k); return Q.order.slice(0, Q.pos).concat(Q.after || []); })
        .concat(state.today.map(t => t.req.id))
    });
    if (!res) return null;
    if (res.plan) q.plan = res.plan;
    return Object.assign({}, reqById(res.id), { day: state.day, time: TIMES[Math.min(state.timeIdx, TIMES.length - 1)], company: c });
  }

  const state = {
    day: 1, timeIdx: 0, req: null, client: null, lines: [], lineIndex: 0,
    budget: 0, bonus: 0, picks: {}, activeSlot: SLOTS[0], result: null,
    today: [],          // 今日の結果 [{company, req, total, stars}]（会社をまたいで1日3件）
    dayAverages: [],    // 日ごとの平均（全体）
    // 会社ごとの記録 { travel: {history, regulars, met, perfect, rank, queue, dayAverages, welcomed}, event: {…} }（js/save.js の blankCompany）
    //   history：clientId → [{reqId, day, time, total, picks:[名前]}]／regulars：常連になった clientId
    companies: Object.fromEntries(COMPANIES.map(c => [c, newCompany()])),
    company: "travel",  // 今の会社（遊んでいる依頼の会社＝最後に入った会社。図鑑・飾るを開いたときもまずこの会社）
    decos: Object.fromEntries(COMPANIES.map(c => [c, newDeco()])), // 会社ごとの飾りつけ { travel: {shelf, wall}, event: {…} }
    detailFrom: null,
    tutorial: null,     // 1日目の案内の進み具合
    playedOnce: false,  // 前の記録で1日目の案内を終えたか（はじめからの2周目は案内をとばせる）
    player: null, items: {},
    news: blankNews(),  // 新しくもらった品の赤い丸（下の「新しい品の印」）
    spot: null          // 自分のキャラが今立っている会社（null は道の上の最初の場所）。同じ会社へは歩かない
  };
  // 今の会社の記録を、前と同じ名前でも読み書きできるようにする（state.history・state.rank・state.deco など）
  ["history", "regulars", "met", "perfect", "rank"].forEach(k => Object.defineProperty(state, k, {
    enumerable: true, get: () => state.companies[state.company][k], set: v => { state.companies[state.company][k] = v; }
  }));
  Object.defineProperty(state, "deco", { enumerable: true, get: () => state.decos[state.company], set: v => { state.decos[state.company] = v; } });
  const day = () => state.day;

  // ---- セーブ ----
  function snapshot() {
    const t = state.tutorial;
    return {
      game: {
        day: state.day, timeIdx: state.today.length,
        today: state.today.map(x => ({ company: x.company || (x.req && x.req.company) || "travel", reqId: x.req.id, total: x.total, stars: x.stars })),
        dayAverages: state.dayAverages.map(a => a ?? null),
        tutorial: t ? { done: [...t.done], firstDone: !!t.firstDone } : null, playedOnce: state.playedOnce, spot: state.spot,
        news: state.news,
        companies: state.companies
      },
      player: state.player, items: state.items, deco: state.decos
    };
  }
  // 結果が出た時・閉じた時・次の日へ進んだ時に呼ぶ。保存できなくても遊びは止めない
  function persist() {
    if (!SAVE || NO_SAVE) return;
    if (SAVE.write(STORE, snapshot())) flashSaveMark();
  }
  // 保存できたときだけ、上の帯に小さな印を少しのあいだ出す（文字の通知や確認の画面は出さない）
  let saveMarkTimer = 0;
  function flashSaveMark() {
    const m = $("save-mark");
    // 帳面に丸のしるし（保存したよ）。均一な塗りで、光る効果はなし
    if (!m.innerHTML) m.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="14" height="18" rx="2" fill="#fff" stroke="#34414f" stroke-width="2"/><path d="M7.5 8h7M7.5 11.5h5" fill="none" stroke="#9aa6b1" stroke-width="1.8" stroke-linecap="round"/><circle cx="17" cy="17" r="5.5" fill="#5cb87a" stroke="#34414f" stroke-width="1.8"/><path d="M14.6 17.1l1.7 1.7 3-3.2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    m.hidden = false;
    m.classList.remove("on"); void m.offsetWidth; m.classList.add("on");
    clearTimeout(saveMarkTimer);
    saveMarkTimer = setTimeout(() => { m.hidden = true; m.classList.remove("on"); }, 1600);
  }
  // 保存データ（v2。js/save.js の normalize を通したもの）を読み込む
  function restore(d) {
    const g = d.game;
    state.companies = g.companies;
    state.decos = d.deco;
    // 今の会社は、自分のキャラが立っている会社＝最後に入った会社（まだどこにも入っていなければ旅行・デート）
    state.company = COMPANIES.includes(g.spot) ? g.spot : "travel";
    COMPANIES.forEach(c => { const q = g.companies[c].queue; if (!q.seed && !FIXED) q.seed = newSeed(); queueOf(c); });
    Object.assign(state, {
      day: g.day, timeIdx: g.today.length,
      today: g.today.map((x, i) => ({ company: x.company, req: Object.assign({}, reqById(x.reqId), { day: g.day, time: TIMES[i] || TIMES[2], company: x.company }), total: x.total, stars: x.stars })),
      dayAverages: g.dayAverages.slice(),
      tutorial: g.tutorial && !NO_TUTORIAL ? { done: new Set(g.tutorial.done), current: null, firstDone: g.tutorial.firstDone } : null,
      playedOnce: g.playedOnce, spot: g.spot, player: fixPlayer(d.player), items: d.items, news: g.news
    });
  }

  // ---- 表示用の小道具 ----
  function money(n, unit) { return unit === "円" ? n.toLocaleString("ja-JP") + "円" : unit + " " + n.toLocaleString("ja-JP"); }
  // 値段の表示（カード・欄・上の合計）。数字は太く大きく、単位は小さく。数字は途中で折り返さない（.num は nowrap）
  //   円は「1,000円」のまま1行。ほかの単位（つゆのしずく など）は、入りきらなければ単位だけが上の行に出る（単位も途中で切らない）
  //   文字だけを読むと money() と同じ（間の空白は表示では消える）
  function moneyHtml(n, unit) {
    const num = `<b class="num">${n.toLocaleString("ja-JP")}</b>`;
    return unit === "円" ? `<span class="money yen">${num}<span class="unit">円</span></span>`
      : `<span class="money"><span class="unit">${unit}</span> ${num}</span>`;
  }
  function points(n) { return Number.isInteger(n) ? String(n) : n.toFixed(1); }
  function starHtml(n) { return [1, 2, 3].map(k => `<span class="star${k <= n ? " on" : ""}${UI ? " has-art" : ""}" aria-hidden="true">${UI ? UI.star(k <= n) : ""}</span>`).join(""); }
  function show(id) {
    document.querySelectorAll(".screen").forEach(s => { s.hidden = s.id !== id; });
    document.body.dataset.screen = id;
    window.scrollTo(0, 0);
  }
  function face(el, client, mood) {
    el.className = el.className.replace(/\b(sp|mood)-\S+/g, "").trim() + ` sp-${client.species} mood-${mood}`;
    el.dataset.mood = mood;
    if (ART.character) { el.classList.add("has-art"); el.innerHTML = ART.character(clientIdOf(client), mood); }
  }
  function setTop(time, done) {
    $("day-label").textContent = day() + "日目";
    $("time-label").textContent = time;
    $("app").dataset.time = time;
    if (UI) $("time-icon").innerHTML = UI.timeIcon(time);
    const total = PER_DAY;
    $("progress-label").textContent = done + "/" + total + "件";
    $("progress-bar").style.width = (done / total * 100) + "%";
  }

  // ---- チュートリアル（1日目の1件目で順に案内） ----
  // allow：案内中に押せる部品（ここだけ明るく・強調）／spot：押せないが明るく見せる説明の対象
  // 見せ方の決まり：操作する段は押す部品だけ明るく（spot なし）。読む段は説明の対象と「わかった」だけ明るく
  // ホームだけは建物が街の絵の中にあるので、街を明るく出して建物のまわりを影で暗くする
  // allow に coach-ok があるときだけ「わかった」を出す。ほかの部品は薄くして押せなくする
  const COACH = {
    home: { text: "ここは人だけでなく様々な生き物が相談しに来る不思議な街。屋根に飛行機の看板がある「旅行・デート」の会社をタップして、事務所に入ろう。", allow: ["#company-travel"], spot: ["#city"] },
    office: { text: "依頼者の話をよく聞こう。表向きの希望とは別に、言葉のはしに「本音」がかくれているよ。「つぎへ」で話を進めよう。", allow: ["#talk-next"], quiet: ["#talk-bubble"] },
    score: { text: "点数は100点満点。本音に合うカード1枚ごとに12.5点（最大50点）、予算を守れば30点、苦手なものは20点から、苦手なものが入ったカード1枚ごとに5点減る。", allow: ["#coach-ok"], spot: ["#budget"] },
    slot: { text: "提案書には4つの欄がある。青い枠の欄に入れるカードを選ぶよ。欄をタップすると、その欄を選び直せる。", allow: ["#coach-ok"], spot: ["#slots"] },
    card: { text: "下の候補から1枚タップ。上の「残り」で予算を確かめよう。日数に合うかも大事。", allow: ["#cards"] },
    fill: { text: "残りの欄も同じように選ぼう。欄をタップすると、その欄を選び直せるよ。", allow: ["#slots", "#cards"] },
    // 3枚目・4枚目は吹き出しを出さず、欄とカード以外は押せないまま選んでもらう
    fill2: { text: "", allow: ["#slots", "#cards"], silent: true },
    submit: { text: "4つの欄がうまったら「提出する」。合計が予算をこえると、予算の30点がもらえないよ。", allow: ["#submit"] },
    result: { text: "選んだカードの◎は本音に合った札、△は本音とは別、×は苦手な札。49点以下のときや、本音に合うカードが1枚もないときは、依頼者が本当の気持ちを教えてくれる。依頼者がとても喜ぶと、お礼の品をもらえることがあります。", allow: ["#coach-ok"], spot: [".picks-panel"] },
    close: { text: "「閉じる」でホームにもどろう。案内はここまで。2件目からは自由に遊べるよ。", allow: ["#close-result"] },
    summary: { text: "1日の点数は3件の平均。平均70点以上の日を5日連続で続けるとランクアップだよ。途中で70点を下回ると0日にもどるよ。", allow: ["#coach-ok"], spot: ["div.summary-avg"] }
  };
  function unlock() {
    document.body.classList.remove("tut-lock");
    document.querySelectorAll(".tut-lift, .tut-allow, .coach-target, .tut-spot").forEach(e => e.classList.remove("tut-lift", "tut-allow", "coach-target", "tut-spot"));
  }
  function coach(step) {
    const box = $("coach");
    unlock();
    if (!state.tutorial || !step || state.tutorial.done.has(step)) { box.hidden = true; return; }
    const c = COACH[step];
    state.tutorial.current = step;
    $("coach-text").textContent = c.text;
    $("coach-ok").hidden = !c.allow.includes("#coach-ok");
    // 2周目からは「案内をとばす」を出す
    $("coach-skip").hidden = !state.playedOnce;
    $("coach-hint").textContent = c.allow.includes("#coach-ok") ? "読んだら「わかった」を押して進もう" : "オレンジに光っているところを押して進もう";
    box.hidden = !!c.silent;
    const screen = document.getElementById(document.body.dataset.screen || "");
    // PC：提案書と結果は左の列に余白があるので左へ、ほかは右の列の先頭に置く（縦にはみ出さないため）
    const col = screen && ["screen-proposal", "screen-result"].includes(screen.id) ? ".col-a" : ".col-b";
    const side = PC.matches && screen && screen.querySelector(col);
    if (side) side.prepend(box); else if (box.parentElement !== $("app")) $("app").prepend(box);
    // 案内中は、押す部品と説明の対象だけを幕の上に出す
    document.body.classList.add("tut-lock");
    box.classList.add("tut-lift");
    c.allow.forEach(sel => { const e = document.querySelector(sel); if (e) e.classList.add("tut-lift", "tut-allow", "coach-target"); });
    // quiet：押せるが光らせない（事務所の会話文。押しても話が進む）
    (c.quiet || []).forEach(sel => { const e = document.querySelector(sel); if (e) e.classList.add("tut-lift", "tut-allow"); });
    $("coach-skip").classList.add("tut-allow");
    (c.spot || []).forEach(sel => { const e = document.querySelector(sel); if (e) e.classList.add("tut-lift", "tut-spot"); });
  }
  // 案内中は、押してよい部品以外のクリックを止める（キーボード操作も含む）
  document.addEventListener("click", e => {
    if (!document.body.classList.contains("tut-lock")) return;
    if (e.target.closest(".tut-allow")) return;
    e.preventDefault(); e.stopPropagation();
  }, true);
  function coachDone(step) {
    if (!state.tutorial) return;
    state.tutorial.done.add(step);
    if (state.tutorial.current === step) coach(null);
  }

  // ---- ホーム ----
  let cityDrawn = null;
  // PC横は街の周りまで描いた引きの絵（wide）を使う。建物の配置はスマホと同じ座標
  const CITY_VIEW = { phone: [0, 0, 600, 800], pc: [-161, 0, 922, 1000], pcCrop: [0, 110, 600, 650] };
  function drawCity(time) {
    const mode = PC.matches ? "pc" : "phone";
    if (cityDrawn === time + mode) return;
    cityDrawn = time + mode;
    let svg = mode === "pc" ? ART.city(time, { wide: true }) : ART.city(time);
    let view = CITY_VIEW[mode];
    if (mode === "pc" && !svg.includes('viewBox="-161 0 922 1000"')) {
      // 引きの絵がない古い city.js のときは、上下を切って代用
      view = CITY_VIEW.pcCrop;
      svg = ART.city(time).replace('viewBox="0 0 600 800"', `viewBox="${view.join(" ")}"`);
    }
    const [vx, vy, vw, vh] = view;
    cityView = view;
    const city = $("city");
    city.classList.add("has-art");
    city.dataset.view = mode;
    city.querySelector(".city-bg").innerHTML = svg;
    // 会社のボタンを絵の建物の位置に重ねる（絵の座標 → %）
    Object.entries(ART.CITY_COMPANIES || {}).forEach(([key, p]) => {
      const b = city.querySelector(`[data-company="${key}"]`);
      if (!b) return;
      b.style.left = ((p.x - vx) / vw * 100) + "%";
      b.style.top = ((p.y - vy) / vh * 100) + "%";
    });
  }
  PC.addEventListener("change", () => { if (document.body.dataset.screen === "screen-home" && ART.city) drawCity($("city").dataset.time); });
  function goHome() {
    const time = TIMES[Math.min(state.timeIdx, TIMES.length - 1)];
    setTop(time, state.timeIdx);
    $("city").dataset.time = time;
    if (ART.city) drawCity(time);
    drawMenuDots();
    drawMe();
    drawLogos();
    // イベントは2日目から、ライフプランは3日目から、投資は4日目から、町おこしは5日目から。その日より前は建物に「○日目から」と出して押せない
    COMPANIES.filter(co => OPEN_FROM[co] > 1).forEach(co => {
      const b = $("company-" + co);
      b.disabled = !isOpen(co);
      b.setAttribute("aria-disabled", String(b.disabled));
      // 開いた会社は文字も空にする（画面では隠れていても、ページを読み取る道具には「○日目から」が残って見えた。2026-11-23 試遊第10回）
      b.querySelector(".soon").textContent = b.disabled ? `${OPEN_FROM[co]}日目から` : "";
      b.querySelector(".soon").hidden = !b.disabled;
    });
    // 依頼者が来ている会社の上に、次に来る依頼者の小さな顔（その会社の順番待ちの次の1件）と人数の札（①②③）
    // 人数は会社ごとの「その会社で今日待っているお客さんの数」＝ 1日3件 − 今日その会社で遊んだ件数（2026-11-19 試遊第8回を受けて。
    // 前は2社に同じ数を出していて、行っていない会社の数も減っていた）。1日3件で終わるのは同じ。1日の終わりは顔も札も消す
    const next = {}, leftOf = {};
    const dayLeft = Math.max(0, PER_DAY - state.today.length);
    if (state.timeIdx < PER_DAY && dayLeft > 0) COMPANIES.forEach(c => {
      if (!isOpen(c)) return;
      leftOf[c] = Math.max(0, PER_DAY - state.today.filter(t => (t.company || "travel") === c).length);
      const r = leftOf[c] > 0 && nextRequest(c); if (r) next[c] = r;
    });
    const circled = n => n > 0 && n <= 20 ? String.fromCharCode(0x245F + n) : String(n);
    document.querySelectorAll("#city .waiting").forEach(el => {
      const key = el.closest(".company").dataset.company, r = next[key], left = r ? leftOf[key] : 0;
      const cnt = el.closest(".company").querySelector(".count");
      el.hidden = !r;
      el.dataset.count = r ? left : 0;
      el.classList.toggle("face", !!(r && ART.character));
      // 人数の札：顔の絵があるときは顔の右上に小さく。絵がないときは顔の場所に数字だけ（札は出さない）
      if (cnt) {
        cnt.hidden = !(r && ART.character);
        cnt.dataset.count = r ? left : 0;
        if (cnt.hidden) { cnt.textContent = ""; cnt.removeAttribute("aria-label"); cnt.removeAttribute("role"); }
        else { cnt.textContent = circled(left); cnt.setAttribute("role", "img"); cnt.setAttribute("aria-label", `お客さん${left}人`); }
      }
      if (!r) { el.textContent = ""; el.removeAttribute("aria-label"); el.removeAttribute("role"); delete el.dataset.client; return; }
      const c = DATA.clients[r.clientId];
      el.dataset.client = r.clientId;
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", `次の依頼者：${c.name}`);
      el.innerHTML = ART.character ? ART.character(r.clientId, "normal") : circled(left);
    });
    // 下の文：2社以上から選べるときは「どの会社へ行きますか？」（第3段で3社になったため。1日目は旅行・デートだけなので今までの文）
    const open = Object.keys(next);
    $("home-note").textContent = open.length >= 2 ? `${day()}日目の${time}。どの会社へ行きますか？` : `${day()}日目の${time}。${COMPANY_NAMES[open[0] || "travel"]}の会社に依頼者が来ています。`;
    // 今日の3件（朝・昼・夜）。遊んだ件は会社の印（✈／◎）と依頼者と点数、これからの件は名前を出さない
    $("today-list").innerHTML = TIMES.slice(0, PER_DAY).map((t, i) => {
      const done = state.today[i], co = done && (done.company || "travel");
      const label = done ? `<span class="co-mark" data-company="${co}" role="img" aria-label="${COMPANY_NAMES[co]}">${COMPANY_MARK[co]}</span>${DATA.clients[done.req.clientId].name}　${points(done.total)}点` : i === state.timeIdx ? "依頼者が来ています" : "これから";
      return `<li class="${done ? "done" : i === state.timeIdx ? "now" : ""}"${co ? ` data-company="${co}"` : ""}><span class="t">${t}</span><span>${label}</span></li>`;
    }).join("");
    show("screen-home");
    placeWalker();
    if (tutorialNow()) coach("home"); else coach(null);
  }

  // ---- 事務所 ----
  // ほかの会社の依頼（needs）を遊んだときの点数の帯（great/ok/poor）。記録がなければ ok
  function crossBandOf(req) {
    const need = reqById(req.needs);
    if (!need) return "ok";
    const C = state.companies[companyOfReq(need)];
    const past = (C && C.history[req.clientId] || []).filter(h => h.reqId === req.needs);
    const last = past[past.length - 1];
    return last && typeof last.total === "number" ? reactionOf(last.total) : "ok";
  }
  function startRequest(req) {
    state.company = req.company || "travel";
    state.req = req;
    state.client = DATA.clients[req.clientId];
    state.picks = {};
    state.activeSlot = SLOTS[0];
    state.result = null;
    state.lineIndex = 0;

    // 再来店：前回の点数であいさつと予算が変わる
    const past = state.history[req.clientId] || [];
    const prev = past[past.length - 1];
    const band = prev ? reactionOf(prev.total) : "ok";
    state.lines = req.returnGreeting ? [req.returnGreeting[band], ...req.lines] : req.lines.slice();
    // ほかの会社から来る依頼者（needs）：前の会社のその依頼の点数で1行目を変える（80点以上・50〜79点・49点以下。2026-11-22 持ち主の指示）
    //   前の点数が分からないとき（古い保存データなど）は 50〜79点の文（lines[0] と同じ）
    if (req.needs && req.crossGreeting) state.lines[0] = req.crossGreeting[crossBandOf(req)] || state.lines[0];
    state.bonus = req.bonusBudget && prev && band === "great" ? req.bonusBudget : 0;
    state.budget = req.budget.amount + state.bonus;
    state.prevBand = prev ? band : null;

    setTop(req.time, state.timeIdx);
    $("client-name").textContent = state.client.name;
    $("office-card-name").textContent = state.client.name;
    // 紹介文は依頼ごとに上書きできる（例：ぷるるさんの2回目「地球が気に入って、また来た旅人」）
    $("office-card-profile").textContent = `${state.client.kind}・${req.profile || state.client.profile}`;
    face($("client-figure"), state.client, "normal");
    const memo = $("client-memo");
    // 同じ依頼がまた来たとき（8日目以降）は、ひと言の札を出す。依頼者メモは初めて会ったときだけ
    // 前回の点数は、同じ依頼でのいちばん最近の点数
    const sameReq = past.filter(v => v.reqId === req.id);
    const again = sameReq.length > 0;
    $("again-note").hidden = !again;
    if (again) $("again-note").textContent = `また相談に来てくれました　この依頼の前回 ${points(sameReq[sameReq.length - 1].total)}点`;
    // 時間が進む常連さん（第3段ライフプラン）：数年ぶりの来店だと分かる札（同じ依頼が2回目以降なら上の札のまま）
    else if (req.yearsLater) { $("again-note").hidden = false; $("again-note").textContent = `${req.yearsLater}年ぶりに来てくれました`; }
    if (state.client.unusual && !past.length && state.client.memo.length) {
      memo.hidden = false;
      memo.innerHTML = `<b>依頼者メモ</b>${state.client.name}の苦手なもの：${state.client.memo.join("・")}`;
    } else memo.hidden = true;

    // 事務所の絵は会社ごと（イベントは仮の絵：紫の壁と旗の飾り。本番の絵はフェーズ4）
    $("office-scene").dataset.company = state.company;
    if (ART.office) {
      $("office-bg").innerHTML = ART.office(req.time, officeOpts());
      $("counter").innerHTML = ART.counter(state.rank.level, state.company);
      $("office-scene").classList.add("has-art");
    }
    // その会社を初めて開いたときだけの案内（事務所の中の箱。読んだら閉じる。新しい画面は足さない）
    const C = state.companies[state.company], tip = WELCOME[state.company];
    $("welcome").hidden = !(tip && !C.welcomed);
    if (tip && !C.welcomed) { $("welcome-text").textContent = tip; C.welcomed = true; }
    show("screen-office");
    const client = $("client");
    client.classList.remove("enter"); void client.offsetWidth; client.classList.add("enter");
    renderLine();
    coach(tutorialNow() ? "office" : null);
  }
  function renderLine() {
    $("talk-text").textContent = state.lines[state.lineIndex];
    $("talk-count").textContent = (state.lineIndex + 1) + "/" + state.lines.length;
    // PC横：これまでの話を吹き出しの上に残す
    $("talk-history").innerHTML = state.lines.slice(0, state.lineIndex).map(l => `<li>${l}</li>`).join("");
    $("talk-next").textContent = state.lineIndex < state.lines.length - 1 ? "つぎへ" : "提案書へ";
  }
  function nextLine() {
    if (state.lineIndex < state.lines.length - 1) { state.lineIndex++; renderLine(); }
    else { coachDone("office"); openProposal(); }
  }

  // ---- 提案書づくり ----
  function openProposal() {
    const r = state.req;
    $("mini-name").textContent = state.client.name;
    $("mini-line").textContent = state.lines[0];
    $("mini-lines").innerHTML = state.lines.map(l => `<li>${l}</li>`).join("");
    face($("mini-face"), state.client, "normal");
    $("budget-amount").innerHTML = moneyHtml(state.budget, r.budget.unit);
    $("budget-bonus").textContent = state.bonus ? `（前回のお礼で増額＋${money(state.bonus, r.budget.unit)}）` : "";
    $("budget-duration").textContent = conditionOf(r.budget);
    // 予算の見出し：ライフプランは毎月使えるお金、投資は応援に出せるお金（人は円、人以外はその種の単位）
    const ck = condKeyOf(r);
    $("budget-label").textContent = ck ? COND_UI[ck].label : "予算";
    show("screen-proposal");
    renderProposal();
  }
  function renderProposal() {
    const r = state.req;
    $("slots").innerHTML = SLOTS.map(s => {
      const c = state.picks[s];
      const active = s === state.activeSlot ? " active" : "";
      return `<button class="slot${c ? " filled" : ""}${active}" data-slot="${s}" data-testid="slot-${s}" aria-pressed="${!!active}">
        <span class="slot-icon">${slotIcon(s)}</span>
        <span class="slot-name">${slotName(s)}</span>
        ${c ? `<span class="slot-card">${cardNameHtml(c.name)}</span><span class="cost">${moneyHtml(c.cost, r.budget.unit)}</span>${checkMark()}`
            : `<span class="slot-empty">えらんでね</span>`}
      </button>`;
    }).join("");
    $("cards-title").textContent = slotName(state.activeSlot) + "の候補";
    $("cards").innerHTML = r.slots[state.activeSlot].map((c, i) => {
      const on = state.picks[state.activeSlot] === c;
      return `<button class="card${on ? " picked" : ""}" data-index="${i}" data-testid="card-${i}" aria-pressed="${on}">
        <span class="card-art slot-${state.activeSlot}" data-art="${c.art || ""}">${cardArt(state.activeSlot, i, c)}</span>
        <span class="card-name">${cardNameHtml(c.name)}${condCap(c, r) ? `<span class="cap per" data-testid="per-${i}">${condCap(c, r)}</span>` : ""}</span>
        <span class="cost">${moneyHtml(c.cost, r.budget.unit)}</span>
        ${on ? checkMark() : ""}
      </button>`;
    }).join("");
    const sum = SLOTS.reduce((s, k) => s + (state.picks[k] ? state.picks[k].cost : 0), 0);
    $("sum-cost").innerHTML = moneyHtml(sum, r.budget.unit);
    $("sum-cost").classList.toggle("over", sum > state.budget);
    const left = state.budget - sum;
    $("budget-left").innerHTML = left >= 0 ? "残り " + moneyHtml(left, r.budget.unit) : moneyHtml(-left, r.budget.unit) + " オーバー";
    $("budget-left").classList.toggle("over", left < 0);
    const full = SLOTS.every(s => state.picks[s]);
    $("submit").disabled = !full;
    fitCardNames();
    // 画面を開いた直後は大きさがまだ決まっていないことがあるので、描き終わったあとにもう一度合わせる
    requestAnimationFrame(fitCardNames);
    if (tutorialNow()) coach(proposalStep(full));
  }
  // 候補カードの名前。会場の広さ「（〜10人）」は切らずに、名前の下の1行にまとめる（名前と広さが途中で分かれないように）
  // カードの名前：言葉の途中では折り返さない（「自己紹介すご／ろく」を出さない。持ち主の指示 2026-11-17）
  //   折り返してよい場所（「の・で…」のあと、カタカナとの境目）は js/name-breaks.js で決め、<wbr> で示す。ほかは word-break: keep-all で折り返さない
  const NB = window.YorozuNameBreaks;
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  function breakable(text) {
    const parts = NB ? NB.breakParts(text) : [text];
    return `<span class="nb">${parts.map(esc).join("<wbr>")}</span>`;
  }
  function cardNameHtml(name) {
    const m = name.match(/^(.*?)(（〜[^）]*）)$/);
    return m ? `<span class="nm">${breakable(m[1])}</span><span class="cap">${esc(m[2])}</span>` : breakable(name);
  }
  // 1文字だけが次の行に残る折り返し（例「似顔絵の名／札」）を直す：まず行の長さをそろえ（text-wrap: balance）、
  // それでも残るときだけ文字を少し小さくする（最小10px）。カードの幅は画面で変わるので、描いたあとに測る
  function lineLengths(el) {
    const r = document.createRange(), rows = {};
    const walk = n => {
      if (n.nodeType === 3) for (let i = 0; i < n.length; i++) {
        r.setStart(n, i); r.setEnd(n, i + 1);
        const rc = r.getClientRects()[0];
        if (rc) { const k = Math.round(rc.top); rows[k] = (rows[k] || 0) + 1; }
      } else n.childNodes.forEach(walk);
    };
    walk(el);
    return Object.values(rows);
  }
  function fitCardNames() {
    document.querySelectorAll("#cards .card-name, #slots .slot-card").forEach(el => {
      const box = el.querySelector(".nm") || el;
      el.style.fontSize = ""; box.style.textWrap = ""; el.classList.remove("nb-loose");
      // 言葉の途中で折り返さないので、折り返せる場所のない長い名前は幅からはみ出すことがある → 文字を少し小さくして収める（最小10px）
      const over = () => el.scrollWidth > el.clientWidth + 1;
      let f = parseFloat(getComputedStyle(el).fontSize);
      while (over() && f > 10) { f -= 0.5; el.style.fontSize = f + "px"; }
      // それでも入らないときは、予備の折り返し場所（文字の種類の境目）も使う（例「自己紹介／すごろく」）
      const nbEl = el.querySelector(".nb");
      //   それでも入らなければ、もう一段の予備（言葉の切れ目ならどこでも。例「ゲーム／センター」）
      for (const level of [1, 2]) {
        if (!(over() && nbEl && NB)) break;
        nbEl.innerHTML = NB.breakParts(nbEl.textContent, level).map(esc).join("<wbr>");
        el.style.fontSize = ""; f = parseFloat(getComputedStyle(el).fontSize);
        while (over() && f > 10) { f -= 0.5; el.style.fontSize = f + "px"; }
      }
      // それでも入らないとき（ふつうは起きない）だけ、言葉の途中でも折り返す
      if (over()) el.classList.add("nb-loose");
      const orphan = () => { const n = lineLengths(box); return n.length > 1 && n.some(x => x === 1); };
      if (!orphan()) return;
      box.style.textWrap = "balance";
      while (orphan() && f > 10) { f -= 0.5; el.style.fontSize = f + "px"; }
    });
    // 値段の単位（つゆのしずく など）がカードの幅に入りきらないときは、単位の文字だけ少し小さくする（最小8.5px。それでも入らなければ「…」）
    document.querySelectorAll("#cards .cost .unit, #slots .cost .unit").forEach(u => {
      u.style.fontSize = "";
      let f = parseFloat(getComputedStyle(u).fontSize);
      const r = document.createRange(); r.selectNodeContents(u);
      const over = () => r.getBoundingClientRect().width > u.getBoundingClientRect().width + 0.1;
      while (over() && f > 8.5) { f -= 0.5; u.style.fontSize = f + "px"; }
    });
    // 値段の全体（●・数字・単位）がカードの幅からはみ出すとき（幅の狭いスマホで「1,000円」の「円」が切れるなど）は、数字を少し小さくする（最小11px）
    document.querySelectorAll("#cards .card .cost, #slots .slot .cost").forEach(c => {
      const num = c.querySelector(".num"); if (!num) return;
      num.style.fontSize = ""; c.classList.remove("tight");
      const box = c.closest(".card, .slot"), money = c.querySelector(".money") || c;
      const unit = c.querySelector(".unit");
      const out = () => { const b = box.getBoundingClientRect(), m = money.getBoundingClientRect(); return m.right > b.right - 3 || m.left < b.left + 3 || money.scrollWidth > money.clientWidth + 1 || c.scrollWidth > c.clientWidth + 1 || (unit && unit.scrollWidth > unit.clientWidth + 0.5); };
      let f = parseFloat(getComputedStyle(num).fontSize);
      while (out() && f > 11) { f -= 0.5; num.style.fontSize = f + "px"; }
      // それでも入らない（5けたの値段など）ときは、前の「●」の印を外して場所を空ける
      if (out()) { c.classList.add("tight"); num.style.fontSize = ""; f = parseFloat(getComputedStyle(num).fontSize); while (out() && f > 10) { f -= 0.5; num.style.fontSize = f + "px"; } }
    });
  }
  function tutorialNow() { return state.tutorial && state.timeIdx === 0 && !state.tutorial.firstDone; }
  function proposalStep(full) {
    const d = state.tutorial.done;
    if (!d.has("score")) return "score";
    if (!d.has("slot")) return "slot";
    if (!d.has("card")) return "card";
    if (!full) return d.has("fill") ? "fill2" : "fill";
    if (!d.has("submit")) return "submit";
    return null;
  }
  function pickCard(i) {
    const s = state.activeSlot;
    state.picks[s] = state.req.slots[s][i];
    // 点数の案内は「わかった」を押すまで残す（カードを選んでも飛ばさない）
    if (tutorialNow()) {
      if (state.tutorial.current === "fill") state.tutorial.done.add("fill");
      ["slot", "card"].forEach(k => state.tutorial.done.add(k));
    }
    const next = SLOTS.find(k => !state.picks[k]);
    if (next) state.activeSlot = next;
    renderProposal();
  }

  // ---- 結果 ----
  function submit() {
    const r = state.req;
    const cards = SLOTS.map(s => state.picks[s]);
    const res = scoreProposal(cards, r, state.budget);
    state.result = res;
    coachDone("submit");
    // 提出した時点で、上の帯の進み具合を1件進める（閉じる前から「1/3件」）
    setTop(r.time, state.timeIdx + 1);

    $("score-total").textContent = points(res.total);
    $("stars").innerHTML = starHtml(res.stars);
    $("stars").setAttribute("aria-label", "星" + res.stars + "つ");
    $("stars").dataset.stars = res.stars;
    $("reaction").textContent = REACTION_LABEL[res.reaction];
    $("reaction").dataset.reaction = res.reaction;
    face($("result-face"), state.client, res.reaction);
    // 本音のカードが0枚なのに「まあまあ」のときも、「本当は〜」で本音を振り返る一言にする
    const lineKey = res.reaction === "ok" && res.honneHits === 0 ? "poor" : res.reaction;
    $("after-line").textContent = r.aftermath[lineKey];
    $("bd-honne").textContent = points(res.honne);
    $("bd-budget").textContent = points(res.budget);
    $("bd-fit").textContent = points(res.fit);
    // 選んだ4枚に印：◎本音に合った／△本音とは別／×苦手なもの（点数の計算と同じタグで判定）
    // 凡例の△：ライフプランの依頼（期間がある）では「本音とは別・期間に合わない」（2026-11-21 持ち主の指示）
    $("legend-miss").textContent = condKeyOf(r) ? COND_UI[condKeyOf(r)].legend : "本音とは別";
    $("result-picks").innerHTML = SLOTS.map((s, i) => {
      const c = cards[i];
      const bad = c.tags.some(t => r.dislikeTags.includes(t));
      const hit = isHonne(c, r); // 期間のある依頼では、期間に向いているカードだけが本音に合う（js/score.js）
      const [cls, mk, label] = bad ? ["m-bad", "×", "苦手なもの"] : hit ? ["m-hit", "◎", "本音に合った"] : ["m-miss", "△", "本音とは別"];
      // イベントの会場が人数より小さいときは、△の理由を添える（2026-11-19 試遊第8回を受けて）
      const why = !bad && !hit && tooSmall(c, r) ? `<small class="pk-why" data-testid="pk-why">人数が入りきらない</small>`
        : !bad && condMiss(c, r) ? `<small class="pk-why" data-testid="pk-why">${COND_UI[condKeyOf(r)].miss}</small>` : "";
      return `<li class="${cls}" data-mark="${cls}" style="--i:${i}"><span class="mk ${cls}" aria-label="${label}">${mk}</span><span class="pk-slot">${slotName(s)}</span><span class="pk-name">${c.name}${why}</span></li>`;
    }).join("");
    // 依頼者の本音：選んだカードのどれかに入っていれば「当てた」、どれにもなければ「外れた」
    $("honne-tags").innerHTML = r.honneTags.map(t => {
      const hit = cards.some(c => c.tags.includes(t) && condOk(c, r));
      return `<li class="${hit ? "h-hit" : "h-miss"}" data-hit="${hit}"><span class="mk" aria-hidden="true">${hit ? "◎" : "✕"}</span>${t}<small>${hit ? "当てた" : "外れた"}</small></li>`;
    }).join("");
    $("cost-note").textContent = `合計 ${money(res.cost, r.budget.unit)}／予算 ${money(state.budget, r.budget.unit)}` + (res.budget ? "" : "（予算オーバー）");

    // 記録（その会社の記録へ。順番待ちを1件進める）
    const C = state.companies[r.company];
    C.queue = SCHED.commit(queueOf(r.company), r.id);
    (state.history[r.clientId] = state.history[r.clientId] || []).push({ reqId: r.id, day: r.day, time: r.time, total: res.total, stars: res.stars, picks: cards.map(c => c.name) });
    state.today.push({ company: r.company, req: r, total: res.total, stars: res.stars });
    if (!state.met.includes(r.clientId)) state.met.push(r.clientId);
    if (res.total === 100 && !state.perfect.includes(r.id)) state.perfect.push(r.id);
    const newRegular = r.becomesRegular && !state.regulars.includes(r.clientId);
    if (newRegular) state.regulars.push(r.clientId);
    // もらえる品：常連の回（3回目の来店から）は80点以上でそのキャラの品、ほかは100点で種類の品
    const got = RW ? RW.award({ total: res.total, clientId: r.clientId, species: state.client.species, regularVisit: C.regulars.includes(r.clientId), company: r.company }, ITEMS, state.items) : null;
    showReward(got);
    if (got && got.item) { state.items = RW.grant(state.items, got); markNewItem(got); }
    persist();
    $("regular-note").hidden = !newRegular;
    $("regular-name").textContent = state.client.name;

    show("screen-result");
    coach(tutorialNow() ? "result" : null);
  }
  function closeResult() {
    coachDone("close");
    if (tutorialNow()) state.tutorial.firstDone = true;
    state.timeIdx++;
    persist();
    if (state.timeIdx >= PER_DAY) summary();
    else goHome();
  }

  // 品の色の名前（data/items.json の colorNames）。名前がないときは「元の色／色違い」
  const colorName = (item, c) => (item.colorNames && item.colorNames[c]) || (c ? "色違い" : "元の色");
  // 結果画面の「○○をもらった！」の札。押しても何も開かない（提案書づくりの流れを止めない）
  function itemIcon(item, color) {
    return ART.item ? ART.item(item.art, item.colors[color]) : `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="${item.colors[color]}"/></svg>`;
  }
  function showReward(got) {
    const note = $("reward-note");
    note.hidden = !got;
    if (!got) return;
    note.dataset.kind = got.kind;
    if (got.kind === "thanks") {
      $("reward-icon").innerHTML = "";
      // 全部の色がそろったときは、品のかわりにお礼の一言
      //   常連さん：キャラごとの一言（data/requests.json の clients.*.thanks）／常連でない客：決まった一言
      const regular = state.regulars.includes(state.req.clientId);
      $("reward-text").textContent = `品はぜんぶそろいました。${state.client.name}「${regular ? state.client.thanks || "いつもありがとう！" : "ありがとう！また相談させてね。"}」`;
      return;
    }
    $("reward-icon").innerHTML = itemIcon(got.item, got.color);
    $("reward-text").textContent = got.kind === "color" ? `「${got.item.name}」の色違い（${colorName(got.item, got.color)}）をもらった！` : `「${got.item.name}」（${colorName(got.item, got.color)}）をもらった！`;
  }

  // ---- 1日の集計 ----
  function summary() {
    const avg = state.today.length ? dayAverage(state.today.map(t => t.total)) : 0;
    state.dayAverages[state.day - 1] = avg;
    setTop("夜", state.today.length);
    // 7日ごとに一区切り：見出しを「○週目おわり」にし、その7日間の平均を出す
    const weekEnd = day() % 7 === 0;
    $("summary-title").textContent = weekEnd ? `${day() / 7}週目おわり（${day()}日目のまとめ）` : day() + "日目のまとめ";
    $("week-avg-row").hidden = !weekEnd;
    if (weekEnd) {
      const w = state.dayAverages.slice(day() - 7, day()).filter(a => a != null);
      $("week-avg").textContent = points(Math.round(dayAverage(w) * 10) / 10);
      $("week-avg-row").querySelector("span").textContent = "この7日間の平均";
    }
    $("summary-rows").innerHTML = state.today.map(t => { const co = t.company || "travel"; return `<li data-time="${t.req.time}" data-company="${co}">
      <span class="t">${t.req.time}</span><span class="n"><span class="co-mark" role="img" aria-label="${COMPANY_NAMES[co]}">${COMPANY_MARK[co]}</span>${DATA.clients[t.req.clientId].name}</span>
      <span class="s">${points(t.total)}点</span><span class="stars small">${starHtml(t.stars)}</span></li>`; }).join("");
    $("summary-avg").textContent = points(Math.round(avg * 10) / 10);
    // ランクアップ：会社ごとに、その日その会社で遊んだ件の平均が70点以上の日が連続5日で上がる（1日でも下回ったら0に戻る）
    // その日に遊ばなかった会社は数えない（連続も途切れない）。同じ日は2回数えない（js/rank.js の countDayByCompany）
    // 表示（docs/第2段_設計.md ③A）：その日に遊んだ会社だけ1行ずつ（平均・ランク・連続日数）。遊ばなかった会社は出さない
    const played = COMPANIES.filter(c => state.today.some(t => (t.company || "travel") === c));
    const ups = {};
    if (RK) {
      const ranks = Object.fromEntries(COMPANIES.map(c => [c, state.companies[c].rank]));
      const r = RK.countDayByCompany(ranks, day(), state.today.map(t => ({ company: t.company || "travel", total: t.total })));
      Object.keys(r.avgs).forEach(c => {
        const C = state.companies[c];
        if (!C) return;
        C.rank = r.ranks[c]; C.dayAverages[day()] = r.avgs[c];
        if (r.up[c]) C.rank.upDay = day();
      });
    }
    // つづきから集計を開き直したときも、その日のランクアップを見せる（upDay）
    played.forEach(c => { ups[c] = state.companies[c].rank.upDay === day(); });
    $("co-rows").innerHTML = played.map(c => {
      const C = state.companies[c], rk = C.rank, lv = rk.level || 1, st = rk.streak || 0, up = ups[c];
      const ts = state.today.filter(t => (t.company || "travel") === c).map(t => t.total);
      const cavg = Math.round(dayAverage(ts) * 10) / 10;
      // ランクアップした日は「0日連続」と空のバーを出さず、次のランクの案内を1行だけ（次の日の集計からはいつもの表示）
      const text = up && RK ? (lv < RK.MAX ? `次は「${RK.NAMES[lv + 1]}」へ。${RANK_DAYS}日連続でランクアップ` : "最高ランクになりました") : RK ? RK.barText(rk) : st + "/" + RANK_DAYS + "日";
      // その会社の順番待ち（21件）を今日遊び終えたら「○○ 21件ひとめぐり」と1行
      const q = C.queue, last = q.order[q.order.length - 1];
      const loop = q.order.length && q.pos >= q.order.length && state.today.some(t => (t.company || "travel") === c && t.req.id === last);
      return `<li class="co-row" data-company="${c}" data-testid="summary-company-${c}">
        <div class="co-head"><span class="co-name"><span class="co-mark" aria-hidden="true">${COMPANY_MARK[c]}</span>${COMPANY_NAMES[c]}</span><span class="co-avg">平均 <b data-testid="co-avg">${points(cavg)}</b>点</span></div>
        <div class="rank-label"><span>ランク：<b data-testid="rank-name">${RK ? RK.NAMES[lv] : ""}</b></span><span class="rank-text" data-testid="rank-text">${text}</span></div>
        <div class="bar"${up ? " hidden" : ""}><span style="width:${lv >= 3 ? 100 : st / RANK_DAYS * 100}%"></span></div>
        ${loop ? `<p class="loop-note" data-testid="loop-note">${COMPANY_NAMES[c]} ${q.order.length}件ひとめぐり</p>` : ""}
      </li>`;
    }).join("");
    // ランクアップした会社には枠。2社が同じ日に上がったときは1つずつ順に見せる（docs/第2段_設計.md ③A）
    //   はじめは1社目の枠だけ（1社のときと同じ形：看板の絵・「ランクアップ！」・名前・壁紙の一文）
    //   その下の「○○のランクアップを見る」で2社目の枠に入れかえる。見ずに「次の日へ」を押したときも、先に2社目を見せる
    const upList = played.filter(c => ups[c]);
    rankUpShown = 0;
    $("rank-ups").innerHTML = upList.map((c, i) => {
      const lv = state.companies[c].rank.level || 1;
      return `<div class="rank-up" data-company="${c}" data-testid="rank-up"${i > 0 ? " hidden" : ""}>
        <b>ランクアップ！</b><span class="rank-up-name"><small class="rank-up-co">${COMPANY_NAMES[c]}</small>「${RK.NAMES[lv]}」になりました</span><small class="rank-up-note" data-testid="rank-up-note">事務所の壁紙とカウンターが新しくなりました</small>
        <div class="rank-up-logo" aria-hidden="true">${UI && UI.logo ? UI.logo(lv) : ""}</div>
      </div>`;
    }).join("") + (upList.length > 1 ? `<button class="btn ghost rank-up-next" id="rank-up-next" data-testid="rank-up-next"></button>` : "");
    showRankUp(0);
    $("summary-rank").dataset.ups = upList.length;
    $("summary-rank").dataset.rows = played.length;
    document.querySelector("#screen-summary .rank-rule").hidden = upList.length > 0;
    drawLogos();
    show("screen-summary");
    persist();
    coach(state.tutorial ? "summary" : null);
  }
  // 同じ日に2社がランクアップしたとき、今見せている枠の番号（0から）
  let rankUpShown = 0;
  function showRankUp(i) {
    const boxes = [...$("rank-ups").querySelectorAll(".rank-up")], btn = $("rank-up-next");
    rankUpShown = i;
    boxes.forEach((b, k) => { b.hidden = k !== i; });
    $("summary-rank").dataset.shown = boxes.length ? i + 1 : 0;
    if (!btn) return;
    const nx = boxes[i + 1];
    btn.hidden = !nx;
    if (nx) btn.textContent = `${COMPANY_NAMES[nx.dataset.company]}のランクアップを見る`;
  }
  // まだ見ていないランクアップの枠があれば、次の枠を見せて true（「次の日へ」はそのあと）
  function showNextRankUp() {
    const n = $("rank-ups").querySelectorAll(".rank-up").length;
    if (rankUpShown + 1 >= n) return false;
    showRankUp(rankUpShown + 1);
    $("next-day").focus();
    return true;
  }
  function nextDay() {
    if (showNextRankUp()) return;
    coachDone("summary");
    state.day++; state.timeIdx = 0; state.today = [];
    if (state.tutorial) state.playedOnce = true;
    state.tutorial = null;
    persist();
    goHome();
  }

  // ---- 自分のキャラ（svg/player.js）・アイコン・着せ替え ----
  // 絵のファイルが読めないときも遊べるように、選べるものの数だけは決めておく
  const P_OPT = ART.PLAYER_OPTIONS || {
    bodies: [{ key: "human", label: "人" }, { key: "animal", label: "動物" }, { key: "bug", label: "虫" }, { key: "alien", label: "宇宙人" }],
    colors: { human: ["#f6d2b4", "#e8b58e", "#c98e64", "#9a6a46", "#f3e0cf"], animal: ["#a0683c", "#e8c08a", "#f2f2f2", "#8a8a8a", "#e08a4a"], bug: ["#e2574c", "#f2c94c", "#5cb87a", "#4a8fd8", "#b79ad8"], alien: ["#7ccfa0", "#b79ad8", "#8fd0e8", "#f0a8c0", "#f2d36a"] },
    hair: { human: [0, 1, 2, 3], animal: [0, 1, 2, 3], bug: [0, 1, 2, 3], alien: [0, 1, 2, 3] }, eyes: [0, 1, 2, 3], mouth: [0, 1, 2, 3],
    iconBg: ["#f7a933", "#4a8fd8", "#5cb87a", "#e2574c", "#b79ad8", "#fbe7b5"],
    hairColors: { human: ["#6b4430", "#4a3226", "#2f2a2e", "#c98a3a", "#a8b0ba"], alien: ["#f2c94c", "#f28fb0", "#6cc0e0", "#9a7ad8", "#f4f1ec"] }
  };
  // 髪の色を選べるのは人と宇宙人だけ
  const hasHairColor = body => !!(P_OPT.hairColors && P_OPT.hairColors[body]);
  // 髪の色が入っていない（前の）保存データは、前の決まり（肌の色に合わせた色）で補う
  // - 人：肌の色の番号ごとに決まっていた色を、同じ色の番号にする（明るい肌→茶、濃い肌→黒に近い色）
  // - 宇宙人：前の色（肌の色から作っていた）にいちばん近い色を、5色の中から選ぶ
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  function nearestColor(hex, list) {
    const a = rgb(hex);
    let best = 0, bd = Infinity;
    list.forEach((c, i) => { const b = rgb(c), d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2; if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function fixPlayer(p) {
    if (!p) return p;
    const list = hasHairColor(p.body) ? P_OPT.hairColors[p.body] : null;
    if (p.hairColor != null && (!list || p.hairColor >= list.length)) p.hairColor = null;
    if (p.hairColor == null && p.body === "human") p.hairColor = [0, 0, 1, 2, 2][p.color] || 0;
    if (p.hairColor == null && p.body === "alien") p.hairColor = ART.playerLegacyTip ? nearestColor(ART.playerLegacyTip(p), list) : 0;
    return p;
  }
  const PARTS = { head: "頭", body: "服", hand: "手" };
  const itemById = id => ITEMS.items.find(i => i.id === id);
  // 保存の形「品ID:色の番号」→ 絵に渡す形 { art, color }。持っていない品は着ない
  function wearOf(p) {
    const out = {};
    Object.keys(PARTS).forEach(k => {
      const v = p.wear && p.wear[k];
      const [id, c] = v ? v.split(":") : [];
      const it = id && itemById(id);
      out[k] = it && (state.items[id] || []).includes(Number(c)) ? { art: it.art, color: it.colors[Number(c)] } : null;
    });
    return out;
  }
  function playerSvg(p, mood) {
    p = p || (SAVE ? SAVE.blank().player : {});
    return ART.player ? ART.player(Object.assign({}, p, { wear: wearOf(p) }), mood || "normal") : `<svg viewBox="0 0 200 260"><circle cx="100" cy="88" r="56" fill="${(P_OPT.colors[p.body] || P_OPT.colors.human)[p.color] || "#f6d2b4"}"/><rect x="66" y="150" width="68" height="90" rx="20" fill="#4a8fd8"/></svg>`;
  }
  function iconSvg(p) {
    p = p || (SAVE ? SAVE.blank().player : {});
    const bg = P_OPT.iconBg[p.iconBg] || P_OPT.iconBg[0];
    return ART.playerIcon ? ART.playerIcon(Object.assign({}, p, { wear: wearOf(p) }), bg) : `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${bg}"/><circle cx="50" cy="56" r="30" fill="${(P_OPT.colors[p.body] || P_OPT.colors.human)[p.color] || "#f6d2b4"}"/></svg>`;
  }
  const playerName = p => (p && p.name) || "所長";
  function drawMe() {
    if (!state.player) return;
    $("me-icon").innerHTML = iconSvg(state.player);
    $("me-icon").setAttribute("aria-label", playerName(state.player) + "のアイコン");
  }

  // キャラ作り。mode = "new"（はじめからの直後）／ "edit"（着せ替えの「見た目」から）
  let createMode = "new", draft = null;
  const CREATE_ROWS = [
    { key: "body", label: "体の種類" }, { key: "color", label: "肌・毛の色" }, { key: "hair", label: "髪型・模様" }, { key: "hairColor", label: "髪の色" },
    { key: "eyes", label: "目" }, { key: "mouth", label: "口" }, { key: "iconBg", label: "アイコンの背景" }
  ];
  function choicesOf(key) {
    if (key === "body") return P_OPT.bodies.map(b => ({ value: b.key, label: b.label }));
    if (key === "color") return (P_OPT.colors[draft.body] || []).map((c, i) => ({ value: i, swatch: c, label: `色${i + 1}` }));
    if (key === "iconBg") return P_OPT.iconBg.map((c, i) => ({ value: i, swatch: c, label: `背景${i + 1}` }));
    if (key === "hairColor") return hasHairColor(draft.body) ? P_OPT.hairColors[draft.body].map((c, i) => ({ value: i, swatch: c, label: `髪の色${i + 1}` })) : [];
    const list = key === "hair" ? (P_OPT.hair[draft.body] || []) : P_OPT[key];
    return list.map((h, i) => ({ value: i, label: (h && h.label) || `${i + 1}` }));
  }
  function openCreate(mode) {
    createMode = mode;
    draft = fixPlayer(JSON.parse(JSON.stringify(state.player || SAVE.blank().player)));
    $("create-title").textContent = mode === "new" ? "所長のキャラを作ろう" : "見た目を変える";
    $("create-name").value = draft.name === "所長" ? "" : draft.name;
    renderCreate();
    show("screen-create");
    coach(null);
  }
  function renderCreate() {
    $("create-figure").innerHTML = playerSvg(draft);
    $("create-icon").innerHTML = iconSvg(draft);
    // 動物と虫は髪の色の行を出さない（毛の色＝肌の色）
    // 宇宙人の髪の色は、アンテナの先・とがり耳・おでこの模様に使うので「アンテナの色」
    const rowLabel = r => r.key === "hairColor" && draft.body === "alien" ? "アンテナの色" : r.label;
    $("create-options").innerHTML = CREATE_ROWS.filter(r => r.key !== "hairColor" || hasHairColor(draft.body)).map(r => `<div class="opt-row"><span class="opt-label">${rowLabel(r)}</span><div class="opt-choices" role="radiogroup" aria-label="${rowLabel(r)}">${
      choicesOf(r.key).map(c => `<button class="opt${String(draft[r.key]) === String(c.value) ? " on" : ""}${c.swatch ? " swatch" : ""}" role="radio" aria-checked="${String(draft[r.key]) === String(c.value)}" data-key="${r.key}" data-value="${c.value}" data-testid="opt-${r.key}-${c.value}" aria-label="${c.label}"${c.swatch ? ` style="--sw:${c.swatch}"` : ""}>${c.swatch ? "" : c.label}</button>`).join("")
    }</div></div>`).join("");
  }
  function pickOption(key, value) {
    draft[key] = key === "body" ? value : Number(value);
    // 体の種類を変えたら、その種類に無い色・模様の番号は0に戻す
    if (key === "body") { if (draft.color >= (P_OPT.colors[draft.body] || []).length) draft.color = 0; if (draft.hair >= (P_OPT.hair[draft.body] || []).length) draft.hair = 0; fixPlayer(draft); }
    renderCreate();
  }
  function randomDraft() {
    const r = n => Math.floor(Math.random() * n);
    draft.body = P_OPT.bodies[r(P_OPT.bodies.length)].key;
    draft.color = r((P_OPT.colors[draft.body] || [0]).length);
    draft.hair = r((P_OPT.hair[draft.body] || [0]).length);
    draft.eyes = r(P_OPT.eyes.length); draft.mouth = r(P_OPT.mouth.length); draft.iconBg = r(P_OPT.iconBg.length);
    draft.hairColor = hasHairColor(draft.body) ? r(P_OPT.hairColors[draft.body].length) : 0;
    renderCreate();
  }
  function finishCreate() {
    const name = $("create-name").value.trim().slice(0, 8);
    draft.name = name || "所長";
    state.player = draft;
    persist();
    drawMe();
    if (createMode === "new") goHome(); else openDress();
  }

  // 着せ替え：持っている身につける品を、部位ごとに選ぶ
  let dressPart = "head";
  function openDress(part) {
    dressPart = part || dressPart;
    document.querySelectorAll("#screen-dress .tab").forEach(b => {
      const on = b.dataset.part === dressPart; b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on));
      b.querySelectorAll(".nd").forEach(e => e.remove());
      if (ITEMS.items.some(i => i.use === "wear" && i.part === b.dataset.part && state.news.fresh.some(v => v.split(":")[0] === i.id))) b.insertAdjacentHTML("beforeend", ND("dress-tab-" + b.dataset.part + "-new"));
    });
    $("dress-figure").innerHTML = playerSvg(state.player);
    const cur = state.player.wear[dressPart];
    // 着られるのは全社でもらった品（決定：着せ替えは会社をまたぐ）。どこでもらったか分かるよう、会社ごとに見出しを付けて並べる
    const mine = ITEMS.items.filter(i => i.use === "wear" && i.part === dressPart && (state.items[i.id] || []).length);
    $("wear-empty").hidden = mine.length > 0;
    const cells = COMPANIES.flatMap(co => {
      const list = mine.filter(i => companyOfItem(i) === co);
      if (!list.length) return [];
      return [`<li class="wear-head" data-company="${co}" data-testid="wear-head-${co}"><span class="co-mark" aria-hidden="true">${COMPANY_MARK[co]}</span>${COMPANY_NAMES[co]}でもらった品</li>`].concat(list.flatMap(i => (state.items[i.id] || []).map(c => {
        const v = i.id + ":" + c;
        return `<li data-company="${co}"><button class="wear-item${cur === v ? " on" : ""}" data-wear="${v}" data-testid="wear-${i.id}-${c}" aria-pressed="${cur === v}">${isFresh(v) ? ND("new-" + i.id + "-" + c) : ""}<span class="zk-icon">${itemIcon(i, c)}</span><span class="wi-text"><b class="wi-name">${i.name}</b><small class="wi-tag">${colorName(i, c)}</small></span></button></li>`;
      })));
    });
    $("wear-list").innerHTML = (mine.length ? [`<li><button class="wear-item${cur ? "" : " on"}" data-wear="" data-testid="wear-none" aria-pressed="${!cur}"><span class="zk-icon missing"></span><span>はずす</span></button></li>`] : []).concat(cells).join("");
    show("screen-dress");
    requestAnimationFrame(fitNames);
    coach(null);
  }
  // 品を選んで画面を描き直しても、スクロールの位置をそのままにする（下の品を続けて試すとき、毎回いちばん上へ戻らないように。持ち主の指示）
  //   画面全体（スマホ）と、枠の中でスクロールする一覧（PC）の両方を覚えて戻す
  function keepScroll(screenId, redraw) {
    const y = window.scrollY;
    const inner = [...document.querySelectorAll(`#${screenId} *`)].filter(el => el.scrollTop > 0).map(el => [el.id || null, el.className, el.scrollTop]);
    redraw();
    window.scrollTo(0, y);
    const els = [...document.querySelectorAll(`#${screenId} *`)];
    inner.forEach(([id, cls, top]) => { const el = id ? document.getElementById(id) : els.find(e => e.className === cls); if (el) el.scrollTop = top; });
  }
  function setWear(v) {
    state.player.wear[dressPart] = v || null;
    state.news.fresh = state.news.fresh.filter(x => x !== v);
    persist();
    drawMe();
    keepScroll("screen-dress", () => openDress());
  }

  // ---- 飾りつけ：棚3か所・壁2か所 ----
  // 保存の形は deco = { shelf: ["品ID:色"|null ×3], wall: [… ×2] }。持っていない品・場所に合わない品は飾らない
  // co：どの会社の事務所か（書かなければ今の会社）。飾れるのはその会社でもらった品だけ
  function decoArt(v, place, co) {
    const [id, c] = v ? v.split(":") : [];
    const it = id && itemById(id);
    return it && it.use === "deco" && it.place === place && companyOfItem(it) === (co || state.company) && (state.items[id] || []).includes(Number(c)) ? itemIcon(it, Number(c)) : null;
  }
  function officeOpts(fit, co) {
    co = co || state.company;
    const d = state.decos[co] || { shelf: [], wall: [] };
    return { rank: state.companies[co].rank.level, company: co, fit, deco: { shelf: (d.shelf || []).map(v => decoArt(v, "shelf", co)), wall: (d.wall || []).map(v => decoArt(v, "wall", co)) } };
  }
  // 図鑑・飾るで見ている会社（上の切り替え）。開いたときは今の会社（最後に入った会社）
  let viewCo = "travel";
  const VC = () => state.companies[viewCo];
  function markCoTabs(id) {
    document.querySelectorAll(`#${id} .tab`).forEach(b => { const on = b.dataset.co === viewCo; b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on)); });
  }
  let decoSpot = null; // { place, i }
  function openDeco(spot) {
    if (!state.decos[viewCo]) state.decos[viewCo] = newDeco();
    const deco = state.decos[viewCo];
    decoSpot = spot || decoSpot || { place: "shelf", i: 0 };
    markCoTabs("deco-co");
    const freshDeco = (co, place) => ITEMS.items.some(i => i.use === "deco" && companyOfItem(i) === co && (!place || i.place === place) && state.news.fresh.some(v => v.split(":")[0] === i.id));
    document.querySelectorAll("#deco-co .tab").forEach(b => { b.querySelectorAll(".nd").forEach(e => e.remove()); if (freshDeco(b.dataset.co)) b.insertAdjacentHTML("beforeend", ND("deco-co-" + b.dataset.co + "-new")); });
    const time = TIMES[Math.min(state.timeIdx, 2)];
    $("deco-bg").innerHTML = ART.office ? ART.office(time, officeOpts("meet", viewCo)) : "";
    $("deco-counter").innerHTML = ART.counter ? ART.counter(VC().rank.level, viewCo) : "";
    // 飾る場所：絵の中は場所を示す枠だけ（押せない）。押すボタンは絵の下に5つ並べる（棚の段は間が狭く、44px のボタンが重なるため）
    const S = (ART.decoSpots ? ART.decoSpots(viewCo) : ART.DECO_SPOTS) || { shelf: [], wall: [] };
    $("deco-scene").querySelectorAll(".deco-mark").forEach(b => b.remove());
    const btns = [];
    ["shelf", "wall"].forEach(place => S[place].forEach((q, i) => {
      const on = decoSpot.place === place && decoSpot.i === i, v = deco[place][i];
      const m = document.createElement("span");
      m.className = "deco-mark" + (on ? " on" : "");
      m.setAttribute("aria-hidden", "true");
      Object.assign(m.style, { left: (q.x / 400 * 100) + "%", top: (q.y / 300 * 100) + "%", width: (q.w / 400 * 100) + "%", height: (q.h / 300 * 100) + "%" });
      $("deco-scene").appendChild(m);
      const [id, c] = v ? v.split(":") : [];
      const it = id && itemById(id);
      btns.push(`<button class="deco-spot${on ? " on" : ""}${v ? " filled" : ""}" data-place="${place}" data-i="${i}" data-testid="spot-${place}-${i}" aria-pressed="${on}" aria-label="${place === "shelf" ? "棚" : "壁"}の${i + 1}か所目">${freshDeco(viewCo, place) ? ND("", "新しい品を飾れます") : ""}<small>${place === "shelf" ? "棚" : "壁"}${i + 1}</small>${it ? `<span class="zk-icon">${itemIcon(it, Number(c))}</span>` : ""}</button>`);
    }));
    $("deco-spots").innerHTML = btns.join("");
    // 選んだ場所に飾れる品
    const place = decoSpot.place, cur = deco[place][decoSpot.i];
    $("deco-help").textContent = `${place === "shelf" ? "棚" : "壁"}の${decoSpot.i + 1}か所目に飾る品を選んでね。`;
    // 飾れるのはその会社でもらった品だけ（決定：品は会社ごと）
    const mine = ITEMS.items.filter(i => i.use === "deco" && i.place === place && companyOfItem(i) === viewCo && (state.items[i.id] || []).length);
    $("deco-empty").hidden = mine.length > 0;
    $("deco-empty").textContent = mine.length ? "" : `まだ${place === "shelf" ? "棚" : "壁"}に飾れる品がありません。依頼者が大喜びすると、品をもらえることがあります。`;
    const cells = mine.flatMap(i => (state.items[i.id] || []).map(c => {
      const v = i.id + ":" + c;
      return `<li><button class="wear-item${cur === v ? " on" : ""}" data-deco="${v}" data-testid="deco-${i.id}-${c}" aria-pressed="${cur === v}">${isFresh(v) ? ND("new-" + i.id + "-" + c) : ""}<span class="zk-icon">${itemIcon(i, c)}</span><span class="wi-text"><b class="wi-name">${i.name}</b><small class="wi-tag">${colorName(i, c)}</small></span></button></li>`;
    }));
    $("deco-list").innerHTML = (mine.length ? [`<li><button class="wear-item${cur ? "" : " on"}" data-deco="" data-testid="deco-none" aria-pressed="${!cur}"><span class="zk-icon missing"></span><span>はずす</span></button></li>`] : []).concat(cells).join("");
    show("screen-deco");
    requestAnimationFrame(fitNames);
    coach(null);
  }
  function setDeco(v) {
    const d = state.decos[viewCo], { place, i } = decoSpot;
    // 同じ品（同じ色）を2か所には飾らない：ほかの場所にあれば、こちらへ移す
    if (v) ["shelf", "wall"].forEach(pl => d[pl].forEach((x, k) => { if (x === v) d[pl][k] = null; }));
    d[place][i] = v || null;
    state.news.fresh = state.news.fresh.filter(x => x !== v);
    persist();
    keepScroll("screen-deco", () => openDeco());
  }

  // ---- 街を歩く：別の会社をタップしたときだけ、自分のキャラが道に沿って入口まで歩く（約1秒）。同じ会社なら歩かずすぐ入る ----
  let cityView = CITY_VIEW.phone, walking = null;
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)");
  // 自分のキャラが立っている場所（会社の名札にかからない道の上）。歩くときは近くの交差点（425,340）を通る
  const HOME_SPOT = { u: 425, v: 450 }, CROSS = { u: 425, v: 340 };
  function cityPct(pt) { const [vx, vy, vw, vh] = cityView; return { left: ((pt.x - vx) / vw * 100) + "%", top: ((pt.y - vy) / vh * 100) + "%" }; }
  //   歩く道：今立っている場所（前に入った会社の前の道の上。まだならホームの最初の場所）から、横の道（v=CROSS.v）へ出て、
  //   行き先の会社の縦の道へ曲がり、入口まで。会社から会社へ移るときに、いったんホームの最初の場所へ戻らない（2026-11-21 持ち主の指摘）
  function walkPoints(key, from) {
    const R = ART.CITY_ROADS, g = R && R.ground[key];
    if (!g) return null;
    const near = (list, x) => list.reduce((a, b) => Math.abs(b - x) < Math.abs(a - x) ? b : a);
    const uR = near(R.UR, g.u);
    const f = from && R.ground[from] ? { u: near(R.UR, R.ground[from].u), v: R.ground[from].v } : HOME_SPOT;
    return [[f.u, f.v], [f.u, CROSS.v], [uR, CROSS.v], [uR, g.v], [g.u, g.v]].map(([u, v]) => R.toXY(u, v));
  }
  function placeWalker() {
    const w = $("walker");
    if (!state.player || !ART.CITY_ROADS) { w.hidden = true; return; }
    w.hidden = false;
    w.innerHTML = playerSvg(state.player);
    // 前に入った会社があれば、その入口に立ったまま（ホームに戻るたびに最初の場所へ戻さない）
    //   歩いたときの最後の位置（fill: forwards）が残っていると置いた場所より優先されるので、先に消す
    if (w.getAnimations) w.getAnimations().forEach(a => a.cancel());
    //   立つのは会社の前の道の上（建物の上だと会社の印にかかるため）
    const pts = state.spot && walkPoints(state.spot);
    Object.assign(w.style, cityPct(pts ? pts[3] : ART.CITY_ROADS.toXY(HOME_SPOT.u, HOME_SPOT.v)));
    w.classList.remove("walking");
  }
  function walkTo(key, done) {
    const from = state.spot, pts = walkPoints(key, from), w = $("walker");
    // もうその会社の前に立っているときは歩かない（別の場所へ行くときだけ歩く）
    const here = from === key;
    state.spot = key;
    if (here || !pts || REDUCE.matches || w.hidden || !w.animate) { done(); return; }
    let finished = false;
    const finish = () => {
      if (finished) return; finished = true;
      document.removeEventListener("pointerdown", skip, true);
      walking = null; w.classList.remove("walking");
      done();
    };
    // 歩いている間に画面を押すと、すぐ事務所に入る
    const skip = e => { e.preventDefault(); e.stopPropagation(); anim.cancel(); finish(); };
    w.classList.add("walking");
    const len = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
    const total = len.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    const frames = pts.map((p, i) => { if (i) acc += len[i - 1]; return Object.assign({ offset: acc / total }, cityPct(p)); });
    const anim = w.animate(frames, { duration: 1000, easing: "linear", fill: "forwards" });
    walking = anim;
    anim.onfinish = finish;
    // 会社を押した指の pointerdown はもう終わっているので、すぐ待ち受けてよい
    document.addEventListener("pointerdown", skip, true);
  }

  // ---- 図鑑（依頼者／常連さん／品）。まだのものは影だけ ----
  let zukanTab = "clients";
  // 図鑑の依頼者は、見ている会社に来る依頼者（会社ごとに数える）
  const clientOrder = () => [...new Set(requestsFor(viewCo).map(r => r.clientId))];
  // back=true：依頼者の記録から戻ったとき。カードは作り直すが、最初から出し終わった印（.in）を付けて動かさない
  function openZukan(tab, back) {
    zukanTab = tab || zukanTab;
    markCoTabs("zukan-co");
    document.querySelectorAll("#screen-zukan .tab[data-tab]").forEach(b => {
      const on = b.dataset.tab === zukanTab;
      b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on));
    });
    document.querySelectorAll("#screen-zukan [data-pane]").forEach(el => { el.hidden = el.dataset.pane !== zukanTab; });
    $("zukan-icon").innerHTML = iconSvg(state.player);
    $("zukan-name").textContent = playerName(state.player) + "の図鑑";
    if (zukanTab === "clients") renderZukanClients();
    if (zukanTab === "regulars") renderRegulars();
    if (zukanTab === "items") renderZukanItems();
    // 一覧のカードに並び順の番号（スタッガー。css の .zk-anim）
    document.querySelectorAll(`#screen-zukan [data-pane="${zukanTab}"] .zk-anim`).forEach((el, i) => { el.style.setProperty("--i", i); if (back) el.classList.add("in"); });
    // 品のタブと、新しい品のある会社のタブに丸
    const zkNew = co => state.news.zukan.some(v => companyOfItem(itemById(v.split(":")[0])) === co);
    $("tab-items").querySelectorAll(".nd").forEach(e => e.remove());
    if (zkNew(viewCo)) $("tab-items").insertAdjacentHTML("beforeend", ND("tab-items-new"));
    document.querySelectorAll("#zukan-co .tab").forEach(b => { b.querySelectorAll(".nd").forEach(e => e.remove()); if (zkNew(b.dataset.co)) b.insertAdjacentHTML("beforeend", ND("zukan-co-" + b.dataset.co + "-new")); });
    show("screen-zukan");
    coach(null);
  }
  function renderZukanClients() {
    const CLIENT_ORDER = clientOrder();
    const met = CLIENT_ORDER.filter(id => VC().met.includes(id)).length;
    $("zukan-count").textContent = `会った依頼者 ${met}/${CLIENT_ORDER.length}人`;
    $("zukan-note").textContent = "まだ会っていない依頼者は、影だけ見えます。";
    $("zukan-clients").innerHTML = CLIENT_ORDER.map(id => {
      const c = DATA.clients[id], seen = VC().met.includes(id);
      return `<li class="zk zk-anim${seen ? "" : " shadow"}" data-client="${id}" data-seen="${seen}"><span class="client-figure zk-face" data-face="${id}" aria-hidden="true"></span>
        <b>${seen ? c.name : "？？？"}</b><small>${seen ? c.kind : ""}</small></li>`;
    }).join("");
    $("zukan-clients").querySelectorAll("[data-face]").forEach(el => face(el, DATA.clients[el.dataset.face], "normal"));
    requestAnimationFrame(fitNames);
  }
  function renderRegulars() {
    const C = VC();
    $("zukan-count").textContent = `常連さん ${C.regulars.length}人`;
    $("zukan-note").textContent = "名前をタップすると、好みとこれまでの提案が見られます。";
    $("regulars-empty").hidden = C.regulars.length > 0;
    $("regular-list").innerHTML = C.regulars.map(id => {
      const c = DATA.clients[id], v = C.history[id] || [], last = v[v.length - 1];
      return `<li class="zk-anim"><button class="regular-item" data-client="${id}" data-testid="regular-${id}">
        <span class="client-figure regular-face" data-face="${id}" aria-hidden="true"></span>
        <span class="regular-text"><b>${c.name}</b><small>${c.kind}・来店${v.length}回${last ? `・前回${points(last.total)}点` : ""}</small></span>
        <span class="regular-go" aria-hidden="true">›</span></button></li>`;
    }).join("");
    $("regular-list").querySelectorAll("[data-face]").forEach(el => face(el, DATA.clients[el.dataset.face], "normal"));
  }
  function renderZukanItems() {
    // 品は会社ごとに数える（見ている会社の品だけ。旅行・デートは it-、イベントは ev- の品）
    const list = ITEMS.items.filter(i => companyOfItem(i) === viewCo);
    const groups = [...new Set(list.map(i => i.group))];
    const total = list.reduce((n, i) => n + i.colors.length, 0);
    const have = list.reduce((n, i) => n + (state.items[i.id] || []).length, 0);
    $("zukan-count").textContent = `集めた品 ${have}/${total}（色違いを含む）`;
    $("zukan-note").textContent = "常連でない依頼者は100点で、常連さんは80点以上で品をくれます。";
    requestAnimationFrame(fitNames);
    $("zukan-items").innerHTML = groups.map(g => {
      const [kind, key] = g.split(":");
      const known = kind === "species" || VC().met.includes(key);
      const title = kind === "species" ? `${ITEMS.groupNames[key] || key}の品` : `${known ? DATA.clients[key].name : "？？？"}の品（常連さん）`;
      const cells = list.filter(i => i.group === g).sort((a, b) => a.order - b.order).map(i => {
        const has = state.items[i.id] || [];
        const any = has.length > 0;
        const dots = i.colors.map((c, k) => has.includes(k)
          ? `<span class="zk-icon" data-color="${k}" title="${colorName(i, k)}">${itemIcon(i, k)}</span>`
          : any ? `<span class="zk-icon missing" data-color="${k}" aria-label="まだの色"></span>`
          : `<span class="zk-icon shadow" data-color="${k}" aria-hidden="true">${itemIcon(i, 0)}</span>`).join("");
        // 色の名前を文字でも（まだの色は「？」）
        const colorText = any ? `<small class="zk-colors" data-testid="zk-colors-${i.id}">${i.colors.map((_, k) => has.includes(k) ? colorName(i, k) : "？").join("・")}</small>` : "";
        const isNew = has.some(k => state.news.zukan.includes(i.id + ":" + k));
        return `<li class="zk item zk-anim${any ? "" : " unknown"}" data-item="${i.id}" data-owned="${has.join(",")}">${isNew ? ND("zk-new-" + i.id) : ""}<span class="zk-icons">${dots}</span><b>${any ? i.name : "？？？"}</b>${colorText}<small>${any ? (i.use === "wear" ? { head: "頭", body: "服", hand: "手に持つ" }[i.part] : { shelf: "棚に飾る", wall: "壁に飾る" }[i.place]) : ""}</small></li>`;
      }).join("");
      return `<li class="zk-head">${title}</li>${cells}`;
    }).join("");
  }
  // 図鑑の名前は1行。カードの幅に収まらないときだけ文字を少し小さくする（最小11px）
  function fitNames() {
    document.querySelectorAll("#zukan-items .zk b, #zukan-clients .zk b, .wi-name").forEach(b => {
      b.style.fontSize = "";
      let f = parseFloat(getComputedStyle(b).fontSize);
      while (b.scrollWidth > b.clientWidth && f > 11) { f -= 0.5; b.style.fontSize = f + "px"; }
    });
  }

  // ---- 常連のキャラ詳細 ----
  // 結果から開くときは今の会社、図鑑の常連さんから開くときは図鑑で見ている会社の記録
  function openDetail(clientId, from) {
    const c = DATA.clients[clientId];
    const co = from === "list" ? viewCo : state.company;
    const visits = state.companies[co].history[clientId] || [];
    state.detailFrom = from;
    // どの会社の常連さんか（さくらさんのように両方の会社に来る依頼者もいるため、来店の記録はその会社の分だけ）
    $("detail-badge").textContent = `${COMPANY_NAMES[co]}の常連さん`;
    face($("detail-face"), c, "great");
    $("detail-name").textContent = c.name;
    // 紹介文は、その会社でいちばん新しい来店の依頼の紹介文（時間が進む常連さんは、今の姿）
    const lastProfile = visits.map(v => reqById(v.reqId)).filter(r => r && r.profile).pop();
    $("detail-profile").textContent = `${c.kind}・${lastProfile ? lastProfile.profile : c.profile}`;
    const likes = [...new Set(visits.flatMap(v => DATA.requests.find(r => r.id === v.reqId).honneTags))];
    $("detail-likes").innerHTML = likes.map(t => `<li>${t}</li>`).join("");
    $("detail-visits").innerHTML = visits.map((v, i) => `<li><div class="v-head"><b>${i + 1}回目</b>（${v.day}日目・${v.time}）<span class="v-score">${points(v.total)}点</span></div><div class="v-picks">${v.picks.join("／")}</div></li>`).join("");
    show("screen-detail");
    coach(null);
  }

  // ---- 会話の全文 ----
  function openLog() {
    $("log-title").textContent = state.client.name + "の話";
    $("log-lines").innerHTML = state.lines.map(l => `<li>${l}</li>`).join("");
    const d = $("talk-log");
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }
  function closeLog() { const d = $("talk-log"); if (d.close) d.close(); else d.removeAttribute("open"); }

  // ---- はじめから ----
  function reset(startDay, withTitle) {
    const b = SAVE ? SAVE.blank() : null;
    const companies = {}, decos = {};
    COMPANIES.forEach(c => { companies[c] = newCompany(); companies[c].queue.seed = newSeed(); decos[c] = newDeco(); });
    Object.assign(state, {
      day: startDay, timeIdx: 0, today: [], dayAverages: [], companies, decos, company: "travel",
      tutorial: startDay === 1 && !NO_TUTORIAL ? { done: new Set(), current: null } : null,
      player: b ? b.player : null, items: {}, news: blankNews(), spot: null
    });
    COMPANIES.forEach(queueOf);
    // 開発用 ?day=N：前の日までの分（旅行・デート1日3件）は遊び終えたことにして、順番待ちを進める
    if (startDay > 1) { const q = queueOf("travel"); q.pos = Math.min((startDay - 1) * PER_DAY, q.order.length); }
    if (withTitle === "create") return; // キャラ作りの画面は呼んだ側で開く
    if (withTitle) openTitle(); else goHome();
  }
  // タイトルの「はじめから」：記録があれば確かめてから消す。前の記録で案内を終えていれば案内をとばせる
  function startNew() {
    const had = hasSave();
    const played = state.playedOnce || (had && (!state.tutorial || state.tutorial.firstDone));
    reset(1, "create");
    state.playedOnce = played;
    openCreate("new");
  }

  // ---- タイトル ----
  let loadNote = "";
  const hasSave = () => !!(STORE && STORE.getItem(SAVE.KEY));
  function openTitle() {
    if (ART.city && !$("title-bg").innerHTML) $("title-bg").innerHTML = ART.city("朝").replace("<svg ", '<svg preserveAspectRatio="xMidYMid slice" ');
    if (UI && UI.logo) $("title-logo").innerHTML = UI.logo(state.rank.level);
    const saved = hasSave();
    $("continue").hidden = !saved;
    $("continue-info").textContent = saved ? `${state.day}日目の${TIMES[Math.min(state.timeIdx, 2)]}から` : "";
    $("continue-me").hidden = !saved;
    if (saved) { $("continue-icon").innerHTML = iconSvg(state.player); $("continue-name").textContent = playerName(state.player); }
    $("start").textContent = saved ? "はじめから" : "はじめる";
    $("start").classList.toggle("primary", !saved);
    $("start").classList.toggle("ghost", saved);
    const note = !STORE ? "この画面では記録を保存できません（閉じると最初から）" : loadNote;
    $("save-note").textContent = note;
    $("save-note").hidden = !note;
    coach(null);
    show("screen-title");
  }
  function continueGame() {
    if (state.today.length >= PER_DAY) summary(); else goHome();
  }

  // ---- つなぎ ----
  $("start").addEventListener("click", () => {
    if (!hasSave()) { startNew(); return; }
    const d = $("confirm-new");
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  });
  const closeConfirm = () => { const d = $("confirm-new"); if (d.close) d.close(); else d.removeAttribute("open"); };
  $("confirm-new-ok").addEventListener("click", () => { closeConfirm(); startNew(); });
  $("confirm-new-cancel").addEventListener("click", closeConfirm);
  $("continue").addEventListener("click", continueGame);
  // 会社をタップ：今いる会社と違うときだけ歩いてから、その会社の次の依頼へ（同じ会社なら歩かずすぐ事務所）
  function enterCompany(c) {
    if (walking || !isOpen(c)) return;
    coachDone("home");
    walkTo(c, () => { const r = nextRequest(c); if (r) startRequest(r); else goHome(); });
  }
  $("company-travel").addEventListener("click", () => enterCompany("travel"));
  $("company-event").addEventListener("click", () => enterCompany("event"));
  ["life", "invest", "town"].forEach(co => $("company-" + co).addEventListener("click", () => enterCompany(co)));
  $("welcome-ok").addEventListener("click", () => { $("welcome").hidden = true; persist(); });
  $("talk-next").addEventListener("click", nextLine);
  $("talk-bubble").addEventListener("click", nextLine);
  $("reread").addEventListener("click", openLog);
  $("log-close").addEventListener("click", closeLog);
  $("open-score-help").addEventListener("click", () => { const d = $("score-help"); $("help-people").hidden = !(state.req && state.req.budget.people); Object.keys(COND_UI).forEach(k => { $(COND_UI[k].help).hidden = condKeyOf(state.req) !== k; }); if (d.showModal) d.showModal(); else d.setAttribute("open", ""); });
  $("score-help-close").addEventListener("click", () => { const d = $("score-help"); if (d.close) d.close(); else d.removeAttribute("open"); });
  $("slots").addEventListener("click", e => {
    const b = e.target.closest(".slot"); if (!b) return;
    state.activeSlot = b.dataset.slot;
    if (tutorialNow()) state.tutorial.done.add("slot");
    renderProposal();
  });
  $("cards").addEventListener("click", e => {
    const b = e.target.closest(".card"); if (!b) return;
    pickCard(Number(b.dataset.index));
  });
  $("submit").addEventListener("click", submit);
  $("close-result").addEventListener("click", closeResult);
  $("next-day").addEventListener("click", nextDay);
  $("rank-ups").addEventListener("click", e => { if (e.target.closest("#rank-up-next")) showNextRankUp(); });
  $("open-detail").addEventListener("click", () => openDetail(state.req.clientId, "result"));
  // メニュー（ホームだけで開ける）
  const menuDlg = $("menu");
  const closeMenu = () => { if (menuDlg.close) menuDlg.close(); else menuDlg.removeAttribute("open"); };
  $("open-menu").addEventListener("click", () => { if (menuDlg.showModal) menuDlg.showModal(); else menuDlg.setAttribute("open", ""); });
  $("menu-close").addEventListener("click", closeMenu);
  $("menu-zukan").addEventListener("click", () => {
    closeMenu(); viewCo = state.company;
    // 新しい品があるときは品のタブから。新しい品がほかの会社のものだけなら、その会社を開く
    const nz = state.news.zukan.map(v => companyOfItem(itemById(v.split(":")[0])));
    if (nz.length && !nz.includes(viewCo)) viewCo = nz[0];
    const tab = state.news.menu.zukan ? "items" : "clients";
    state.news.menu.zukan = false; persist();
    openZukan(tab);
  });
  document.querySelectorAll("#zukan-co .tab").forEach(b => b.addEventListener("click", () => { viewCo = b.dataset.co; openZukan(); }));
  document.querySelectorAll("#deco-co .tab").forEach(b => b.addEventListener("click", () => { viewCo = b.dataset.co; openDeco({ place: "shelf", i: 0 }); }));
  $("menu-title").addEventListener("click", () => { closeMenu(); openTitle(); });
  document.querySelectorAll("#screen-zukan .tab[data-tab]").forEach(b => b.addEventListener("click", () => openZukan(b.dataset.tab)));
  $("zukan-back").addEventListener("click", () => { if (state.news.zukan.length) { state.news.zukan = []; persist(); } goHome(); });
  $("menu-dress").addEventListener("click", () => {
    closeMenu(); state.news.menu.dress = false; persist();
    // 新しい品がある部位から開く
    const f = ITEMS.items.find(i => i.use === "wear" && state.news.fresh.some(v => v.split(":")[0] === i.id));
    openDress(f ? f.part : "head");
  });
  $("create-options").addEventListener("click", e => { const b = e.target.closest(".opt"); if (b) pickOption(b.dataset.key, b.dataset.value); });
  $("create-random").addEventListener("click", randomDraft);
  $("create-ok").addEventListener("click", finishCreate);
  $("create-name").addEventListener("keydown", e => { if (e.key === "Enter") finishCreate(); });
  document.querySelectorAll("#screen-dress .tab").forEach(b => b.addEventListener("click", () => openDress(b.dataset.part)));
  $("wear-list").addEventListener("click", e => { const b = e.target.closest(".wear-item"); if (b) setWear(b.dataset.wear); });
  $("dress-look").addEventListener("click", () => openCreate("edit"));
  $("dress-back").addEventListener("click", goHome);
  $("menu-deco").addEventListener("click", () => {
    closeMenu(); state.news.menu.deco = false; persist();
    // 新しい品があるときは、その会社・その場所から開く
    const f = ITEMS.items.find(i => i.use === "deco" && state.news.fresh.some(v => v.split(":")[0] === i.id));
    viewCo = f ? companyOfItem(f) : state.company;
    openDeco({ place: f ? f.place : "shelf", i: 0 });
  });
  $("deco-spots").addEventListener("click", e => { const b = e.target.closest(".deco-spot"); if (b) openDeco({ place: b.dataset.place, i: Number(b.dataset.i) }); });
  $("deco-list").addEventListener("click", e => { const b = e.target.closest(".wear-item"); if (b) setDeco(b.dataset.deco); });
  $("deco-back").addEventListener("click", goHome);
  $("regular-list").addEventListener("click", e => {
    const b = e.target.closest("[data-client]"); if (b) openDetail(b.dataset.client, "list");
  });
  $("detail-back").addEventListener("click", () => state.detailFrom === "result" ? show("screen-result") : state.detailFrom === "list" ? openZukan("regulars", true) : goHome());
  // 図鑑のカードも、出し終わったものに印を付ける（css の .zk-anim.in）
  $("screen-zukan").addEventListener("animationend", e => { if (e.target.classList.contains("zk-anim")) e.target.classList.add("in"); });
  // 結果の「選んだカード」は、出し終わった行に印を付ける（画面を出し直しても、もう一度は動かさない。css の .result-picks li.in）
  $("result-picks").addEventListener("animationend", e => { if (e.target.parentNode === $("result-picks")) e.target.classList.add("in"); });
  $("coach-skip").addEventListener("click", () => {
    state.tutorial = null;
    coach(null);
    if (document.body.dataset.screen === "screen-proposal") renderProposal();
  });
  $("coach-ok").addEventListener("click", () => {
    const cur = state.tutorial && state.tutorial.current;
    if (!cur) return;
    state.tutorial.done.add(cur);
    // 提案書の画面では、欄→カード→提出の順に続けて案内する
    if (document.body.dataset.screen === "screen-proposal" && tutorialNow()) coach(proposalStep(SLOTS.every(k => state.picks[k])));
    else if (cur === "result") coach("close");
    else coach(null);
  });

  // 看板はランクで変わる（ホームとタイトル）
  function drawLogos() { if (UI && UI.logo && $("logo")) $("logo").innerHTML = UI.logo(state.rank.level); }
  drawLogos();

  // 開発用：?tutorial=off でチュートリアルなし（画面テスト用）
  // 開発用：?day=3 でその日から始める（タイトル・チュートリアルなし）
  // 開発用：?day=N のときは保存を読まず、保存もしない（いまの記録を消さないため）
  const qDay = Number(new URLSearchParams(location.search).get("day"));
  if (qDay >= 1) reset(qDay);
  else {
    reset(1);
    const r = SAVE && STORE ? SAVE.load(STORE) : { ok: false, reason: "none" };
    if (r.ok) restore(r.data);
    else if (r.reason === "broken" || r.reason === "newer") loadNote = "保存データを読み込めませんでした。「はじめる」から新しく遊べます";
    openTitle();
  }
  window.__readyAt = performance.now();
  document.body.dataset.ready = "1";
  // テスト用：state.companies に会社ごとの記録。nextRequest(会社) で次に来る依頼、queueOf(会社) で順番待ち
  // company：今の会社（最後に入った会社）／companyState(会社)：その会社の記録（ランク・常連・順番待ちなど）
  window.__yorozu = {
    state, DAYS, COMPANIES, nextRequest, queueOf, snapshot, restore, fixPlayer,
    // テスト用：依頼の提案書をすぐ開く（候補カードの名前の折り返しを確かめる）
    openProposalFor: (id, slot) => { startRequest(Object.assign({}, reqById(id), { time: "朝" })); openProposal(); state.activeSlot = slot || SLOTS[0]; renderProposal(); },
    get company() { return state.company; },
    companyState: c => state.companies[c],
    isOpen
  };
})();
