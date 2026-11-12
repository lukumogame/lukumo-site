// よろず提案所：来店の予定づくり（画面を触らない計算だけ。ゲーム本体と node のテストの両方で使う）
// - 1日目はデータの day:1 の3件で固定（チュートリアル）
// - 2〜7日目は、残りの依頼を乱数で並べる。同じ依頼者の n 回目は n−1 回目より後の日。常連の候補は7日目までに全員3回目が来る
// - 8日目以降は1日ずつ決める：常連から1件＋まだ100点を取っていない依頼2件。前の2日に来た依頼は選ばない
(function (root) {
  const WEEK = 7, PER_DAY = 3;

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
  function pickDay(day, seed, ctx) {
    const r = rng((seed ^ Math.imul(day, 0x9E3779B1)) >>> 0);
    const recent = new Set([...(ctx.days[day - 1] || []), ...(ctx.days[day - 2] || [])]);
    const perfect = new Set(ctx.perfect || []);
    const picked = [], usedClients = new Set();
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
    const regs = shuffle((ctx.regulars || []).slice(), r);
    for (const id of regs) {
      const q = choose(ctx.requests.filter(x => x.clientId === id));
      if (q) { take(q); break; }
    }
    // 2. 残りは、まだ100点を取っていない依頼から
    while (picked.length < PER_DAY) {
      const q = choose(ctx.requests);
      if (!q) break;
      take(q);
    }
    return shuffle(picked, r);
  }

  const api = { WEEK, PER_DAY, rng, buildWeek, fixedWeek, validWeek, pickDay };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YorozuSchedule = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
