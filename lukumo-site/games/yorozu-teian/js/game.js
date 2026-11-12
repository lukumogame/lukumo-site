// よろず提案所：画面の進行（ホーム→事務所→提案書→結果→…→1日の集計→次の日へ。日付は終わりなく続く）
(function () {
  "use strict";
  const { SLOTS, SLOT_NAMES, scoreProposal, reactionOf, dayAverage } = window.YorozuScore;
  const DATA = window.YOROZU_DATA;
  const $ = id => document.getElementById(id);
  // 絵（svg/*.js）。読み込めなかった時は仮の図形のまま遊べる
  const ART = window.YorozuArt || {};
  const UI = ART.ui || null;
  const clientIdOf = c => Object.keys(DATA.clients).find(k => DATA.clients[k] === c);
  const slotIcon = s => UI ? UI.slotIcon(s) : SLOT_ICON[s];
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

  // 来店の予定は js/schedule.js で作り、保存データ（state.schedule）に入れる
  // 1日目は固定、2〜7日目は乱数で並べる、8日目以降はその日の朝に決める
  // 開発用：?schedule=fixed でデータの day・time どおり（テストと試遊の再現用。8日目以降は乱数の種0で決める）
  const SCHED = window.YorozuSchedule;
  const FIXED = new URLSearchParams(location.search).get("schedule") === "fixed";
  const DAYS = [...new Set(DATA.requests.map(r => r.day))].sort((a, b) => a - b);
  const reqById = id => DATA.requests.find(r => r.id === id);
  const newSeed = () => FIXED ? 0 : 1 + Math.floor(Math.random() * 2147483646);
  function idsOf(day) {
    const S = state.schedule;
    if (!S.days[day]) {
      if (day <= SCHED.WEEK) {
        let week;
        try { week = FIXED ? SCHED.fixedWeek(DATA.requests) : SCHED.buildWeek(DATA.requests, S.seed); }
        catch (e) { week = SCHED.fixedWeek(DATA.requests); }
        for (let d = 1; d <= SCHED.WEEK; d++) if (!S.days[d]) S.days[d] = week[d];
      } else {
        S.days[day] = SCHED.pickDay(day, S.seed, { requests: DATA.requests, regulars: state.regulars, perfect: state.perfect, days: S.days });
      }
    }
    return S.days[day] || [];
  }
  // その日の依頼（朝・昼・夜の順）。来た日と時間帯は予定のものに置きかえる
  const requestsOf = day => idsOf(day).map(reqById).filter(Boolean).map((r, k) => Object.assign({}, r, { day, time: TIMES[k] }));

  const state = {
    day: 1, timeIdx: 0, req: null, client: null, lines: [], lineIndex: 0,
    budget: 0, bonus: 0, picks: {}, activeSlot: SLOTS[0], result: null,
    today: [],          // 今日の結果 [{req, total, stars}]
    dayAverages: [],    // 日ごとの平均
    history: {},        // clientId → [{reqId, day, time, total, picks:[名前]}]
    regulars: [],       // 常連になった clientId
    detailFrom: null,
    tutorial: null,     // 1日目の案内の進み具合
    playedOnce: false,  // 前の記録で1日目の案内を終えたか（はじめからの2周目は案内をとばせる）
    // 第1段のフェーズ3〜5で使う。今は保存と読み込みで同じ中身を引きつぐだけ
    met: [], schedule: { seed: 0, days: {} }, perfect: [], rank: { level: 1, streak: 0 },
    player: null, items: {}, deco: null
  };
  const day = () => state.day;

  // ---- セーブ ----
  function snapshot() {
    const t = state.tutorial;
    return {
      game: {
        day: state.day, timeIdx: state.today.length,
        today: state.today.map(x => ({ reqId: x.req.id, total: x.total, stars: x.stars })),
        dayAverages: state.dayAverages.map(a => a ?? null), history: state.history, regulars: state.regulars,
        met: state.met, schedule: state.schedule, perfect: state.perfect, rank: state.rank,
        tutorial: t ? { done: [...t.done], firstDone: !!t.firstDone } : null, playedOnce: state.playedOnce
      },
      player: state.player, items: state.items, deco: state.deco
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
  function restore(d) {
    const g = d.game;
    state.schedule = g.schedule;
    if (!state.schedule.seed && !FIXED) state.schedule.seed = newSeed();
    state.regulars = g.regulars; state.perfect = g.perfect;
    const reqs = requestsOf(g.day);
    Object.assign(state, {
      day: g.day, timeIdx: g.today.length,
      today: g.today.map((x, i) => ({ req: reqs[i] && reqs[i].id === x.reqId ? reqs[i] : reqById(x.reqId), total: x.total, stars: x.stars })),
      dayAverages: g.dayAverages.slice(), history: g.history, regulars: g.regulars,
      met: g.met, schedule: g.schedule, perfect: g.perfect, rank: g.rank,
      tutorial: g.tutorial && !NO_TUTORIAL ? { done: new Set(g.tutorial.done), current: null, firstDone: g.tutorial.firstDone } : null,
      playedOnce: g.playedOnce, player: fixPlayer(d.player), items: d.items, deco: d.deco
    });
  }

  // ---- 表示用の小道具 ----
  function money(n, unit) { return unit === "円" ? n.toLocaleString("ja-JP") + "円" : unit + " " + n.toLocaleString("ja-JP"); }
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
    const total = requestsOf(day()).length;
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
    score: { text: "点数は100点満点。本音に合うカード1枚ごとに12.5点（最大50点）、予算を守れば30点、依頼者の苦手なものがなければ20点。", allow: ["#coach-ok"], spot: ["#budget"] },
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
    const reqs = requestsOf(day());
    const time = TIMES[Math.min(state.timeIdx, TIMES.length - 1)];
    setTop(time, state.timeIdx);
    $("city").dataset.time = time;
    if (ART.city) drawCity(time);
    $("home-note").textContent = `${day()}日目の${time}。旅行・デートの会社に依頼者が来ています。`;
    $("menu-new").hidden = !state.newItem;
    drawMe();
    drawLogos();
    // 依頼者が来ている会社に人数の札（①②…）を出す。会社は依頼の company（なければ旅行・デート）
    const waiting = {};
    reqs.slice(state.timeIdx).filter(r => r.time === time).forEach(r => { const c = r.company || "travel"; waiting[c] = (waiting[c] || 0) + 1; });
    document.querySelectorAll("#city .waiting").forEach(el => {
      const key = el.closest(".company").dataset.company, n = waiting[key] || 0;
      el.hidden = n === 0;
      el.textContent = n > 0 && n <= 20 ? String.fromCharCode(0x245F + n) : String(n);
      el.setAttribute("aria-label", `お客さん${n}人`);
      el.dataset.count = n;
    });
    $("today-list").innerHTML = reqs.map((r, i) => {
      const done = state.today[i];
      const label = done ? `${DATA.clients[r.clientId].name}　${points(done.total)}点` : i === state.timeIdx ? "依頼者が来ています" : "これから";
      return `<li class="${done ? "done" : i === state.timeIdx ? "now" : ""}"><span class="t">${r.time}</span><span>${label}</span></li>`;
    }).join("");
    show("screen-home");
    placeWalker();
    if (tutorialNow()) coach("home"); else coach(null);
    if (!reqs.length) summary();
  }

  // ---- 事務所 ----
  function startRequest(req) {
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
    if (again) $("again-note").textContent = `また相談に来てくれました　前回 ${points(sameReq[sameReq.length - 1].total)}点`;
    if (state.client.unusual && !past.length && state.client.memo.length) {
      memo.hidden = false;
      memo.innerHTML = `<b>依頼者メモ</b>${state.client.name}の苦手なもの：${state.client.memo.join("・")}`;
    } else memo.hidden = true;

    if (ART.office) {
      $("office-bg").innerHTML = ART.office(req.time, officeOpts());
      $("counter").innerHTML = ART.counter(state.rank.level);
      $("office-scene").classList.add("has-art");
    }
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
    $("budget-amount").textContent = money(state.budget, r.budget.unit);
    $("budget-bonus").textContent = state.bonus ? `（常連の増額＋${money(state.bonus, r.budget.unit)}）` : "";
    $("budget-duration").textContent = r.budget.duration;
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
        <span class="slot-name">${SLOT_NAMES[s]}</span>
        ${c ? `<span class="slot-card">${c.name}</span><span class="cost">${money(c.cost, r.budget.unit)}</span>${checkMark()}`
            : `<span class="slot-empty">えらんでね</span>`}
      </button>`;
    }).join("");
    $("cards-title").textContent = SLOT_NAMES[state.activeSlot] + "の候補";
    $("cards").innerHTML = r.slots[state.activeSlot].map((c, i) => {
      const on = state.picks[state.activeSlot] === c;
      return `<button class="card${on ? " picked" : ""}" data-index="${i}" data-testid="card-${i}" aria-pressed="${on}">
        <span class="card-art slot-${state.activeSlot}" data-art="${c.art || ""}">${cardArt(state.activeSlot, i, c)}</span>
        <span class="card-name">${c.name}</span>
        <span class="cost">${money(c.cost, r.budget.unit)}</span>
        ${on ? checkMark() : ""}
      </button>`;
    }).join("");
    const sum = SLOTS.reduce((s, k) => s + (state.picks[k] ? state.picks[k].cost : 0), 0);
    $("sum-cost").textContent = money(sum, r.budget.unit);
    $("sum-cost").classList.toggle("over", sum > state.budget);
    const left = state.budget - sum;
    $("budget-left").textContent = left >= 0 ? "残り " + money(left, r.budget.unit) : money(-left, r.budget.unit) + " オーバー";
    $("budget-left").classList.toggle("over", left < 0);
    const full = SLOTS.every(s => state.picks[s]);
    $("submit").disabled = !full;
    if (tutorialNow()) coach(proposalStep(full));
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
    $("result-picks").innerHTML = SLOTS.map((s, i) => {
      const c = cards[i];
      const bad = c.tags.some(t => r.dislikeTags.includes(t));
      const hit = c.tags.some(t => r.honneTags.includes(t));
      const [cls, mk, label] = bad ? ["m-bad", "×", "苦手なもの"] : hit ? ["m-hit", "◎", "本音に合った"] : ["m-miss", "△", "本音とは別"];
      return `<li class="${cls}" data-mark="${cls}"><span class="mk ${cls}" aria-label="${label}">${mk}</span><span class="pk-slot">${SLOT_NAMES[s]}</span><span class="pk-name">${c.name}</span></li>`;
    }).join("");
    // 依頼者の本音：選んだカードのどれかに入っていれば「当てた」、どれにもなければ「外れた」
    $("honne-tags").innerHTML = r.honneTags.map(t => {
      const hit = cards.some(c => c.tags.includes(t));
      return `<li class="${hit ? "h-hit" : "h-miss"}" data-hit="${hit}"><span class="mk" aria-hidden="true">${hit ? "◎" : "✕"}</span>${t}<small>${hit ? "当てた" : "外れた"}</small></li>`;
    }).join("");
    $("cost-note").textContent = `合計 ${money(res.cost, r.budget.unit)}／予算 ${money(state.budget, r.budget.unit)}` + (res.budget ? "" : "（予算オーバー）");

    // 記録
    (state.history[r.clientId] = state.history[r.clientId] || []).push({ reqId: r.id, day: r.day, time: r.time, total: res.total, stars: res.stars, picks: cards.map(c => c.name) });
    state.today.push({ req: r, total: res.total, stars: res.stars });
    if (!state.met.includes(r.clientId)) state.met.push(r.clientId);
    if (res.total === 100 && !state.perfect.includes(r.id)) state.perfect.push(r.id);
    const newRegular = r.becomesRegular && !state.regulars.includes(r.clientId);
    if (newRegular) state.regulars.push(r.clientId);
    // もらえる品：常連の回（3回目の来店から）は80点以上でそのキャラの品、ほかは100点で種類の品
    const got = RW ? RW.award({ total: res.total, clientId: r.clientId, species: state.client.species, regularVisit: state.regulars.includes(r.clientId) }, ITEMS, state.items) : null;
    showReward(got);
    if (got && got.item) { state.items = RW.grant(state.items, got); state.newItem = true; }
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
    if (state.timeIdx >= requestsOf(day()).length) summary();
    else goHome();
  }

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
      // 全部の色がそろった常連さんは、キャラごとのお礼の一言（data/requests.json の clients.*.thanks）
      $("reward-text").textContent = `${state.client.name}「${state.client.thanks || "いつもありがとう！"}」`;
      return;
    }
    $("reward-icon").innerHTML = itemIcon(got.item, got.color);
    $("reward-text").textContent = got.kind === "color" ? `「${got.item.name}」の色違いをもらった！` : `「${got.item.name}」をもらった！`;
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
    $("summary-rows").innerHTML = state.today.map(t => `<li data-time="${t.req.time}">
      <span class="t">${t.req.time}</span><span class="n">${DATA.clients[t.req.clientId].name}</span>
      <span class="s">${points(t.total)}点</span><span class="stars small">${starHtml(t.stars)}</span></li>`).join("");
    $("summary-avg").textContent = points(Math.round(avg * 10) / 10);
    // ランクアップ：平均70点以上の日が連続5日で上がる（1日でも下回ったら0に戻る）。同じ日は2回数えない（js/rank.js）
    let up = false;
    if (RK) { const r = RK.countDay(state.rank, day(), avg); up = r.up; state.rank = r.rank; if (up) state.rank.upDay = day(); }
    if (state.rank.upDay === day()) up = true; // つづきから集計を開き直したときも、その日のランクアップを見せる
    const lv = state.rank.level || 1, st = state.rank.streak || 0;
    $("rank-name").textContent = RK ? RK.NAMES[lv] : "";
    // ランクアップした日は「0日連続」と空のバーを出さず、次のランクの案内を1行だけ（次の日の集計からはいつもの表示）
    $("rank-text").textContent = up && RK ? (lv < RK.MAX ? `次は「${RK.NAMES[lv + 1]}」へ。${RANK_DAYS}日連続でランクアップ` : "最高ランクになりました") : RK ? RK.barText(state.rank) : st + "/" + RANK_DAYS + "日";
    $("rank-bar").style.width = (lv >= 3 ? 100 : st / RANK_DAYS * 100) + "%";
    $("rank-bar").parentElement.hidden = up;
    document.querySelector("#screen-summary .rank > small").hidden = up;
    $("rank-up").hidden = !up;
    if (up) { $("rank-up-name").textContent = `「${RK.NAMES[lv]}」になりました`; if (UI && UI.logo) $("rank-up-logo").innerHTML = UI.logo(lv); }
    drawLogos();
    show("screen-summary");
    persist();
    coach(state.tutorial ? "summary" : null);
  }
  function nextDay() {
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
    document.querySelectorAll("#screen-dress .tab").forEach(b => { const on = b.dataset.part === dressPart; b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on)); });
    $("dress-figure").innerHTML = playerSvg(state.player);
    const cur = state.player.wear[dressPart];
    const mine = ITEMS.items.filter(i => i.use === "wear" && i.part === dressPart && (state.items[i.id] || []).length);
    $("wear-empty").hidden = mine.length > 0;
    const cells = mine.flatMap(i => (state.items[i.id] || []).map(c => {
      const v = i.id + ":" + c;
      return `<li><button class="wear-item${cur === v ? " on" : ""}" data-wear="${v}" data-testid="wear-${i.id}-${c}" aria-pressed="${cur === v}"><span class="zk-icon">${itemIcon(i, c)}</span><span class="wi-text"><b class="wi-name">${i.name}</b>${c ? `<small class="wi-tag">色違い</small>` : ""}</span></button></li>`;
    }));
    $("wear-list").innerHTML = (mine.length ? [`<li><button class="wear-item${cur ? "" : " on"}" data-wear="" data-testid="wear-none" aria-pressed="${!cur}"><span class="zk-icon missing"></span><span>はずす</span></button></li>`] : []).concat(cells).join("");
    show("screen-dress");
    requestAnimationFrame(fitNames);
    coach(null);
  }
  function setWear(v) {
    state.player.wear[dressPart] = v || null;
    persist();
    drawMe();
    openDress();
  }

  // ---- 飾りつけ：棚3か所・壁2か所 ----
  // 保存の形は deco = { shelf: ["品ID:色"|null ×3], wall: [… ×2] }。持っていない品・場所に合わない品は飾らない
  function decoArt(v, place) {
    const [id, c] = v ? v.split(":") : [];
    const it = id && itemById(id);
    return it && it.use === "deco" && it.place === place && (state.items[id] || []).includes(Number(c)) ? itemIcon(it, Number(c)) : null;
  }
  function officeOpts(fit) {
    const d = state.deco || { shelf: [], wall: [] };
    return { rank: state.rank.level, fit, deco: { shelf: (d.shelf || []).map(v => decoArt(v, "shelf")), wall: (d.wall || []).map(v => decoArt(v, "wall")) } };
  }
  let decoSpot = null; // { place, i }
  function openDeco(spot) {
    if (!state.deco) state.deco = SAVE.blank().deco;
    decoSpot = spot || decoSpot || { place: "shelf", i: 0 };
    const time = TIMES[Math.min(state.timeIdx, 2)];
    $("deco-bg").innerHTML = ART.office ? ART.office(time, officeOpts("meet")) : "";
    $("deco-counter").innerHTML = ART.counter ? ART.counter(state.rank.level) : "";
    // 飾る場所：絵の中は場所を示す枠だけ（押せない）。押すボタンは絵の下に5つ並べる（棚の段は間が狭く、44px のボタンが重なるため）
    const S = ART.DECO_SPOTS || { shelf: [], wall: [] };
    $("deco-scene").querySelectorAll(".deco-mark").forEach(b => b.remove());
    const btns = [];
    ["shelf", "wall"].forEach(place => S[place].forEach((q, i) => {
      const on = decoSpot.place === place && decoSpot.i === i, v = state.deco[place][i];
      const m = document.createElement("span");
      m.className = "deco-mark" + (on ? " on" : "");
      m.setAttribute("aria-hidden", "true");
      Object.assign(m.style, { left: (q.x / 400 * 100) + "%", top: (q.y / 300 * 100) + "%", width: (q.w / 400 * 100) + "%", height: (q.h / 300 * 100) + "%" });
      $("deco-scene").appendChild(m);
      const [id, c] = v ? v.split(":") : [];
      const it = id && itemById(id);
      btns.push(`<button class="deco-spot${on ? " on" : ""}${v ? " filled" : ""}" data-place="${place}" data-i="${i}" data-testid="spot-${place}-${i}" aria-pressed="${on}" aria-label="${place === "shelf" ? "棚" : "壁"}の${i + 1}か所目"><small>${place === "shelf" ? "棚" : "壁"}${i + 1}</small>${it ? `<span class="zk-icon">${itemIcon(it, Number(c))}</span>` : ""}</button>`);
    }));
    $("deco-spots").innerHTML = btns.join("");
    // 選んだ場所に飾れる品
    const place = decoSpot.place, cur = state.deco[place][decoSpot.i];
    $("deco-help").textContent = `${place === "shelf" ? "棚" : "壁"}の${decoSpot.i + 1}か所目に飾る品を選んでね。`;
    const mine = ITEMS.items.filter(i => i.use === "deco" && i.place === place && (state.items[i.id] || []).length);
    $("deco-empty").hidden = mine.length > 0;
    $("deco-empty").textContent = mine.length ? "" : `まだ${place === "shelf" ? "棚" : "壁"}に飾れる品がありません。依頼者が大喜びすると、品をもらえることがあります。`;
    const cells = mine.flatMap(i => (state.items[i.id] || []).map(c => {
      const v = i.id + ":" + c;
      return `<li><button class="wear-item${cur === v ? " on" : ""}" data-deco="${v}" data-testid="deco-${i.id}-${c}" aria-pressed="${cur === v}"><span class="zk-icon">${itemIcon(i, c)}</span><span class="wi-text"><b class="wi-name">${i.name}</b>${c ? `<small class="wi-tag">色違い</small>` : ""}</span></button></li>`;
    }));
    $("deco-list").innerHTML = (mine.length ? [`<li><button class="wear-item${cur ? "" : " on"}" data-deco="" data-testid="deco-none" aria-pressed="${!cur}"><span class="zk-icon missing"></span><span>はずす</span></button></li>`] : []).concat(cells).join("");
    show("screen-deco");
    requestAnimationFrame(fitNames);
    coach(null);
  }
  function setDeco(v) {
    const d = state.deco, { place, i } = decoSpot;
    // 同じ品（同じ色）を2か所には飾らない：ほかの場所にあれば、こちらへ移す
    if (v) ["shelf", "wall"].forEach(pl => d[pl].forEach((x, k) => { if (x === v) d[pl][k] = null; }));
    d[place][i] = v || null;
    persist();
    openDeco();
  }

  // ---- 街を歩く：会社をタップすると、自分のキャラが道に沿って入口まで歩く（約1秒） ----
  let cityView = CITY_VIEW.phone, walking = null;
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)");
  // 自分のキャラが立っている場所（会社の名札にかからない道の上）。歩くときは近くの交差点（425,340）を通る
  const HOME_SPOT = { u: 425, v: 450 }, CROSS = { u: 425, v: 340 };
  function cityPct(pt) { const [vx, vy, vw, vh] = cityView; return { left: ((pt.x - vx) / vw * 100) + "%", top: ((pt.y - vy) / vh * 100) + "%" }; }
  function walkPoints(key) {
    const R = ART.CITY_ROADS, g = R && R.ground[key];
    if (!g) return null;
    const near = (list, x) => list.reduce((a, b) => Math.abs(b - x) < Math.abs(a - x) ? b : a);
    const uR = near(R.UR, g.u);
    return [[HOME_SPOT.u, HOME_SPOT.v], [CROSS.u, CROSS.v], [uR, CROSS.v], [uR, g.v], [g.u, g.v]].map(([u, v]) => R.toXY(u, v));
  }
  function placeWalker() {
    const w = $("walker");
    if (!state.player || !ART.CITY_ROADS) { w.hidden = true; return; }
    w.hidden = false;
    w.innerHTML = playerSvg(state.player);
    Object.assign(w.style, cityPct(ART.CITY_ROADS.toXY(HOME_SPOT.u, HOME_SPOT.v)));
    w.classList.remove("walking");
  }
  function walkTo(key, done) {
    const pts = walkPoints(key), w = $("walker");
    if (!pts || REDUCE.matches || w.hidden || !w.animate) { done(); return; }
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
  const CLIENT_ORDER = [...new Set(DATA.requests.map(r => r.clientId))];
  function openZukan(tab) {
    zukanTab = tab || zukanTab;
    document.querySelectorAll("#screen-zukan .tab").forEach(b => {
      const on = b.dataset.tab === zukanTab;
      b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on));
    });
    document.querySelectorAll("#screen-zukan [data-pane]").forEach(el => { el.hidden = el.dataset.pane !== zukanTab; });
    $("zukan-icon").innerHTML = iconSvg(state.player);
    $("zukan-name").textContent = playerName(state.player) + "の図鑑";
    if (zukanTab === "clients") renderZukanClients();
    if (zukanTab === "regulars") renderRegulars();
    if (zukanTab === "items") { renderZukanItems(); state.newItem = false; }
    show("screen-zukan");
    coach(null);
  }
  function renderZukanClients() {
    const met = CLIENT_ORDER.filter(id => state.met.includes(id)).length;
    $("zukan-count").textContent = `会った依頼者 ${met}/${CLIENT_ORDER.length}人`;
    $("zukan-note").textContent = "まだ会っていない依頼者は、影だけ見えます。";
    $("zukan-clients").innerHTML = CLIENT_ORDER.map(id => {
      const c = DATA.clients[id], seen = state.met.includes(id);
      return `<li class="zk${seen ? "" : " shadow"}" data-client="${id}" data-seen="${seen}"><span class="client-figure zk-face" data-face="${id}" aria-hidden="true"></span>
        <b>${seen ? c.name : "？？？"}</b><small>${seen ? c.kind : ""}</small></li>`;
    }).join("");
    $("zukan-clients").querySelectorAll("[data-face]").forEach(el => face(el, DATA.clients[el.dataset.face], "normal"));
    requestAnimationFrame(fitNames);
  }
  function renderRegulars() {
    $("zukan-count").textContent = `常連さん ${state.regulars.length}人`;
    $("zukan-note").textContent = "名前をタップすると、好みとこれまでの提案が見られます。";
    $("regulars-empty").hidden = state.regulars.length > 0;
    $("regular-list").innerHTML = state.regulars.map(id => {
      const c = DATA.clients[id], v = state.history[id] || [], last = v[v.length - 1];
      return `<li><button class="regular-item" data-client="${id}" data-testid="regular-${id}">
        <span class="client-figure regular-face" data-face="${id}" aria-hidden="true"></span>
        <span class="regular-text"><b>${c.name}</b><small>${c.kind}・来店${v.length}回${last ? `・前回${points(last.total)}点` : ""}</small></span>
        <span class="regular-go" aria-hidden="true">›</span></button></li>`;
    }).join("");
    $("regular-list").querySelectorAll("[data-face]").forEach(el => face(el, DATA.clients[el.dataset.face], "normal"));
  }
  function renderZukanItems() {
    const groups = [...new Set(ITEMS.items.map(i => i.group))];
    const total = ITEMS.items.reduce((n, i) => n + i.colors.length, 0);
    const have = ITEMS.items.reduce((n, i) => n + (state.items[i.id] || []).length, 0);
    $("zukan-count").textContent = `集めた品 ${have}/${total}（色違いを含む）`;
    $("zukan-note").textContent = "常連でない依頼者は100点で、常連さんは80点以上で品をくれます。";
    requestAnimationFrame(fitNames);
    $("zukan-items").innerHTML = groups.map(g => {
      const [kind, key] = g.split(":");
      const known = kind === "species" || state.met.includes(key);
      const title = kind === "species" ? `${ITEMS.groupNames[key] || key}の品` : `${known ? DATA.clients[key].name : "？？？"}の品（常連さん）`;
      const cells = ITEMS.items.filter(i => i.group === g).sort((a, b) => a.order - b.order).map(i => {
        const has = state.items[i.id] || [];
        const any = has.length > 0;
        const dots = i.colors.map((c, k) => has.includes(k)
          ? `<span class="zk-icon" data-color="${k}" title="${k ? "色違い" : "元の色"}">${itemIcon(i, k)}</span>`
          : any ? `<span class="zk-icon missing" data-color="${k}" aria-label="まだの色"></span>`
          : `<span class="zk-icon shadow" data-color="${k}" aria-hidden="true">${itemIcon(i, 0)}</span>`).join("");
        return `<li class="zk item${any ? "" : " unknown"}" data-item="${i.id}" data-owned="${has.join(",")}"><span class="zk-icons">${dots}</span><b>${any ? i.name : "？？？"}</b><small>${any ? (i.use === "wear" ? { head: "頭", body: "服", hand: "手に持つ" }[i.part] : { shelf: "棚に飾る", wall: "壁に飾る" }[i.place]) : ""}</small></li>`;
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
  function openRegulars() { openZukan("regulars"); }

  // ---- 常連のキャラ詳細 ----
  function openDetail(clientId, from) {
    const c = DATA.clients[clientId];
    const visits = state.history[clientId] || [];
    state.detailFrom = from;
    face($("detail-face"), c, "great");
    $("detail-name").textContent = c.name;
    $("detail-profile").textContent = `${c.kind}・${c.profile}`;
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
    Object.assign(state, {
      day: startDay, timeIdx: 0, today: [], dayAverages: [], history: {}, regulars: [],
      tutorial: startDay === 1 && !NO_TUTORIAL ? { done: new Set(), current: null } : null,
      met: [], schedule: { seed: newSeed(), days: {} }, perfect: [], rank: { level: 1, streak: 0 },
      player: b ? b.player : null, items: {}, deco: b ? b.deco : null
    });
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
    const reqs = requestsOf(day());
    if (state.today.length >= reqs.length) summary(); else goHome();
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
  $("company-travel").addEventListener("click", () => {
    if (walking) return;
    coachDone("home");
    walkTo("travel", () => startRequest(requestsOf(day())[state.timeIdx]));
  });
  $("talk-next").addEventListener("click", nextLine);
  $("talk-bubble").addEventListener("click", nextLine);
  $("reread").addEventListener("click", openLog);
  $("log-close").addEventListener("click", closeLog);
  $("open-score-help").addEventListener("click", () => { const d = $("score-help"); if (d.showModal) d.showModal(); else d.setAttribute("open", ""); });
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
  $("open-detail").addEventListener("click", () => openDetail(state.req.clientId, "result"));
  // メニュー（ホームだけで開ける）
  const menuDlg = $("menu");
  const closeMenu = () => { if (menuDlg.close) menuDlg.close(); else menuDlg.removeAttribute("open"); };
  $("open-menu").addEventListener("click", () => { if (menuDlg.showModal) menuDlg.showModal(); else menuDlg.setAttribute("open", ""); });
  $("menu-close").addEventListener("click", closeMenu);
  $("menu-zukan").addEventListener("click", () => { closeMenu(); openZukan(state.newItem ? "items" : "clients"); });
  $("menu-title").addEventListener("click", () => { closeMenu(); openTitle(); });
  document.querySelectorAll("#screen-zukan .tab").forEach(b => b.addEventListener("click", () => openZukan(b.dataset.tab)));
  $("zukan-back").addEventListener("click", goHome);
  $("menu-dress").addEventListener("click", () => { closeMenu(); openDress("head"); });
  $("create-options").addEventListener("click", e => { const b = e.target.closest(".opt"); if (b) pickOption(b.dataset.key, b.dataset.value); });
  $("create-random").addEventListener("click", randomDraft);
  $("create-ok").addEventListener("click", finishCreate);
  $("create-name").addEventListener("keydown", e => { if (e.key === "Enter") finishCreate(); });
  document.querySelectorAll("#screen-dress .tab").forEach(b => b.addEventListener("click", () => openDress(b.dataset.part)));
  $("wear-list").addEventListener("click", e => { const b = e.target.closest(".wear-item"); if (b) setWear(b.dataset.wear); });
  $("dress-look").addEventListener("click", () => openCreate("edit"));
  $("dress-back").addEventListener("click", goHome);
  $("menu-deco").addEventListener("click", () => { closeMenu(); openDeco({ place: "shelf", i: 0 }); });
  $("deco-spots").addEventListener("click", e => { const b = e.target.closest(".deco-spot"); if (b) openDeco({ place: b.dataset.place, i: Number(b.dataset.i) }); });
  $("deco-list").addEventListener("click", e => { const b = e.target.closest(".wear-item"); if (b) setDeco(b.dataset.deco); });
  $("deco-back").addEventListener("click", goHome);
  $("regular-list").addEventListener("click", e => {
    const b = e.target.closest("[data-client]"); if (b) openDetail(b.dataset.client, "list");
  });
  $("detail-back").addEventListener("click", () => state.detailFrom === "result" ? show("screen-result") : state.detailFrom === "list" ? openRegulars() : goHome());
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
  window.__yorozu = { state, DAYS, requestsOf, snapshot, restore, fixPlayer };
})();
