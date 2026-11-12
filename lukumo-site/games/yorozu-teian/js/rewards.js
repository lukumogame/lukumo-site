// よろず提案所：もらえる品の判定（画面を触らない計算だけ。ゲーム本体と node のテストの両方で使う）
// - 常連でない回：100点で、依頼者の種類の品（まだない品→まだない色違い→全部そろえば何もなし）
// - 常連の回（3回目の来店から）：80点以上で、そのキャラだけの品（品の種類は最大3つ）→ そろったら色違い → 全部そろえばお礼の一言だけ
(function (root) {
  const MAX_REGULAR_ITEMS = 3;   // 常連の品は1キャラにつき最大3種類
  const PERFECT = 100, GREAT = 80;

  // 依頼者の種類（species）→ 品のまとまり（human/bug/animal/alien）
  function groupOf(species, catalog) { return (catalog.speciesGroups || {})[species] || "human"; }

  // そのまとまりの品を order の順に（常連の品は上限の数まで）
  function itemsOf(group, catalog) {
    const list = catalog.items.filter(i => i.group === group).sort((a, b) => a.order - b.order);
    return group.startsWith("regular:") ? list.slice(0, MAX_REGULAR_ITEMS) : list;
  }

  // 次に渡すもの：まだ持っていない品を順に → 全部持っていれば、まだない色を品の順に
  function nextOf(list, owned) {
    const fresh = list.find(i => !(owned[i.id] && owned[i.id].length));
    if (fresh) return { item: fresh, color: 0, kind: "item" };
    for (const i of list) {
      const has = owned[i.id] || [];
      const c = i.colors.findIndex((_, k) => !has.includes(k));
      if (c >= 0) return { item: i, color: c, kind: "color" };
    }
    return null;
  }

  // 判定。v = { total, clientId, species, regularVisit }。owned = { 品ID: [色の番号…] }
  // 返り値：{ item, color, kind:"item"|"color" } ／ { kind:"thanks" }（常連で全部そろったとき）／ null（何もなし）
  function award(v, catalog, owned) {
    if (v.regularVisit) {
      if (v.total < GREAT) return null;
      return nextOf(itemsOf("regular:" + v.clientId, catalog), owned) || { kind: "thanks" };
    }
    if (v.total < PERFECT) return null;
    return nextOf(itemsOf("species:" + groupOf(v.species, catalog), catalog), owned);
  }

  // もらった品を持ち物に入れる（新しい持ち物を返す。元は変えない）
  function grant(owned, got) {
    const out = JSON.parse(JSON.stringify(owned || {}));
    if (!got || !got.item) return out;
    const has = out[got.item.id] = out[got.item.id] || [];
    if (!has.includes(got.color)) has.push(got.color);
    has.sort((a, b) => a - b);
    return out;
  }

  const api = { MAX_REGULAR_ITEMS, PERFECT, GREAT, groupOf, itemsOf, award, grant };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YorozuRewards = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
