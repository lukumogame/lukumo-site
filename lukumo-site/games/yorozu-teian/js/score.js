// よろず提案所：点数の計算（ゲーム本体と tools/check-requests の両方で使う唯一の計算場所）
(function (root) {
  const SLOTS = ["destination", "activity", "food", "surprise"];
  const SLOT_NAMES = { destination: "行き先", activity: "過ごし方", food: "食事", surprise: "サプライズ" };

  // cards: 4欄で選んだカード4枚 / req: 依頼データ / budget: 予算（前回のお礼の増額を含めたい時は渡す）
  function scoreProposal(cards, req, budget) {
    const limit = budget ?? req.budget.amount;
    const honneHits = cards.filter(c => c.tags.some(t => req.honneTags.includes(t))).length;
    const dislikeHits = cards.filter(c => c.tags.some(t => req.dislikeTags.includes(t))).length;
    const cost = cards.reduce((s, c) => s + c.cost, 0);
    const honne = honneHits * 12.5;                 // 本音 50点
    const budgetPts = cost <= limit ? 30 : 0;       // 予算 30点
    const fit = Math.max(0, 20 - dislikeHits * 5);  // 合うか 20点
    const total = honne + budgetPts + fit;
    return { total, honne, budget: budgetPts, fit, cost, honneHits, dislikeHits,
             reaction: reactionOf(total), stars: starsOf(total) };
  }
  function reactionOf(t) { return t >= 80 ? "great" : t >= 50 ? "ok" : "poor"; }
  function starsOf(t) { return t >= 80 ? 3 : t >= 50 ? 2 : 1; }
  function dayAverage(totals) { return totals.reduce((s, t) => s + t, 0) / totals.length; }

  const api = { SLOTS, SLOT_NAMES, scoreProposal, reactionOf, starsOf, dayAverage };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YorozuScore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
