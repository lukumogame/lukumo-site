// よろず提案所：来店の予定づくり（画面を触らない計算だけ。ゲーム本体と node のテストの両方で使う）
// - 1日目はデータの day:1 の3件で固定（チュートリアル）
// - 2〜7日目は、残りの依頼を乱数で並べる。同じ依頼者の n 回目は n−1 回目より後の日。常連の候補は7日目までに全員3回目が来る
// - 8日目以降は1日ずつ決める：常連から1件＋まだ100点を取っていない依頼2件。前の2日に来た依頼は選ばない
// 第2段（1件ごとに会社を選ぶ）：会社ごとに21件の「順番待ち」（buildQueue）を持ち、その会社を選ぶたびに次の1件（nextFor）
// - 順番待ちは1週目の予定（buildWeek）を日の順につなげたもの。旅行・デートだけ遊べば、今までと同じ順で来る
// - 21件を遊び終えた会社は、8日目以降の決まり（pickDay）で、その会社のその日の候補を選び、1件ずつ出す
(function (root) {
  const WEEK = 7, PER_DAY = 3, QUEUE = WEEK * PER_DAY;

  // 再現できる乱数（mulberry32）。tools/check-requests と同じ式
  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(a, r) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const visitOf = r => r.visit || 1;

  // 1週目（1〜7日目）の予定 → { "1": [id×3], …, "7": [id×3] }
  function buildWeek(requests, seed) {
    const first = requests.filter(r => r.day === 1).sort((a, b) => "朝昼夜".indexOf(a.time) - "朝昼夜".indexOf(b.time));
    const rest = requests.filter(r => r.day !== 1);
    if (rest.length !== (WEEK - 1) * PER_DAY) throw new Error(`2〜7日目の依頼が${rest.length}件です（${(WEEK - 1) * PER_DAY}件が必要）`);
    const r = rng(seed);
    for (let tries = 0; tries < 1000; tries++) {
      const order = shuffle(rest.slice(), r);
      // 同じ依頼者の来店は、並べた位置を来店の順に入れかえる（n回目がn−1回目より前に来ないように）
      const byClient = {};
      order.forEach((q, i) => (byClient[q.clientId] = byClient[q.clientId] || []).push(i));
      Object.values(byClient).forEach(pos => {
        const reqs = pos.map(i => order[i]).sort((a, b) => visitOf(a) - visitOf(b));
        pos.forEach((i, k) => { order[i] = reqs[k]; });
      });
      const days = { 1: first.map(q => q.id) };
      for (let d = 2; d <= WEEK; d++) days[d] = order.slice((d - 2) * PER_DAY, (d - 1) * PER_DAY).map(q => q.id);
      if (validWeek(days, requests)) return days;
    }
    // ここに来ることはほぼない（テストで1,000通りの種を確かめている）。来たらデータの固定日を使う
    return fixedWeek(requests);
  }
  function fixedWeek(requests) {
    const days = {};
    for (let d = 1; d <= WEEK; d++) days[d] = requests.filter(r => r.day === d).sort((a, b) => "朝昼夜".indexOf(a.time) - "朝昼夜".indexOf(b.time)).map(r => r.id);
    return days;
  }
  // 決まりを満たすか：1日3件、同じ依頼者は1日1回まで、n回目はn−1回目より後の日、全件が1回ずつ
  function validWeek(days, requests) {
    const byId = Object.fromEntries(requests.map(r => [r.id, r]));
    const seen = new Set(), dayOf = {};
    for (let d = 1; d <= WEEK; d++) {
      const ids = days[d] || [];
      if (ids.length !== PER_DAY) return false;
      const clients = new Set();
      for (const id of ids) {
        const q = byId[id];
        if (!q || seen.has(id) || clients.has(q.clientId)) return false;
        seen.add(id); clients.add(q.clientId);
        (dayOf[q.clientId] = dayOf[q.clientId] || {})[visitOf(q)] = d;
      }
    }
    if (seen.size !== requests.length) return false;
    return Object.values(dayOf).every(v => Object.keys(v).map(Number).sort((a, b) => a - b).every((n, i, a) => i === 0 || v[n] > v[a[i - 1]]));
  }

  // 8日目以降の1日分。ctx = { requests, regulars:[clientId], perfect:[reqId], days:{日:[id]} }
  // 会社ごとに使うときは days のかわりに recent（その会社に直近に来た6件）と usedClients（今日もう来た依頼者。ほかの会社も含む）を渡せる
  function pickDay(day, seed, ctx) {
    const r = rng((seed ^ Math.imul(day, 0x9E3779B1)) >>> 0);
    const recent = new Set(ctx.recent || [...((ctx.days || {})[day - 1] || []), ...((ctx.days || {})[day - 2] || [])]);
    const perfect = new Set(ctx.perfect || []);
    const picked = [], usedClients = new Set(ctx.usedClients || []);
    const take = q => { picked.push(q.id); usedClients.add(q.clientId); };
    // 候補の中から、決まりを1つずつゆるめながら選ぶ（100点を取っていない＞前の2日に来ていない、の順に大事）
    const choose = pool => {
      const free = pool.filter(q => !picked.includes(q.id) && !usedClients.has(q.clientId));
      const tiers = [
        free.filter(q => !perfect.has(q.id) && !recent.has(q.id)),
        free.filter(q => !recent.has(q.id)),
        free.filter(q => !perfect.has(q.id)),
        free
      ];
      const t = tiers.find(x => x.length);
      return t ? t[Math.floor(r() * t.length)] : null;
    };
    // 1. 常連から1件（その常連の過去の依頼から）
    //    直近に来た依頼しか選べない常連は飛ばして次の常連へ（会社を混ぜて遊ぶと、直近6件に1人の3件がそろうことがある）
    //    どの常連も直近の依頼しかないときだけ、最初に選べた常連の依頼にする
    const regs = shuffle((ctx.regulars || []).slice(), r);
    let regPick = null;
    for (const id of regs) {
      const q = choose(ctx.requests.filter(x => x.clientId === id));
      if (q && !recent.has(q.id)) { regPick = q; break; }
      if (q && !regPick) regPick = q;
    }
    if (regPick) take(regPick);
    // 2. 残りは、まだ100点を取っていない依頼から
    while (picked.length < PER_DAY) {
      const q = choose(ctx.requests);
      if (!q) break;
      take(q);
    }
    return shuffle(picked, r);
  }

  // ---- 会社ごとの順番待ち（第2段 仮②A） ----
  const flatWeek = days => { const out = []; for (let d = 1; d <= WEEK; d++) out.push(...(days[d] || [])); return out; };
  // その会社の依頼（21件）→ 順番待ちの21件の ID。最初の3件は day:1 の固定、同じ依頼者の n 回目は n−1 回目より後
  function buildQueue(requests, seed) { return requests.length ? flatWeek(buildWeek(requests, seed)) : []; }
  // 固定の予定（?schedule=fixed）の順番待ち：データの day・time の順
  function fixedQueue(requests) { return requests.length ? flatWeek(fixedWeek(requests)) : []; }

  // 次にその会社に来る依頼。純粋な計算（ctx も queue も変えない）
  // ctx = { company, requests:その会社の依頼, queue:{seed, order, pos, after, plan}, day,
  //         today:[{company, reqId, clientId}]（今日遊んだ件。ほかの会社も含む）, regulars, perfect }（regulars・perfect はその会社の分）
  // 返り値：{ id, plan }（plan は8日目以降の決まりで使ったその日の候補。呼んだ側が queue.plan に入れておく）／依頼がなければ null
  function nextFor(ctx) {
    let reqs = ctx.requests || [];
    if (!reqs.length) return null;
    const q = ctx.queue, byId = Object.fromEntries(reqs.map(r => [r.id, r]));
    const today = ctx.today || [];
    const usedClients = new Set(today.map(t => t.clientId));
    // needs：ほかの会社で先に遊んでおく依頼の ID（例：イベントのあきらさん e12 は、旅行のあきらさん r14 のあと）
    //   旅行の縁にふれる会話が、初対面のときに出ないようにする。ctx.played＝どの会社でも遊び終えた依頼の ID
    const played = new Set(ctx.played || []);
    const ready = id => !byId[id].needs || played.has(byId[id].needs);
    // 1. 順番待ち：次の1件。その依頼者が今日もう来ていたら（ほかの会社でも）、または needs がまだなら、来られる依頼を先に出す
    //    同じ依頼者の依頼は飛ばした件より後ろへは回さない（n 回目が n−1 回目より先に来ないように）
    const rest = q.order.slice(q.pos).filter(id => byId[id]);
    if (rest.length) {
      const passed = new Set();
      for (const id of rest) {
        const c = byId[id].clientId;
        if (!usedClients.has(c) && !passed.has(c) && ready(id)) return { id, plan: q.plan || null };
        passed.add(c);
      }
      // どれも出せないとき（今日もう来た依頼者だけ、または needs がまだの依頼だけが残った）は、遊びを止めないよう
      // needs を満たすものを先に、なければ順番どおりの1件
      return { id: rest.find(ready) || rest[0], plan: q.plan || null };
    }
    // 2. 順番待ちを遊び終えたあと：8日目以降の決まりで、その会社のその日の候補（3件）を選び、まだ出していないものから1件ずつ
    const mine = today.filter(t => t.company === ctx.company).map(t => t.reqId);
    const served = [...q.order.slice(0, q.pos), ...q.after];
    // 時間が進む常連さん（yearsLater のある依頼。第3段ライフプラン）：もっと先の回を遊んだあとは、それより前の回を出さない（時間が戻らないように）
    const servedSet = new Set(served);
    const laterServed = r => ctx.requests.some(o => o.clientId === r.clientId && o.yearsLater && visitOf(o) > visitOf(r) && servedSet.has(o.id));
    reqs = reqs.filter(r => !laterServed(r));
    // 直近の6件（今日より前に、その会社に来た件。今日遊んだ件は served の末尾にある）
    const recent = served.slice(0, served.length - mine.length).slice(-2 * PER_DAY);
    let plan = q.plan && q.plan.day === ctx.day ? q.plan : null;
    if (!plan) plan = { day: ctx.day, ids: pickDay(ctx.day, q.seed, { requests: reqs, regulars: ctx.regulars, perfect: ctx.perfect, recent, usedClients: [...usedClients] }) };
    const ok = id => byId[id] && !mine.includes(id) && !usedClients.has(byId[id].clientId) && ready(id);
    const id = plan.ids.find(ok);
    if (id) return { id, plan };
    // 候補がどれも出せないとき（ほかの会社に同じ依頼者が来たなど）は、1件だけ選び足す
    const extra = pickDay(ctx.day, (q.seed + 1 + mine.length) >>> 0, { requests: reqs, regulars: [], perfect: ctx.perfect, recent: recent.concat(plan.ids), usedClients: [...usedClients] }).find(ok)
      || reqs.map(r => r.id).find(ok) || reqs.map(r => r.id).find(x => !mine.includes(x)) || reqs[0].id;
    return { id: extra, plan: { day: ctx.day, ids: plan.ids.concat(extra) } };
  }
  // 遊んだ依頼を順番待ちに記録する（新しい queue を返す。元は変えない）
  // 順番待ちの中の依頼なら pos の位置へ移して pos を1つ進める（飛ばして先に出した件も、遊んだ順に並ぶ）。順番待ちのあとなら after に足す
  function commit(queue, id, plan) {
    const q = JSON.parse(JSON.stringify(queue));
    if (plan !== undefined) q.plan = plan;
    const i = q.order.indexOf(id, q.pos);
    if (i >= 0) { q.order.splice(i, 1); q.order.splice(q.pos, 0, id); q.pos++; }
    else q.after.push(id);
    return q;
  }

  const api = { WEEK, PER_DAY, QUEUE, rng, buildWeek, fixedWeek, validWeek, pickDay, buildQueue, fixedQueue, nextFor, commit };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YorozuSchedule = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
