// 候補カードの絵：ユーザーの指摘で描き直した・描き足したもの（cards-a.js / cards-b.js の後に読み込み、同じ名前は上書き）
(function (root) {
  const S = b => '<svg viewBox="0 0 80 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">' + b + '</svg>';
  const M = {
    // りんご飴（食べ歩きツアー）：屋台のちょうちんと、つやのあるりんご飴2本
    candyapple: S(
      '<rect width="80" height="48" fill="#fde8e4"/>' +
      '<rect y="39" width="80" height="9" fill="#f6cfc6"/>' +
      '<path d="M4 6H76" stroke="#c9965c" stroke-width="1.5"/>' +
      '<ellipse cx="12" cy="13" rx="5" ry="6.5" fill="#f5a623"/><path d="M8 11h8M8 15h8" stroke="#e08a14" stroke-width="1"/><rect x="10.5" y="5.5" width="3" height="2" fill="#7a5a3a"/>' +
      '<ellipse cx="68" cy="13" rx="5" ry="6.5" fill="#e2574c"/><path d="M64 11h8M64 15h8" stroke="#c43c33" stroke-width="1"/><rect x="66.5" y="5.5" width="3" height="2" fill="#7a5a3a"/>' +
      '<rect x="31" y="6" width="2.6" height="17" rx="1.3" fill="#d9a86a"/>' +
      '<ellipse cx="32" cy="40" rx="10" ry="2.6" fill="#c92a3c"/>' +
      '<circle cx="32" cy="29" r="11" fill="#e2374a"/>' +
      '<path d="M23 25.5q9-5.5 18 0" fill="none" stroke="#f47c89" stroke-width="2.4"/>' +
      '<ellipse cx="27.5" cy="25" rx="3" ry="1.8" fill="#fff" opacity=".85"/>' +
      '<rect x="49" y="10" width="2.4" height="15" rx="1.2" fill="#d9a86a"/>' +
      '<ellipse cx="50" cy="40.5" rx="8" ry="2.2" fill="#c92a3c"/>' +
      '<circle cx="50" cy="31.5" r="8.5" fill="#ef4a5c"/>' +
      '<path d="M43 28.5q7-4.5 14 0" fill="none" stroke="#f78c98" stroke-width="2"/>' +
      '<ellipse cx="46.5" cy="28" rx="2.4" ry="1.4" fill="#fff" opacity=".85"/>'
    ),
    // カニ鍋（カニの食べ放題）：土鍋に白菜・豆腐・しいたけ・ねぎ・春菊・にんじん、ふちから赤いカニの脚とハサミ
    crabnabe: S(
      '<rect width="80" height="48" fill="#fff3e0"/>' +
      '<rect y="42" width="80" height="6" fill="#efd3ab"/>' +
      '<path d="M36 13q-2.5-2.5 0-5t0-5M42 12q-2.5-2.5 0-5t0-5" fill="none" stroke="#f1e3cd" stroke-width="1.8"/>' +
      '<ellipse cx="9" cy="27.5" rx="4.5" ry="2.4" fill="#4a3126"/><ellipse cx="71" cy="27.5" rx="4.5" ry="2.4" fill="#4a3126"/>' +
      '<path d="M11 26q0 18 29 18t29-18z" fill="#5d3e30"/>' +
      '<path d="M15 34q25 9 50 0" fill="none" stroke="#734f3e" stroke-width="2"/>' +
      '<ellipse cx="40" cy="26" rx="29" ry="8" fill="#3f2a20"/>' +
      '<ellipse cx="40" cy="26" rx="26" ry="6.3" fill="#f4d9a4"/>' +
      // 白菜・春菊（奥）
      '<path d="M17 25q4-7 11-6q-3 5-11 6z" fill="#eef5d8"/><path d="M19 23q4-4 8-3" fill="none" stroke="#a7cf7a" stroke-width="1.5"/>' +
      '<path d="M52 20q7-2 11 4q-6 1-11-4z" fill="#eef5d8"/><path d="M54 21q4-1 7 2" fill="none" stroke="#a7cf7a" stroke-width="1.5"/>' +
      '<path d="M44 19q2-3 5-1q-1 3-5 1zM47 21q3-2 5 0q-2 3-5 0z" fill="#5cb85c"/>' +
      // 豆腐・しいたけ・ねぎ・にんじん（手前）
      '<rect x="22" y="26" width="6" height="4.5" rx="1" fill="#fffdf6" stroke="#ead9bd" stroke-width=".6"/>' +
      '<rect x="51" y="26.5" width="6" height="4.5" rx="1" fill="#fffdf6" stroke="#ead9bd" stroke-width=".6"/>' +
      '<ellipse cx="34" cy="28" rx="4" ry="2.6" fill="#8a5a3c"/><path d="M32 27l4 2M36 27l-4 2" stroke="#f3e2c8" stroke-width=".9"/>' +
      '<circle cx="45" cy="29" r="1.9" fill="#fff" stroke="#8fc96a" stroke-width="1"/><circle cx="48.5" cy="27.5" r="1.6" fill="#fff" stroke="#8fc96a" stroke-width="1"/>' +
      '<path d="M40 22.2l1 1.7 2-.3-1.2 1.6 1 1.7-2-.6-1.3 1.5-.2-2-1.9-.8 1.8-.9z" fill="#f28c28"/>' +
      // カニの脚（鍋の中からふちの外へ）：節で曲がる赤い脚と、身の白い切り口
      '<path d="M28 24L20 17L11 14" fill="none" stroke="#c93d28" stroke-width="5"/>' +
      '<path d="M28 24L20 17L11 14" fill="none" stroke="#f06a48" stroke-width="2"/>' +
      '<circle cx="10.5" cy="13.8" r="2.5" fill="#fff4ee" stroke="#f3c2b2" stroke-width=".6"/>' +
      '<circle cx="20" cy="17" r="2" fill="#b8341f"/>' +
      '<path d="M34 23L31 14L26 7" fill="none" stroke="#c93d28" stroke-width="5"/>' +
      '<path d="M34 23L31 14L26 7" fill="none" stroke="#f06a48" stroke-width="2"/>' +
      '<circle cx="25.6" cy="6.6" r="2.5" fill="#fff4ee" stroke="#f3c2b2" stroke-width=".6"/>' +
      '<circle cx="31" cy="14" r="1.8" fill="#b8341f"/>' +
      '<path d="M46 23L50 14L56 8" fill="none" stroke="#c93d28" stroke-width="5"/>' +
      '<path d="M46 23L50 14L56 8" fill="none" stroke="#f06a48" stroke-width="2"/>' +
      '<circle cx="56.4" cy="7.6" r="2.5" fill="#fff4ee" stroke="#f3c2b2" stroke-width=".6"/>' +
      '<circle cx="50" cy="14" r="1.8" fill="#b8341f"/>' +
      // ハサミ：腕の節と、上下2本の指
      '<path d="M52 24L61 18" fill="none" stroke="#c93d28" stroke-width="5"/>' +
      '<circle cx="61" cy="18" r="2.2" fill="#b8341f"/>' +
      '<path d="M60 18q2-8 10-8q-1 4-5 6z" fill="#e2483a"/>' +
      '<path d="M61 19q7-3 11 1q-4 2-11 0z" fill="#d9402f"/>' +
      '<path d="M63 14q3-2 6-2" fill="none" stroke="#f58a6d" stroke-width="1"/>'
    ),
    // ヤギ（子ヤギの名付け親）：正面向きのヤギ。後ろへ反った角・横に垂れた耳・にっこり目・あごひげ・花をくわえる。鈴つき首輪と名札
    goat: S(
      '<rect width="80" height="48" fill="#e9f6ec"/>' +
      '<path d="M0 38q20-4 40 0t40 0v10H0z" fill="#c4e6b0"/>' +
      '<circle cx="9" cy="42" r="1.7" fill="#ffd36a"/><circle cx="14" cy="45" r="1.3" fill="#ffffff"/><circle cx="71" cy="43" r="1.7" fill="#ffb3c1"/>' +
      // 体（肩まわり）
      '<path d="M23 48q0-14 15-14t15 14z" fill="#fffaf3" stroke="#d9c6ae" stroke-width="1.1"/>' +
      // 角：後ろへ反る2本
      '<path d="M32 12q-3-6-9-7" fill="none" stroke="#c9a575" stroke-width="4.4"/>' +
      '<path d="M32 12q-3-6-9-7" fill="none" stroke="#e7cc9f" stroke-width="2"/>' +
      '<path d="M44 12q3-6 9-7" fill="none" stroke="#c9a575" stroke-width="4.4"/>' +
      '<path d="M44 12q3-6 9-7" fill="none" stroke="#e7cc9f" stroke-width="2"/>' +
      // 耳：横に垂れる
      '<path d="M28 17q-9-2-13 3q6 3 13 1z" fill="#fffaf3" stroke="#d9c6ae" stroke-width="1.1"/>' +
      '<path d="M27 18.2q-6-1-9 2q4 1.4 9 .2z" fill="#ffc6d0"/>' +
      '<path d="M48 17q9-2 13 3q-6 3-13 1z" fill="#fffaf3" stroke="#d9c6ae" stroke-width="1.1"/>' +
      '<path d="M49 18.2q6-1 9 2q-4 1.4-9 .2z" fill="#ffc6d0"/>' +
      // 頭と口元
      '<path d="M38 9q11 0 11 11q0 6-3 9q-3 4-8 4t-8-4q-3-3-3-9q0-11 11-11z" fill="#fffaf3" stroke="#d9c6ae" stroke-width="1.1"/>' +
      '<ellipse cx="38" cy="27.5" rx="7" ry="5" fill="#fbece0"/>' +
      // 前髪のくるん
      '<path d="M35 10q1-3 3-1q2-3 3 1" fill="#fffaf3" stroke="#d9c6ae" stroke-width="1.1"/>' +
      // にっこり目・ほっぺ
      '<path d="M31 20q2.2-2.6 4.4 0M41.6 20q2.2-2.6 4.4 0" fill="none" stroke="#3b4656" stroke-width="1.7"/>' +
      '<ellipse cx="30" cy="24" rx="2.6" ry="1.6" fill="#ffc0cc"/><ellipse cx="46" cy="24" rx="2.6" ry="1.6" fill="#ffc0cc"/>' +
      // 鼻・口
      '<ellipse cx="36.2" cy="25.6" rx=".9" ry=".7" fill="#c99a86"/><ellipse cx="39.8" cy="25.6" rx=".9" ry=".7" fill="#c99a86"/>' +
      '<path d="M35.5 28.3q2.5 2 5 0" fill="none" stroke="#3b4656" stroke-width="1.1"/>' +
      // あごひげ
      '<path d="M36 32q2 5 4 0" fill="#f1e2cf" stroke="#d9c6ae" stroke-width=".9"/>' +
      // くわえた花
      '<path d="M40.5 29q5 1 8 -2" fill="none" stroke="#6cb86a" stroke-width="1.2"/>' +
      '<g fill="#ffffff" stroke="#f1d78a" stroke-width=".5"><circle cx="50.5" cy="25" r="1.6"/><circle cx="48.3" cy="25.4" r="1.6"/><circle cx="49.7" cy="23.2" r="1.6"/><circle cx="51.9" cy="23.4" r="1.6"/><circle cx="51.4" cy="26.9" r="1.6"/><circle cx="49" cy="27.2" r="1.6"/></g>' +
      '<circle cx="50.1" cy="25.2" r="1.3" fill="#ffc21a"/>' +
      // 首輪・鈴・名札
      '<path d="M29 35.5q9 4 18 0" fill="none" stroke="#e85d6c" stroke-width="2.6"/>' +
      '<circle cx="36.5" cy="39.3" r="2.5" fill="#ffc21a" stroke="#d9a218" stroke-width=".8"/><path d="M35.2 39.6h2.6" stroke="#a97c10" stroke-width=".8"/>' +
      '<path d="M43.5 37v1.6" stroke="#d9b566" stroke-width=".8"/>' +
      '<rect x="41.3" y="38.4" width="5.6" height="4.4" rx="1" fill="#fff4cf" stroke="#d9b566" stroke-width=".8"/>' +
      '<path d="M42.6 40.6h3" stroke="#d9b566" stroke-width=".7"/>' +
      // ハート
      '<path d="M66 10c-2-3-6-1-4 2l4 4 4-4c2-3-2-5-4-2z" fill="#f2728a"/>' +
      '<path d="M15 9.5c-1.3-1.8-3.7-.6-2.6 1.3l2.6 2.4 2.6-2.4c1.1-1.9-1.3-3.1-2.6-1.3z" fill="#f7a3b3"/>'
    )
  };
  root.YorozuArt = root.YorozuArt || {};
  root.YorozuArt.cardMotifs = Object.assign(root.YorozuArt.cardMotifs || {}, M);
})(typeof globalThis !== "undefined" ? globalThis : this);
