// よろず提案所：画面の進行（ホーム→事務所→提案書→結果→…→1日の集計→次の日へ、を4日間）
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
  let playedOnce = false; // 4日目まで遊び終えて「最初から」を押したか（2周目は案内をとばせる）
  const NO_TUTORIAL = new URLSearchParams(location.search).get("tutorial") === "off";
  const PC = window.matchMedia("(min-width: 900px) and (orientation: landscape)");
  const SLOT_ICON = {
    destination: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6l3.5 10L12 14l-3.5 2z" fill="currentColor"/></svg>',
    activity: '<svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="2.4" fill="currentColor"/><path d="M8 10l-3 4m3-4l4 2 3-3m-7 1l1 6-3 4m3-4l5 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    food: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 4v7m0-7v16M21 4c-2 2-2 6 0 7v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    surprise: '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M12 10v10M12 10c-3-5-7-3-4-1m4 1c3-5 7-3 4-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  // 来店日はデータの day と time で決まる（本番でランダムにする時はここを差しかえる）
  const DAYS = [...new Set(DATA.requests.map(r => r.day))].sort((a, b) => a - b);
  const requestsOf = day => DATA.requests.filter(r => r.day === day)
    .sort((a, b) => TIMES.indexOf(a.time) - TIMES.indexOf(b.time));

  const state = {
    dayIdx: 0, timeIdx: 0, req: null, client: null, lines: [], lineIndex: 0,
    budget: 0, bonus: 0, picks: {}, activeSlot: SLOTS[0], result: null,
    today: [],          // 今日の結果 [{req, total, stars}]
    dayAverages: [],    // 日ごとの平均
    history: {},        // clientId → [{reqId, day, time, total, picks:[名前]}]
    regulars: [],       // 常連になった clientId
    detailFrom: null,
    tutorial: null      // 1日目の案内の進み具合
  };
  const day = () => DAYS[state.dayIdx];

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
    result: { text: "選んだカードの◎は本音に合った札、△は本音とは別、×は苦手な札。49点以下のときや、本音に合うカードが1枚もないときは、依頼者が本当の気持ちを教えてくれる。", allow: ["#coach-ok"], spot: [".picks-panel"] },
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
    $("coach-skip").hidden = !playedOnce;
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
    $("open-regulars").hidden = state.regulars.length === 0;
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
    $("office-card-profile").textContent = `${state.client.kind}・${state.client.profile}`;
    face($("client-figure"), state.client, "normal");
    const memo = $("client-memo");
    if (state.client.unusual && req.visit === 1 && state.client.memo.length) {
      memo.hidden = false;
      memo.innerHTML = `<b>依頼者メモ</b>${state.client.kind}の苦手なもの：${state.client.memo.join("・")}`;
    } else memo.hidden = true;

    if (ART.office) {
      $("office-bg").innerHTML = ART.office(req.time);
      $("counter").innerHTML = ART.counter();
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
    $("cost-note").textContent = `合計 ${money(res.cost, r.budget.unit)}／予算 ${money(state.budget, r.budget.unit)}` + (res.budget ? "" : "（予算オーバー）");

    // 記録
    (state.history[r.clientId] = state.history[r.clientId] || []).push({ reqId: r.id, day: r.day, time: r.time, total: res.total, stars: res.stars, picks: cards.map(c => c.name) });
    state.today.push({ req: r, total: res.total, stars: res.stars });
    const newRegular = r.becomesRegular && !state.regulars.includes(r.clientId);
    if (newRegular) state.regulars.push(r.clientId);
    $("regular-note").hidden = !newRegular;
    $("regular-name").textContent = state.client.name;

    show("screen-result");
    coach(tutorialNow() ? "result" : null);
  }
  function closeResult() {
    coachDone("close");
    if (tutorialNow()) state.tutorial.firstDone = true;
    state.timeIdx++;
    if (state.timeIdx >= requestsOf(day()).length) summary();
    else goHome();
  }

  // ---- 1日の集計 ----
  function summary() {
    const avg = state.today.length ? dayAverage(state.today.map(t => t.total)) : 0;
    state.dayAverages[state.dayIdx] = avg;
    setTop("夜", state.today.length);
    $("summary-title").textContent = day() + "日目のまとめ";
    $("summary-rows").innerHTML = state.today.map(t => `<li data-time="${t.req.time}">
      <span class="t">${t.req.time}</span><span class="n">${DATA.clients[t.req.clientId].name}</span>
      <span class="s">${points(t.total)}点</span><span class="stars small">${starHtml(t.stars)}</span></li>`).join("");
    $("summary-avg").textContent = points(Math.round(avg * 10) / 10);
    // ランクアップの進み具合：最後から続けて平均70点以上の日数
    let streak = 0;
    for (let i = state.dayAverages.length - 1; i >= 0 && state.dayAverages[i] >= RANK_AVG; i--) streak++;
    $("rank-text").textContent = Math.min(streak, RANK_DAYS) + "/" + RANK_DAYS + "日";
    $("rank-bar").style.width = Math.min(streak, RANK_DAYS) / RANK_DAYS * 100 + "%";
    const last = state.dayIdx >= DAYS.length - 1;
    $("next-day").textContent = last ? "最初から" : "次の日へ";
    $("next-day").dataset.last = last ? "1" : "0";
    show("screen-summary");
    coach(state.tutorial ? "summary" : null);
  }
  function nextDay() {
    coachDone("summary");
    if ($("next-day").dataset.last === "1") { playedOnce = true; reset(0, true); return; }
    state.dayIdx++; state.timeIdx = 0; state.today = []; state.tutorial = null;
    goHome();
  }

  // ---- 常連さんの一覧 ----
  function openRegulars() {
    $("regular-list").innerHTML = state.regulars.map(id => {
      const c = DATA.clients[id], v = state.history[id] || [], last = v[v.length - 1];
      return `<li><button class="regular-item" data-client="${id}" data-testid="regular-${id}">
        <span class="client-figure regular-face" data-face="${id}" aria-hidden="true"></span>
        <span class="regular-text"><b>${c.name}</b><small>${c.kind}・来店${v.length}回${last ? `・前回${points(last.total)}点` : ""}</small></span>
        <span class="regular-go" aria-hidden="true">›</span></button></li>`;
    }).join("");
    $("regular-list").querySelectorAll("[data-face]").forEach(el => face(el, DATA.clients[el.dataset.face], "normal"));
    show("screen-regulars");
    coach(null);
  }

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

  // ---- 最初から ----
  function reset(dayIdx, withTitle) {
    Object.assign(state, { dayIdx, timeIdx: 0, today: [], dayAverages: [], history: {}, regulars: [], tutorial: dayIdx === 0 && !NO_TUTORIAL ? { done: new Set(), current: null } : null });
    if (withTitle) openTitle(); else goHome();
  }

  // ---- タイトル ----
  function openTitle() {
    if (ART.city && !$("title-bg").innerHTML) $("title-bg").innerHTML = ART.city("朝").replace("<svg ", '<svg preserveAspectRatio="xMidYMid slice" ');
    if (UI && UI.logo) $("title-logo").innerHTML = UI.logo();
    coach(null);
    show("screen-title");
  }

  // ---- つなぎ ----
  $("start").addEventListener("click", goHome);
  $("company-travel").addEventListener("click", () => { coachDone("home"); startRequest(requestsOf(day())[state.timeIdx]); });
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
  $("open-regulars").addEventListener("click", openRegulars);
  $("regulars-back").addEventListener("click", goHome);
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

  if (UI && $("logo")) $("logo").innerHTML = UI.logo();

  // 開発用：?tutorial=off でチュートリアルなし（画面テスト用）
  // 開発用：?day=3 でその日から始める（タイトル・チュートリアルなし）
  const qDay = Number(new URLSearchParams(location.search).get("day"));
  if (qDay && DAYS.includes(qDay)) reset(DAYS.indexOf(qDay)); else reset(0, true);
  window.__readyAt = performance.now();
  document.body.dataset.ready = "1";
  window.__yorozu = { state, DAYS, requestsOf };
})();
