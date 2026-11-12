// よろず提案所：ランクアップの計算（画面を触らない計算だけ。ゲーム本体と node のテストの両方で使う）
// - 1日の平均が70点以上の日が「連続5日」でランクが1つ上がる（1日でも70点を下回ったら連続は0に戻る）
// - 上がったときも連続は0に戻り、次のランクへ向けてまた5日
// - ランクは3段階（1 街の提案所／2 評判の提案所／3 街いちばんの提案所）。3が最高
(function (root) {
  const DAYS = 5, AVG = 70, MAX = 3;
  const NAMES = { 1: "街の提案所", 2: "評判の提案所", 3: "街いちばんの提案所" };

  // rank = { level, streak, lastDay }。同じ日を2回数えないように、数えた日を lastDay に残す
  // 返り値：{ rank（新しい形）, up（この日に上がったか） }。元の rank は変えない
  function countDay(rank, day, avg) {
    const r = Object.assign({}, rank, { level: rank.level || 1, streak: rank.streak || 0, lastDay: rank.lastDay || 0 });
    if (day <= r.lastDay) return { rank: r, up: false };
    r.lastDay = day;
    if (r.level >= MAX) { r.streak = avg >= AVG ? Math.min(r.streak + 1, DAYS) : 0; return { rank: r, up: false }; }
    r.streak = avg >= AVG ? r.streak + 1 : 0;
    if (r.streak >= DAYS) { r.level++; r.streak = 0; return { rank: r, up: true }; }
    return { rank: r, up: false };
  }
  // 集計のバーに出す文（今の連続日数と「あと○日」）
  function barText(rank) {
    if (rank.level >= MAX) return "最高ランク";
    return `${rank.streak}日連続・あと${DAYS - rank.streak}日でランクアップ`;
  }

  const api = { DAYS, AVG, MAX, NAMES, countDay, barText };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YorozuRank = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
